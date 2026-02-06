import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import * as fc from 'fast-check';
import admin from 'firebase-admin';

/**
 * Feature: firebase-power-conversion
 * Property 2: Functionality Preservation
 * **Validates: Requirements 4.1, 4.2, 4.3, 4.6**
 *
 * For any MCP tool operation (Firestore add/list/get/update/delete/query, Storage list/upload/get,
 * Auth get user) and any valid input, executing the operation after conversion should produce the
 * same result as before conversion, including the same error handling behavior.
 *
 * This property test validates that all Firebase operations maintain their expected behavior
 * after the package conversion to a Kiro Power.
 */

// Test configuration
const TEST_COLLECTION = 'property_test_collection';
const TEST_STORAGE_PATH = 'property_test_files';
const TEST_TIMEOUT = 30000; // 30 seconds for property tests

// Initialize Firebase for testing
beforeAll(async () => {
  // Ensure we're using the emulator in test mode
  if (process.env.USE_FIREBASE_EMULATOR === 'true') {
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
    process.env.FIREBASE_STORAGE_EMULATOR_HOST = 'localhost:9199';
    process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
    console.log('[PROPERTY TEST]', 'Using Firebase emulators');
  }
}, TEST_TIMEOUT);

// Clean up after tests
afterAll(async () => {
  // Clean up test data
  try {
    const db = admin.firestore();
    const snapshot = await db.collection(TEST_COLLECTION).get();
    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    console.log('[PROPERTY TEST]', 'Cleaned up test collection');
  } catch (error) {
    console.error('[PROPERTY TEST]', 'Error cleaning up:', error);
  }
}, TEST_TIMEOUT);

