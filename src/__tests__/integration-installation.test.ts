import { describe, it, expect } from 'vitest';
import { spawn } from 'child_process';
import { join } from 'path';

describe('Integration: Installation via npx', () => {
  it('should start server correctly with built distribution', async () => {
    const serverPath = join(process.cwd(), 'dist', 'index.js');
    
    // Start the server process
    const serverProcess = spawn('node', [serverPath], {
      env: {
        ...process.env,
        SERVICE_ACCOUNT_KEY_PATH: '/tmp/test-service-account.json',
      },
    });

    let output = '';
    let errorOutput = '';

    // Collect stdout
    serverProcess.stdout?.on('data', (data) => {
      output += data.toString();
    });

    // Collect stderr
    serverProcess.stderr?.on('data', (data) => {
      errorOutput += data.toString();
    });

    // Wait for server to initialize
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Kill the server
    serverProcess.kill('SIGTERM');

    // Wait for process to exit
    await new Promise((resolve) => {
      serverProcess.on('exit', resolve);
    });

    // Verify server started with correct transport
    expect(errorOutput).toContain('Using transport: stdio');
    
    // Verify it's waiting for initialization (expected behavior with invalid key path)
    expect(errorOutput).toContain('Waiting for Firebase to initialize');
  }, 10000);

  it('should show clear error message when SERVICE_ACCOUNT_KEY_PATH is missing', async () => {
    const serverPath = join(process.cwd(), 'dist', 'index.js');
    
    // Start the server process without SERVICE_ACCOUNT_KEY_PATH
    const serverProcess = spawn('node', [serverPath], {
      env: {
        ...process.env,
        SERVICE_ACCOUNT_KEY_PATH: undefined,
      },
    });

    let errorOutput = '';

    // Collect stderr
    serverProcess.stderr?.on('data', (data) => {
      errorOutput += data.toString();
    });

    // Wait for server to process
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Kill the server
    serverProcess.kill('SIGTERM');

    // Wait for process to exit
    await new Promise((resolve) => {
      serverProcess.on('exit', resolve);
    });

    // Verify clear error message
    expect(errorOutput).toContain('SERVICE_ACCOUNT_KEY_PATH not set');
  }, 10000);

  it('should verify package.json bin configuration is correct', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const packageJson = require('../../package.json');
    
    // Verify bin configuration
    expect(packageJson.bin).toBeDefined();
    expect(packageJson.bin['firebase-power']).toBe('./dist/index.js');
    
    // Verify package name
    expect(packageJson.name).toBe('@kiro/firebase-power');
    
    // Verify POWER.md is in files array
    expect(packageJson.files).toContain('POWER.md');
  });

  it('should verify all required distribution files exist', async () => {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const requiredFiles = [
      'dist/index.js',
      'POWER.md',
      'README.md',
      'LICENSE',
      'package.json',
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(process.cwd(), file);
      const exists = await fs.access(filePath).then(() => true).catch(() => false);
      expect(exists).toBe(true);
    }
  });
});
