import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import fs from 'fs';
import path from 'path';

/**
 * Feature: firebase-power-conversion
 * Property 9: Dependency Preservation
 * **Validates: Requirements 1.4**
 *
 * For any dependency listed in the original package.json, the dependency and its
 * version should remain unchanged in the converted package.json
 */

describe('Property 9: Dependency Preservation', () => {
  // Read the current package.json
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Expected dependencies based on the original Firebase MCP server
  // These are the dependencies that should be preserved during conversion
  const expectedDependencies = {
    '@modelcontextprotocol/sdk': '^1.11.0',
    axios: '^1.9.0',
    dotenv: '^16.5.0',
    express: '^5.1.0',
    'firebase-admin': '^13.3.0',
  };

  const expectedDevDependencies = {
    '@eslint/eslintrc': '^3.3.1',
    '@eslint/js': '^9.39.2',
    '@types/express': '^5.0.1',
    '@types/node': '^22.15.14',
    '@typescript-eslint/eslint-plugin': '^8.32.0',
    '@typescript-eslint/parser': '^8.32.0',
    '@vitest/coverage-v8': '^3.1.3',
    eslint: '^9.39.2',
    'eslint-config-prettier': '^10.1.2',
    'eslint-plugin-prettier': '^5.5.5',
    prettier: '^3.5.3',
    typescript: '^5.9.3',
    'typescript-eslint': '^8.32.0',
    vitest: '^3.1.3',
  };

  it('should preserve all runtime dependencies and their versions', () => {
    // Property-based test: for any dependency in the expected list,
    // it should exist in the current package.json with the same version
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(expectedDependencies)),
        (dependencyName) => {
          // The dependency should exist in the current package.json
          expect(packageJson.dependencies).toHaveProperty(dependencyName);

          // The version should match exactly
          const expectedVersion = expectedDependencies[dependencyName as keyof typeof expectedDependencies];
          const actualVersion = packageJson.dependencies[dependencyName];

          expect(actualVersion).toBe(expectedVersion);

          return true;
        }
      ),
      { numRuns: Object.keys(expectedDependencies).length }
    );
  });

  it('should preserve all development dependencies and their versions', () => {
    // Property-based test: for any dev dependency in the expected list,
    // it should exist in the current package.json with the same version
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(expectedDevDependencies)),
        (dependencyName) => {
          // The dependency should exist in the current package.json
          expect(packageJson.devDependencies).toHaveProperty(dependencyName);

          // The version should match exactly
          const expectedVersion = expectedDevDependencies[dependencyName as keyof typeof expectedDevDependencies];
          const actualVersion = packageJson.devDependencies[dependencyName];

          expect(actualVersion).toBe(expectedVersion);

          return true;
        }
      ),
      { numRuns: Object.keys(expectedDevDependencies).length }
    );
  });

  it('should not have any unexpected runtime dependencies', () => {
    // Verify that all dependencies in package.json are in our expected list
    const actualDependencies = Object.keys(packageJson.dependencies || {});
    const expectedDependencyNames = Object.keys(expectedDependencies);

    actualDependencies.forEach((dep) => {
      expect(expectedDependencyNames).toContain(dep);
    });
  });

  it('should not have any unexpected development dependencies', () => {
    // Verify that all dev dependencies in package.json are in our expected list
    // (excluding fast-check which was added for property testing)
    const actualDevDependencies = Object.keys(packageJson.devDependencies || {});
    const expectedDevDependencyNames = Object.keys(expectedDevDependencies);

    actualDevDependencies.forEach((dep) => {
      // Allow fast-check as it's added for property-based testing
      if (dep === 'fast-check') {
        return;
      }
      expect(expectedDevDependencyNames).toContain(dep);
    });
  });

  it('should maintain the exact dependency count', () => {
    // The number of runtime dependencies should match
    const actualDependencyCount = Object.keys(packageJson.dependencies || {}).length;
    const expectedDependencyCount = Object.keys(expectedDependencies).length;

    expect(actualDependencyCount).toBe(expectedDependencyCount);
  });

  it('should maintain the exact dev dependency count (plus fast-check)', () => {
    // The number of dev dependencies should match (plus fast-check)
    const actualDevDependencyCount = Object.keys(packageJson.devDependencies || {}).length;
    const expectedDevDependencyCount = Object.keys(expectedDevDependencies).length;

    // Allow for fast-check to be added
    expect(actualDevDependencyCount).toBeLessThanOrEqual(expectedDevDependencyCount + 1);
    expect(actualDevDependencyCount).toBeGreaterThanOrEqual(expectedDevDependencyCount);
  });

  it('should preserve dependency versions across arbitrary subsets', () => {
    // Property-based test: for any subset of dependencies,
    // all should be preserved with correct versions
    const allDependencies = { ...expectedDependencies };

    fc.assert(
      fc.property(
        fc.subarray(Object.keys(allDependencies), { minLength: 1 }),
        (dependencySubset) => {
          // For each dependency in the subset
          dependencySubset.forEach((depName) => {
            // It should exist in package.json
            expect(packageJson.dependencies).toHaveProperty(depName);

            // With the correct version
            const expectedVersion = allDependencies[depName as keyof typeof allDependencies];
            const actualVersion = packageJson.dependencies[depName];
            expect(actualVersion).toBe(expectedVersion);
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
