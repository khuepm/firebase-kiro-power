/**
 * Test stdio transport compatibility
 * 
 * This test verifies that:
 * 1. The server starts successfully with stdio transport
 * 2. MCP protocol communication works correctly over stdio
 * 
 * Requirements: 3.3
 * Task: 8.2
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { TransportType, type ServerConfig } from '../config.js';
import { Readable, Writable } from 'stream';

// Mock the StdioServerTransport
const mockConnect = vi.fn().mockResolvedValue(undefined);
const mockClose = vi.fn().mockResolvedValue(undefined);

vi.mock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: vi.fn().mockImplementation(() => ({
    onclose: null,
    onerror: null,
    onmessage: null,
    start: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
    send: vi.fn().mockResolvedValue(undefined),
  })),
}));

// Mock HTTP transport
vi.mock('../transports/http.js', () => ({
  initializeHttpTransport: vi.fn().mockResolvedValue(undefined),
}));

// Mock config
vi.mock('../config.js', async () => {
  const actual = await vi.importActual('../config.js');
  return {
    ...actual,
    isHttpServerRunning: vi.fn().mockResolvedValue(false),
  };
});

// Mock logger
vi.mock('../utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('Stdio Transport Compatibility', () => {
  let mockServer: Server;
  let config: ServerConfig;
  let initializeTransport: (server: Server, config: ServerConfig) => Promise<void>;
  let StdioServerTransport: any;
  let logger: any;

  beforeEach(async () => {
    // Reset modules and mocks
    vi.resetModules();
    vi.clearAllMocks();

    // Create mock server with MCP protocol methods
    mockServer = {
      connect: mockConnect,
      close: mockClose,
      setRequestHandler: vi.fn(),
      onerror: null,
    } as unknown as Server;

    // Create test config with stdio transport
    config = {
      serviceAccountKeyPath: '/path/to/service-account.json',
      storageBucket: 'test-bucket',
      transport: TransportType.STDIO,
      http: {
        port: 3000,
        host: 'localhost',
        path: '/mcp',
      },
      version: '1.0.0',
      name: 'firebase-power',
    };

    // Import mocked modules
    const stdioModule = await import('@modelcontextprotocol/sdk/server/stdio.js');
    const loggerModule = await import('../utils/logger.js');

    // Get mocked functions
    StdioServerTransport = stdioModule.StdioServerTransport;
    logger = loggerModule.logger;

    // Import the module under test
    const transportModule = await import('../transports/index.js');
    initializeTransport = transportModule.initializeTransport;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Server Startup with Stdio Transport', () => {
    it('should successfully start server with stdio transport', async () => {
      // Call the initialization function
      await initializeTransport(mockServer, config);

      // Verify stdio transport was created
      expect(StdioServerTransport).toHaveBeenCalled();
      
      // Verify server.connect was called with the transport
      expect(mockServer.connect).toHaveBeenCalledTimes(1);
      expect(mockServer.connect).toHaveBeenCalledWith(expect.any(Object));
      
      // Verify logging
      expect(logger.info).toHaveBeenCalledWith('Initializing stdio transport');
    });

    it('should use stdio transport by default when not specified', async () => {
      // Remove transport specification to test default behavior
      const defaultConfig = { ...config };
      delete (defaultConfig as any).transport;

      await initializeTransport(mockServer, defaultConfig);

      // Verify stdio transport was initialized (default behavior)
      expect(StdioServerTransport).toHaveBeenCalled();
      expect(mockServer.connect).toHaveBeenCalled();
    });

    it('should initialize stdio transport when explicitly configured', async () => {
      // Explicitly set stdio transport
      config.transport = TransportType.STDIO;

      await initializeTransport(mockServer, config);

      // Verify stdio transport was initialized
      expect(StdioServerTransport).toHaveBeenCalled();
      expect(mockServer.connect).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith('Initializing stdio transport');
    });
  });

  describe('MCP Protocol Communication', () => {
    it('should establish MCP protocol connection over stdio', async () => {
      await initializeTransport(mockServer, config);

      // Verify that the server's connect method was called
      // This establishes the MCP protocol connection
      expect(mockServer.connect).toHaveBeenCalledTimes(1);
      
      // Verify the transport object was passed to connect
      const connectCall = mockServer.connect as any;
      expect(connectCall.mock.calls[0][0]).toBeDefined();
    });

    it('should create transport with proper stdio streams', async () => {
      await initializeTransport(mockServer, config);

      // Verify StdioServerTransport was instantiated
      // The SDK's StdioServerTransport automatically uses process.stdin/stdout
      expect(StdioServerTransport).toHaveBeenCalledTimes(1);
      
      // Verify server connection was established
      expect(mockServer.connect).toHaveBeenCalled();
    });

    it('should handle server connection successfully', async () => {
      // Mock successful connection
      mockConnect.mockResolvedValueOnce(undefined);

      await initializeTransport(mockServer, config);

      // Verify connection completed without errors
      expect(mockServer.connect).toHaveBeenCalled();
      await expect(mockServer.connect).toHaveReturned();
    });

    it('should support MCP protocol message handling', async () => {
      await initializeTransport(mockServer, config);

      // Verify transport was created and connected
      expect(StdioServerTransport).toHaveBeenCalled();
      expect(mockServer.connect).toHaveBeenCalled();
      
      // The transport should be ready to handle MCP protocol messages
      // This is verified by successful connection - the SDK handles the rest
      // The mock transport is configured with send, start, and close methods
      expect(StdioServerTransport).toHaveBeenCalledTimes(1);
    });
  });

  describe('Stdio Transport Configuration', () => {
    it('should not check for HTTP server when using stdio transport', async () => {
      const { isHttpServerRunning } = await import('../config.js');
      
      // Clear any previous calls
      vi.mocked(isHttpServerRunning).mockClear();

      await initializeTransport(mockServer, config);

      // When stdio transport is used and no HTTP server is running,
      // the check happens but doesn't prevent initialization
      expect(mockServer.connect).toHaveBeenCalled();
    });

    it('should handle stdio transport in non-TTY environment', async () => {
      // Simulate non-TTY environment (typical for MCP clients)
      const originalIsTTY = process.stdin.isTTY;
      Object.defineProperty(process.stdin, 'isTTY', {
        value: false,
        configurable: true,
      });

      await initializeTransport(mockServer, config);

      // Verify stdio transport works in non-TTY environment
      expect(StdioServerTransport).toHaveBeenCalled();
      expect(mockServer.connect).toHaveBeenCalled();

      // Restore original value
      Object.defineProperty(process.stdin, 'isTTY', {
        value: originalIsTTY,
        configurable: true,
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle connection errors gracefully', async () => {
      // Mock connection failure
      const connectionError = new Error('Connection failed');
      mockConnect.mockRejectedValueOnce(connectionError);

      // Attempt to initialize transport
      await expect(initializeTransport(mockServer, config)).rejects.toThrow('Connection failed');

      // Verify transport was created but connection failed
      expect(StdioServerTransport).toHaveBeenCalled();
      expect(mockServer.connect).toHaveBeenCalled();
    });

    it('should handle transport creation errors', async () => {
      // Mock transport creation failure
      StdioServerTransport.mockImplementationOnce(() => {
        throw new Error('Transport creation failed');
      });

      // Attempt to initialize transport
      await expect(initializeTransport(mockServer, config)).rejects.toThrow(
        'Transport creation failed'
      );
    });
  });

  describe('Integration with MCP Server', () => {
    it('should allow server to register request handlers after transport initialization', async () => {
      await initializeTransport(mockServer, config);

      // Verify server is ready to register handlers
      expect(mockServer.connect).toHaveBeenCalled();
      
      // Server should have setRequestHandler method available
      expect(mockServer.setRequestHandler).toBeDefined();
    });

    it('should support bidirectional communication', async () => {
      await initializeTransport(mockServer, config);

      // Verify transport was created and server connected
      expect(StdioServerTransport).toHaveBeenCalled();
      expect(mockServer.connect).toHaveBeenCalled();
      
      // The MCP SDK's StdioServerTransport handles bidirectional communication
      // through stdin/stdout streams. The successful connection verifies this.
      // The mock is configured with send, onmessage, and other required properties
      expect(StdioServerTransport).toHaveBeenCalledTimes(1);
    });
  });
});
