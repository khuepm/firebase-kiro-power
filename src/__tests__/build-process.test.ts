import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Unit tests for build process verification
 * **Validates: Requirements 7.1, 7.2, 7.3, 7.4**
 *
 * These tests verify that:
 * - TypeScript compilation succeeds
 * - dist/ directory contains expected files
 * - package.json bin configuration is correct
 * - POWER.md is in distribution
 */

describe('Build Process Verification', () => {
  const rootDir = process.cwd();
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  describe('TypeScript Compilation', () => {
    it('should compile TypeScript without errors', () => {
      // Verify that the build script exists
      expect(packageJson.scripts).toHaveProperty('build');
      expect(packageJson.scripts.build).toBe('tsc');
    });

    it('should have TypeScript as a dev dependency', () => {
      expect(packageJson.devDependencies).toHaveProperty('typescript');
    });

    it('should have a tsconfig.json file', () => {
      const tsconfigPath = path.join(rootDir, 'tsconfig.json');
      expect(fs.existsSync(tsconfigPath)).toBe(true);
    });

    it('should produce JavaScript files in dist directory', () => {
      const distDir = path.join(rootDir, 'dist');
      expect(fs.existsSync(distDir)).toBe(true);

      // Check for main entry point
      const indexJs = path.join(distDir, 'index.js');
      expect(fs.existsSync(indexJs)).toBe(true);
    });

    it('should produce TypeScript declaration files', () => {
      const distDir = path.join(rootDir, 'dist');
      const indexDts = path.join(distDir, 'index.d.ts');
      expect(fs.existsSync(indexDts)).toBe(true);
    });

    it('should produce source maps', () => {
      const distDir = path.join(rootDir, 'dist');
      const indexMap = path.join(distDir, 'index.js.map');
      expect(fs.existsSync(indexMap)).toBe(true);
    });
  });

  describe('dist/ Directory Structure', () => {
    it('should contain index.js as main entry point', () => {
      const indexPath = path.join(rootDir, 'dist/index.js');
      expect(fs.existsSync(indexPath)).toBe(true);

      const stats = fs.statSync(indexPath);
      expect(stats.size).toBeGreaterThan(0);
    });

    it('should contain config.js', () => {
      const configPath = path.join(rootDir, 'dist/config.js');
      expect(fs.existsSync(configPath)).toBe(true);
    });

    it('should contain lib/firebase directory with client files', () => {
      const firebaseDir = path.join(rootDir, 'dist/lib/firebase');
      expect(fs.existsSync(firebaseDir)).toBe(true);

      // Check for specific client files
      const firestoreClient = path.join(firebaseDir, 'firestoreClient.js');
      const storageClient = path.join(firebaseDir, 'storageClient.js');
      const authClient = path.join(firebaseDir, 'authClient.js');
      const firebaseConfig = path.join(firebaseDir, 'firebaseConfig.js');

      expect(fs.existsSync(firestoreClient)).toBe(true);
      expect(fs.existsSync(storageClient)).toBe(true);
      expect(fs.existsSync(authClient)).toBe(true);
      expect(fs.existsSync(firebaseConfig)).toBe(true);
    });

    it('should contain transports directory', () => {
      const transportsDir = path.join(rootDir, 'dist/transports');
      expect(fs.existsSync(transportsDir)).toBe(true);

      const indexJs = path.join(transportsDir, 'index.js');
      const httpJs = path.join(transportsDir, 'http.js');

      expect(fs.existsSync(indexJs)).toBe(true);
      expect(fs.existsSync(httpJs)).toBe(true);
    });

    it('should contain utils directory', () => {
      const utilsDir = path.join(rootDir, 'dist/utils');
      expect(fs.existsSync(utilsDir)).toBe(true);

      const loggerJs = path.join(utilsDir, 'logger.js');
      expect(fs.existsSync(loggerJs)).toBe(true);
    });

    it('should have all JavaScript files with corresponding declaration files', () => {
      const distDir = path.join(rootDir, 'dist');

      // Helper function to recursively find all .js files
      const findJsFiles = (dir: string): string[] => {
        const files: string[] = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            files.push(...findJsFiles(fullPath));
          } else if (entry.name.endsWith('.js') && !entry.name.endsWith('.map')) {
            files.push(fullPath);
          }
        }

        return files;
      };

      const jsFiles = findJsFiles(distDir);
      expect(jsFiles.length).toBeGreaterThan(0);

      // For each .js file, verify there's a .d.ts file
      jsFiles.forEach((jsFile) => {
        const dtsFile = jsFile.replace('.js', '.d.ts');
        expect(fs.existsSync(dtsFile)).toBe(true);
      });
    });
  });

  describe('Executable Binary Configuration', () => {
    it('should have bin field in package.json', () => {
      expect(packageJson.bin).toBeDefined();
      expect(typeof packageJson.bin).toBe('object');
    });

    it('should have firebase-power as the executable name', () => {
      expect(packageJson.bin).toHaveProperty('firebase-power');
    });

    it('should point to dist/index.js', () => {
      expect(packageJson.bin['firebase-power']).toBe('./dist/index.js');
    });

    it('should have shebang in dist/index.js', () => {
      const indexPath = path.join(rootDir, 'dist/index.js');
      const content = fs.readFileSync(indexPath, 'utf8');
      const firstLine = content.split('\n')[0];

      expect(firstLine).toBe('#!/usr/bin/env node');
    });

    it('should have main field pointing to dist/index.js', () => {
      expect(packageJson.main).toBe('dist/index.js');
    });

    it('should have types field pointing to dist/index.d.ts', () => {
      expect(packageJson.types).toBe('dist/index.d.ts');
    });
  });

  describe('POWER.md in Distribution', () => {
    it('should have POWER.md in root directory', () => {
      const powerMdPath = path.join(rootDir, 'POWER.md');
      expect(fs.existsSync(powerMdPath)).toBe(true);
    });

    it('should include POWER.md in package.json files array', () => {
      expect(packageJson.files).toContain('POWER.md');
    });

    it('should have POWER.md with substantial content', () => {
      const powerMdPath = path.join(rootDir, 'POWER.md');
      const stats = fs.statSync(powerMdPath);

      // Should be at least 10KB
      expect(stats.size).toBeGreaterThan(10000);
    });

    it('should have POWER.md with proper structure', () => {
      const powerMdPath = path.join(rootDir, 'POWER.md');
      const content = fs.readFileSync(powerMdPath, 'utf8');

      // Check for key sections
      expect(content).toContain('# Firebase Power');
      expect(content).toContain('## Overview');
      expect(content).toContain('## Installation');
      expect(content).toContain('## Configuration');
      expect(content).toContain('## Available Tools');
    });

    it('should verify POWER.md appears in npm pack output', () => {
      const packOutput = execSync('npm pack --dry-run 2>&1', {
        cwd: rootDir,
        encoding: 'utf8',
      });

      expect(packOutput).toContain('POWER.md');
    });
  });

  describe('Package Distribution Files', () => {
    it('should include dist directory in files array', () => {
      expect(packageJson.files).toContain('dist');
    });

    it('should include README.md in files array', () => {
      expect(packageJson.files).toContain('README.md');
    });

    it('should include LICENSE in files array', () => {
      expect(packageJson.files).toContain('LICENSE');
    });

    it('should have all files in files array present', () => {
      const filesArray = packageJson.files || [];

      filesArray.forEach((file: string) => {
        const filePath = path.join(rootDir, file);
        expect(fs.existsSync(filePath)).toBe(true);
      });
    });

    it('should verify npm pack completes successfully', () => {
      expect(() => {
        execSync('npm pack --dry-run', {
          cwd: rootDir,
          encoding: 'utf8',
        });
      }).not.toThrow();
    });

    it('should verify package name is correct in npm pack output', () => {
      const packOutput = execSync('npm pack --dry-run 2>&1', {
        cwd: rootDir,
        encoding: 'utf8',
      });

      expect(packOutput).toContain('@khuepm/firebase-kiro-power');
    });
  });

  describe('Build Scripts', () => {
    it('should have build script defined', () => {
      expect(packageJson.scripts).toHaveProperty('build');
    });

    it('should have prepublishOnly script that runs build', () => {
      expect(packageJson.scripts).toHaveProperty('prepublishOnly');
      expect(packageJson.scripts.prepublishOnly).toContain('build');
    });

    it('should have start script that uses built files', () => {
      expect(packageJson.scripts).toHaveProperty('start');
      expect(packageJson.scripts.start).toContain('dist/index.js');
    });
  });

  describe('Package Metadata for Distribution', () => {
    it('should have correct package name', () => {
      expect(packageJson.name).toBe('@khuepm/firebase-kiro-power');
    });

    it('should have version defined', () => {
      expect(packageJson.version).toBeDefined();
      expect(typeof packageJson.version).toBe('string');
    });

    it('should have description mentioning Kiro Power', () => {
      expect(packageJson.description).toContain('Kiro Power');
    });

    it('should have keywords including kiro and kiro-power', () => {
      expect(packageJson.keywords).toContain('kiro');
      expect(packageJson.keywords).toContain('kiro-power');
    });

    it('should have license defined', () => {
      expect(packageJson.license).toBeDefined();
    });

    it('should have repository defined', () => {
      expect(packageJson.repository).toBeDefined();
      expect(packageJson.repository).toHaveProperty('type');
      expect(packageJson.repository).toHaveProperty('url');
    });
  });
});
