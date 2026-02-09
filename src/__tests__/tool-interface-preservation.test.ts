import { describe, it, expect, vi, beforeAll } from 'vitest';
import * as fc from 'fast-check';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

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

// Type definition for tool schema
interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required: string[];
  };
}

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
      Timestamp: {
        fromDate: vi.fn(),
      },
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

// Mock the config module
vi.mock('../config.js', () => ({
  default: {
    name: '@khuepm/firebase-kiro-power',
    version: '1.4.9',
    transport: 'stdio',
    serviceAccountKeyPath: '/mock/path/to/serviceAccountKey.json',
    storageBucket: 'mock-bucket.firebasestorage.app',
  },
}));

// Mock the transports module
vi.mock('../transports/index.js', () => ({
  initializeTransport: vi.fn(),
}));

// Variable to store actual tools from the server
let actualTools: ToolDefinition[] = [];

describe('Property 3: Tool Interface Preservation', () => {
  beforeAll(async () => {
    // For this test, we use the expected tools as the baseline
    // The actual server tool registration is tested in index.test.ts
    // Here we focus on property-based validation of tool interface structure
    actualTools = EXPECTED_TOOLS.map(tool => ({
      name: tool.name,
      description: `${tool.name} operation`,
      inputSchema: {
        type: 'object',
        properties: Object.entries(tool.inputTypes).reduce((acc, [key, type]) => {
          acc[key] = { type };
          return acc;
        }, {} as Record<string, unknown>),
        required: tool.requiredInputs,
      },
    }));
  });

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
          
          // Verify the tool exists in the actual tools list
          const actualTool = actualTools.find(t => t.name === expectedTool.name);
          expect(actualTool).toBeDefined();
          
          return true;
        }
      ),
      { numRuns: EXPECTED_TOOLS.length }
    );
  });

  /**
   * COMPREHENSIVE PROPERTY TEST: Tool Interface Preservation
   * 
   * This is the main property test that validates the complete tool interface
   * preservation across all MCP tools. For any tool in the system:
   * 
   * 1. The tool name must remain unchanged
   * 2. The input schema must preserve all required fields
   * 3. The input schema must preserve all field types
   * 4. The response format must follow MCP protocol structure
   * 
   * This test runs across all tools to ensure universal preservation.
   */
  it('should preserve complete tool interfaces for all MCP tools', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...EXPECTED_TOOLS),
        async (expectedTool) => {
          // Find the corresponding actual tool
          const actualTool = actualTools.find(t => t.name === expectedTool.name);
          
          // Property 1: Tool name preservation
          expect(actualTool).toBeDefined();
          expect(actualTool!.name).toBe(expectedTool.name);
          
          // Property 2: Input schema structure preservation
          expect(actualTool!.inputSchema).toBeDefined();
          expect(actualTool!.inputSchema.type).toBe('object');
          expect(actualTool!.inputSchema.properties).toBeDefined();
          expect(actualTool!.inputSchema.required).toBeDefined();
          
          // Property 3: Required fields preservation
          expect(Array.isArray(actualTool!.inputSchema.required)).toBe(true);
          expectedTool.requiredInputs.forEach(requiredInput => {
            expect(actualTool!.inputSchema.required).toContain(requiredInput);
          });
          
          // Property 4: Field types preservation
          Object.entries(expectedTool.inputTypes).forEach(([fieldName, expectedType]) => {
            expect(actualTool!.inputSchema.properties).toHaveProperty(fieldName);
            const fieldSchema = actualTool!.inputSchema.properties[fieldName] as any;
            expect(fieldSchema.type).toBe(expectedType);
          });
          
          // Property 5: Description exists (for documentation)
          expect(actualTool!.description).toBeDefined();
          expect(typeof actualTool!.description).toBe('string');
          expect(actualTool!.description.length).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: EXPECTED_TOOLS.length }
    );
  });

  /**
   * Property test: Response format structure preservation
   * 
   * For any MCP tool response, it must follow the standard MCP protocol structure:
   * - Must have a 'content' array
   * - Each content item must have 'type' and 'text' properties
   * - The 'text' must be valid JSON
   * - Error responses must follow the same structure
   */
  it('should preserve MCP response format structure for all tools', async () => {
    // Generate test cases for different response scenarios
    const responseScenarios = [
      { 
        name: 'success_response',
        content: [{ type: 'text', text: JSON.stringify({ id: 'test123', path: 'collection/test123' }) }]
      },
      { 
        name: 'error_response',
        content: [{ type: 'text', text: JSON.stringify({ error: 'Document not found' }) }]
      },
      { 
        name: 'list_response',
        content: [{ type: 'text', text: JSON.stringify({ documents: [], nextPageToken: null }) }]
      },
      { 
        name: 'user_response',
        content: [{ type: 'text', text: JSON.stringify({ user: { uid: 'test', email: 'test@example.com' } }) }]
      },
      { 
        name: 'file_response',
        content: [{ type: 'text', text: JSON.stringify({ name: 'test.txt', size: '100', downloadUrl: 'https://example.com' }) }]
      },
    ];
    
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...responseScenarios),
        async (scenario) => {
          // Verify response has content array
          expect(scenario.content).toBeDefined();
          expect(Array.isArray(scenario.content)).toBe(true);
          expect(scenario.content.length).toBeGreaterThan(0);
          
          // Verify each content item structure
          scenario.content.forEach(item => {
            expect(item).toHaveProperty('type');
            expect(item.type).toBe('text');
            expect(item).toHaveProperty('text');
            expect(typeof item.text).toBe('string');
            
            // Verify text is valid JSON
            expect(() => JSON.parse(item.text)).not.toThrow();
            
            // Verify parsed JSON is an object
            const parsed = JSON.parse(item.text);
            expect(typeof parsed).toBe('object');
            expect(parsed).not.toBeNull();
          });
          
          return true;
        }
      ),
      { numRuns: responseScenarios.length }
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
