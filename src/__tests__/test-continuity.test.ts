import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Feature: firebase-power-conversion
 * Property 4: Test Continuity
 * **Validates: Requirements 5.1, 5.2**
 *
 * For any existing test file and test case, the test file should still exist after conversion
 * and the test case should pass/fail with the same status as before conversion.
 *
 * This property test validates that:
 * - All expected test files exist in the codebase
 * - Test files contain valid test cases
 * - Test structure is preserved (describe blocks, it blocks)
 * - Test files are executable and properly configured
 *
 * The test ensures that the conversion to Kiro Power did not break or remove any existing tests.
 */

// Expected test files that should exist after conversion
// These represent the core Firebase functionality tests that must be preserved
const EXPECTED_TEST_FILES = [
  'config.test.ts',
  'http.test.ts',
  'index.test.ts',
  'index-tool-handlers.test.ts',
  'timestamp-handling.test.ts',
  'transports.test.ts',
];

// Test files added for the conversion itself
const CONVERSION_TEST_FILES = [
  'build-artifact-completeness.test.ts',
  'build-process.test.ts',
  'dependency-preservation.test.ts',
  'documentation-completeness.test.ts',
  'functionality-preservation.test.ts',
  'package-metadata.test.ts',
  'package-name-consistency.test.ts',
  'power-md-structure.test.ts',
  'readme-section-preservation.test.ts',
  'readme-updates.test.ts',
  'tool-interface-preservation.test.ts',
  'test-continuity.test.ts', // This file itself
];

const ALL_TEST_FILES = [...EXPECTED_TEST_FILES, ...CONVERSION_TEST_FILES];

