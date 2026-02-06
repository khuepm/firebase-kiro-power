import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Test suite for Kiro IDE configuration format
 * 
 * This test validates that Firebase Power can be properly configured
 * using the Kiro IDE configuration format and that environment variables
 * are read correctly from the configuration.
 * 
 * Requirements: 3.1, 3.2
 * Task: 8.1 Create test configuration for Kiro IDE format
 */

// Mock logger
vi.mock('../utils/logger.js', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Save original environment
const originalEnv = { ...process.env };

describe('Kiro IDE Configuration Format', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    
    // Clear any environment variables that might affect tests
    delete process.env.SERVICE_ACCOUNT_KEY_PATH;
    delete process.env.FIREBASE_STORAGE_BUCKET;
    delete process.env.MCP_TRANSPORT;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('Sample Kiro Configuration', () => {
    it('should define a valid Kiro IDE configuration structure', () => {
      // Sample Kiro configuration as documented in POWER.md
      const kiroConfig = {
        mcpServers: {
          'firebase-power': {
            command: 'npx',
            args: ['-y', '@kiro/firebase-power'],
            env: {
              SERVICE_ACCOUNT_KEY_PATH: '/absolute/path/to/your/serviceAccountKey.json',
              FIREBASE_STORAGE_BUCKET: 'your-project-id.firebasestorage.app',
            },
          },
        },
      };

      // Validate structure
      expect(kiroConfig).toHaveProperty('mcpServers');
      expect(kiroConfig.mcpServers).toHaveProperty('firebase-power');
      expect(kiroConfig.mcpServers['firebase-power']).toHaveProperty('command', 'npx');
      expect(kiroConfig.mcpServers['firebase-power']).toHaveProperty('args');
      expect(kiroConfig.mcpServers['firebase-power'].args).toEqual(['-y', '@kiro/firebase-power']);
      expect(kiroConfig.mcpServers['firebase-power']).toHaveProperty('env');
      expect(kiroConfig.mcpServers['firebase-power'].env).toHaveProperty('SERVICE_ACCOUNT_KEY_PATH');
    });

    it('should allow optional FIREBASE_STORAGE_BUCKET in configuration', () => {
      // Configuration with only required environment variable
      const minimalConfig = {
        mcpServers: {
          'firebase-power': {
            command: 'npx',
            args: ['-y', '@kiro/firebase-power'],
            env: {
              SERVICE_ACCOUNT_KEY_PATH: '/path/to/serviceAccountKey.json',
            },
          },
        },
      };

      expect(minimalConfig.mcpServers['firebase-power'].env).toHaveProperty('SERVICE_ACCOUNT_KEY_PATH');
      expect(minimalConfig.mcpServers['firebase-power'].env).not.toHaveProperty('FIREBASE_STORAGE_BUCKET');
    });

    it('should serialize to valid JSON', () => {
      const kiroConfig = {
        mcpServers: {
          'firebase-power': {
            command: 'npx',
            args: ['-y', '@kiro/firebase-power'],
            env: {
              SERVICE_ACCOUNT_KEY_PATH: '/absolute/path/to/your/serviceAccountKey.json',
              FIREBASE_STORAGE_BUCKET: 'your-project-id.firebasestorage.app',
            },
          },
        },
      };

      // Should serialize without errors
      const jsonString = JSON.stringify(kiroConfig, null, 2);
      expect(jsonString).toBeTruthy();

      // Should parse back to the same structure
      const parsed = JSON.parse(jsonString);
      expect(parsed).toEqual(kiroConfig);
    });
  });

  describe('Server Initialization with Kiro Config', () => {
    it('should initialize config module with environment variables from Kiro config', async () => {
      // Simulate environment variables that would be set by Kiro IDE
      process.env.SERVICE_ACCOUNT_KEY_PATH = '/test/path/serviceAccountKey.json';
      process.env.FIREBASE_STORAGE_BUCKET = 'test-project.firebasestorage.app';

      // Import config module
      const { getConfig } = await import('../config.js');

      // Get configuration
      const config = getConfig();

      // Verify environment variables are read correctly
      expect(config.serviceAccountKeyPath).toBe('/test/path/serviceAccountKey.json');
      expect(config.storageBucket).toBe('test-project.firebasestorage.app');
    });

    it('should handle missing optional FIREBASE_STORAGE_BUCKET', async () => {
      // Set only required environment variable
      process.env.SERVICE_ACCOUNT_KEY_PATH = '/test/path/serviceAccountKey.json';

      // Import config module
      const { getConfig } = await import('../config.js');

      // Get configuration
      const config = getConfig();

      // Verify required variable is set
      expect(config.serviceAccountKeyPath).toBe('/test/path/serviceAccountKey.json');
      
      // Verify optional variable is null when not provided
      expect(config.storageBucket).toBeNull();
    });

    it('should use default transport (stdio) when not specified in Kiro config', async () => {
      // Set environment variables without transport specification
      process.env.SERVICE_ACCOUNT_KEY_PATH = '/test/path/serviceAccountKey.json';

      // Import config module
      const { getConfig, TransportType } = await import('../config.js');

      // Get configuration
      const config = getConfig();

      // Verify default transport is stdio
      expect(config.transport).toBe(TransportType.STDIO);
    });

    it('should include server name and version in config', async () => {
      // Set required environment variable
      process.env.SERVICE_ACCOUNT_KEY_PATH = '/test/path/serviceAccountKey.json';

      // Import config module
      const { getConfig } = await import('../config.js');

      // Get configuration
      const config = getConfig();

      // Verify server metadata
      expect(config.name).toBe('firebase-power');
      expect(config.version).toBeTruthy();
      expect(typeof config.version).toBe('string');
    });
  });

  describe('Environment Variable Reading', () => {
    it('should correctly read SERVICE_ACCOUNT_KEY_PATH from environment', async () => {
      const testPath = '/custom/path/to/serviceAccount.json';
      process.env.SERVICE_ACCOUNT_KEY_PATH = testPath;

      const { getConfig } = await import('../config.js');
      const config = getConfig();

      expect(config.serviceAccountKeyPath).toBe(testPath);
    });

    it('should correctly read FIREBASE_STORAGE_BUCKET from environment', async () => {
      const testBucket = 'my-firebase-project.firebasestorage.app';
      process.env.SERVICE_ACCOUNT_KEY_PATH = '/test/path/key.json';
      process.env.FIREBASE_STORAGE_BUCKET = testBucket;

      const { getConfig } = await import('../config.js');
      const config = getConfig();

      expect(config.storageBucket).toBe(testBucket);
    });

    it('should handle Windows-style paths with backslashes', async () => {
      const windowsPath = 'C:\\Users\\username\\serviceAccountKey.json';
      process.env.SERVICE_ACCOUNT_KEY_PATH = windowsPath;

      const { getConfig } = await import('../config.js');
      const config = getConfig();

      expect(config.serviceAccountKeyPath).toBe(windowsPath);
    });

    it('should handle Unix-style paths with forward slashes', async () => {
      const unixPath = '/home/username/serviceAccountKey.json';
      process.env.SERVICE_ACCOUNT_KEY_PATH = unixPath;

      const { getConfig } = await import('../config.js');
      const config = getConfig();

      expect(config.serviceAccountKeyPath).toBe(unixPath);
    });

    it('should handle relative paths', async () => {
      const relativePath = './config/serviceAccountKey.json';
      process.env.SERVICE_ACCOUNT_KEY_PATH = relativePath;

      const { getConfig } = await import('../config.js');
      const config = getConfig();

      expect(config.serviceAccountKeyPath).toBe(relativePath);
    });

    it('should handle paths with spaces', async () => {
      const pathWithSpaces = '/path/with spaces/serviceAccountKey.json';
      process.env.SERVICE_ACCOUNT_KEY_PATH = pathWithSpaces;

      const { getConfig } = await import('../config.js');
      const config = getConfig();

      expect(config.serviceAccountKeyPath).toBe(pathWithSpaces);
    });
  });

  describe('Configuration Validation', () => {
    it('should return null for serviceAccountKeyPath when not set', async () => {
      // Don't set SERVICE_ACCOUNT_KEY_PATH
      delete process.env.SERVICE_ACCOUNT_KEY_PATH;

      const { getConfig } = await import('../config.js');
      const config = getConfig();

      expect(config.serviceAccountKeyPath).toBeNull();
    });

    it('should return null for storageBucket when not set', async () => {
      // Set required variable but not optional one
      process.env.SERVICE_ACCOUNT_KEY_PATH = '/test/path/key.json';
      delete process.env.FIREBASE_STORAGE_BUCKET;

      const { getConfig } = await import('../config.js');
      const config = getConfig();

      expect(config.storageBucket).toBeNull();
    });

    it('should handle empty string environment variables', async () => {
      process.env.SERVICE_ACCOUNT_KEY_PATH = '';
      process.env.FIREBASE_STORAGE_BUCKET = '';

      const { getConfig } = await import('../config.js');
      const config = getConfig();

      // Empty strings should be treated as null
      expect(config.serviceAccountKeyPath).toBeFalsy();
      expect(config.storageBucket).toBeFalsy();
    });
  });

  describe('Kiro Config Examples from Documentation', () => {
    it('should work with the exact configuration from POWER.md', async () => {
      // This is the exact configuration example from POWER.md
      const powerMdConfig = {
        mcpServers: {
          'firebase-power': {
            command: 'npx',
            args: ['-y', '@kiro/firebase-power'],
            env: {
              SERVICE_ACCOUNT_KEY_PATH: '/absolute/path/to/your/serviceAccountKey.json',
              FIREBASE_STORAGE_BUCKET: 'your-project-id.firebasestorage.app',
            },
          },
        },
      };

      // Simulate Kiro IDE setting these environment variables
      process.env.SERVICE_ACCOUNT_KEY_PATH = powerMdConfig.mcpServers['firebase-power'].env.SERVICE_ACCOUNT_KEY_PATH;
      process.env.FIREBASE_STORAGE_BUCKET = powerMdConfig.mcpServers['firebase-power'].env.FIREBASE_STORAGE_BUCKET;

      const { getConfig } = await import('../config.js');
      const config = getConfig();

      expect(config.serviceAccountKeyPath).toBe('/absolute/path/to/your/serviceAccountKey.json');
      expect(config.storageBucket).toBe('your-project-id.firebasestorage.app');
      expect(config.name).toBe('firebase-power');
    });

    it('should work with minimal configuration (only required variables)', async () => {
      const minimalConfig = {
        mcpServers: {
          'firebase-power': {
            command: 'npx',
            args: ['-y', '@kiro/firebase-power'],
            env: {
              SERVICE_ACCOUNT_KEY_PATH: '/path/to/serviceAccountKey.json',
            },
          },
        },
      };

      // Simulate Kiro IDE setting only required environment variable
      process.env.SERVICE_ACCOUNT_KEY_PATH = minimalConfig.mcpServers['firebase-power'].env.SERVICE_ACCOUNT_KEY_PATH;

      const { getConfig } = await import('../config.js');
      const config = getConfig();

      expect(config.serviceAccountKeyPath).toBe('/path/to/serviceAccountKey.json');
      expect(config.storageBucket).toBeNull();
    });
  });

  describe('HTTP Configuration Options', () => {
    it('should support HTTP transport configuration', async () => {
      process.env.SERVICE_ACCOUNT_KEY_PATH = '/test/path/key.json';
      process.env.MCP_TRANSPORT = 'http';
      process.env.MCP_HTTP_PORT = '4000';
      process.env.MCP_HTTP_HOST = '127.0.0.1';
      process.env.MCP_HTTP_PATH = '/api/mcp';

      const { getConfig, TransportType } = await import('../config.js');
      const config = getConfig();

      expect(config.transport).toBe(TransportType.HTTP);
      expect(config.http.port).toBe(4000);
      expect(config.http.host).toBe('127.0.0.1');
      expect(config.http.path).toBe('/api/mcp');
    });

    it('should use default HTTP settings when not specified', async () => {
      process.env.SERVICE_ACCOUNT_KEY_PATH = '/test/path/key.json';
      process.env.MCP_TRANSPORT = 'http';

      const { getConfig, TransportType } = await import('../config.js');
      const config = getConfig();

      expect(config.transport).toBe(TransportType.HTTP);
      expect(config.http.port).toBe(3000);
      expect(config.http.host).toBe('localhost');
      expect(config.http.path).toBe('/mcp');
    });
  });
});
