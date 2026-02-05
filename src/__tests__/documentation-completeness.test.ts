import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import fs from 'fs';
import path from 'path';

/**
 * Feature: firebase-power-conversion
 * Property 5: Documentation Completeness
 * **Validates: Requirements 2.3**
 *
 * For any MCP tool available in the system, the tool should be documented in POWER.md
 * with its name, description, parameters, and usage examples
 */

describe('Property 5: Documentation Completeness', () => {
  // Read the POWER.md file
  const powerMdPath = path.resolve(process.cwd(), 'POWER.md');
  const powerMdContent = fs.readFileSync(powerMdPath, 'utf8');

  // Read the index.ts file to extract tool definitions
  const indexPath = path.resolve(process.cwd(), 'src/index.ts');
  const indexContent = fs.readFileSync(indexPath, 'utf8');

  // Extract all MCP tool names from index.ts
  // Tools are defined in the ListToolsRequestSchema handler
  const toolNameRegex = /name:\s*['"]([^'"]+)['"]/g;
  const toolMatches = [...indexContent.matchAll(toolNameRegex)];
  const mcpTools = toolMatches.map(match => match[1]);

  // Remove duplicates and filter to only Firebase tools
  const uniqueMcpTools = [...new Set(mcpTools)].filter(
    tool => tool.startsWith('firestore_') || tool.startsWith('storage_') || tool.startsWith('auth_')
  );

  it('should document all MCP tools in POWER.md', () => {
    // Property: For any MCP tool, it should be documented in POWER.md
    fc.assert(
      fc.property(
        fc.constantFrom(...uniqueMcpTools),
        (toolName) => {
          // The tool name should appear as a heading in POWER.md
          const toolHeadingRegex = new RegExp(`####\\s+${toolName}`, 'i');
          expect(powerMdContent).toMatch(toolHeadingRegex);

          return true;
        }
      ),
      { numRuns: uniqueMcpTools.length }
    );
  });

  it('should document tool descriptions for all MCP tools', () => {
    // Property: For any MCP tool, it should have a description in POWER.md
    fc.assert(
      fc.property(
        fc.constantFrom(...uniqueMcpTools),
        (toolName) => {
          // Find the tool section in POWER.md
          const toolSectionRegex = new RegExp(
            `####\\s+${toolName}[\\s\\S]*?(?=####|$)`,
            'i'
          );
          const toolSection = powerMdContent.match(toolSectionRegex);

          // The tool section should exist
          expect(toolSection).not.toBeNull();

          if (toolSection) {
            // The section should contain a description (text after the heading)
            const sectionContent = toolSection[0];
            
            // Remove the heading line
            const lines = sectionContent.split('\n').slice(1);
            const contentWithoutHeading = lines.join('\n').trim();
            
            // Should have some descriptive text
            expect(contentWithoutHeading.length).toBeGreaterThan(0);
          }

          return true;
        }
      ),
      { numRuns: uniqueMcpTools.length }
    );
  });

  it('should document parameters for all MCP tools', () => {
    // Property: For any MCP tool, it should have parameters documented in POWER.md
    fc.assert(
      fc.property(
        fc.constantFrom(...uniqueMcpTools),
        (toolName) => {
          // Find the tool section in POWER.md
          const toolSectionRegex = new RegExp(
            `####\\s+${toolName}[\\s\\S]*?(?=####|$)`,
            'i'
          );
          const toolSection = powerMdContent.match(toolSectionRegex);

          // The tool section should exist
          expect(toolSection).not.toBeNull();

          if (toolSection) {
            const sectionContent = toolSection[0];
            
            // The section should contain a "Parameters:" heading or section
            // Some tools may have no parameters, so we check for the word "Parameters"
            expect(sectionContent.toLowerCase()).toContain('parameter');
          }

          return true;
        }
      ),
      { numRuns: uniqueMcpTools.length }
    );
  });

  it('should document usage examples for all MCP tools', () => {
    // Property: For any MCP tool, it should have usage examples in POWER.md
    fc.assert(
      fc.property(
        fc.constantFrom(...uniqueMcpTools),
        (toolName) => {
          // Find the tool section in POWER.md
          const toolSectionRegex = new RegExp(
            `####\\s+${toolName}[\\s\\S]*?(?=####|$)`,
            'i'
          );
          const toolSection = powerMdContent.match(toolSectionRegex);

          // The tool section should exist
          expect(toolSection).not.toBeNull();

          if (toolSection) {
            const sectionContent = toolSection[0];
            
            // The section should contain usage examples
            // Look for common example indicators: "Example", "Usage", code blocks
            const hasExampleHeading = /example\s*usage/i.test(sectionContent);
            const hasCodeBlock = /```/.test(sectionContent);
            
            // Should have either an example heading or code blocks
            expect(hasExampleHeading || hasCodeBlock).toBe(true);
          }

          return true;
        }
      ),
      { numRuns: uniqueMcpTools.length }
    );
  });

  it('should document return values for all MCP tools', () => {
    // Property: For any MCP tool, it should have return values documented
    fc.assert(
      fc.property(
        fc.constantFrom(...uniqueMcpTools),
        (toolName) => {
          // Find the tool section in POWER.md
          const toolSectionRegex = new RegExp(
            `####\\s+${toolName}[\\s\\S]*?(?=####|$)`,
            'i'
          );
          const toolSection = powerMdContent.match(toolSectionRegex);

          // The tool section should exist
          expect(toolSection).not.toBeNull();

          if (toolSection) {
            const sectionContent = toolSection[0];
            
            // The section should document what the tool returns
            // Look for "Returns:", "Response:", or similar indicators
            const hasReturnsSection = /returns?:/i.test(sectionContent);
            const hasResponseSection = /response:/i.test(sectionContent);
            
            // Should have either a returns or response section
            expect(hasReturnsSection || hasResponseSection).toBe(true);
          }

          return true;
        }
      ),
      { numRuns: uniqueMcpTools.length }
    );
  });

  it('should have complete documentation structure for arbitrary tool subsets', () => {
    // Property: For any subset of MCP tools, all should have complete documentation
    fc.assert(
      fc.property(
        fc.subarray(uniqueMcpTools, { minLength: 1 }),
        (toolSubset) => {
          toolSubset.forEach((toolName) => {
            // Find the tool section
            const toolSectionRegex = new RegExp(
              `####\\s+${toolName}[\\s\\S]*?(?=####|$)`,
              'i'
            );
            const toolSection = powerMdContent.match(toolSectionRegex);

            // Tool should be documented
            expect(toolSection).not.toBeNull();

            if (toolSection) {
              const sectionContent = toolSection[0];

              // Should have description (content after heading)
              const lines = sectionContent.split('\n').slice(1);
              const contentWithoutHeading = lines.join('\n').trim();
              expect(contentWithoutHeading.length).toBeGreaterThan(0);

              // Should have parameters section
              expect(sectionContent.toLowerCase()).toContain('parameter');

              // Should have examples
              const hasExamples = /example\s*usage/i.test(sectionContent) || /```/.test(sectionContent);
              expect(hasExamples).toBe(true);

              // Should have return/response documentation
              const hasReturns = /returns?:/i.test(sectionContent) || /response:/i.test(sectionContent);
              expect(hasReturns).toBe(true);
            }
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not have any undocumented MCP tools', () => {
    // Verify that all tools found in index.ts are documented in POWER.md
    uniqueMcpTools.forEach((toolName) => {
      const toolHeadingRegex = new RegExp(`####\\s+${toolName}`, 'i');
      expect(powerMdContent).toMatch(toolHeadingRegex);
    });
  });

  it('should maintain consistent documentation format across all tools', () => {
    // Property: All tools should follow a consistent documentation structure
    fc.assert(
      fc.property(
        fc.constantFrom(...uniqueMcpTools),
        (toolName) => {
          // Find the tool section
          const toolSectionRegex = new RegExp(
            `####\\s+${toolName}[\\s\\S]*?(?=####|$)`,
            'i'
          );
          const toolSection = powerMdContent.match(toolSectionRegex);

          if (toolSection) {
            const sectionContent = toolSection[0];

            // Check for consistent structure elements
            const hasHeading = /^####\s+/.test(sectionContent);
            const hasParameters = /parameter/i.test(sectionContent);
            const hasExamples = /example/i.test(sectionContent) || /```/.test(sectionContent);
            const hasReturns = /returns?:/i.test(sectionContent) || /response:/i.test(sectionContent);

            // All tools should have these basic elements
            expect(hasHeading).toBe(true);
            expect(hasParameters).toBe(true);
            expect(hasExamples).toBe(true);
            expect(hasReturns).toBe(true);
          }

          return true;
        }
      ),
      { numRuns: uniqueMcpTools.length }
    );
  });

  it('should document all 13 expected Firebase MCP tools', () => {
    // Verify we have exactly 13 unique Firebase tools
    expect(uniqueMcpTools.length).toBe(13);

    // Verify the expected tools are present
    const expectedTools = [
      'firestore_add_document',
      'firestore_list_documents',
      'firestore_get_document',
      'firestore_update_document',
      'firestore_delete_document',
      'firestore_list_collections',
      'firestore_query_collection_group',
      'firestore_count_documents',
      'auth_get_user',
      'storage_list_files',
      'storage_get_file_info',
      'storage_upload',
      'storage_upload_from_url',
    ];

    expectedTools.forEach((toolName) => {
      expect(uniqueMcpTools).toContain(toolName);
    });
  });

  it('should have tool documentation organized by service category', () => {
    // Verify that POWER.md has sections for each service category
    expect(powerMdContent).toMatch(/###\s+Firestore\s+Tools/i);
    expect(powerMdContent).toMatch(/###\s+Storage\s+Tools/i);
    expect(powerMdContent).toMatch(/###\s+(Firebase\s+)?Authentication(\s+Tools)?/i);
  });

  it('should document parameter types and requirements', () => {
    // Property: For any MCP tool, parameters should have type and requirement info
    fc.assert(
      fc.property(
        fc.constantFrom(...uniqueMcpTools),
        (toolName) => {
          // Find the tool section
          const toolSectionRegex = new RegExp(
            `####\\s+${toolName}[\\s\\S]*?(?=####|$)`,
            'i'
          );
          const toolSection = powerMdContent.match(toolSectionRegex);

          if (toolSection) {
            const sectionContent = toolSection[0];

            // Look for parameter documentation with types
            // Should have indicators like "string", "number", "object", "array", "required", "optional"
            const hasTypeInfo = /(string|number|object|array|boolean)/i.test(sectionContent);
            const hasRequirementInfo = /(required|optional)/i.test(sectionContent);

            // Should document types and requirements
            expect(hasTypeInfo || hasRequirementInfo).toBe(true);
          }

          return true;
        }
      ),
      { numRuns: uniqueMcpTools.length }
    );
  });
});
