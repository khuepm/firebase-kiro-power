import { describe, it, expect } from 'vitest';
import { spawn } from 'child_process';
import { join } from 'path';

describe('Integration: Installation via npx', () => {
  it('should exit with error when service account key file does not exist', async () => {
    const serverPath = join(process.cwd(), 'dist', 'index.js');
    
    // Start the server process with non-existent service account key
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

    // Wait for server to process and exit
    const exitCode = await new Promise<number | null>((resolve) => {
      serverProcess.on('exit', (code) => resolve(code));
      // Timeout after 3 seconds
      setTimeout(() => {
        serverProcess.kill('SIGTERM');
        resolve(null);
      }, 3000);
    });

    // Verify server started with correct transport
    expect(errorOutput).toContain('Using transport: stdio');
    
    // Verify it shows error about Firebase initialization failure
    expect(errorOutput).toContain('Error initializing Firebase');
    
    // Verify process exited with error code
    expect(exitCode).toBe(1);
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

    // Wait for process to exit
    const exitCode = await new Promise<number | null>((resolve) => {
      serverProcess.on('exit', (code) => resolve(code));
      // Timeout after 3 seconds
      setTimeout(() => {
        serverProcess.kill('SIGTERM');
        resolve(null);
      }, 3000);
    });

    // Verify clear error messages
    expect(errorOutput).toContain('SERVICE_ACCOUNT_KEY_PATH not set');
    expect(errorOutput).toContain('Please set SERVICE_ACCOUNT_KEY_PATH environment variable');
    expect(errorOutput).toContain('Or use Firebase Emulator: USE_FIREBASE_EMULATOR=true');
    
    // Verify process exited with error code
    expect(exitCode).toBe(1);
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
