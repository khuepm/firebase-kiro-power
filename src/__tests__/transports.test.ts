import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ServerConfig, TransportType } from '../config';

// We'll mock process.exit in the individual tests

// Mock StdioServerTransport
vi.mock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: vi.fn().mockImplementation(() => ({
    onclose: null,
  })),
}));

// Mock HTTP transport
vi.mock('../transports/http.js', () => ({
  initializeHttpTransport: vi.fn().mockResolvedValue(undefined),
}));

// Mock config
vi.mock('../config.js', () => ({
  TransportType: { STDIO: 'stdio', HTTP: 'http' },
  isHttpServerRunning: vi.fn().mockResolvedValue(false),
}));

// Mock logger
vi.mock('../utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('Transport Initialization', () => {
  let mockServer: Server;
  let config: ServerConfig;
  let initializeTransport: (server: Server, config: ServerConfig) => Promise<void>;
  let isHttpServerRunning: (host: string, port: number) => Promise<boolean>;
  let initializeHttpTransport: (server: Server, config: ServerConfig) => Promise<void>;
  let StdioServerTransport: any;
  let logger: any;

  beforeEach(async () => {
    // Reset modules and mocks
    vi.resetModules();
    vi.clearAllMocks();

    // Create mock server
    mockServer = {
      connect: vi.fn().mockResolvedValue(undefined),
    } as unknown as Server;

    // Create test config
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
      name: 'test-server',
    };

    // Import mocked modules
    const configModule = await import('../config.js');
    const httpModule = await import('../transports/http.js');
    const stdioModule = await import('@modelcontextprotocol/sdk/server/stdio.js');
    const loggerModule = await import('../utils/logger.js');

    // Get mocked functions
    isHttpServerRunning = configModule.isHttpServerRunning as any;
    initializeHttpTransport = httpModule.initializeHttpTransport;
    StdioServerTransport = stdioModule.StdioServerTransport;
    logger = loggerModule.logger;

    // Import the module under test
    const transportModule = await import('../transports/index.js');
    initializeTransport = transportModule.initializeTransport;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should initialize stdio transport by default', async () => {
    // Call the function
    await initializeTransport(mockServer, config);

    // Verify stdio transport was initialized
    expect(StdioServerTransport).toHaveBeenCalled();
    expect(mockServer.connect).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('Initializing stdio transport');
  });

  it('should initialize HTTP transport when configured', async () => {
    // Update config to use HTTP transport
    config.transport = TransportType.HTTP;

    // Call the function
    await initializeTransport(mockServer, config);

    // Verify HTTP transport was initialized
    expect(initializeHttpTransport).toHaveBeenCalledWith(mockServer, config);
    expect(logger.info).toHaveBeenCalledWith('Initializing HTTP transport');
  });

  it('should exit if HTTP server is already running in stdio mode', async () => {
    // Mock isHttpServerRunning to return true
    (isHttpServerRunning as any).mockResolvedValueOnce(true);

    // Create a spy for process.exit
    const processExitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
      throw new Error('process.exit called');
    }) as any);

    try {
      // Call the function
      await initializeTransport(mockServer, config);
    } catch (error) {
      // Ignore the error, we just want to check if process.exit was called
    }

    // Verify error was logged and process.exit was called
    expect(logger.error).toHaveBeenCalledWith(
      `Cannot connect via stdio: HTTP server already running at ${config.http.host}:${config.http.port}`
    );
    expect(logger.error).toHaveBeenCalledWith(
      'To connect to the HTTP server, configure your client to use HTTP transport'
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);

    // Restore the original process.exit
    processExitSpy.mockRestore();
  });

  it('should not check for HTTP server if transport is HTTP', async () => {
    // Update config to use HTTP transport
    config.transport = TransportType.HTTP;

    // Call the function
    await initializeTransport(mockServer, config);

    // Verify isHttpServerRunning was not called
    expect(isHttpServerRunning).not.toHaveBeenCalled();
  });

  // Task 8.2: Test transport layer compatibility
  describe('Task 8.2: Transport Layer Compatibility', () => {
    describe('Server Starts with stdio Transport', () => {
      it('should successfully start server with stdio transport', async () => {
        // Configure for stdio transport
        config.transport = TransportType.STDIO;

        // Call the function
        await initializeTransport(mockServer, config);

        // Verify stdio transport was created and connected
        expect(StdioServerTransport).toHaveBeenCalled();
        expect(mockServer.connect).toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalledWith('Initializing stdio transport');
      });

      it('should create StdioServerTransport instance for stdio mode', async () => {
        // Configure for stdio transport
        config.transport = TransportType.STDIO;

        // Call the function
        await initializeTransport(mockServer, config);

        // Verify StdioServerTransport was instantiated
        expect(StdioServerTransport).toHaveBeenCalledTimes(1);
        expect(StdioServerTransport).toHaveBeenCalledWith();
      });

      it('should connect server to stdio transport', async () => {
        // Configure for stdio transport
        config.transport = TransportType.STDIO;

        // Call the function
        await initializeTransport(mockServer, config);

        // Verify server.connect was called with the transport
        expect(mockServer.connect).toHaveBeenCalledTimes(1);
        const connectCall = (mockServer.connect as any).mock.calls[0];
        expect(connectCall).toBeDefined();
        expect(connectCall[0]).toBeDefined(); // Transport instance passed
      });

      it('should handle stdio transport initialization without errors', async () => {
        // Configure for stdio transport
        config.transport = TransportType.STDIO;

        // Call the function and verify no errors are thrown
        await expect(initializeTransport(mockServer, config)).resolves.not.toThrow();
      });

      it('should use stdio transport when transport type is explicitly set to STDIO', async () => {
        // Explicitly set transport to STDIO
        config.transport = TransportType.STDIO;

        // Call the function
        await initializeTransport(mockServer, config);

        // Verify stdio transport was used
        expect(StdioServerTransport).toHaveBeenCalled();
        expect(initializeHttpTransport).not.toHaveBeenCalled();
      });
    });

    describe('Server Starts with HTTP Transport', () => {
      it('should successfully start server with HTTP transport', async () => {
        // Configure for HTTP transport
        config.transport = TransportType.HTTP;

        // Call the function
        await initializeTransport(mockServer, config);

        // Verify HTTP transport was initialized
        expect(initializeHttpTransport).toHaveBeenCalledWith(mockServer, config);
        expect(logger.info).toHaveBeenCalledWith('Initializing HTTP transport');
      });

      it('should pass server instance to HTTP transport initializer', async () => {
        // Configure for HTTP transport
        config.transport = TransportType.HTTP;

        // Call the function
        await initializeTransport(mockServer, config);

        // Verify initializeHttpTransport was called with correct arguments
        expect(initializeHttpTransport).toHaveBeenCalledTimes(1);
        expect(initializeHttpTransport).toHaveBeenCalledWith(mockServer, config);
      });

      it('should pass configuration to HTTP transport initializer', async () => {
        // Configure for HTTP transport with custom settings
        config.transport = TransportType.HTTP;
        config.http.port = 8080;
        config.http.host = '0.0.0.0';
        config.http.path = '/firebase-mcp';

        // Call the function
        await initializeTransport(mockServer, config);

        // Verify config was passed correctly
        const callArgs = (initializeHttpTransport as any).mock.calls[0];
        expect(callArgs[1]).toEqual(config);
        expect(callArgs[1].http.port).toBe(8080);
        expect(callArgs[1].http.host).toBe('0.0.0.0');
        expect(callArgs[1].http.path).toBe('/firebase-mcp');
      });

      it('should handle HTTP transport initialization without errors', async () => {
        // Configure for HTTP transport
        config.transport = TransportType.HTTP;

        // Call the function and verify no errors are thrown
        await expect(initializeTransport(mockServer, config)).resolves.not.toThrow();
      });

      it('should use HTTP transport when transport type is explicitly set to HTTP', async () => {
        // Explicitly set transport to HTTP
        config.transport = TransportType.HTTP;

        // Call the function
        await initializeTransport(mockServer, config);

        // Verify HTTP transport was used
        expect(initializeHttpTransport).toHaveBeenCalled();
        expect(StdioServerTransport).not.toHaveBeenCalled();
      });

      it('should not check for existing HTTP server when using HTTP transport', async () => {
        // Configure for HTTP transport
        config.transport = TransportType.HTTP;

        // Call the function
        await initializeTransport(mockServer, config);

        // Verify isHttpServerRunning was not called (no conflict check needed)
        expect(isHttpServerRunning).not.toHaveBeenCalled();
      });
    });

    describe('MCP Protocol Communication Verification', () => {
      it('should establish MCP connection for stdio transport', async () => {
        // Configure for stdio transport
        config.transport = TransportType.STDIO;

        // Call the function
        await initializeTransport(mockServer, config);

        // Verify server.connect was called (establishes MCP protocol connection)
        expect(mockServer.connect).toHaveBeenCalled();
        expect(mockServer.connect).toHaveBeenCalledTimes(1);
      });

      it('should establish MCP connection for HTTP transport', async () => {
        // Configure for HTTP transport
        config.transport = TransportType.HTTP;

        // Mock initializeHttpTransport to verify it's called
        (initializeHttpTransport as any).mockResolvedValueOnce(undefined);

        // Call the function
        await initializeTransport(mockServer, config);

        // Verify HTTP transport initializer was called (establishes MCP protocol connection)
        expect(initializeHttpTransport).toHaveBeenCalledWith(mockServer, config);
      });

      it('should complete transport initialization for stdio without errors', async () => {
        // Configure for stdio transport
        config.transport = TransportType.STDIO;

        // Mock server.connect to resolve successfully
        (mockServer.connect as any).mockResolvedValueOnce(undefined);

        // Call the function and verify it completes successfully
        await expect(initializeTransport(mockServer, config)).resolves.toBeUndefined();
      });

      it('should complete transport initialization for HTTP without errors', async () => {
        // Configure for HTTP transport
        config.transport = TransportType.HTTP;

        // Mock initializeHttpTransport to resolve successfully
        (initializeHttpTransport as any).mockResolvedValueOnce(undefined);

        // Call the function and verify it completes successfully
        await expect(initializeTransport(mockServer, config)).resolves.toBeUndefined();
      });

      it('should support switching between transport types', async () => {
        // First, initialize with stdio
        config.transport = TransportType.STDIO;
        await initializeTransport(mockServer, config);

        // Verify stdio was used
        expect(StdioServerTransport).toHaveBeenCalledTimes(1);
        expect(initializeHttpTransport).not.toHaveBeenCalled();

        // Reset mocks
        vi.clearAllMocks();

        // Now initialize with HTTP
        config.transport = TransportType.HTTP;
        await initializeTransport(mockServer, config);

        // Verify HTTP was used
        expect(initializeHttpTransport).toHaveBeenCalledTimes(1);
        expect(StdioServerTransport).not.toHaveBeenCalled();
      });

      it('should handle both transport types with same server instance', async () => {
        // Test stdio transport
        config.transport = TransportType.STDIO;
        await initializeTransport(mockServer, config);
        expect(mockServer.connect).toHaveBeenCalled();

        // Reset mocks
        vi.clearAllMocks();

        // Test HTTP transport with same server instance
        config.transport = TransportType.HTTP;
        await initializeTransport(mockServer, config);
        expect(initializeHttpTransport).toHaveBeenCalledWith(mockServer, config);
      });

      it('should log appropriate messages for stdio transport initialization', async () => {
        // Configure for stdio transport
        config.transport = TransportType.STDIO;

        // Call the function
        await initializeTransport(mockServer, config);

        // Verify logging
        expect(logger.info).toHaveBeenCalledWith('Initializing stdio transport');
      });

      it('should log appropriate messages for HTTP transport initialization', async () => {
        // Configure for HTTP transport
        config.transport = TransportType.HTTP;

        // Call the function
        await initializeTransport(mockServer, config);

        // Verify logging
        expect(logger.info).toHaveBeenCalledWith('Initializing HTTP transport');
      });

      it('should verify MCP protocol compatibility for stdio transport', async () => {
        // Configure for stdio transport
        config.transport = TransportType.STDIO;

        // Mock server.connect to simulate successful MCP connection
        const mockConnect = vi.fn().mockResolvedValue(undefined);
        mockServer.connect = mockConnect;

        // Call the function
        await initializeTransport(mockServer, config);

        // Verify MCP connection was established
        expect(mockConnect).toHaveBeenCalled();
        expect(mockConnect).toHaveBeenCalledWith(expect.any(Object));
      });

      it('should verify MCP protocol compatibility for HTTP transport', async () => {
        // Configure for HTTP transport
        config.transport = TransportType.HTTP;

        // Mock initializeHttpTransport to simulate successful MCP connection
        const mockHttpInit = vi.fn().mockResolvedValue(undefined);
        (initializeHttpTransport as any).mockImplementation(mockHttpInit);

        // Call the function
        await initializeTransport(mockServer, config);

        // Verify HTTP transport was initialized with server (MCP connection)
        expect(mockHttpInit).toHaveBeenCalledWith(mockServer, config);
      });
    });

    describe('Transport Configuration Validation', () => {
      it('should respect transport configuration from config object', async () => {
        // Test with stdio
        config.transport = TransportType.STDIO;
        await initializeTransport(mockServer, config);
        expect(StdioServerTransport).toHaveBeenCalled();

        vi.clearAllMocks();

        // Test with HTTP
        config.transport = TransportType.HTTP;
        await initializeTransport(mockServer, config);
        expect(initializeHttpTransport).toHaveBeenCalled();
      });

      it('should handle default transport type (stdio)', async () => {
        // Set transport to default (stdio)
        config.transport = TransportType.STDIO;

        // Call the function
        await initializeTransport(mockServer, config);

        // Verify stdio transport was used
        expect(StdioServerTransport).toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalledWith('Initializing stdio transport');
      });

      it('should initialize transport with correct server metadata', async () => {
        // Configure with specific server metadata
        config.name = 'firebase-power';
        config.version = '1.4.9';
        config.transport = TransportType.STDIO;

        // Call the function
        await initializeTransport(mockServer, config);

        // Verify transport was initialized (server metadata is used by Server instance)
        expect(mockServer.connect).toHaveBeenCalled();
      });
    });
  });
});