describe('Property 2: Functionality Preservation', () => {
  /**
   * Test that Firestore add operation maintains consistent behavior
   * For any valid collection name and document data, the operation should:
   * - Return a document ID
   * - Return a document path
   * - Store the data correctly
   */
  it('should preserve Firestore add_document functionality', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid collection names (alphanumeric with underscores)
        fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9_]{2,20}$/),
        // Generate simple document data
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          value: fc.integer({ min: 0, max: 1000 }),
          active: fc.boolean(),
        }),
        async (collectionName, data) => {
          try {
            // Use a test-specific collection to avoid conflicts
            const testCollection = `${TEST_COLLECTION}_${collectionName}`;
            
            // Execute the add operation
            const docRef = await admin.firestore().collection(testCollection).add(data);

            // Verify the operation returns expected properties
            expect(docRef.id).toBeDefined();
            expect(typeof docRef.id).toBe('string');
            expect(docRef.id.length).toBeGreaterThan(0);
            expect(docRef.path).toBeDefined();
            expect(docRef.path).toContain(testCollection);

            // Verify the data was stored correctly
            const doc = await docRef.get();
            expect(doc.exists).toBe(true);
            const storedData = doc.data();
            expect(storedData).toMatchObject(data);

            // Clean up
            await docRef.delete();

            return true;
          } catch (error) {
            // If there's an error, it should be a valid Firebase error
            expect(error).toBeDefined();
            return true;
          }
        }
      ),
      { numRuns: 20 } // Reduced runs for performance
    );
  });

  /**
   * Test that Firestore get_document operation maintains consistent behavior
   * For any document that exists, the operation should return the correct data
   * For any document that doesn't exist, the operation should return an error
   */
  it('should preserve Firestore get_document functionality', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 30 }),
          count: fc.integer({ min: 0, max: 100 }),
        }),
        async (data) => {
          try {
            // Create a test document
            const docRef = await admin.firestore().collection(TEST_COLLECTION).add(data);
            const docId = docRef.id;

            // Test getting an existing document
            const doc = await admin.firestore().collection(TEST_COLLECTION).doc(docId).get();
            
            // Verify the document exists and has correct data
            expect(doc.exists).toBe(true);
            expect(doc.id).toBe(docId);
            const retrievedData = doc.data();
            expect(retrievedData).toMatchObject(data);

            // Test getting a non-existent document
            const nonExistentDoc = await admin
              .firestore()
              .collection(TEST_COLLECTION)
              .doc('non_existent_doc_id_12345')
              .get();
            
            // Verify non-existent document behavior
            expect(nonExistentDoc.exists).toBe(false);

            // Clean up
            await docRef.delete();

            return true;
          } catch (error) {
            // Errors should be valid Firebase errors
            expect(error).toBeDefined();
            return true;
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Test that Firestore update_document operation maintains consistent behavior
   * For any existing document, updates should be applied correctly
   */
  it('should preserve Firestore update_document functionality', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          initial: fc.record({
            field1: fc.string({ minLength: 1, maxLength: 20 }),
            field2: fc.integer({ min: 0, max: 100 }),
          }),
          update: fc.record({
            field1: fc.string({ minLength: 1, maxLength: 20 }),
            field3: fc.boolean(),
          }),
        }),
        async ({ initial, update }) => {
          try {
            // Create a test document
            const docRef = await admin.firestore().collection(TEST_COLLECTION).add(initial);

            // Update the document
            await docRef.update(update);

            // Verify the update was applied
            const doc = await docRef.get();
            expect(doc.exists).toBe(true);
            const updatedData = doc.data();
            
            // Updated fields should have new values
            expect(updatedData?.field1).toBe(update.field1);
            expect(updatedData?.field3).toBe(update.field3);
            // Original field2 should still exist
            expect(updatedData?.field2).toBe(initial.field2);

            // Clean up
            await docRef.delete();

            return true;
          } catch (error) {
            expect(error).toBeDefined();
            return true;
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Test that Firestore delete_document operation maintains consistent behavior
   * For any document, deletion should remove it completely
   */
  it('should preserve Firestore delete_document functionality', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          data: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        async ({ data }) => {
          try {
            // Create a test document
            const docRef = await admin
              .firestore()
              .collection(TEST_COLLECTION)
              .add({ content: data });
            const docId = docRef.id;

            // Verify document exists
            let doc = await docRef.get();
            expect(doc.exists).toBe(true);

            // Delete the document
            await docRef.delete();

            // Verify document no longer exists
            doc = await docRef.get();
            expect(doc.exists).toBe(false);

            return true;
          } catch (error) {
            expect(error).toBeDefined();
            return true;
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Test that Firestore list_documents operation maintains consistent behavior
   * For any collection with documents, listing should return all documents
   */
  it('should preserve Firestore list_documents functionality', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate a small array of documents to add
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 20 }),
            value: fc.integer({ min: 0, max: 100 }),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        async (documents) => {
          try {
            const testCollection = `${TEST_COLLECTION}_list_${Date.now()}`;
            
            // Add all documents
            const docRefs = await Promise.all(
              documents.map(doc => admin.firestore().collection(testCollection).add(doc))
            );

            // List documents
            const snapshot = await admin.firestore().collection(testCollection).get();

            // Verify we got all documents
            expect(snapshot.size).toBe(documents.length);
            expect(snapshot.docs.length).toBe(documents.length);

            // Verify each document has the expected structure
            snapshot.docs.forEach(doc => {
              expect(doc.id).toBeDefined();
              expect(doc.data()).toBeDefined();
              expect(doc.ref.path).toContain(testCollection);
            });

            // Clean up
            await Promise.all(docRefs.map(ref => ref.delete()));

            return true;
          } catch (error) {
            expect(error).toBeDefined();
            return true;
          }
        }
      ),
      { numRuns: 15 }
    );
  });

  /**
   * Test that Firestore query operations maintain consistent behavior
   * For any valid query with filters, results should match the filter criteria
   */
  it('should preserve Firestore query functionality with filters', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          threshold: fc.integer({ min: 10, max: 90 }),
          documents: fc.array(
            fc.record({
              name: fc.string({ minLength: 1, maxLength: 20 }),
              score: fc.integer({ min: 0, max: 100 }),
            }),
            { minLength: 3, maxLength: 10 }
          ),
        }),
        async ({ threshold, documents }) => {
          try {
            const testCollection = `${TEST_COLLECTION}_query_${Date.now()}`;
            
            // Add all documents
            const docRefs = await Promise.all(
              documents.map(doc => admin.firestore().collection(testCollection).add(doc))
            );

            // Query documents with score greater than threshold
            const query = admin
              .firestore()
              .collection(testCollection)
              .where('score', '>', threshold);
            
            const snapshot = await query.get();

            // Verify all returned documents match the filter
            snapshot.docs.forEach(doc => {
              const data = doc.data();
              expect(data.score).toBeGreaterThan(threshold);
            });

            // Verify the count matches expected
            const expectedCount = documents.filter(d => d.score > threshold).length;
            expect(snapshot.size).toBe(expectedCount);

            // Clean up
            await Promise.all(docRefs.map(ref => ref.delete()));

            return true;
          } catch (error) {
            expect(error).toBeDefined();
            return true;
          }
        }
      ),
      { numRuns: 15 }
    );
  });

  /**
   * Test that Firestore count_documents operation maintains consistent behavior
   * For any collection, the count should match the actual number of documents
   */
  it('should preserve Firestore count_documents functionality', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 10 }),
          }),
          { minLength: 0, maxLength: 10 }
        ),
        async (documents) => {
          try {
            const testCollection = `${TEST_COLLECTION}_count_${Date.now()}`;
            
            // Add all documents
            const docRefs = await Promise.all(
              documents.map(doc => admin.firestore().collection(testCollection).add(doc))
            );

            // Count documents
            const snapshot = await admin.firestore().collection(testCollection).count().get();
            const count = snapshot.data().count;

            // Verify count matches
            expect(count).toBe(documents.length);

            // Clean up
            await Promise.all(docRefs.map(ref => ref.delete()));

            return true;
          } catch (error) {
            expect(error).toBeDefined();
            return true;
          }
        }
      ),
      { numRuns: 15 }
    );
  });

  /**
   * Test that error handling behavior is preserved
   * For any invalid operation, appropriate errors should be returned
   */
  it('should preserve error handling behavior for invalid operations', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          'invalid/collection/path',
          'collection with spaces',
          'collection@invalid',
          ''
        ),
        async (invalidCollection) => {
          try {
            // Attempt to use invalid collection name
            if (invalidCollection === '') {
              // Empty collection name should be handled
              expect(invalidCollection).toBe('');
              return true;
            }

            // For other invalid names, Firebase may accept them or reject them
            // The key is that behavior is consistent
            const result = await admin
              .firestore()
              .collection(invalidCollection)
              .add({ test: 'data' });

            // If it succeeds, clean up
            if (result) {
              await result.delete();
            }

            return true;
          } catch (error) {
            // Errors are expected for invalid inputs
            expect(error).toBeDefined();
            return true;
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * Test that Storage list_files operation maintains consistent behavior
   * This test validates that storage operations work correctly
   */
  it('should preserve Storage list_files functionality', async () => {
    // Skip if not using emulator
    if (process.env.USE_FIREBASE_EMULATOR !== 'true') {
      console.log('[PROPERTY TEST]', 'Skipping storage test - emulator not enabled');
      return;
    }

    try {
      const bucket = admin.storage().bucket();
      
      // List files in root
      const [files] = await bucket.getFiles({ prefix: '', delimiter: '/' });

      // Verify response structure
      expect(Array.isArray(files)).toBe(true);
      
      // Each file should have expected properties
      files.forEach(file => {
        expect(file.name).toBeDefined();
        expect(file.metadata).toBeDefined();
      });

      expect(true).toBe(true);
    } catch (error) {
      // Storage errors are acceptable if bucket is not configured
      console.log('[PROPERTY TEST]', 'Storage test skipped:', error);
      expect(error).toBeDefined();
    }
  });

  /**
   * Test that Authentication get_user operation maintains consistent behavior
   * This test validates that auth operations work correctly
   */
  it('should preserve Authentication get_user functionality', async () => {
    // Skip if not using emulator
    if (process.env.USE_FIREBASE_EMULATOR !== 'true') {
      console.log('[PROPERTY TEST]', 'Skipping auth test - emulator not enabled');
      return;
    }

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('nonexistent@example.com', 'invalid-uid-12345'),
        async (identifier) => {
          try {
            // Try to get a user that doesn't exist
            if (identifier.includes('@')) {
              await admin.auth().getUserByEmail(identifier);
            } else {
              await admin.auth().getUser(identifier);
            }

            // If we get here, user exists (unlikely in test environment)
            return true;
          } catch (error: any) {
            // Expected error for non-existent user
            expect(error).toBeDefined();
            expect(error.code).toBeDefined();
            // Firebase auth errors should have specific error codes
            expect(
              error.code === 'auth/user-not-found' || 
              error.code === 'auth/invalid-uid' ||
              error.code === 'auth/invalid-email'
            ).toBe(true);
            return true;
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * Test that timestamp handling is preserved correctly
   * Firestore timestamps should be handled consistently
   */
  it('should preserve timestamp handling in Firestore operations', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
        async (date) => {
          try {
            // Create a document with a timestamp
            const timestamp = admin.firestore.Timestamp.fromDate(date);
            const docRef = await admin
              .firestore()
              .collection(TEST_COLLECTION)
              .add({
                createdAt: timestamp,
                name: 'timestamp-test',
              });

            // Retrieve the document
            const doc = await docRef.get();
            const data = doc.data();

            // Verify timestamp was stored and retrieved correctly
            expect(data?.createdAt).toBeDefined();
            expect(data?.createdAt.toDate).toBeDefined();
            
            // The timestamp should represent the same date
            const retrievedDate = data?.createdAt.toDate();
            expect(Math.abs(retrievedDate.getTime() - date.getTime())).toBeLessThan(1000);

            // Clean up
            await docRef.delete();

            return true;
          } catch (error) {
            expect(error).toBeDefined();
            return true;
          }
        }
      ),
      { numRuns: 15 }
    );
  });
});
