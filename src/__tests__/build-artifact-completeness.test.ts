import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Feature: firebase-power-conversion
 * Property 7: Build Artifact Completeness
 * **Validates: Requirements 7.3**
 *
 * For any NPM package build, the distribution should include all necessary files
 * (dist/, POWER.md, README.md, LICENSE) and the package should be installable via npx
 */

describe('Property 7: Build Artifact Completeness', () => {
  const rootDir = process.cwd();
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Required files that must be in the distribution
  const requiredFiles = ['POWER.md', 'README.md', 'LICENSE'];

  // Required dist files that must exist after build
  const requiredDistFiles = [
    'dist/index.js',
    'dist/index.d.ts',
    'dist/config.js',
    'dist/config.d.ts',
  ];

  // Required dist directories
  const requiredDistDirs = [
    'dist/lib/firebase',
    'dist/transports',
    'dist/utils',
  ];

  it('should include all required root files in package.json files array', () => {
    // Property: For any required file, it should be listed in package.json files array
    fc.assert(
      fc.property(
        fc.constantFrom(...requiredFiles),
        (requiredFile) => {
          // Check if the file is in the files array
          const filesArray = packageJson.files || [];
          const isIncluded = filesArray.includes(requiredFile);

          expect(isIncluded).toBe(true);

          return true;
        }
      ),
      { numRuns: requiredFiles.length }
    );
  });

  it('should include dist directory in package.json files array', () => {
    const filesArray = packageJson.files || [];
    expect(filesArray).toContain('dist');
  });

  it('should have all required root files present in the repository', () => {
    // Property: For any required file, it should exist in the root directory
    fc.assert(
      fc.property(
        fc.constantFrom(...requiredFiles),
        (requiredFile) => {
          const filePath = path.join(rootDir, requiredFile);
          const exists = fs.existsSync(filePath);

          expect(exists).toBe(true);

          // Also verify the file is not empty
          if (exists) {
            const stats = fs.statSync(filePath);
            expect(stats.size).toBeGreaterThan(0);
          }

          return true;
        }
      ),
      { numRuns: requiredFiles.length }
    );
  });

  it('should have all required dist files after build', () => {
    // Verify dist directory exists
    const distDir = path.join(rootDir, 'dist');
    expect(fs.existsSync(distDir)).toBe(true);

    // Property: For any required dist file, it should exist after build
    fc.assert(
      fc.property(
        fc.constantFrom(...requiredDistFiles),
        (requiredFile) => {
          const filePath = path.join(rootDir, requiredFile);
          const exists = fs.existsSync(filePath);

          expect(exists).toBe(true);

          // Verify the file is not empty
          if (exists) {
            const stats = fs.statSync(filePath);
            expect(stats.size).toBeGreaterThan(0);
          }

          return true;
        }
      ),
      { numRuns: requiredDistFiles.length }
    );
  });

  it('should have all required dist directories after build', () => {
    // Property: For any required dist directory, it should exist after build
    fc.assert(
      fc.property(
        fc.constantFrom(...requiredDistDirs),
        (requiredDir) => {
          const dirPath = path.join(rootDir, requiredDir);
          const exists = fs.existsSync(dirPath);

          expect(exists).toBe(true);

          // Verify it's actually a directory
          if (exists) {
            const stats = fs.statSync(dirPath);
            expect(stats.isDirectory()).toBe(true);
          }

          return true;
        }
      ),
      { numRuns: requiredDistDirs.length }
    );
  });

  it('should have executable shebang in dist/index.js', () => {
    const indexPath = path.join(rootDir, 'dist/index.js');
    expect(fs.existsSync(indexPath)).toBe(true);

    const content = fs.readFileSync(indexPath, 'utf8');
    const firstLine = content.split('\n')[0];

    expect(firstLine).toBe('#!/usr/bin/env node');
  });

  it('should have correct bin configuration in package.json', () => {
    expect(packageJson.bin).toBeDefined();
    expect(packageJson.bin).toHaveProperty('firebase-power');
    expect(packageJson.bin['firebase-power']).toBe('./dist/index.js');
  });

  it('should include all Firebase client files in dist', () => {
    const firebaseClientFiles = [
      'dist/lib/firebase/firestoreClient.js',
      'dist/lib/firebase/storageClient.js',
      'dist/lib/firebase/authClient.js',
      'dist/lib/firebase/firebaseConfig.js',
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...firebaseClientFiles),
        (clientFile) => {
          const filePath = path.join(rootDir, clientFile);
          const exists = fs.existsSync(filePath);

          expect(exists).toBe(true);

          // Verify the file is not empty
          if (exists) {
            const stats = fs.statSync(filePath);
            expect(stats.size).toBeGreaterThan(0);
          }

          return true;
        }
      ),
      { numRuns: firebaseClientFiles.length }
    );
  });

  it('should include transport files in dist', () => {
    const transportFiles = [
      'dist/transports/index.js',
      'dist/transports/http.js',
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...transportFiles),
        (transportFile) => {
          const filePath = path.join(rootDir, transportFile);
          const exists = fs.existsSync(filePath);

          expect(exists).toBe(true);

          return true;
        }
      ),
      { numRuns: transportFiles.length }
    );
  });

  it('should verify npm pack includes all required files', () => {
    // Run npm pack --dry-run to see what would be included
    const packOutput = execSync('npm pack --dry-run 2>&1', {
      cwd: rootDir,
      encoding: 'utf8',
    });

    // Property: For any required file, it should appear in npm pack output
    fc.assert(
      fc.property(
        fc.constantFrom(...requiredFiles),
        (requiredFile) => {
          // Check if the file is mentioned in the pack output
          const isIncluded = packOutput.includes(requiredFile);

          expect(isIncluded).toBe(true);

          return true;
        }
      ),
      { numRuns: requiredFiles.length }
    );

    // Also verify dist is included
    expect(packOutput).toContain('dist/');
  });

  it('should verify package metadata is correct for distribution', () => {
    // Verify package name
    expect(packageJson.name).toBe('@khuepm/firebase-kiro-power');

    // Verify main entry point
    expect(packageJson.main).toBe('dist/index.js');

    // Verify types entry point
    expect(packageJson.types).toBe('dist/index.d.ts');

    // Verify description mentions Kiro Power
    expect(packageJson.description).toContain('Kiro Power');
  });

  it('should have TypeScript declaration files for all JS files', () => {
    // Property: For any .js file in dist, there should be a corresponding .d.ts file
    const jsFiles = [
      'dist/index.js',
      'dist/config.js',
      'dist/lib/firebase/firestoreClient.js',
      'dist/lib/firebase/storageClient.js',
      'dist/lib/firebase/authClient.js',
      'dist/lib/firebase/firebaseConfig.js',
      'dist/transports/index.js',
      'dist/transports/http.js',
      'dist/utils/logger.js',
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...jsFiles),
        (jsFile) => {
          const dtsFile = jsFile.replace('.js', '.d.ts');
          const dtsPath = path.join(rootDir, dtsFile);
          const exists = fs.existsSync(dtsPath);

          expect(exists).toBe(true);

          return true;
        }
      ),
      { numRuns: jsFiles.length }
    );
  });

  it('should verify all files in package.json files array exist', () => {
    const filesArray = packageJson.files || [];

    // Property: For any file/directory in the files array, it should exist
    fc.assert(
      fc.property(
        fc.constantFrom(...filesArray),
        (fileOrDir) => {
          const fullPath = path.join(rootDir, fileOrDir);
          const exists = fs.existsSync(fullPath);

          expect(exists).toBe(true);

          return true;
        }
      ),
      { numRuns: filesArray.length }
    );
  });

  it('should verify package can be packed without errors', () => {
    // This test verifies that npm pack completes successfully
    expect(() => {
      execSync('npm pack --dry-run', {
        cwd: rootDir,
        encoding: 'utf8',
      });
    }).not.toThrow();
  });

  it('should verify POWER.md has substantial content', () => {
    const powerMdPath = path.join(rootDir, 'POWER.md');
    const stats = fs.statSync(powerMdPath);

    // POWER.md should be at least 10KB (comprehensive documentation)
    expect(stats.size).toBeGreaterThan(10000);

    // Verify it contains key sections
    const content = fs.readFileSync(powerMdPath, 'utf8');
    expect(content).toContain('# Firebase Power');
    expect(content).toContain('## Installation');
    expect(content).toContain('## Configuration');
  });

  it('should verify build artifact completeness property with 100+ iterations', () => {
    // Property: For any combination of file checks, all required artifacts should exist
    // This test runs 100+ iterations to thoroughly validate the property
    fc.assert(
      fc.property(
        fc.record({
          checkRootFiles: fc.boolean(),
          checkDistFiles: fc.boolean(),
          checkPackageJson: fc.boolean(),
          checkExecutable: fc.boolean(),
        }),
        (checks) => {
          let allChecksPass = true;

          // Check root files if requested
          if (checks.checkRootFiles) {
            requiredFiles.forEach((file) => {
              const filePath = path.join(rootDir, file);
              if (!fs.existsSync(filePath)) {
                allChecksPass = false;
              }
            });
          }

          // Check dist files if requested
          if (checks.checkDistFiles) {
            requiredDistFiles.forEach((file) => {
              const filePath = path.join(rootDir, file);
              if (!fs.existsSync(filePath)) {
                allChecksPass = false;
              }
            });
          }

          // Check package.json metadata if requested
          if (checks.checkPackageJson) {
            if (packageJson.name !== '@khuepm/firebase-kiro-power') {
              allChecksPass = false;
            }
            if (!packageJson.files || !packageJson.files.includes('dist')) {
              allChecksPass = false;
            }
          }

          // Check executable configuration if requested
          if (checks.checkExecutable) {
            if (!packageJson.bin || !packageJson.bin['firebase-power']) {
              allChecksPass = false;
            }
            const indexPath = path.join(rootDir, 'dist/index.js');
            if (fs.existsSync(indexPath)) {
              const content = fs.readFileSync(indexPath, 'utf8');
              const firstLine = content.split('\n')[0];
              if (firstLine !== '#!/usr/bin/env node') {
                allChecksPass = false;
              }
            }
          }

          expect(allChecksPass).toBe(true);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should verify all dist files have corresponding type definitions with 100+ iterations', () => {
    // Property: For any JavaScript file in dist, a corresponding .d.ts file should exist
    // Generate random subsets of JS files to check
    const allJsFiles = [
      'dist/index.js',
      'dist/config.js',
      'dist/lib/firebase/firestoreClient.js',
      'dist/lib/firebase/storageClient.js',
      'dist/lib/firebase/authClient.js',
      'dist/lib/firebase/firebaseConfig.js',
      'dist/transports/index.js',
      'dist/transports/http.js',
      'dist/utils/logger.js',
    ];

    fc.assert(
      fc.property(
        fc.subarray(allJsFiles, { minLength: 1 }),
        (jsFilesToCheck) => {
          // For each JS file, verify the corresponding .d.ts file exists
          for (const jsFile of jsFilesToCheck) {
            const dtsFile = jsFile.replace('.js', '.d.ts');
            const dtsPath = path.join(rootDir, dtsFile);
            expect(fs.existsSync(dtsPath)).toBe(true);
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should verify package structure integrity across multiple validation runs', () => {
    // Property: Package structure should be consistent across multiple checks
    // This validates that the build artifacts are stable and complete
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        (iteration) => {
          // Verify core package structure elements
          const checks = [
            // Check package.json exists and is valid JSON
            () => {
              const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
              return pkg.name === '@khuepm/firebase-kiro-power';
            },
            // Check dist directory exists
            () => fs.existsSync(path.join(rootDir, 'dist')),
            // Check POWER.md exists and has content
            () => {
              const powerMdPath = path.join(rootDir, 'POWER.md');
              return fs.existsSync(powerMdPath) && fs.statSync(powerMdPath).size > 0;
            },
            // Check README.md exists and has content
            () => {
              const readmePath = path.join(rootDir, 'README.md');
              return fs.existsSync(readmePath) && fs.statSync(readmePath).size > 0;
            },
            // Check LICENSE exists
            () => fs.existsSync(path.join(rootDir, 'LICENSE')),
            // Check main entry point exists
            () => fs.existsSync(path.join(rootDir, packageJson.main)),
            // Check types entry point exists
            () => fs.existsSync(path.join(rootDir, packageJson.types)),
            // Check bin executable exists
            () => fs.existsSync(path.join(rootDir, packageJson.bin['firebase-power'])),
          ];

          // All checks should pass
          const allPass = checks.every((check) => check());
          expect(allPass).toBe(true);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
