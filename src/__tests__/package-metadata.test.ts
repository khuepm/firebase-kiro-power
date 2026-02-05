import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Unit tests for package.json updates during Firebase Power conversion
 * **Validates: Requirements 1.1, 1.2, 1.5**
 *
 * These tests verify that package.json has been correctly updated with
 * Kiro Power metadata including the new package name, description,
 * keywords, and file distribution list.
 */

describe('Package.json Kiro Power Metadata', () => {
  // Read the current package.json
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  describe('Package Name', () => {
    it('should have package name "@kiro/firebase-power"', () => {
      expect(packageJson.name).toBe('@kiro/firebase-power');
    });

    it('should not contain the old package name', () => {
      expect(packageJson.name).not.toBe('@khuepm/firebase-kiro-power');
      expect(packageJson.name).not.toBe('@gannonh/firebase-mcp');
    });
  });

  describe('Package Description', () => {
    it('should contain "Kiro Power" in the description', () => {
      expect(packageJson.description).toContain('Kiro Power');
    });

    it('should contain "Firebase" in the description', () => {
      expect(packageJson.description).toContain('Firebase');
    });

    it('should be a non-empty string', () => {
      expect(packageJson.description).toBeTruthy();
      expect(typeof packageJson.description).toBe('string');
      expect(packageJson.description.length).toBeGreaterThan(0);
    });
  });

  describe('Package Keywords', () => {
    it('should include "kiro" in keywords array', () => {
      expect(packageJson.keywords).toContain('kiro');
    });

    it('should include "kiro-power" in keywords array', () => {
      expect(packageJson.keywords).toContain('kiro-power');
    });

    it('should include "firebase" in keywords array', () => {
      expect(packageJson.keywords).toContain('firebase');
    });

    it('should include "mcp" in keywords array', () => {
      expect(packageJson.keywords).toContain('mcp');
    });

    it('should have keywords as an array', () => {
      expect(Array.isArray(packageJson.keywords)).toBe(true);
    });

    it('should have at least 5 keywords', () => {
      expect(packageJson.keywords.length).toBeGreaterThanOrEqual(5);
    });

    it('should have all keywords as strings', () => {
      packageJson.keywords.forEach((keyword: unknown) => {
        expect(typeof keyword).toBe('string');
      });
    });
  });

  describe('Files Distribution Array', () => {
    it('should include POWER.md in files array', () => {
      expect(packageJson.files).toContain('POWER.md');
    });

    it('should include dist directory in files array', () => {
      expect(packageJson.files).toContain('dist');
    });

    it('should include README.md in files array', () => {
      expect(packageJson.files).toContain('README.md');
    });

    it('should include LICENSE in files array', () => {
      expect(packageJson.files).toContain('LICENSE');
    });

    it('should have files as an array', () => {
      expect(Array.isArray(packageJson.files)).toBe(true);
    });

    it('should have at least 4 files in distribution', () => {
      expect(packageJson.files.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Binary Executable Configuration', () => {
    it('should have bin configuration', () => {
      expect(packageJson.bin).toBeDefined();
      expect(typeof packageJson.bin).toBe('object');
    });

    it('should have "firebase-power" as the executable name', () => {
      expect(packageJson.bin).toHaveProperty('firebase-power');
    });

    it('should point to the correct dist file', () => {
      expect(packageJson.bin['firebase-power']).toBe('./dist/index.js');
    });
  });

  describe('Package Metadata Completeness', () => {
    it('should have a version field', () => {
      expect(packageJson.version).toBeDefined();
      expect(typeof packageJson.version).toBe('string');
    });

    it('should have a main entry point', () => {
      expect(packageJson.main).toBe('dist/index.js');
    });

    it('should have type definitions', () => {
      expect(packageJson.types).toBe('dist/index.d.ts');
    });

    it('should have a license', () => {
      expect(packageJson.license).toBeDefined();
      expect(typeof packageJson.license).toBe('string');
    });

    it('should have repository information', () => {
      expect(packageJson.repository).toBeDefined();
      expect(packageJson.repository).toHaveProperty('type');
      expect(packageJson.repository).toHaveProperty('url');
    });

    it('should have author information', () => {
      expect(packageJson.author).toBeDefined();
      expect(typeof packageJson.author).toBe('string');
    });
  });

  describe('Build and Test Scripts', () => {
    it('should have build script', () => {
      expect(packageJson.scripts).toHaveProperty('build');
    });

    it('should have test scripts', () => {
      expect(packageJson.scripts).toHaveProperty('test');
      expect(packageJson.scripts).toHaveProperty('test:emulator');
    });

    it('should have coverage scripts', () => {
      expect(packageJson.scripts).toHaveProperty('test:coverage');
      expect(packageJson.scripts).toHaveProperty('test:coverage:emulator');
    });
  });

  describe('Kiro Power Branding Consistency', () => {
    it('should have consistent Kiro Power branding across name, description, and keywords', () => {
      // Package name should indicate it's a Kiro Power
      expect(packageJson.name).toMatch(/@kiro\//);

      // Description should mention Kiro Power
      expect(packageJson.description).toContain('Kiro Power');

      // Keywords should include both kiro and kiro-power
      expect(packageJson.keywords).toContain('kiro');
      expect(packageJson.keywords).toContain('kiro-power');
    });

    it('should maintain Firebase branding alongside Kiro Power branding', () => {
      // Name should include firebase
      expect(packageJson.name).toContain('firebase');

      // Description should mention Firebase
      expect(packageJson.description).toContain('Firebase');

      // Keywords should include firebase
      expect(packageJson.keywords).toContain('firebase');
    });
  });
});
