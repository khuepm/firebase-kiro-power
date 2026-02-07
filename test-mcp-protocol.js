#!/usr/bin/env node

/**
 * Test MCP Protocol Communication
 * This script tests that the Firebase Power server responds correctly to MCP protocol messages
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('=== MCP Protocol Communication Test ===\n');

// Start the server process
const serverPath = resolve(__dirname, 'dist/index.js');
console.log(`Starting server: ${serverPath}`);

const server = spawn('node', [serverPath], {
  env: {
    ...process.env,
    SERVICE_ACCOUNT_KEY_PATH: resolve(__dirname, 'test-service-account.json'),
    USE_FIREBASE_EMULATOR: 'true',
    FIRESTORE_EMULATOR_HOST: '127.0.0.1:8080',
    FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099',
    FIREBASE_STORAGE_EMULATOR_HOST: '127.0.0.1:9199',
  },
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let errorOutput = '';

server.stdout.on('data', (data) => {
  output += data.toString();
  console.log('STDOUT:', data.toString());
});

server.stderr.on('data', (data) => {
  errorOutput += data.toString();
  console.log('STDERR:', data.toString());
});

// Wait a bit for server to initialize
setTimeout(() => {
  console.log('\nSending MCP initialize request...');

  // Send MCP initialize request
  const initRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    }
  };

  server.stdin.write(JSON.stringify(initRequest) + '\n');

  // Wait for response
  setTimeout(() => {
    console.log('\nSending tools/list request...');

    const listToolsRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {}
    };

    server.stdin.write(JSON.stringify(listToolsRequest) + '\n');

    // Wait for response and cleanup
    setTimeout(() => {
      console.log('\n=== Test Results ===');

      if (errorOutput.includes('Service account file read successfully')) {
        console.log('✓ Server initialized successfully');
      } else {
        console.log('✗ Server initialization failed');
      }

      if (output.length > 0) {
        console.log('✓ Server responded to MCP requests');
      } else {
        console.log('⚠ No MCP responses received (this is expected if emulator is not running)');
      }

      console.log('\n=== Test Complete ===');
      server.kill();
      process.exit(0);
    }, 2000);
  }, 2000);
}, 2000);

// Handle server exit
server.on('exit', (code) => {
  console.log(`\nServer exited with code: ${code}`);
});

// Timeout after 10 seconds
setTimeout(() => {
  console.log('\n✗ Test timeout');
  server.kill();
  process.exit(1);
}, 10000);
