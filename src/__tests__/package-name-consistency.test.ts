import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

/**
 * Feature: firebase-power-conversion
 * Property 1: Package Name Consistency
 * **Validates: Requirements 1.1, 1.2, 8.1, 8.2**
 *
 * For any file in the codebase that references the package name, the reference
 * should use "@khuepm/firebase-kiro-power" consistently
 */

describe('Property 1: Package Name Consistency', () => {
  // Define the correct package name
  const CORRECT_PACKAGE_NAME = '@khuepm/firebase-kiro-power';
  
  // Define old/incorrect package names that should not appear
  const OLD_PACKAGE_NAMES = [
    '@kiro/firebase-power',
    'firebase-mcp-server',
  ];

  // Files that should contain package name references
  const FILES_TO_CHECK = [
    'package.json',
    'package-lock.json',
    'README.md',
    'POWER.md',
    'llms-install.md',
  ];

  // Get all TypeScript source and test files
  const sourceFiles = glob.sync('src/**/*.ts', {
    ignore: ['**/node_modules/**', '**/dist/**'],
  });

  // Get all markdown files in the project root
  const markdownFiles = glob.sync('*.md', {
    ignore: ['**/node_modules/**'],
  });

  // Combine all files to check
  const allFilesToCheck = [
    ...FILES_TO_CHECK,
    ...sourceFiles,
    ...markdownFiles,
  ].filter((file) => {
    // Filter out files that don't exist or are in excluded directories
    try {
      const fullPath = path.resolve(process.cwd(), file);
      return fs.existsSync(fullPath) && !file.includes('node_modules');
    } catch {
      return false;
    }
  });

  it('should use correct package name in all configuration files', () => {
    // Property: For any configuration file, it should use the correct package name
    fc.assert(
      fc.property(
        fc.constantFrom(...FILES_TO_CHECK.filter(f => fs.existsSync(f))),
        (fileName) => {
          const filePath = path.resolve(process.cwd(), fileName);
          const fileContent = fs.readFileSync(filePath, 'utf8');

          // If the file contains any package name reference, it should be the correct one
          const hasPackageReference = fileContent.includes('@kiro/') || 
                                     fileContent.includes('firebase-power') ||
                                     fileContent.includes('firebase-kiro-power') ||
                                     fileContent.includes('firebase-kiro-power');

          if (hasPackageReference) {
            // Should contain the correct package name
            expect(fileContent).toContain(CORRECT_PACKAGE_NAME);
          }

          return true;
        }
      ),
      { numRuns: FILES_TO_CHECK.filter(f => fs.existsSync(f)).length }
    );
  });

  it('should not contain old package names in any file', () => {
    // Property: For any file in the codebase, it should not contain old package names
    fc.assert(
      fc.property(
        fc.constantFrom(...allFilesToCheck),
        (fileName) => {
          const filePath = path.resolve(process.cwd(), fileName);
          const fileContent = fs.readFileSync(filePath, 'utf8');

          // Check that none of the old package names appear in the file
          // Exception: test files may reference old names in assertions
          const isTestFile = fileName.includes('__tests__') || fileName.includes('.test.');
          
          if (!isTestFile) {
            OLD_PACKAGE_NAMES.forEach((oldName) => {
              expect(fileContent).not.toContain(oldName);
            });
          }

          return true;
        }
      ),
      { numRuns: Math.min(allFilesToCheck.length, 100) }
    );
  });

  it('should use correct package name in package.json', () => {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Property: package.json should have the correct package name
    expect(packageJson.name).toBe(CORRECT_PACKAGE_NAME);
    
    // Should not have any old package names
    OLD_PACKAGE_NAMES.forEach((oldName) => {
      expect(packageJson.name).not.toBe(oldName);
    });
  });

  it('should use correct package name in package-lock.json', () => {
    const packageLockPath = path.resolve(process.cwd(), 'package-lock.json');
    
    if (fs.existsSync(packageLockPath)) {
      const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));

      // Property: package-lock.json should have the correct package name
      expect(packageLock.name).toBe(CORRECT_PACKAGE_NAME);
      
      // The root package should also have the correct name
      if (packageLock.packages && packageLock.packages['']) {
        expect(packageLock.packages[''].name).toBe(CORRECT_PACKAGE_NAME);
      }
    }
  });

  it('should use correct package name in documentation files', () => {
    // Property: For any documentation file, all package references should be correct
    const docFiles = ['README.md', 'POWER.md', 'llms-install.md'].filter(f => 
      fs.existsSync(path.resolve(process.cwd(), f))
    );

    fc.assert(
      fc.property(
        fc.constantFrom(...docFiles),
        (fileName) => {
          const filePath = path.resolve(process.cwd(), fileName);
          const fileContent = fs.readFileSync(filePath, 'utf8');

          // Should contain the correct package name
          expect(fileContent).toContain(CORRECT_PACKAGE_NAME);

          // Should not contain old package names
          OLD_PACKAGE_NAMES.forEach((oldName) => {
            expect(fileContent).not.toContain(oldName);
          });

          return true;
        }
      ),
      { numRuns: docFiles.length }
    );
  });

  it('should use correct package name in npx commands', () => {
    // Property: For any file containing npx commands, they should use the correct package name
    const filesWithNpx = allFilesToCheck.filter((fileName) => {
      const filePath = path.resolve(process.cwd(), fileName);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return fileContent.includes('npx') && !fileName.includes('__tests__');
    });

    fc.assert(
      fc.property(
        fc.constantFrom(...filesWithNpx),
        (fileName) => {
          const filePath = path.resolve(process.cwd(), fileName);
          const fileContent = fs.readFileSync(filePath, 'utf8');

          // Find all npx commands
          const npxCommandRegex = /npx\s+(?:-y\s+)?(@[^\s"'`]+)/g;
          const matches = [...fileContent.matchAll(npxCommandRegex)];

          // For any npx command that references a firebase package
          matches.forEach((match) => {
            const packageName = match[1];
            if (packageName.includes('firebase')) {
              // It should be the correct package name
              expect(packageName).toBe(CORRECT_PACKAGE_NAME);
              
              // Should not be an old package name
              OLD_PACKAGE_NAMES.forEach((oldName) => {
                expect(packageName).not.toBe(oldName);
              });
            }
          });

          return true;
        }
      ),
      { numRuns: filesWithNpx.length }
    );
  });

  it('should use correct package name in MCP configuration examples', () => {
    // Property: For any file containing MCP configuration, it should use the correct package name
    const filesWithConfig = allFilesToCheck.filter((fileName) => {
      const filePath = path.resolve(process.cwd(), fileName);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return fileContent.includes('mcpServers') || fileContent.includes('"command"') && !fileName.includes('__tests__');
    });

    fc.assert(
      fc.property(
        fc.constantFrom(...filesWithConfig),
        (fileName) => {
          const filePath = path.resolve(process.cwd(), fileName);
          const fileContent = fs.readFileSync(filePath, 'utf8');

          // If the file contains firebase package references in config
          if (fileContent.includes('@kiro/') || fileContent.includes('firebase')) {
            // Should use the correct package name
            const hasCorrectName = fileContent.includes(CORRECT_PACKAGE_NAME);
            
            // If it has any firebase package reference, it should be the correct one
            if (fileContent.match(/@[a-z]+\/firebase-[a-z-]+/)) {
              expect(hasCorrectName).toBe(true);
            }
          }

          return true;
        }
      ),
      { numRuns: filesWithConfig.length }
    );
  });

  it('should maintain consistency across arbitrary file subsets', () => {
    // Property: For any subset of files, all should use consistent package naming
    const nonTestFiles = allFilesToCheck.filter(f => !f.includes('__tests__') && !f.includes('.test.'));

    fc.assert(
      fc.property(
        fc.subarray(nonTestFiles, { minLength: 1, maxLength: 10 }),
        (fileSubset) => {
          fileSubset.forEach((fileName) => {
            const filePath = path.resolve(process.cwd(), fileName);
            const fileContent = fs.readFileSync(filePath, 'utf8');

            // If the file contains any firebase package reference
            const hasFirebaseRef = fileContent.match(/@[a-z]+\/firebase-[a-z-]+/);
            
            if (hasFirebaseRef) {
              // Should use the correct package name
              expect(fileContent).toContain(CORRECT_PACKAGE_NAME);
              
              // Should not use old package names
              OLD_PACKAGE_NAMES.forEach((oldName) => {
                expect(fileContent).not.toContain(oldName);
              });
            }
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use correct executable name in package.json bin field', () => {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Property: The bin field should use "firebase-power" as the executable name
    expect(packageJson.bin).toHaveProperty('firebase-power');
    expect(packageJson.bin['firebase-power']).toBe('./dist/index.js');
  });

  it('should use correct name in source code module declarations', () => {
    // Property: For any source file with @module declarations, it should use "firebase-power"
    const sourceFilesWithModules = sourceFiles.filter((fileName) => {
      // Exclude test files from this check
      if (fileName.includes('__tests__') || fileName.includes('.test.')) {
        return false;
      }
      const filePath = path.resolve(process.cwd(), fileName);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return fileContent.includes('@module');
    });

    fc.assert(
      fc.property(
        fc.constantFrom(...sourceFilesWithModules),
        (fileName) => {
          const filePath = path.resolve(process.cwd(), fileName);
          const fileContent = fs.readFileSync(filePath, 'utf8');

          // Find all @module declarations
          const moduleRegex = /@module\s+([^\s\n]+)/g;
          const matches = [...fileContent.matchAll(moduleRegex)];

          // For any module declaration
          matches.forEach((match) => {
            const moduleName = match[1];
            
            // Should use "firebase-power" as the base module name
            expect(moduleName).toMatch(/^firebase-power/);
            
            // Should not use old naming patterns
            expect(moduleName).not.toContain('firebase-kiro-power');
            expect(moduleName).not.toContain('firebase-kiro-power');
          });

          return true;
        }
      ),
      { numRuns: sourceFilesWithModules.length }
    );
  });

  it('should use correct name in config.ts server info', () => {
    const configPath = path.resolve(process.cwd(), 'src/config.ts');
    const configContent = fs.readFileSync(configPath, 'utf8');

    // Property: The server name in config should be "firebase-power"
    expect(configContent).toContain("name: 'firebase-power'");
  });

  it('should not have any references to old package names in non-test source files', () => {
    // Property: For any non-test source file, it should not contain old package names
    const nonTestSourceFiles = sourceFiles.filter(f => !f.includes('__tests__') && !f.includes('.test.'));

    fc.assert(
      fc.property(
        fc.constantFrom(...nonTestSourceFiles),
        (fileName) => {
          const filePath = path.resolve(process.cwd(), fileName);
          const fileContent = fs.readFileSync(filePath, 'utf8');

          // Should not contain old package names
          OLD_PACKAGE_NAMES.forEach((oldName) => {
            expect(fileContent).not.toContain(oldName);
          });

          return true;
        }
      ),
      { numRuns: nonTestSourceFiles.length }
    );
  });

  it('should have consistent branding across package.json fields', () => {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Property: All package.json fields should use consistent naming
    
    // Name should be @kiro/firebase-power
    expect(packageJson.name).toBe(CORRECT_PACKAGE_NAME);
    
    // Description should mention "Kiro Power" and "Firebase"
    expect(packageJson.description).toContain('Kiro Power');
    expect(packageJson.description).toContain('Firebase');
    
    // Keywords should include kiro, kiro-power, and firebase
    expect(packageJson.keywords).toContain('kiro');
    expect(packageJson.keywords).toContain('kiro-power');
    expect(packageJson.keywords).toContain('firebase');
    
    // Bin should use firebase-power
    expect(packageJson.bin).toHaveProperty('firebase-power');
  });

  it('should verify all files in distribution use correct naming', () => {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Property: For any file in the distribution, it should use correct naming
    const distributionFiles = packageJson.files || [];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...distributionFiles),
        (fileName) => {
          // Check if the file exists and contains package references
          const filePath = path.resolve(process.cwd(), fileName);
          
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            
            // If it contains package references, they should be correct
            if (fileContent.includes('@kiro/') || fileContent.includes('firebase')) {
              const hasOldNames = OLD_PACKAGE_NAMES.some(oldName => 
                fileContent.includes(oldName)
              );
              expect(hasOldNames).toBe(false);
            }
          }

          return true;
        }
      ),
      { numRuns: distributionFiles.length }
    );
  });
});
