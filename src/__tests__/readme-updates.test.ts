import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Unit tests for README.md updates for Kiro Power conversion
 * **Validates: Requirements 6.1, 6.2, 6.6**
 */

describe('README.md Kiro Power Updates', () => {
  // Read the README.md file
  const readmePath = path.resolve(process.cwd(), 'README.md');
  const readmeContent = fs.readFileSync(readmePath, 'utf8');

  describe('Title and Branding', () => {
    it('should have "Firebase Power" as the title', () => {
      // Requirement 6.1: Update title to "Firebase Power"
      const titleRegex = /^#\s+Firebase Power/m;
      expect(readmeContent).toMatch(titleRegex);
    });

    it('should include Kiro Power designation', () => {
      // Requirement 6.2: Add Kiro Power designation
      expect(readmeContent).toMatch(/Kiro Power/i);
    });

    it('should have Kiro Power designation in overview', () => {
      // Requirement 6.2: Kiro Power should be mentioned in overview
      const overviewRegex = /##\s+Overview[\s\S]*?Firebase Power.*Kiro Power/i;
      expect(readmeContent).toMatch(overviewRegex);
    });

    it('should have a subtitle indicating Kiro Power integration', () => {
      // Should have a subtitle like "> A Kiro Power for Firebase services integration"
      expect(readmeContent).toMatch(/>\s+A Kiro Power for/i);
    });
  });

  describe('Quick Start for Kiro IDE Section', () => {
    it('should have a "Quick Start for Kiro IDE" section', () => {
      // Requirement 6.3: Add "Quick Start for Kiro IDE" section
      expect(readmeContent).toMatch(/##\s+.*Quick Start for Kiro IDE/i);
    });

    it('should list Kiro IDE as a prerequisite', () => {
      // Should mention Kiro IDE in prerequisites
      const kiroQuickStartRegex = /##\s+.*Quick Start for Kiro IDE[\s\S]*?Prerequisites[\s\S]*?Kiro IDE/i;
      expect(readmeContent).toMatch(kiroQuickStartRegex);
    });

    it('should include installation steps for Kiro IDE', () => {
      // Should have numbered installation steps
      const kiroQuickStartRegex = /##\s+.*Quick Start for Kiro IDE[\s\S]*?Installation Steps/i;
      expect(readmeContent).toMatch(kiroQuickStartRegex);
    });

    it('should mention opening Kiro IDE in installation steps', () => {
      // Should instruct users to open Kiro IDE
      const kiroQuickStartRegex = /##\s+.*Quick Start for Kiro IDE[\s\S]*?Open Kiro IDE/i;
      expect(readmeContent).toMatch(kiroQuickStartRegex);
    });

    it('should mention Powers panel in installation steps', () => {
      // Should instruct users to navigate to Powers panel
      const kiroQuickStartRegex = /##\s+.*Quick Start for Kiro IDE[\s\S]*?Powers panel/i;
      expect(readmeContent).toMatch(kiroQuickStartRegex);
    });

    it('should mention searching for Firebase Power', () => {
      // Should instruct users to search for "Firebase Power"
      const kiroQuickStartRegex = /##\s+.*Quick Start for Kiro IDE[\s\S]*?Search for.*Firebase Power/i;
      expect(readmeContent).toMatch(kiroQuickStartRegex);
    });

    it('should mention clicking Install', () => {
      // Should instruct users to click Install
      const kiroQuickStartRegex = /##\s+.*Quick Start for Kiro IDE[\s\S]*?Click Install/i;
      expect(readmeContent).toMatch(kiroQuickStartRegex);
    });

    it('should mention configuring environment variables', () => {
      // Should instruct users to configure environment variables
      const kiroQuickStartRegex = /##\s+.*Quick Start for Kiro IDE[\s\S]*?Configure environment variables/i;
      expect(readmeContent).toMatch(kiroQuickStartRegex);
    });

    it('should list SERVICE_ACCOUNT_KEY_PATH in Kiro IDE section', () => {
      // Should mention SERVICE_ACCOUNT_KEY_PATH
      const kiroQuickStartRegex = /##\s+.*Quick Start for Kiro IDE[\s\S]*?SERVICE_ACCOUNT_KEY_PATH/;
      expect(readmeContent).toMatch(kiroQuickStartRegex);
    });

    it('should list FIREBASE_STORAGE_BUCKET in Kiro IDE section', () => {
      // Should mention FIREBASE_STORAGE_BUCKET
      const kiroQuickStartRegex = /##\s+.*Quick Start for Kiro IDE[\s\S]*?FIREBASE_STORAGE_BUCKET/;
      expect(readmeContent).toMatch(kiroQuickStartRegex);
    });

    it('should include Firebase Console link for service account key', () => {
      // Should link to Firebase Console
      const kiroQuickStartRegex = /##\s+.*Quick Start for Kiro IDE[\s\S]*?Firebase Console/i;
      expect(readmeContent).toMatch(kiroQuickStartRegex);
    });

    it('should include test instructions for Kiro IDE', () => {
      // Should instruct users to test the installation
      const kiroQuickStartRegex = /##\s+.*Quick Start for Kiro IDE[\s\S]*?Test.*installation/i;
      expect(readmeContent).toMatch(kiroQuickStartRegex);
    });
  });

  describe('Other MCP Clients Section', () => {
    it('should have a section for other MCP clients', () => {
      // Should have a separate section for non-Kiro clients
      expect(readmeContent).toMatch(/##\s+.*Quick Start for Other MCP Clients/i);
    });

    it('should reference "Firebase Power" in other clients section', () => {
      // Requirement 6.4: Update existing installation sections to reference Kiro Power
      const otherClientsRegex = /##\s+.*Quick Start for Other MCP Clients[\s\S]*?Firebase Power/i;
      expect(readmeContent).toMatch(otherClientsRegex);
    });

    it('should use @kiro/firebase-power package name in npx configuration', () => {
      // Should use the new package name
      expect(readmeContent).toContain('@kiro/firebase-power');
    });

    it('should update configuration key to "firebase-power"', () => {
      // Configuration should use "firebase-power" as the key
      const configRegex = /"firebase-power":\s*{/;
      expect(readmeContent).toMatch(configRegex);
    });

    it('should not contain old package name references', () => {
      // Should not reference old package names
      expect(readmeContent).not.toContain('@khuepm/firebase-kiro-power');
      expect(readmeContent).not.toContain('@khuepm/firebase-kiro-power');
    });
  });

  describe('POWER.md Reference', () => {
    it('should include a link to POWER.md', () => {
      // Requirement 6.6: Add reference link to POWER.md
      expect(readmeContent).toMatch(/\[POWER\.md\]\(\.\/POWER\.md\)/);
    });

    it('should reference POWER.md in the overview section', () => {
      // Should mention POWER.md early in the document
      const overviewRegex = /##\s+Overview[\s\S]*?POWER\.md/i;
      expect(readmeContent).toMatch(overviewRegex);
    });

    it('should reference POWER.md in Kiro IDE section', () => {
      // Should reference POWER.md in Kiro IDE quick start
      const kiroQuickStartRegex = /##\s+.*Quick Start for Kiro IDE[\s\S]*?POWER\.md/i;
      expect(readmeContent).toMatch(kiroQuickStartRegex);
    });

    it('should indicate POWER.md contains detailed documentation', () => {
      // Should explain that POWER.md has detailed docs
      expect(readmeContent).toMatch(/detailed.*documentation.*POWER\.md/i);
    });
  });

  describe('Repository URLs', () => {
    it('should use correct repository URL in badges', () => {
      // Requirement 6.5: Update repository URLs if needed
      // Should use khuepm/firebase-kiro-power as the repository
      expect(readmeContent).toMatch(/github\.com\/khuepm\/firebase-kiro-power/);
    });

    it('should use correct repository URL in developer guide', () => {
      // Should use correct repo URL in git clone instructions
      const devGuideRegex = /git clone.*github\.com\/khuepm\/firebase-kiro-power/;
      expect(readmeContent).toMatch(devGuideRegex);
    });
  });

  describe('Technical Documentation Preservation', () => {
    it('should preserve API Reference section', () => {
      // Requirement 6.4: Maintain all existing technical documentation sections
      expect(readmeContent).toMatch(/##\s+.*API Reference/i);
    });

    it('should preserve Firestore Tools table', () => {
      expect(readmeContent).toMatch(/###\s+Firestore Tools/i);
      expect(readmeContent).toMatch(/firestore_add_document/);
    });

    it('should preserve Storage Tools table', () => {
      expect(readmeContent).toMatch(/###\s+Storage Tools/i);
      expect(readmeContent).toMatch(/storage_list_files/);
    });

    it('should preserve Authentication Tools table', () => {
      expect(readmeContent).toMatch(/###\s+Authentication Tools/i);
      expect(readmeContent).toMatch(/auth_get_user/);
    });

    it('should preserve Setup & Configuration section', () => {
      expect(readmeContent).toMatch(/##\s+.*Setup & Configuration/i);
    });

    it('should preserve Developer Guide section', () => {
      expect(readmeContent).toMatch(/##\s+.*Developer Guide/i);
    });

    it('should preserve HTTP Transport section', () => {
      expect(readmeContent).toMatch(/##\s+.*HTTP Transport/i);
    });

    it('should preserve Troubleshooting section', () => {
      expect(readmeContent).toMatch(/##\s+.*Troubleshooting/i);
    });

    it('should preserve Response Formatting section', () => {
      expect(readmeContent).toMatch(/##\s+.*Response Formatting/i);
    });

    it('should preserve Contributing section', () => {
      expect(readmeContent).toMatch(/##\s+.*Contributing/i);
    });

    it('should preserve License section', () => {
      expect(readmeContent).toMatch(/##\s+.*License/i);
    });

    it('should preserve Related Resources section', () => {
      expect(readmeContent).toMatch(/##\s+.*Related Resources/i);
    });
  });

  describe('Configuration Examples', () => {
    it('should update HTTP transport npx command to use new package name', () => {
      // Should use @kiro/firebase-power in HTTP transport examples
      const httpTransportRegex = /MCP_TRANSPORT=http.*npx @kiro\/firebase-power/;
      expect(readmeContent).toMatch(httpTransportRegex);
    });

    it('should update debug logging npx command to use new package name', () => {
      // Should use @kiro/firebase-power in debug logging examples
      const debugLogRegex = /DEBUG_LOG_FILE=true npx @kiro\/firebase-power/;
      expect(readmeContent).toMatch(debugLogRegex);
    });

    it('should update MCP client configuration examples', () => {
      // Should show firebase-power as the configuration key
      const configExampleRegex = /"firebase-power":\s*{\s*"command":\s*"npx"/;
      expect(readmeContent).toMatch(configExampleRegex);
    });
  });

  describe('Consistency', () => {
    it('should consistently use "Firebase Power" throughout', () => {
      // Should use "Firebase Power" (not "Firebase MCP") in multiple places
      const firebasePowerMatches = readmeContent.match(/Firebase Power/g);
      expect(firebasePowerMatches).not.toBeNull();
      expect(firebasePowerMatches!.length).toBeGreaterThan(3);
    });

    it('should not use "Firebase MCP" in titles or headings', () => {
      // Should not have "Firebase MCP" in any heading
      const headingRegex = /^#+\s+.*Firebase MCP/gm;
      expect(readmeContent).not.toMatch(headingRegex);
    });

    it('should maintain consistent package name references', () => {
      // All package references should use @kiro/firebase-power
      const packageNameMatches = readmeContent.match(/@kiro\/firebase-power/g);
      expect(packageNameMatches).not.toBeNull();
      expect(packageNameMatches!.length).toBeGreaterThanOrEqual(5);
    });
  });
});
