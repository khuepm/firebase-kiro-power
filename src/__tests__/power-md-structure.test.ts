import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Unit tests for POWER.md structure and completeness
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7**
 *
 * These tests verify that POWER.md has been correctly created with all
 * required sections, proper structure, and complete documentation for all
 * MCP tools (Firestore, Storage, Authentication).
 */

describe('POWER.md Structure and Completeness', () => {
  // Read the POWER.md file
  const powerMdPath = path.resolve(process.cwd(), 'POWER.md');
  
  describe('File Existence', () => {
    it('should have POWER.md file in root directory', () => {
      expect(fs.existsSync(powerMdPath)).toBe(true);
    });

    it('should be a readable file', () => {
      expect(() => fs.readFileSync(powerMdPath, 'utf8')).not.toThrow();
    });

    it('should not be empty', () => {
      const content = fs.readFileSync(powerMdPath, 'utf8');
      expect(content.length).toBeGreaterThan(0);
    });

    it('should have substantial content (at least 10KB)', () => {
      const content = fs.readFileSync(powerMdPath, 'utf8');
      expect(content.length).toBeGreaterThan(10000);
    });
  });

  describe('Required Sections - Overview and Introduction', () => {
    const powerMdContent = fs.readFileSync(powerMdPath, 'utf8');

    it('should have a main title "Firebase Power"', () => {
      expect(powerMdContent).toMatch(/^#\s+Firebase\s+Power/m);
    });

    it('should have an Overview section', () => {
      expect(powerMdContent).toMatch(/##\s+Overview/i);
    });

    it('should describe Firebase Power capabilities in Overview', () => {
      const overviewMatch = powerMdContent.match(/##\s+Overview[\s\S]*?(?=\n##\s+[^#]|$)/i);
      expect(overviewMatch).not.toBeNull();
      
      if (overviewMatch) {
        const overviewContent = overviewMatch[0];
        expect(overviewContent).toContain('Firebase');
        expect(overviewContent).toContain('Kiro');
        expect(overviewContent.length).toBeGreaterThan(100);
      }
    });

    it('should have "What is a Kiro Power?" section', () => {
      expect(powerMdContent).toMatch(/##\s+What\s+is\s+a\s+Kiro\s+Power\??/i);
    });

    it('should explain Kiro Power concept', () => {
      const kiroPowerMatch = powerMdContent.match(/##\s+What\s+is\s+a\s+Kiro\s+Power\??[\s\S]*?(?=\n##\s+[^#]|$)/i);
      expect(kiroPowerMatch).not.toBeNull();
      
      if (kiroPowerMatch) {
        const kiroPowerContent = kiroPowerMatch[0];
        expect(kiroPowerContent.toLowerCase()).toContain('power');
        expect(kiroPowerContent.length).toBeGreaterThan(50);
      }
    });

    it('should have a Features section', () => {
      expect(powerMdContent).toMatch(/##\s+Features/i);
    });

    it('should list Firestore, Storage, and Authentication features', () => {
      const featuresMatch = powerMdContent.match(/##\s+Features[\s\S]*?(?=\n##\s+[^#]|$)/i);
      expect(featuresMatch).not.toBeNull();
      
      if (featuresMatch) {
        const featuresContent = featuresMatch[0];
        expect(featuresContent.toLowerCase()).toContain('firestore');
        expect(featuresContent.toLowerCase()).toContain('storage');
        expect(featuresContent.toLowerCase()).toContain('authentication');
      }
    });
  });

  describe('Required Sections - Installation', () => {
    const powerMdContent = fs.readFileSync(powerMdPath, 'utf8');

    it('should have an Installation section', () => {
      expect(powerMdContent).toMatch(/##\s+Installation/i);
    });

    it('should document prerequisites', () => {
      const installMatch = powerMdContent.match(/##\s+Installation[\s\S]*?(?=\n##\s+[^#]|$)/i);
      expect(installMatch).not.toBeNull();
      
      if (installMatch) {
        const installContent = installMatch[0];
        expect(installContent.toLowerCase()).toContain('prerequisite');
      }
    });

    it('should mention Kiro IDE as a prerequisite', () => {
      const installMatch = powerMdContent.match(/##\s+Installation[\s\S]*?(?=\n##\s+[^#]|$)/i);
      expect(installMatch).not.toBeNull();
      
      if (installMatch) {
        const installContent = installMatch[0];
        expect(installContent).toContain('Kiro IDE');
      }
    });

    it('should mention Firebase project as a prerequisite', () => {
      const installMatch = powerMdContent.match(/##\s+Installation[\s\S]*?(?=\n##\s+[^#]|$)/i);
      expect(installMatch).not.toBeNull();
      
      if (installMatch) {
        const installContent = installMatch[0];
        expect(installContent.toLowerCase()).toContain('firebase project');
      }
    });

    it('should provide step-by-step installation instructions', () => {
      const installMatch = powerMdContent.match(/##\s+Installation[\s\S]*?(?=\n##\s+[^#]|$)/i);
      expect(installMatch).not.toBeNull();
      
      if (installMatch) {
        const installContent = installMatch[0];
        // Look for numbered steps or bullet points
        const hasSteps = /\d+\.\s+/.test(installContent) || /[-*]\s+/.test(installContent);
        expect(hasSteps).toBe(true);
      }
    });

    it('should mention Powers panel installation workflow', () => {
      const installMatch = powerMdContent.match(/##\s+Installation[\s\S]*?(?=\n##\s+[^#]|$)/i);
      expect(installMatch).not.toBeNull();
      
      if (installMatch) {
        const installContent = installMatch[0];
        expect(installContent.toLowerCase()).toContain('powers panel');
      }
    });
  });

  describe('Required Sections - Configuration', () => {
    const powerMdContent = fs.readFileSync(powerMdPath, 'utf8');

    it('should have a Configuration section', () => {
      expect(powerMdContent).toMatch(/##\s+Configuration/i);
    });

    it('should document SERVICE_ACCOUNT_KEY_PATH environment variable', () => {
      const configMatch = powerMdContent.match(/##\s+Configuration[\s\S]*?(?=\n##\s+[^#]|$)/i);
      expect(configMatch).not.toBeNull();
      
      if (configMatch) {
        const configContent = configMatch[0];
        expect(configContent).toContain('SERVICE_ACCOUNT_KEY_PATH');
      }
    });

    it('should mark SERVICE_ACCOUNT_KEY_PATH as required', () => {
      const configMatch = powerMdContent.match(/##\s+Configuration[\s\S]*?(?=\n##\s+[^#]|$)/i);
      expect(configMatch).not.toBeNull();
      
      if (configMatch) {
        const configContent = configMatch[0];
        // Look for SERVICE_ACCOUNT_KEY_PATH with "required" nearby
        const serviceAccountSection = configContent.match(/SERVICE_ACCOUNT_KEY_PATH[\s\S]{0,500}/);
        expect(serviceAccountSection).not.toBeNull();
        
        if (serviceAccountSection) {
          expect(serviceAccountSection[0].toLowerCase()).toContain('required');
        }
      }
    });

    it('should document FIREBASE_STORAGE_BUCKET environment variable', () => {
      const configMatch = powerMdContent.match(/##\s+Configuration[\s\S]*?(?=\n##\s+[^#]|$)/i);
      expect(configMatch).not.toBeNull();
      
      if (configMatch) {
        const configContent = configMatch[0];
        expect(configContent).toContain('FIREBASE_STORAGE_BUCKET');
      }
    });

    it('should mark FIREBASE_STORAGE_BUCKET as optional', () => {
      const configMatch = powerMdContent.match(/##\s+Configuration[\s\S]*?(?=\n##\s+[^#]|$)/i);
      expect(configMatch).not.toBeNull();
      
      if (configMatch) {
        const configContent = configMatch[0];
        // Look for FIREBASE_STORAGE_BUCKET with "optional" nearby
        const storageBucketSection = configContent.match(/FIREBASE_STORAGE_BUCKET[\s\S]{0,500}/);
        expect(storageBucketSection).not.toBeNull();
        
        if (storageBucketSection) {
          expect(storageBucketSection[0].toLowerCase()).toContain('optional');
        }
      }
    });

    it('should provide Kiro IDE configuration example in JSON format', () => {
      const configMatch = powerMdContent.match(/##\s+Configuration[\s\S]*?(?=\n##\s+[^#]|$)/i);
      expect(configMatch).not.toBeNull();
      
      if (configMatch) {
        const configContent = configMatch[0];
        // Look for JSON code blocks
        expect(configContent).toMatch(/```json/i);
        // Should mention Kiro
        expect(configContent.toLowerCase()).toContain('kiro');
      }
    });

    it('should provide configuration examples for other MCP clients', () => {
      const configMatch = powerMdContent.match(/##\s+Configuration[\s\S]*?(?=\n##\s+[^#]|$)/i);
      expect(configMatch).not.toBeNull();
      
      if (configMatch) {
        const configContent = configMatch[0];
        // Should have multiple JSON code blocks for different clients
        const jsonBlocks = configContent.match(/```json/gi);
        expect(jsonBlocks).not.toBeNull();
        expect(jsonBlocks!.length).toBeGreaterThanOrEqual(2);
      }
    });
  });

  describe('Required Sections - Available Tools', () => {
    const powerMdContent = fs.readFileSync(powerMdPath, 'utf8');

    it('should have an Available Tools section', () => {
      expect(powerMdContent).toMatch(/##\s+Available\s+Tools/i);
    });

    it('should have Firestore Tools subsection', () => {
      expect(powerMdContent).toMatch(/###\s+Firestore\s+Tools/i);
    });

    it('should have Storage Tools subsection', () => {
      expect(powerMdContent).toMatch(/###\s+Storage\s+Tools/i);
    });

    it('should have Authentication Tools subsection', () => {
      expect(powerMdContent).toMatch(/###\s+(Firebase\s+)?Authentication(\s+Tools)?/i);
    });
  });

  describe('Firestore Tools Documentation', () => {
    const powerMdContent = fs.readFileSync(powerMdPath, 'utf8');

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

    firestoreTools.forEach((toolName) => {
      it(`should document ${toolName}`, () => {
        const toolHeadingRegex = new RegExp(`####\\s+${toolName}`, 'i');
        expect(powerMdContent).toMatch(toolHeadingRegex);
      });

      it(`should document parameters for ${toolName}`, () => {
        const toolSectionRegex = new RegExp(
          `####\\s+${toolName}[\\s\\S]*?(?=####|$)`,
          'i'
        );
        const toolSection = powerMdContent.match(toolSectionRegex);
        expect(toolSection).not.toBeNull();
        
        if (toolSection) {
          expect(toolSection[0].toLowerCase()).toContain('parameter');
        }
      });

      it(`should document examples for ${toolName}`, () => {
        const toolSectionRegex = new RegExp(
          `####\\s+${toolName}[\\s\\S]*?(?=####|$)`,
          'i'
        );
        const toolSection = powerMdContent.match(toolSectionRegex);
        expect(toolSection).not.toBeNull();
        
        if (toolSection) {
          const hasExamples = /example\s*usage/i.test(toolSection[0]) || /```/.test(toolSection[0]);
          expect(hasExamples).toBe(true);
        }
      });
    });

    it('should document all 8 Firestore tools', () => {
      firestoreTools.forEach((toolName) => {
        const toolHeadingRegex = new RegExp(`####\\s+${toolName}`, 'i');
        expect(powerMdContent).toMatch(toolHeadingRegex);
      });
    });
  });

  describe('Storage Tools Documentation', () => {
    const powerMdContent = fs.readFileSync(powerMdPath, 'utf8');

    const storageTools = [
      'storage_list_files',
      'storage_get_file_info',
      'storage_upload',
      'storage_upload_from_url',
    ];

    storageTools.forEach((toolName) => {
      it(`should document ${toolName}`, () => {
        const toolHeadingRegex = new RegExp(`####\\s+${toolName}`, 'i');
        expect(powerMdContent).toMatch(toolHeadingRegex);
      });

      it(`should document parameters for ${toolName}`, () => {
        const toolSectionRegex = new RegExp(
          `####\\s+${toolName}[\\s\\S]*?(?=####|$)`,
          'i'
        );
        const toolSection = powerMdContent.match(toolSectionRegex);
        expect(toolSection).not.toBeNull();
        
        if (toolSection) {
          expect(toolSection[0].toLowerCase()).toContain('parameter');
        }
      });

      it(`should document examples for ${toolName}`, () => {
        const toolSectionRegex = new RegExp(
          `####\\s+${toolName}[\\s\\S]*?(?=####|$)`,
          'i'
        );
        const toolSection = powerMdContent.match(toolSectionRegex);
        expect(toolSection).not.toBeNull();
        
        if (toolSection) {
          const hasExamples = /example\s*usage/i.test(toolSection[0]) || /```/.test(toolSection[0]);
          expect(hasExamples).toBe(true);
        }
      });
    });

    it('should document all 4 Storage tools', () => {
      storageTools.forEach((toolName) => {
        const toolHeadingRegex = new RegExp(`####\\s+${toolName}`, 'i');
        expect(powerMdContent).toMatch(toolHeadingRegex);
      });
    });
  });

  describe('Authentication Tools Documentation', () => {
    const powerMdContent = fs.readFileSync(powerMdPath, 'utf8');

    const authTools = ['auth_get_user'];

    authTools.forEach((toolName) => {
      it(`should document ${toolName}`, () => {
        const toolHeadingRegex = new RegExp(`####\\s+${toolName}`, 'i');
        expect(powerMdContent).toMatch(toolHeadingRegex);
      });

      it(`should document parameters for ${toolName}`, () => {
        const toolSectionRegex = new RegExp(
          `####\\s+${toolName}[\\s\\S]*?(?=####|$)`,
          'i'
        );
        const toolSection = powerMdContent.match(toolSectionRegex);
        expect(toolSection).not.toBeNull();
        
        if (toolSection) {
          expect(toolSection[0].toLowerCase()).toContain('parameter');
        }
      });

      it(`should document examples for ${toolName}`, () => {
        const toolSectionRegex = new RegExp(
          `####\\s+${toolName}[\\s\\S]*?(?=####|$)`,
          'i'
        );
        const toolSection = powerMdContent.match(toolSectionRegex);
        expect(toolSection).not.toBeNull();
        
        if (toolSection) {
          const hasExamples = /example\s*usage/i.test(toolSection[0]) || /```/.test(toolSection[0]);
          expect(hasExamples).toBe(true);
        }
      });

      it(`should document email and UID lookup for ${toolName}`, () => {
        const toolSectionRegex = new RegExp(
          `####\\s+${toolName}[\\s\\S]*?(?=####|$)`,
          'i'
        );
        const toolSection = powerMdContent.match(toolSectionRegex);
        expect(toolSection).not.toBeNull();
        
        if (toolSection) {
          const sectionContent = toolSection[0].toLowerCase();
          expect(sectionContent).toContain('email');
          expect(sectionContent).toContain('uid');
        }
      });
    });

    it('should document the Authentication tool', () => {
      authTools.forEach((toolName) => {
        const toolHeadingRegex = new RegExp(`####\\s+${toolName}`, 'i');
        expect(powerMdContent).toMatch(toolHeadingRegex);
      });
    });
  });

  describe('Required Sections - Usage Examples', () => {
    const powerMdContent = fs.readFileSync(powerMdPath, 'utf8');

    it('should have a Usage Examples section', () => {
      expect(powerMdContent).toMatch(/##\s+Usage\s+Examples/i);
    });

    it('should provide common workflow examples', () => {
      const examplesMatch = powerMdContent.match(/##\s+Usage\s+Examples[\s\S]*?(?=\n##\s+[^#]|$)/i);
      expect(examplesMatch).not.toBeNull();
      
      if (examplesMatch) {
        const examplesContent = examplesMatch[0];
        // Should have multiple examples (look for "Example" headings)
        const exampleHeadings = examplesContent.match(/###\s+Example/gi);
        expect(exampleHeadings).not.toBeNull();
        expect(exampleHeadings!.length).toBeGreaterThanOrEqual(3);
      }
    });

    it('should include code examples in Usage Examples section', () => {
      const examplesMatch = powerMdContent.match(/##\s+Usage\s+Examples[\s\S]*?(?=\n##\s+[^#]|$)/i);
      expect(examplesMatch).not.toBeNull();
      
      if (examplesMatch) {
        const examplesContent = examplesMatch[0];
        // Should have code blocks
        expect(examplesContent).toMatch(/```/);
      }
    });
  });

  describe('Required Sections - Troubleshooting', () => {
    const powerMdContent = fs.readFileSync(powerMdPath, 'utf8');

    it('should have a Troubleshooting section', () => {
      expect(powerMdContent).toMatch(/##\s+Troubleshooting/i);
    });

    it('should document common issues', () => {
      const troubleshootingMatch = powerMdContent.match(/##\s+Troubleshooting[\s\S]*?(?=\n##\s+[^#]|$)/i);
      expect(troubleshootingMatch).not.toBeNull();
      
      if (troubleshootingMatch) {
        const troubleshootingContent = troubleshootingMatch[0];
        // Should have multiple issue headings
        const issueHeadings = troubleshootingContent.match(/###\s+/g);
        expect(issueHeadings).not.toBeNull();
        expect(issueHeadings!.length).toBeGreaterThanOrEqual(3);
      }
    });

    it('should provide solutions for common issues', () => {
      const troubleshootingMatch = powerMdContent.match(/##\s+Troubleshooting[\s\S]*?(?=\n##\s+[^#]|$)/i);
      expect(troubleshootingMatch).not.toBeNull();
      
      if (troubleshootingMatch) {
        const troubleshootingContent = troubleshootingMatch[0];
        // Should mention solutions
        expect(troubleshootingContent.toLowerCase()).toContain('solution');
      }
    });

    it('should document Firebase emulator usage', () => {
      const troubleshootingMatch = powerMdContent.match(/##\s+Troubleshooting[\s\S]*?(?=\n##\s+[^#]|$)/i);
      expect(troubleshootingMatch).not.toBeNull();
      
      if (troubleshootingMatch) {
        const troubleshootingContent = troubleshootingMatch[0];
        expect(troubleshootingContent.toLowerCase()).toContain('emulator');
      }
    });

    it('should include links to Firebase Console', () => {
      const troubleshootingMatch = powerMdContent.match(/##\s+Troubleshooting[\s\S]*?(?=\n##\s+[^#]|$)/i);
      expect(troubleshootingMatch).not.toBeNull();
      
      if (troubleshootingMatch) {
        const troubleshootingContent = troubleshootingMatch[0];
        expect(troubleshootingContent).toContain('console.firebase.google.com');
      }
    });
  });

  describe('Documentation Quality', () => {
    const powerMdContent = fs.readFileSync(powerMdPath, 'utf8');

    it('should have proper markdown heading hierarchy', () => {
      // Check that headings follow proper hierarchy (# -> ## -> ### -> ####)
      const lines = powerMdContent.split('\n');
      let previousLevel = 0;
      
      lines.forEach((line) => {
        const headingMatch = line.match(/^(#{1,6})\s+/);
        if (headingMatch) {
          const currentLevel = headingMatch[1].length;
          // Level should not jump more than 1 (e.g., # -> ### is bad)
          if (previousLevel > 0) {
            expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
          }
          previousLevel = currentLevel;
        }
      });
    });

    it('should have consistent tool documentation format', () => {
      const allTools = [
        'firestore_add_document',
        'firestore_list_documents',
        'firestore_get_document',
        'firestore_update_document',
        'firestore_delete_document',
        'firestore_list_collections',
        'firestore_query_collection_group',
        'firestore_count_documents',
        'storage_list_files',
        'storage_get_file_info',
        'storage_upload',
        'storage_upload_from_url',
        'auth_get_user',
      ];

      allTools.forEach((toolName) => {
        const toolSectionRegex = new RegExp(
          `####\\s+${toolName}[\\s\\S]*?(?=####|$)`,
          'i'
        );
        const toolSection = powerMdContent.match(toolSectionRegex);
        
        if (toolSection) {
          const sectionContent = toolSection[0];
          
          // Each tool should have consistent elements
          const hasParameters = /parameter/i.test(sectionContent);
          const hasReturns = /returns?:/i.test(sectionContent) || /response:/i.test(sectionContent);
          const hasExamples = /example/i.test(sectionContent) || /```/.test(sectionContent);
          
          expect(hasParameters).toBe(true);
          expect(hasReturns).toBe(true);
          expect(hasExamples).toBe(true);
        }
      });
    });

    it('should not have broken markdown links', () => {
      // Check for malformed markdown links [text](url)
      const brokenLinkPattern = /\[([^\]]+)\]\(\s*\)/g;
      const brokenLinks = powerMdContent.match(brokenLinkPattern);
      expect(brokenLinks).toBeNull();
    });

    it('should have properly formatted code blocks', () => {
      // Count opening and closing code block markers
      const codeBlockMarkers = powerMdContent.match(/```/g);
      expect(codeBlockMarkers).not.toBeNull();
      
      if (codeBlockMarkers) {
        // Should have even number of ``` (each block has opening and closing)
        expect(codeBlockMarkers.length % 2).toBe(0);
      }
    });

    it('should document all 13 MCP tools', () => {
      const allTools = [
        'firestore_add_document',
        'firestore_list_documents',
        'firestore_get_document',
        'firestore_update_document',
        'firestore_delete_document',
        'firestore_list_collections',
        'firestore_query_collection_group',
        'firestore_count_documents',
        'storage_list_files',
        'storage_get_file_info',
        'storage_upload',
        'storage_upload_from_url',
        'auth_get_user',
      ];

      allTools.forEach((toolName) => {
        const toolHeadingRegex = new RegExp(`####\\s+${toolName}`, 'i');
        expect(powerMdContent).toMatch(toolHeadingRegex);
      });
    });

    it('should have substantial documentation for each tool (at least 200 characters)', () => {
      const allTools = [
        'firestore_add_document',
        'firestore_list_documents',
        'firestore_get_document',
        'firestore_update_document',
        'firestore_delete_document',
        'firestore_list_collections',
        'firestore_query_collection_group',
        'firestore_count_documents',
        'storage_list_files',
        'storage_get_file_info',
        'storage_upload',
        'storage_upload_from_url',
        'auth_get_user',
      ];

      allTools.forEach((toolName) => {
        const toolSectionRegex = new RegExp(
          `####\\s+${toolName}[\\s\\S]*?(?=####|$)`,
          'i'
        );
        const toolSection = powerMdContent.match(toolSectionRegex);
        
        expect(toolSection).not.toBeNull();
        if (toolSection) {
          expect(toolSection[0].length).toBeGreaterThan(200);
        }
      });
    });
  });

  describe('Links and References', () => {
    const powerMdContent = fs.readFileSync(powerMdPath, 'utf8');

    it('should include links to Firebase Console', () => {
      expect(powerMdContent).toContain('console.firebase.google.com');
    });

    it('should include links to Firebase documentation', () => {
      expect(powerMdContent).toMatch(/firebase\.google\.com\/docs/i);
    });

    it('should have valid HTTPS URLs', () => {
      // Extract all URLs from markdown links
      const urlPattern = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
      const urls = [...powerMdContent.matchAll(urlPattern)];
      
      // Should have multiple URLs
      expect(urls.length).toBeGreaterThan(0);
      
      // All URLs should start with https:// or http://
      urls.forEach((match) => {
        const url = match[2];
        expect(url).toMatch(/^https?:\/\//);
      });
    });
  });
});
