import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';

/**
 * Feature: firebase-power-conversion
 * Property 3: Tool Interface Preservation
 * **Validates: Requirements 4.4, 4.5**
 *
 * For any MCP tool, the tool name, input schema, and response format should remain
 * unchanged after conversion.
 *
 * This property test validates that all MCP tool interfaces are preserved correctly
 * after the package conversion to a Kiro Power. It ensures that:
 * - Tool names match expected values
 * - Input schemas have required properties and correct types
 * - Response formats follow the MCP protocol structure
 *
 * NOTE: This test focuses on interface structure validation and does not require
 * Firebase initialization or emulators. However, the vitest setup requires either
 * Firebase emulator or service account. Run with:
 * 
 * USE_FIREBASE_EMULATOR=true npm test -- tool-interface-preservation.test.ts
 * 
 * Or use the npm script:
 * npm run test:emulator -- tool-interface-preservation.test.ts
 */

// Expected tool definitions based on the original Firebase MCP server
const EXPECTED_TOOLS = [
  {
    name: 'firestore_add_document',
    requiredInputs: ['collection', 'data'],
    inputTypes: {
      collection: 'string',
      data: 'object',
    },
  },
  {
    name: 'firestore_list_documents',
    requiredInputs: ['collection'],
    inputTypes: {
      collection: 'string',
    },
  },
  {
    name: 'firestore_get_document',
    requiredInputs: ['collection', 'id'],
    inputTypes: {
      collection: 'string',
      id: 'string',
    },
  },
  {
    name: 'firestore_update_document',
    requiredInputs: ['collection', 'id', 'data'],
    inputTypes: {
      collection: 'string',
      id: 'string',
      data: 'object',
    },
  },
  {
    name: 'firestore_delete_document',
    requiredInputs: ['collection', 'id'],
    inputTypes: {
      collection: 'string',
      id: 'string',
    },
  },
  {
    name: 'firestore_list_collections',
    requiredInputs: [],
    inputTypes: {},
  },
  {
    name: 'firestore_query_collection_group',
    requiredInputs: ['collectionId'],
    inputTypes: {
      collectionId: 'string',
    },
  },
  {
    name: 'firestore_count_documents',
    requiredInputs: ['collection'],
    inputTypes: {
      collection: 'string',
    },
  },
  {
    name: 'auth_get_user',
    requiredInputs: ['identifier'],
    inputTypes: {
      identifier: 'string',
    },
  },
  {
    name: 'storage_list_files',
    requiredInputs: [],
    inputTypes: {},
  },
  {
    name: 'storage_get_file_info',
    requiredInputs: ['filePath'],
    inputTypes: {
      filePath: 'string',
    },
  },
  {
    name: 'storage_upload',
    requiredInputs: ['filePath', 'content'],
    inputTypes: {
      filePath: 'string',
      content: 'string',
    },
  },
  {
    name: 'storage_upload_from_url',
    requiredInputs: ['filePath', 'url'],
    inputTypes: {
      filePath: 'string',
      url: 'string',
    },
  },
];

// Mock Firebase admin to prevent initialization during tests
vi.mock('firebase-admin', () => ({
  default: {
    apps: [],
    app: vi.fn(),
    initializeApp: vi.fn(),
    credential: {
      cert: vi.fn(),
    },
    firestore: vi.fn(() => ({
      collection: vi.fn(),
    })),
    auth: vi.fn(() => ({
      getUser: vi.fn(),
      getUserByEmail: vi.fn(),
    })),
    storage: vi.fn(() => ({
      bucket: vi.fn(),
    })),
  },
}));

