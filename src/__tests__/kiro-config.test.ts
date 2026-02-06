import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getConfig, TransportType } from '../config';

// Mock logger
vi.mock('../utils/logger.js', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('Kiro Configuration Compatibility', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('Error Handling for Missing Configuration', () => {
    it('should handle missing SERVICE_ACCOUNT_KEY_PATH gracefully', async () => {
      // Clear the environment variable
      delete process.env.SERVICE_ACCOUNT_KEY_PATH;

      const config = getConfig();

      // Verify that serviceAccountKeyPath is null when not set
      expect(config.serviceAccountKeyPath).toBeNull();
    });

    it('should provide clear error message when SERVICE_ACCOUNT_KEY_PATH is missing', async () => {
      // Clear the environment variable
      delete process.env.SERVICE_ACCOUNT_KEY_PATH;

      // Import the index module to trigger Firebase initialization
      const { logger } = await import('../utils/logger.js');

      // Dynamically import the index module
      await import('../index.js');

      // Wait for async initialization
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify that an error was logged
      expect(logger.error).toHaveBeenCalledWith('SERVICE_ACCOUNT_KEY_PATH not set');
    });

    it('should handle invalid service account key file path', async () => {
      // This test verifies that the config module handles invalid paths gracefully
      // The actual error handling happens in the index.ts initializeFirebase function
      // We test that the config returns the path as-is, and the error is handled later
      process.env.SERVICE_ACCOUNT_KEY_PATH = '/invalid/path/to/service-account.json';

      const config = getConfig();

      // Verify that the config returns the path even if it's invalid
      // The validation happens during Firebase initialization, not in config
      expect(config.serviceAccountKeyPath).toBe('/invalid/path/to/service-account.json');
    });
  });

  describe('Kiro IDE Configuration Format', () => {
    it('should support Kiro configuration with environment variables', () => {
      // Set environment variables as Kiro would
      process.env.SERVICE_ACCOUNT_KEY_PATH = '/path/to/serviceAccountKey.json';
      process.env.FIREBASE_STORAGE_BUCKET = 'project-id.firebasestorage.app';

      const config = getConfig();

      expect(config.serviceAccountKeyPath).toBe('/path/to/serviceAccountKey.json');
      expect(config.storageBucket).toBe('project-id.firebasestorage.app');
    });

    it('should use default transport (stdio) for Kiro', () => {
      const config = getConfig();

      // Kiro uses stdio transport by default
      expect(config.transport).toBe(TransportType.STDIO);
    });

    it('should support HTTP transport when explicitly configured', () => {
      process.env.MCP_TRANSPORT = 'http';
      process.env.MCP_HTTP_PORT = '3000';
      process.env.MCP_HTTP_HOST = 'localhost';
      process.env.MCP_HTTP_PATH = '/mcp';

      const config = getConfig();

      expect(config.transport).toBe(TransportType.HTTP);
      expect(config.http.port).toBe(3000);
      expect(config.http.host).toBe('localhost');
      expect(config.http.path).toBe('/mcp');
    });

    it('should have correct package name for Kiro Power', () => {
      const config = getConfig();

      expect(config.name).toBe('firebase-power');
    });
  });
});
