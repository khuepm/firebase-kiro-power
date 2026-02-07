import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { getConfig, TransportType } from '../config';

// Feature: firebase-power-conversion, Property 6: Configuration Compatibility
// For any valid MCP client configuration format (Kiro, Claude Desktop, VS Code, Cursor),
// the Power should initialize successfully when provided with valid environment variables

// Mock logger
vi.mock('../utils/logger.js', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('Property-Based Tests: Configuration Compatibility', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  /**
   * Property 6: Configuration Compatibility
   * **Validates: Requirements 3.1, 3.2**
   *
   * For any valid MCP client configuration format, the Power should initialize
   * successfully when provided with valid environment variables.
   */
  it('should accept any valid service account path configuration', () => {
    fc.assert(
      fc.property(
        // Generate valid file paths
        fc.record({
          path: fc.oneof(
            fc.constant('/path/to/serviceAccountKey.json'),
            fc.constant('./serviceAccountKey.json'),
            fc.constant('../config/serviceAccountKey.json'),
            fc.constant('/Users/user/firebase/serviceAccountKey.json'),
            fc.constant('C:\\Users\\user\\firebase\\serviceAccountKey.json')
          ),
        }),
        ({ path }) => {
          // Set the environment variable
          process.env.SERVICE_ACCOUNT_KEY_PATH = path;

          // Get the configuration
          const config = getConfig();

          // Verify that the path is accepted
          expect(config.serviceAccountKeyPath).toBe(path);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should accept any valid storage bucket configuration', () => {
    fc.assert(
      fc.property(
        // Generate valid bucket names
        fc.record({
          bucket: fc.oneof(
            fc.constant('project-id.firebasestorage.app'),
            fc.constant('my-bucket.appspot.com'),
            fc.constant('custom-bucket'),
            fc.constant('test-project-123.firebasestorage.app')
          ),
        }),
        ({ bucket }) => {
          // Set the environment variable
          process.env.FIREBASE_STORAGE_BUCKET = bucket;

          // Get the configuration
          const config = getConfig();

          // Verify that the bucket is accepted
          expect(config.storageBucket).toBe(bucket);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should accept any valid transport configuration', () => {
    fc.assert(
      fc.property(
        // Generate valid transport types
        fc.constantFrom('stdio', 'http'),
        transport => {
          // Set the environment variable
          process.env.MCP_TRANSPORT = transport;
          // Ensure we're not in stdio context to allow HTTP
          process.stdin.isTTY = true;

          // Get the configuration
          const config = getConfig();

          // Verify that the transport is accepted
          expect(config.transport).toBe(transport);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should accept any valid HTTP configuration', () => {
    fc.assert(
      fc.property(
        // Generate valid HTTP configurations
        fc.record({
          port: fc.integer({ min: 1024, max: 65535 }),
          host: fc.constantFrom('localhost', '127.0.0.1', '0.0.0.0'),
          path: fc.constantFrom('/mcp', '/api/mcp', '/firebase', '/'),
        }),
        ({ port, host, path }) => {
          // Set the environment variables
          process.env.MCP_HTTP_PORT = port.toString();
          process.env.MCP_HTTP_HOST = host;
          process.env.MCP_HTTP_PATH = path;

          // Get the configuration
          const config = getConfig();

          // Verify that the HTTP configuration is accepted
          expect(config.http.port).toBe(port);
          expect(config.http.host).toBe(host);
          expect(config.http.path).toBe(path);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle any combination of valid configuration values', () => {
    fc.assert(
      fc.property(
        // Generate complete valid configurations
        fc.record({
          serviceAccountPath: fc.oneof(
            fc.constant('/path/to/serviceAccountKey.json'),
            fc.constant('./serviceAccountKey.json'),
            fc.constant(null) // Missing is also valid
          ),
          storageBucket: fc.oneof(
            fc.constant('project-id.firebasestorage.app'),
            fc.constant('my-bucket.appspot.com'),
            fc.constant(null) // Missing is also valid
          ),
          transport: fc.constantFrom('stdio', 'http'),
          httpPort: fc.integer({ min: 1024, max: 65535 }),
          httpHost: fc.constantFrom('localhost', '127.0.0.1'),
          httpPath: fc.constantFrom('/mcp', '/api/mcp'),
        }),
        ({ serviceAccountPath, storageBucket, transport, httpPort, httpHost, httpPath }) => {
          // Set the environment variables
          if (serviceAccountPath) {
            process.env.SERVICE_ACCOUNT_KEY_PATH = serviceAccountPath;
          } else {
            delete process.env.SERVICE_ACCOUNT_KEY_PATH;
          }

          if (storageBucket) {
            process.env.FIREBASE_STORAGE_BUCKET = storageBucket;
          } else {
            delete process.env.FIREBASE_STORAGE_BUCKET;
          }

          process.env.MCP_TRANSPORT = transport;
          process.env.MCP_HTTP_PORT = httpPort.toString();
          process.env.MCP_HTTP_HOST = httpHost;
          process.env.MCP_HTTP_PATH = httpPath;

          // Ensure we're not in stdio context to allow HTTP
          process.stdin.isTTY = true;

          // Get the configuration
          const config = getConfig();

          // Verify that all configuration values are accepted
          expect(config.serviceAccountKeyPath).toBe(serviceAccountPath);
          expect(config.storageBucket).toBe(storageBucket);
          expect(config.transport).toBe(transport);
          expect(config.http.port).toBe(httpPort);
          expect(config.http.host).toBe(httpHost);
          expect(config.http.path).toBe(httpPath);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should default to stdio transport for invalid transport values', () => {
    fc.assert(
      fc.property(
        // Generate invalid transport values
        fc.string().filter(s => s !== 'stdio' && s !== 'http'),
        invalidTransport => {
          // Set the invalid transport
          process.env.MCP_TRANSPORT = invalidTransport;

          // Get the configuration
          const config = getConfig();

          // Verify that it defaults to stdio
          expect(config.transport).toBe(TransportType.STDIO);
        }
      ),
      { numRuns: 100 }
    );
  });
});