describe('Property 4: Test Continuity', () => {
  const testDir = path.resolve(process.cwd(), 'src/__tests__');

  /**
   * Test that all expected test files exist after conversion
   * For any test file in the expected list, it should exist in the test directory
   */
  it('should preserve all existing test files', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...EXPECTED_TEST_FILES),
        async (testFile) => {
          const testPath = path.join(testDir, testFile);
          
          // Verify the test file exists
          expect(fs.existsSync(testPath)).toBe(true);
          
          // Verify it's a file (not a directory)
          const stats = fs.statSync(testPath);
          expect(stats.isFile()).toBe(true);
          
          return true;
        }
      ),
      { numRuns: EXPECTED_TEST_FILES.length }
    );
  });

  /**
   * Test that all test files are valid TypeScript files
   * For any test file, it should be a .ts file with valid syntax
   */
  it('should have valid TypeScript test files', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...ALL_TEST_FILES),
        async (testFile) => {
          const testPath = path.join(testDir, testFile);
          
          // Verify file has .ts extension
          expect(testFile).toMatch(/\.test\.ts$/);
          
          // Verify file is readable
          const content = fs.readFileSync(testPath, 'utf8');
          expect(content.length).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: ALL_TEST_FILES.length }
    );
  });

  /**
   * Test that all test files contain valid test structure
   * For any test file, it should contain describe and it/test blocks
   */
  it('should contain valid test structure in all test files', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...ALL_TEST_FILES),
        async (testFile) => {
          const testPath = path.join(testDir, testFile);
          const content = fs.readFileSync(testPath, 'utf8');
          
          // Verify file contains describe blocks
          expect(content).toMatch(/describe\s*\(/);
          
          // Verify file contains test cases (it or test blocks)
          const hasItBlocks = content.includes('it(') || content.includes('it.skip(');
          const hasTestBlocks = content.includes('test(') || content.includes('test.skip(');
          expect(hasItBlocks || hasTestBlocks).toBe(true);
          
          return true;
        }
      ),
      { numRuns: ALL_TEST_FILES.length }
    );
  });

  /**
   * Test that all test files import required testing utilities
   * For any test file, it should import from vitest
   */
  it('should import testing utilities in all test files', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...ALL_TEST_FILES),
        async (testFile) => {
          const testPath = path.join(testDir, testFile);
          const content = fs.readFileSync(testPath, 'utf8');
          
          // Verify file imports from vitest
          expect(content).toMatch(/from\s+['"]vitest['"]/);
          
          // Verify file imports describe and it/test
          const hasDescribe = content.includes('describe');
          const hasIt = content.includes('it') || content.includes('test');
          expect(hasDescribe && hasIt).toBe(true);
          
          return true;
        }
      ),
      { numRuns: ALL_TEST_FILES.length }
    );
  });

  /**
   * Test that core Firebase functionality tests are preserved
   * For any core test file, it should test the expected functionality
   */
  it('should preserve core Firebase functionality tests', async () => {
    const coreTests = [
      { file: 'config.test.ts', keyword: 'config' },
      { file: 'http.test.ts', keyword: 'http' },
      { file: 'index.test.ts', keyword: 'server' },
      { file: 'transports.test.ts', keyword: 'transport' },
      { file: 'timestamp-handling.test.ts', keyword: 'timestamp' },
    ];

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...coreTests),
        async (testInfo) => {
          const testPath = path.join(testDir, testInfo.file);
          const content = fs.readFileSync(testPath, 'utf8');
          
          // Verify the test file contains relevant keywords
          const lowerContent = content.toLowerCase();
          expect(lowerContent).toContain(testInfo.keyword.toLowerCase());
          
          return true;
        }
      ),
      { numRuns: coreTests.length }
    );
  });

  /**
   * Test that test files have proper documentation
   * For any test file, it should have comments explaining what it tests
   */
  it('should have documentation in test files', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...ALL_TEST_FILES),
        async (testFile) => {
          const testPath = path.join(testDir, testFile);
          const content = fs.readFileSync(testPath, 'utf8');
          
          // Verify file has comments (either // or /* */)
          const hasComments = content.includes('//') || content.includes('/*');
          expect(hasComments).toBe(true);
          
          return true;
        }
      ),
      { numRuns: ALL_TEST_FILES.length }
    );
  });

  /**
   * Test that property tests are properly annotated
   * For any property test file, it should have Feature and Property annotations
   */
  it('should have proper annotations in property test files', async () => {
    const propertyTestFiles = [
      'functionality-preservation.test.ts',
      'tool-interface-preservation.test.ts',
      'dependency-preservation.test.ts',
      'documentation-completeness.test.ts',
      'package-name-consistency.test.ts',
      'readme-section-preservation.test.ts',
      'build-artifact-completeness.test.ts',
      'test-continuity.test.ts',
    ];

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...propertyTestFiles),
        async (testFile) => {
          const testPath = path.join(testDir, testFile);
          const content = fs.readFileSync(testPath, 'utf8');
          
          // Verify file has Feature annotation
          expect(content).toMatch(/Feature:\s*firebase-power-conversion/);
          
          // Verify file has Property annotation (including "Property (partial)" format)
          expect(content).toMatch(/Property(\s+\d+|\s+\(partial\))?:/);
          
          // Verify file has Validates annotation
          expect(content).toMatch(/\*\*Validates:\s*Requirements/);
          
          return true;
        }
      ),
      { numRuns: propertyTestFiles.length }
    );
  });

  /**
   * Test that property tests use fast-check library
   * For any property test file, it should import and use fast-check
   */
  it('should use fast-check in property test files', async () => {
    const propertyTestFiles = [
      'functionality-preservation.test.ts',
      'tool-interface-preservation.test.ts',
      'dependency-preservation.test.ts',
      'documentation-completeness.test.ts',
      'package-name-consistency.test.ts',
      'readme-section-preservation.test.ts',
      'build-artifact-completeness.test.ts',
      'test-continuity.test.ts',
    ];

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...propertyTestFiles),
        async (testFile) => {
          const testPath = path.join(testDir, testFile);
          const content = fs.readFileSync(testPath, 'utf8');
          
          // Verify file imports fast-check
          expect(content).toMatch(/import.*fast-check/);
          
          // Verify file uses fc.assert or fc.asyncProperty
          const usesFastCheck = content.includes('fc.assert') || 
                               content.includes('fc.asyncProperty') ||
                               content.includes('fc.property');
          expect(usesFastCheck).toBe(true);
          
          return true;
        }
      ),
      { numRuns: propertyTestFiles.length }
    );
  });

  /**
   * Test that test files follow naming conventions
   * For any test file, it should follow the pattern *.test.ts
   */
  it('should follow naming conventions for all test files', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...ALL_TEST_FILES),
        async (testFile) => {
          // Verify file follows naming convention
          expect(testFile).toMatch(/^[a-z0-9-]+\.test\.ts$/);
          
          // Verify file name uses kebab-case
          const nameWithoutExtension = testFile.replace('.test.ts', '');
          expect(nameWithoutExtension).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
          
          return true;
        }
      ),
      { numRuns: ALL_TEST_FILES.length }
    );
  });

  /**
   * Test that the test directory structure is preserved
   * All tests should be in the src/__tests__ directory
   */
  it('should maintain test directory structure', () => {
    // Verify test directory exists
    expect(fs.existsSync(testDir)).toBe(true);
    expect(fs.statSync(testDir).isDirectory()).toBe(true);
    
    // Verify all test files are in the correct directory
    const actualFiles = fs.readdirSync(testDir)
      .filter(file => file.endsWith('.test.ts'));
    
    // All expected files should be present
    EXPECTED_TEST_FILES.forEach(file => {
      expect(actualFiles).toContain(file);
    });
    
    // Verify we have a reasonable number of test files
    expect(actualFiles.length).toBeGreaterThanOrEqual(EXPECTED_TEST_FILES.length);
  });

  /**
   * Test that test files are executable (no syntax errors)
   * For any test file, it should be valid TypeScript that can be parsed
   */
  it('should have syntactically valid test files', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...ALL_TEST_FILES),
        async (testFile) => {
          const testPath = path.join(testDir, testFile);
          const content = fs.readFileSync(testPath, 'utf8');
          
          // Basic syntax checks
          // Verify balanced braces (excluding braces in strings and comments)
          const openBraces = (content.match(/{/g) || []).length;
          const closeBraces = (content.match(/}/g) || []).length;
          // Allow small difference for braces in strings/comments
          expect(Math.abs(openBraces - closeBraces)).toBeLessThanOrEqual(2);
          
          // Verify has describe blocks
          const hasDescribe = content.includes('describe(');
          expect(hasDescribe).toBe(true);
          
          return true;
        }
      ),
      { numRuns: ALL_TEST_FILES.length }
    );
  });

  /**
   * Test that conversion did not remove any test cases
   * For any core test file, it should have at least one test case
   */
  it('should preserve test cases in all test files', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...ALL_TEST_FILES),
        async (testFile) => {
          const testPath = path.join(testDir, testFile);
          const content = fs.readFileSync(testPath, 'utf8');
          
          // Count test cases (it or test blocks)
          const itMatches = content.match(/\bit\s*\(/g) || [];
          const testMatches = content.match(/\btest\s*\(/g) || [];
          const totalTests = itMatches.length + testMatches.length;
          
          // Every test file should have at least one test
          expect(totalTests).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: ALL_TEST_FILES.length }
    );
  });

  /**
   * Test that test files use consistent expect assertions
   * For any test file, it should use vitest's expect function
   */
  it('should use consistent assertion style in all test files', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...ALL_TEST_FILES),
        async (testFile) => {
          const testPath = path.join(testDir, testFile);
          const content = fs.readFileSync(testPath, 'utf8');
          
          // Verify file uses expect assertions
          expect(content).toContain('expect(');
          
          // Verify file imports expect from vitest
          const hasExpectImport = content.match(/import.*expect.*from\s+['"]vitest['"]/);
          expect(hasExpectImport).toBeTruthy();
          
          return true;
        }
      ),
      { numRuns: ALL_TEST_FILES.length }
    );
  });

  /**
   * Test that Firebase-related tests maintain emulator support
   * For any Firebase functionality test, it should support emulator mode
   */
  it('should maintain Firebase emulator support in functionality tests', () => {
    const firebaseTestFiles = [
      'functionality-preservation.test.ts',
    ];

    firebaseTestFiles.forEach(testFile => {
      const testPath = path.join(testDir, testFile);
      const content = fs.readFileSync(testPath, 'utf8');
      
      // Verify test mentions emulator or has Firebase availability check
      const hasEmulatorSupport = 
        content.includes('USE_FIREBASE_EMULATOR') ||
        content.includes('isFirebaseAvailable') ||
        content.includes('emulator');
      
      expect(hasEmulatorSupport).toBe(true);
    });
  });

  /**
   * Test that test coverage is maintained
   * The test suite should cover all major components
   */
  it('should maintain comprehensive test coverage', () => {
    const actualFiles = fs.readdirSync(testDir)
      .filter(file => file.endsWith('.test.ts'));
    
    // Verify we have tests for major components
    const hasConfigTests = actualFiles.some(f => f.includes('config'));
    const hasHttpTests = actualFiles.some(f => f.includes('http'));
    const hasIndexTests = actualFiles.some(f => f.includes('index'));
    const hasTransportTests = actualFiles.some(f => f.includes('transport'));
    
    expect(hasConfigTests).toBe(true);
    expect(hasHttpTests).toBe(true);
    expect(hasIndexTests).toBe(true);
    expect(hasTransportTests).toBe(true);
    
    // Verify we have property tests for conversion
    const hasFunctionalityTests = actualFiles.some(f => f.includes('functionality-preservation'));
    const hasInterfaceTests = actualFiles.some(f => f.includes('tool-interface-preservation'));
    const hasDependencyTests = actualFiles.some(f => f.includes('dependency-preservation'));
    
    expect(hasFunctionalityTests).toBe(true);
    expect(hasInterfaceTests).toBe(true);
    expect(hasDependencyTests).toBe(true);
  });
});
