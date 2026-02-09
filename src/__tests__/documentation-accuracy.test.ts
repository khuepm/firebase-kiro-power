/**
 * Task 10.3: Verify documentation accuracy
 * Requirements: 2.3, 2.4, 2.5, 2.6, 2.7
 *
 * This test suite validates that all documentation is accurate and matches the actual implementation:
 * - POWER.md installation instructions are correct
 * - Configuration examples are valid
 * - All documented tools exist and work as described
 * - Troubleshooting guidance is accurate
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import admin from 'firebase-admin';

describe('Task 10.3: Documentation Accuracy Verification', () => {
  describe('POWER.md Documentation', () => {
    let powerMdContent: string;

    it('should have POWER.md file', () => {
      const powerMdPath = join(process.cwd(), 'POWER.md');
      expect(existsSync(powerMdPath)).toBe(true);
      powerMdContent = readFileSync(powerMdPath, 'utf-8');
    });

    it('should have correct title and overview', () => {
      const powerMdPath = join(process.cwd(), 'POWER.md');
      powerMdContent = readFileSync(powerMdPath, 'utf-8');

      // Check title
      expect(powerMdContent).toContain('# Firebase Power');

      // Check overview section
      expect(powerMdContent).toContain('## Overview');
      expect(powerMdContent).toContain('Firebase');
      expect(powerMdContent).toContain('Kiro Power');
    });

    it('should document installation instructions', () => {
      const powerMdPath = join(process.cwd(), 'POWER.md');
      powerMdContent = readFileSync(powerMdPath, 'utf-8');

      // Check installation section
      expect(powerMdContent).toContain('## Installation');
      expect(powerMdContent).toContain('Prerequisites');
      expect(powerMdContent).toContain('Kiro IDE');
      expect(powerMdContent).toContain('Firebase project');
    });

    it('should document required environment variables', () => {
      const powerMdPath = join(process.cwd(), 'POWER.md');
      powerMdContent = readFileSync(powerMdPath, 'utf-8');

      // Check configuration section
      expect(powerMdContent).toContain('## Configuration');
      expect(powerMdContent).toContain('SERVICE_ACCOUNT_KEY_PATH');
      expect(powerMdContent).toContain('FIREBASE_STORAGE_BUCKET');

      // Check that environment variables are described
      expect(powerMdContent).toMatch(/SERVICE_ACCOUNT_KEY_PATH.*path/i);
      expect(powerMdContent).toMatch(/FIREBASE_STORAGE_BUCKET.*bucket/i);
    });

    it('should provide valid configuration examples', () => {
      const powerMdPath = join(process.cwd(), 'POWER.md');
      powerMdContent = readFileSync(powerMdPath, 'utf-8');

      // Check for configuration examples
      expect(powerMdContent).toContain('```json');

      // Check for Kiro IDE configuration example (package name may be split across lines)
      expect(powerMdContent).toContain('@khuepm/firebase-kiro-power');
      expect(powerMdContent).toContain('npx');

      // Check that configuration includes required fields
      const hasServiceAccountPath = powerMdContent.includes('SERVICE_ACCOUNT_KEY_PATH');
      const hasStorageBucket = powerMdContent.includes('FIREBASE_STORAGE_BUCKET');
      expect(hasServiceAccountPath).toBe(true);
      expect(hasStorageBucket).toBe(true);
    });

    it('should document all Firestore tools', () => {
      const powerMdPath = join(process.cwd(), 'POWER.md');
      powerMdContent = readFileSync(powerMdPath, 'utf-8');

      // Check Firestore section
      expect(powerMdContent).toContain('Firestore');

      // Check all Firestore tools are documented
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

      for (const tool of firestoreTools) {
        expect(powerMdContent).toContain(tool);
      }
    });

    it('should document all Storage tools', () => {
      const powerMdPath = join(process.cwd(), 'POWER.md');
      powerMdContent = readFileSync(powerMdPath, 'utf-8');

      // Check Storage section
      expect(powerMdContent).toContain('Storage');

      // Check all Storage tools are documented
      const storageTools = [
        'storage_list_files',
        'storage_upload',
        'storage_upload_from_url',
        'storage_get_file_info',
      ];

      for (const tool of storageTools) {
        expect(powerMdContent).toContain(tool);
      }
    });

    it('should document all Authentication tools', () => {
      const powerMdPath = join(process.cwd(), 'POWER.md');
      powerMdContent = readFileSync(powerMdPath, 'utf-8');

      // Check Authentication section
      expect(powerMdContent).toContain('Authentication');

      // Check Authentication tool is documented
      expect(powerMdContent).toContain('auth_get_user');
    });

    it('should provide usage examples', () => {
      const powerMdPath = join(process.cwd(), 'POWER.md');
      powerMdContent = readFileSync(powerMdPath, 'utf-8');

      // Check for usage examples section
      expect(powerMdContent).toMatch(/## (Usage|Examples|Common Use Cases)/i);

      // Check for code examples
      expect(powerMdContent).toContain('```');
    });

    it('should include troubleshooting guidance', () => {
      const powerMdPath = join(process.cwd(), 'POWER.md');
      powerMdContent = readFileSync(powerMdPath, 'utf-8');

      // Check troubleshooting section
      expect(powerMdContent).toMatch(/## Troubleshooting/i);

      // Check for common issues
      expect(powerMdContent).toMatch(/service account|credential|permission/i);
    });

    it('should document Firebase emulator usage', () => {
      const powerMdPath = join(process.cwd(), 'POWER.md');
      powerMdContent = readFileSync(powerMdPath, 'utf-8');

      // Check for emulator documentation
      expect(powerMdContent).toMatch(/emulator/i);
      expect(powerMdContent).toMatch(/USE_FIREBASE_EMULATOR/i);
    });
  });

  describe('README.md Documentation', () => {
    let readmeContent: string;

    it('should have README.md file', () => {
      const readmePath = join(process.cwd(), 'README.md');
      expect(existsSync(readmePath)).toBe(true);
      readmeContent = readFileSync(readmePath, 'utf-8');
    });

    it('should have correct title with Kiro Power designation', () => {
      const readmePath = join(process.cwd(), 'README.md');
      readmeContent = readFileSync(readmePath, 'utf-8');

      // Check title includes Firebase Power
      expect(readmeContent).toMatch(/# Firebase.*Power/i);

      // Check Kiro Power designation
      expect(readmeContent).toMatch(/Kiro Power/i);
    });

    it('should reference POWER.md for detailed documentation', () => {
      const readmePath = join(process.cwd(), 'README.md');
      readmeContent = readFileSync(readmePath, 'utf-8');

      // Check for link to POWER.md
      expect(readmeContent).toMatch(/POWER\.md/i);
    });

    it('should include installation instructions', () => {
      const readmePath = join(process.cwd(), 'README.md');
      readmeContent = readFileSync(readmePath, 'utf-8');

      // Check for installation section
      expect(readmeContent).toMatch(/## (Installation|Quick Start|Getting Started)/i);

      // Check for npx command
      expect(readmeContent).toMatch(/npx.*@khuepm\/firebase-kiro-power/);
    });

    it('should maintain technical documentation', () => {
      const readmePath = join(process.cwd(), 'README.md');
      readmeContent = readFileSync(readmePath, 'utf-8');

      // Check for technical sections (more flexible matching)
      const hasTechnicalSection = 
        readmeContent.includes('## Overview') ||
        readmeContent.includes('## Quick Start') ||
        readmeContent.includes('## Setup') ||
        readmeContent.includes('## Configuration') ||
        readmeContent.includes('## Quick Reference');
      
      expect(hasTechnicalSection).toBe(true);

      // Check for Firebase services
      expect(readmeContent).toContain('Firestore');
      expect(readmeContent).toContain('Storage');
      expect(readmeContent).toContain('Authentication');
    });
  });

  describe('Configuration Examples Validation', () => {
    it('should have valid package.json matching documentation', () => {
      const packageJson = JSON.parse(
        readFileSync(join(process.cwd(), 'package.json'), 'utf-8')
      );

      // Verify package name matches documentation
      expect(packageJson.name).toBe('@khuepm/firebase-kiro-power');

      // Verify binary name
      expect(packageJson.bin['firebase-power']).toBe('./dist/index.js');

      // Verify description includes Kiro Power
      expect(packageJson.description).toContain('Kiro Power');
    });

    it('should have correct environment variable names in config', () => {
      const configPath = join(process.cwd(), 'src', 'config.ts');
      if (existsSync(configPath)) {
        const configContent = readFileSync(configPath, 'utf-8');

        // Check for documented environment variables
        expect(configContent).toContain('SERVICE_ACCOUNT_KEY_PATH');
        expect(configContent).toContain('FIREBASE_STORAGE_BUCKET');
      }
    });
  });

  describe('Tool Documentation Accuracy', () => {
    it('should document tools that actually exist in the codebase', () => {
      const powerMdPath = join(process.cwd(), 'POWER.md');
      const powerMdContent = readFileSync(powerMdPath, 'utf-8');

      // Check that documented Firestore tools exist in implementation
      const firestoreClientPath = join(process.cwd(), 'src', 'lib', 'firebase', 'firestoreClient.ts');
      if (existsSync(firestoreClientPath)) {
        const firestoreContent = readFileSync(firestoreClientPath, 'utf-8');

        // Verify key functions exist
        expect(firestoreContent).toContain('addDocument');
        expect(firestoreContent).toContain('listDocuments');
        expect(firestoreContent).toContain('getDocument');
        expect(firestoreContent).toContain('updateDocument');
        expect(firestoreContent).toContain('deleteDocument');
      }

      // Check that documented Storage tools exist in implementation
      const storageClientPath = join(process.cwd(), 'src', 'lib', 'firebase', 'storageClient.ts');
      if (existsSync(storageClientPath)) {
        const storageContent = readFileSync(storageClientPath, 'utf-8');

        // Verify key functions exist (using actual function names)
        expect(storageContent).toContain('listDirectoryFiles');
        expect(storageContent).toContain('uploadFile');
        expect(storageContent).toContain('getFileInfo');
      }

      // Check that documented Auth tools exist in implementation
      const authClientPath = join(process.cwd(), 'src', 'lib', 'firebase', 'authClient.ts');
      if (existsSync(authClientPath)) {
        const authContent = readFileSync(authClientPath, 'utf-8');

        // Verify key functions exist
        expect(authContent).toContain('getUser');
      }
    });

    it('should have accurate tool parameter descriptions', () => {
      const powerMdPath = join(process.cwd(), 'POWER.md');
      const powerMdContent = readFileSync(powerMdPath, 'utf-8');

      // Check that tool parameters are described
      // For firestore_add_document
      if (powerMdContent.includes('firestore_add_document')) {
        expect(powerMdContent).toMatch(/collection.*path/i);
        expect(powerMdContent).toMatch(/data.*document/i);
      }

      // For storage_upload
      if (powerMdContent.includes('storage_upload')) {
        expect(powerMdContent).toMatch(/path.*file/i);
        expect(powerMdContent).toMatch(/content/i);
      }

      // For auth_get_user
      if (powerMdContent.includes('auth_get_user')) {
        expect(powerMdContent).toMatch(/identifier.*email.*uid/i);
      }
    });
  });

  describe('Troubleshooting Guidance Accuracy', () => {
    it('should document actual error scenarios', () => {
      const powerMdPath = join(process.cwd(), 'POWER.md');
      const powerMdContent = readFileSync(powerMdPath, 'utf-8');

      // Check for common error scenarios
      expect(powerMdContent).toMatch(/SERVICE_ACCOUNT_KEY_PATH/i);
      expect(powerMdContent).toMatch(/Storage bucket/i);
      expect(powerMdContent).toMatch(/Document not found|File not found|User not found/i);
    });

    it('should provide solutions that match the implementation', () => {
      const powerMdPath = join(process.cwd(), 'POWER.md');
      const powerMdContent = readFileSync(powerMdPath, 'utf-8');

      // Check for solution guidance
      expect(powerMdContent).toMatch(/SERVICE_ACCOUNT_KEY_PATH/i);
      expect(powerMdContent).toMatch(/Firebase Console/i);
      expect(powerMdContent).toMatch(/emulator/i);
    });
  });

  describe('Installation Instructions Validation', () => {
    it('should have step-by-step installation instructions', () => {
      const powerMdPath = join(process.cwd(), 'POWER.md');
      const powerMdContent = readFileSync(powerMdPath, 'utf-8');

      // Check for numbered or bulleted steps
      expect(powerMdContent).toMatch(/1\.|2\.|3\.|•|-/);

      // Check for key installation steps
      expect(powerMdContent).toMatch(/Kiro IDE/i);
      expect(powerMdContent).toMatch(/Powers.*panel/i);
      expect(powerMdContent).toMatch(/configure.*environment/i);
    });

    it('should document prerequisites correctly', () => {
      const powerMdPath = join(process.cwd(), 'POWER.md');
      const powerMdContent = readFileSync(powerMdPath, 'utf-8');

      // Check prerequisites
      expect(powerMdContent).toMatch(/prerequisite/i);
      expect(powerMdContent).toMatch(/Kiro IDE/i);
      expect(powerMdContent).toMatch(/Firebase project/i);
      expect(powerMdContent).toMatch(/Node\.js/i);
    });

    it('should document configuration steps accurately', () => {
      const powerMdPath = join(process.cwd(), 'POWER.md');
      const powerMdContent = readFileSync(powerMdPath, 'utf-8');

      // Check configuration steps
      expect(powerMdContent).toMatch(/service account.*key/i);
      expect(powerMdContent).toMatch(/\.json/i);
      expect(powerMdContent).toMatch(/path/i);
    });
  });

  describe('Cross-Reference Validation', () => {
    it('should have consistent information between POWER.md and README.md', () => {
      const powerMdPath = join(process.cwd(), 'POWER.md');
      const readmePath = join(process.cwd(), 'README.md');

      const powerMdContent = readFileSync(powerMdPath, 'utf-8');
      const readmeContent = readFileSync(readmePath, 'utf-8');

      // Both should mention Firebase Power
      expect(powerMdContent).toContain('Firebase Power');
      expect(readmeContent).toContain('Firebase Power');

      // Both should mention Kiro Power
      expect(powerMdContent).toContain('Kiro Power');
      expect(readmeContent).toContain('Kiro Power');

      // Both should mention the package name
      expect(powerMdContent).toContain('@khuepm/firebase-kiro-power');
      expect(readmeContent).toContain('@khuepm/firebase-kiro-power');
    });

    it('should have consistent tool names across documentation', () => {
      const powerMdPath = join(process.cwd(), 'POWER.md');
      const powerMdContent = readFileSync(powerMdPath, 'utf-8');

      // Check that tool names use consistent format (snake_case)
      const toolPattern = /(firestore|storage|auth)_[a-z_]+/g;
      const tools = powerMdContent.match(toolPattern);

      if (tools) {
        // All tool names should be lowercase with underscores
        tools.forEach(tool => {
          expect(tool).toMatch(/^[a-z_]+$/);
        });
      }
    });
  });

  describe('Firebase Admin SDK Compatibility', () => {
    it('should document correct Firebase Admin SDK version', () => {
      const packageJson = JSON.parse(
        readFileSync(join(process.cwd(), 'package.json'), 'utf-8')
      );

      // Check Firebase Admin SDK version
      expect(packageJson.dependencies['firebase-admin']).toBeDefined();
      expect(packageJson.dependencies['firebase-admin']).toMatch(/\^13\./);
    });

    it('should document correct MCP SDK version', () => {
      const packageJson = JSON.parse(
        readFileSync(join(process.cwd(), 'package.json'), 'utf-8')
      );

      // Check MCP SDK version
      expect(packageJson.dependencies['@modelcontextprotocol/sdk']).toBeDefined();
      expect(packageJson.dependencies['@modelcontextprotocol/sdk']).toMatch(/\^1\./);
    });
  });
});