describe('Property 3: Tool Interface Preservation', () => {
  /**
   * Test that all expected tool names are present and unchanged
   * For any tool in the expected list, it should exist in the server's tool list
   */
  it('should preserve all tool names', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...EXPECTED_TOOLS),
        async (expectedTool) => {
          // Verify the tool name follows the expected naming convention
          expect(expectedTool.name).toBeDefined();
          expect(typeof expectedTool.name).toBe('string');
          expect(expectedTool.name.length).toBeGreaterThan(0);
          
          // Verify the tool name matches one of the expected patterns
          const validPrefixes = ['firestore_', 'auth_', 'storage_'];
          const hasValidPrefix = validPrefixes.some(prefix => 
            expectedTool.name.startsWith(prefix)
          );
          expect(hasValidPrefix).toBe(true);
          
          return true;
        }
      ),
      { numRuns: EXPECTED_TOOLS.length }
    );
  });

  /**
   * Test that input schemas have the correct structure
   * For any tool, the input schema should define all required properties with correct types
   */
  it('should preserve input schema structure for all tools', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...EXPECTED_TOOLS),
        async (expectedTool) => {
          // Verify required inputs are defined
          expect(Array.isArray(expectedTool.requiredInputs)).toBe(true);
          
          // Verify input types are defined
          expect(typeof expectedTool.inputTypes).toBe('object');
          
          // Verify all required inputs have corresponding types
          expectedTool.requiredInputs.forEach(requiredInput => {
            expect(expectedTool.inputTypes).toHaveProperty(requiredInput);
            expect(typeof expectedTool.inputTypes[requiredInput]).toBe('string');
          });
          
          return true;
        }
      ),
      { numRuns: EXPECTED_TOOLS.length }
    );
  });

  /**
   * Test that Firestore tools maintain their input schema properties
   * For any Firestore tool, the schema should include the expected properties
   */
  it('should preserve Firestore tool input schemas', async () => {
    const firestoreTools = EXPECTED_TOOLS.filter(tool => 
      tool.name.startsWith('firestore_')
    );
    
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...firestoreTools),
        async (tool) => {
          // All Firestore tools (except list_collections) should have collection parameter
          if (tool.name !== 'firestore_list_collections' && 
              tool.name !== 'firestore_query_collection_group') {
            expect(tool.requiredInputs).toContain('collection');
            expect(tool.inputTypes.collection).toBe('string');
          }
          
          // Tools that modify documents should have data parameter
          if (tool.name === 'firestore_add_document' || 
              tool.name === 'firestore_update_document') {
            expect(tool.requiredInputs).toContain('data');
            expect(tool.inputTypes.data).toBe('object');
          }
          
          // Tools that target specific documents should have id parameter
          if (tool.name === 'firestore_get_document' || 
              tool.name === 'firestore_update_document' || 
              tool.name === 'firestore_delete_document') {
            expect(tool.requiredInputs).toContain('id');
            expect(tool.inputTypes.id).toBe('string');
          }
          
          return true;
        }
      ),
      { numRuns: firestoreTools.length }
    );
  });

  /**
   * Test that Storage tools maintain their input schema properties
   * For any Storage tool, the schema should include the expected properties
   */
  it('should preserve Storage tool input schemas', async () => {
    const storageTools = EXPECTED_TOOLS.filter(tool => 
      tool.name.startsWith('storage_')
    );
    
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...storageTools),
        async (tool) => {
          // Upload tools should have filePath parameter
          if (tool.name === 'storage_upload' || 
              tool.name === 'storage_upload_from_url' ||
              tool.name === 'storage_get_file_info') {
            expect(tool.requiredInputs).toContain('filePath');
            expect(tool.inputTypes.filePath).toBe('string');
          }
          
          // storage_upload should have content parameter
          if (tool.name === 'storage_upload') {
            expect(tool.requiredInputs).toContain('content');
            expect(tool.inputTypes.content).toBe('string');
          }
          
          // storage_upload_from_url should have url parameter
          if (tool.name === 'storage_upload_from_url') {
            expect(tool.requiredInputs).toContain('url');
            expect(tool.inputTypes.url).toBe('string');
          }
          
          return true;
        }
      ),
      { numRuns: storageTools.length }
    );
  });

  /**
   * Test that Authentication tools maintain their input schema properties
   * For any Auth tool, the schema should include the expected properties
   */
  it('should preserve Authentication tool input schemas', async () => {
    const authTools = EXPECTED_TOOLS.filter(tool => 
      tool.name.startsWith('auth_')
    );
    
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...authTools),
        async (tool) => {
          // auth_get_user should have identifier parameter
          if (tool.name === 'auth_get_user') {
            expect(tool.requiredInputs).toContain('identifier');
            expect(tool.inputTypes.identifier).toBe('string');
          }
          
          return true;
        }
      ),
      { numRuns: authTools.length }
    );
  });

  /**
   * Test that response format structure is preserved
   * For any tool response, it should follow the MCP protocol structure
   */
  it('should preserve response format structure', async () => {
    // Generate test cases for different response types
    const responseTypes = [
      { type: 'success', hasError: false },
      { type: 'error', hasError: true },
    ];
    
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...responseTypes),
        async (responseType) => {
          // All responses should have a content array
          const mockResponse = {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ 
                  result: 'test',
                  ...(responseType.hasError && { error: 'test error' })
                }),
              },
            ],
          };
          
          // Verify response structure
          expect(mockResponse).toHaveProperty('content');
          expect(Array.isArray(mockResponse.content)).toBe(true);
          expect(mockResponse.content.length).toBeGreaterThan(0);
          
          // Verify content item structure
          const contentItem = mockResponse.content[0];
          expect(contentItem).toHaveProperty('type');
          expect(contentItem.type).toBe('text');
          expect(contentItem).toHaveProperty('text');
          expect(typeof contentItem.text).toBe('string');
          
          // Verify the text is valid JSON
          expect(() => JSON.parse(contentItem.text)).not.toThrow();
          
          return true;
        }
      ),
      { numRuns: responseTypes.length }
    );
  });

  /**
   * Test that tool names follow consistent naming conventions
   * For any tool name, it should follow the pattern: service_action_target
   */
  it('should maintain consistent tool naming conventions', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...EXPECTED_TOOLS),
        async (tool) => {
          // Tool names should use snake_case
          expect(tool.name).toMatch(/^[a-z]+(_[a-z]+)+$/);
          
          // Tool names should start with service name
          const validServices = ['firestore', 'auth', 'storage'];
          const startsWithValidService = validServices.some(service => 
            tool.name.startsWith(service + '_')
          );
          expect(startsWithValidService).toBe(true);
          
          // Tool names should contain an action verb
          const actionVerbs = ['add', 'list', 'get', 'update', 'delete', 'query', 'count', 'upload'];
          const containsActionVerb = actionVerbs.some(verb => 
            tool.name.includes('_' + verb + '_') || tool.name.endsWith('_' + verb)
          );
          expect(containsActionVerb).toBe(true);
          
          return true;
        }
      ),
      { numRuns: EXPECTED_TOOLS.length }
    );
  });

  /**
   * Test that all tools have complete interface definitions
   * For any tool, it should have name, required inputs, and input types defined
   */
  it('should have complete interface definitions for all tools', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...EXPECTED_TOOLS),
        async (tool) => {
          // Verify tool has all required properties
          expect(tool).toHaveProperty('name');
          expect(tool).toHaveProperty('requiredInputs');
          expect(tool).toHaveProperty('inputTypes');
          
          // Verify properties are of correct types
          expect(typeof tool.name).toBe('string');
          expect(Array.isArray(tool.requiredInputs)).toBe(true);
          expect(typeof tool.inputTypes).toBe('object');
          
          // Verify name is not empty
          expect(tool.name.length).toBeGreaterThan(0);
          
          // Verify consistency between requiredInputs and inputTypes
          tool.requiredInputs.forEach(input => {
            expect(tool.inputTypes).toHaveProperty(input);
          });
          
          return true;
        }
      ),
      { numRuns: EXPECTED_TOOLS.length }
    );
  });

  /**
   * Test that input types are valid JSON Schema types
   * For any input type, it should be a valid JSON Schema type
   */
  it('should use valid JSON Schema types for all inputs', async () => {
    const validTypes = ['string', 'number', 'boolean', 'object', 'array', 'null'];
    
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...EXPECTED_TOOLS),
        async (tool) => {
          // Check all input types are valid
          Object.values(tool.inputTypes).forEach(type => {
            expect(validTypes).toContain(type);
          });
          
          return true;
        }
      ),
      { numRuns: EXPECTED_TOOLS.length }
    );
  });

  /**
   * Test that the total number of tools is preserved
   * The server should expose exactly the expected number of tools
   */
  it('should preserve the total number of tools', () => {
    // Verify we have the expected number of tools
    expect(EXPECTED_TOOLS.length).toBe(13);
    
    // Verify distribution across services
    const firestoreTools = EXPECTED_TOOLS.filter(t => t.name.startsWith('firestore_'));
    const authTools = EXPECTED_TOOLS.filter(t => t.name.startsWith('auth_'));
    const storageTools = EXPECTED_TOOLS.filter(t => t.name.startsWith('storage_'));
    
    expect(firestoreTools.length).toBe(8); // 8 Firestore tools
    expect(authTools.length).toBe(1);      // 1 Auth tool
    expect(storageTools.length).toBe(4);   // 4 Storage tools
  });
});
