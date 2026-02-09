import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Integration: Documentation Accuracy', () => {
  it('should verify POWER.md documents all Firestore tools', () => {
    const powerMdPath = join(process.cwd(), 'POWER.md');
    const powerMdContent = readFileSync(powerMdPath, 'utf-8');

    // List of all Firestore tools that should be documented
    const firestoreTools = [
      'firestore_add_document',
      'firestore_list_documents',
      'firestore_get_document',
      'firestore_update_document',
      'firestore_delete_document',
      'firestore_list_collections',
      'firestore_query_collection_group',
      'firestore_count_documents',
    ];

    // Verify each tool is documented
    for (const tool of firestoreTools) {
      expect(powerMdContent).toContain(tool);
    }
  });

  it('should verify POWER.md documents all Storage tools', () => {
    const powerMdPath = join(process.cwd(), 'POWER.md');
    const powerMdContent = readFileSync(powerMdPath, 'utf-8');

    // List of all Storage tools that should be documented
    const storageTools = [
      'storage_list_files',
      'storage_get_file_info',
      'storage_upload',
      'storage_upload_from_url',
    ];

    // Verify each tool is documented
    for (const tool of storageTools) {
      expect(powerMdContent).toContain(tool);
    }
  });

  it('should verify POWER.md documents all Authentication tools', () => {
    const powerMdPath = join(process.cwd(), 'POWER.md');
    const powerMdContent = readFileSync(powerMdPath, 'utf-8');

    // List of all Auth tools that should be documented
    const authTools = ['auth_get_user'];

    // Verify each tool is documented
    for (const tool of authTools) {
      expect(powerMdContent).toContain(tool);
    }
  });

  it('should verify POWER.md includes installation instructions', () => {
    const powerMdPath = join(process.cwd(), 'POWER.md');
    const powerMdContent = readFileSync(powerMdPath, 'utf-8');

    // Verify installation section exists
    expect(powerMdContent).toContain('## Installation');
    expect(powerMdContent).toContain('Prerequisites');
    expect(powerMdContent).toContain('Kiro IDE');
    expect(powerMdContent).toContain('Firebase project');
    expect(powerMdContent).toContain('service account');
  });

  it('should verify POWER.md includes configuration examples', () => {
    const powerMdPath = join(process.cwd(), 'POWER.md');
    const powerMdContent = readFileSync(powerMdPath, 'utf-8');

    // Verify configuration section exists
    expect(powerMdContent).toContain('## Configuration');
    expect(powerMdContent).toContain('SERVICE_ACCOUNT_KEY_PATH');
    expect(powerMdContent).toContain('FIREBASE_STORAGE_BUCKET');
    
    // Verify configuration examples for different clients
    expect(powerMdContent).toContain('Kiro IDE Configuration');
    expect(powerMdContent).toContain('Claude Desktop Configuration');
  });

  it('should verify POWER.md includes troubleshooting section', () => {
    const powerMdPath = join(process.cwd(), 'POWER.md');
    const powerMdContent = readFileSync(powerMdPath, 'utf-8');

    // Verify troubleshooting section exists
    expect(powerMdContent).toContain('Troubleshooting');
    expect(powerMdContent).toContain('Firebase Console');
  });

  it('should verify README.md references POWER.md', () => {
    const readmePath = join(process.cwd(), 'README.md');
    const readmeContent = readFileSync(readmePath, 'utf-8');

    // Verify README references POWER.md
    expect(readmeContent).toContain('POWER.md');
    expect(readmeContent).toContain('Firebase Power');
    expect(readmeContent).toContain('Kiro Power');
  });

  it('should verify README.md includes Kiro IDE installation steps', () => {
    const readmePath = join(process.cwd(), 'README.md');
    const readmeContent = readFileSync(readmePath, 'utf-8');

    // Verify Kiro IDE installation section exists
    expect(readmeContent).toContain('Quick Start for Kiro IDE');
    expect(readmeContent).toContain('Powers panel');
    expect(readmeContent).toContain('SERVICE_ACCOUNT_KEY_PATH');
  });

  it('should verify package.json has correct metadata', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const packageJson = require('../../package.json');

    // Verify package name
    expect(packageJson.name).toBe('@khuepm/firebase-kiro-power');

    // Verify description mentions Kiro Power
    expect(packageJson.description).toContain('Kiro Power');

    // Verify keywords include kiro and kiro-power
    expect(packageJson.keywords).toContain('kiro');
    expect(packageJson.keywords).toContain('kiro-power');

    // Verify POWER.md is in files array
    expect(packageJson.files).toContain('POWER.md');
  });

  it('should verify POWER.md contains configuration examples', () => {
    const powerMdPath = join(process.cwd(), 'POWER.md');
    const powerMdContent = readFileSync(powerMdPath, 'utf-8');

    // Extract JSON code blocks from POWER.md
    const jsonBlockRegex = /```json\n([\s\S]*?)\n```/g;
    const jsonBlocks = [];
    let match;

    while ((match = jsonBlockRegex.exec(powerMdContent)) !== null) {
      jsonBlocks.push(match[1]);
    }

    // Verify we found some JSON blocks
    expect(jsonBlocks.length).toBeGreaterThan(0);

    // Verify at least one block contains MCP server configuration
    const hasMcpConfig = jsonBlocks.some(block => 
      block.includes('mcpServers') || block.includes('firebase')
    );
    expect(hasMcpConfig).toBe(true);
  });

  it('should verify tool parameter documentation matches implementation', () => {
    const powerMdPath = join(process.cwd(), 'POWER.md');
    const powerMdContent = readFileSync(powerMdPath, 'utf-8');

    // Check that key parameters are documented for each tool type
    
    // Firestore parameters
    expect(powerMdContent).toContain('collection');
    expect(powerMdContent).toContain('data');
    expect(powerMdContent).toContain('filters');
    expect(powerMdContent).toContain('orderBy');
    expect(powerMdContent).toContain('limit');

    // Storage parameters
    expect(powerMdContent).toContain('filePath');
    expect(powerMdContent).toContain('directoryPath');
    expect(powerMdContent).toContain('content');

    // Auth parameters
    expect(powerMdContent).toContain('identifier');
  });
});
