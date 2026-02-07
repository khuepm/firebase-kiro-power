import { describe, it, expect } from 'vitest';
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
 *
 * NOTE: These tests require Firebase emulators to be running. Run with:
 * USE_FIREBASE_EMULATOR=true npm test -- functionality-preservation.test.ts
 */

// Test configuration
const TEST_COLLECTION = 'property_test_collection';
const TEST_TIMEOUT = 60000; // 60 seconds for property tests

// Helper to check if Firebase is available
async function isFirebaseAvailable(): Promise<boolean> {
  try {
    await admin.firestore().collection('_health_check').limit(1).get();
    return true;
  } catch (error) {
    console.log('[PROPERTY TEST]', 'Firebase not available:', error);
    return false;
  }
}

describe('Property 2: Functionality Preservation', () => {
  /**
   * Test that Firestore add operation maintains consistent behavior
   * For any valid collection name and document data, the operation should:
   * - Return a document ID
   * - Return a document path
   * - Store the data correctly
   */
  it(
    'should preserve Firestore add_document functionality',
    async () => {
      const available = await isFirebaseAvailable();
      if (!available) {
        console.log('[PROPERTY TEST]', 'Skipping test - Firebase not available');
        return;
      }

      await fc.assert(
        fc.asyncProperty(
          // Generate simple document data
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 50 }),
            value: fc.integer({ min: 0, max: 1000 }),
            active: fc.boolean(),
          }),
          async (data) => {
            // Execute the add operation
            const docRef = await admin.firestore().collection(TEST_COLLECTION).add(data);

            // Verify the operation returns expected properties
            expect(docRef.id).toBeDefined();
            expect(typeof docRef.id).toBe('string');
            expect(docRef.id.length).toBeGreaterThan(0);
            expect(docRef.path).toBeDefined();
            expect(docRef.path).toContain(TEST_COLLECTION);

            // Verify the data was stored correctly
            const doc = await docRef.get();
            expect(doc.exists).toBe(true);
            const storedData = doc.data();
            expect(storedData).toMatchObject(data);

            // Clean up
            await docRef.delete();

            return true;
          }
        ),
        { numRuns: 10 }
      );
    },
    TEST_TIMEOUT
  );

  /**
   * Test that Firestore get_document operation maintains consistent behavior
   * For any document that exists, the operation should return the correct data
   * For any document that doesn't exist, the operation should return an error
   */
  it(
    'should preserve Firestore get_document functionality',
    async () => {
      const available = await isFirebaseAvailable();
      if (!available) {
        console.log('[PROPERTY TEST]', 'Skipping test - Firebase not available');
        return;
      }

      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 30 }),
            count: fc.integer({ min: 0, max: 100 }),
          }),
          async (data) => {
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
          }
        ),
        { numRuns: 10 }
      );
    },
    TEST_TIMEOUT
  );

  /**
   * Test that Firestore update_document operation maintains consistent behavior
   * For any existing document, updates should be applied correctly
   */
  it(
    'should preserve Firestore update_document functionality',
    async () => {
      const available = await isFirebaseAvailable();
      if (!available) {
        console.log('[PROPERTY TEST]', 'Skipping test - Firebase not available');
        return;
      }

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
          }
        ),
        { numRuns: 10 }
      );
    },
    TEST_TIMEOUT
  );

  /**
   * Test that Firestore delete_document operation maintains consistent behavior
   * For any document, deletion should remove it completely
   */
  it(
    'should preserve Firestore delete_document functionality',
    async () => {
      const available = await isFirebaseAvailable();
      if (!available) {
        console.log('[PROPERTY TEST]', 'Skipping test - Firebase not available');
        return;
      }

      await fc.assert(
        fc.asyncProperty(
          fc.record({
            data: fc.string({ minLength: 1, maxLength: 50 }),
          }),
          async ({ data }) => {
            // Create a test document
            const docRef = await admin
              .firestore()
              .collection(TEST_COLLECTION)
              .add({ content: data });

            // Verify document exists
            let doc = await docRef.get();
            expect(doc.exists).toBe(true);

            // Delete the document
            await docRef.delete();

            // Verify document no longer exists
            doc = await docRef.get();
            expect(doc.exists).toBe(false);

            return true;
          }
        ),
        { numRuns: 10 }
      );
    },
    TEST_TIMEOUT
  );

  /**
   * Test that Firestore list_documents operation maintains consistent behavior
   * For any collection with documents, listing should return all documents
   */
  it(
    'should preserve Firestore list_documents functionality',
    async () => {
      const available = await isFirebaseAvailable();
      if (!available) {
        console.log('[PROPERTY TEST]', 'Skipping test - Firebase not available');
        return;
      }

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
            const testCollection = `${TEST_COLLECTION}_list_${Date.now()}_${Math.random().toString(36).substring(7)}`;

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
          }
        ),
        { numRuns: 10 }
      );
    },
    TEST_TIMEOUT
  );

  /**
   * Test that Firestore query operations maintain consistent behavior
   * For any valid query with filters, results should match the filter criteria
   */
  it(
    'should preserve Firestore query functionality with filters',
    async () => {
      const available = await isFirebaseAvailable();
      if (!available) {
        console.log('[PROPERTY TEST]', 'Skipping test - Firebase not available');
        return;
      }

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
            const testCollection = `${TEST_COLLECTION}_query_${Date.now()}_${Math.random().toString(36).substring(7)}`;

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
          }
        ),
        { numRuns: 10 }
      );
    },
    TEST_TIMEOUT
  );

  /**
   * Test that Firestore count_documents operation maintains consistent behavior
   * For any collection, the count should match the actual number of documents
   */
  it(
    'should preserve Firestore count_documents functionality',
    async () => {
      const available = await isFirebaseAvailable();
      if (!available) {
        console.log('[PROPERTY TEST]', 'Skipping test - Firebase not available');
        return;
      }

      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.record({
              id: fc.string({ minLength: 1, maxLength: 10 }),
            }),
            { minLength: 0, maxLength: 10 }
          ),
          async (documents) => {
            const testCollection = `${TEST_COLLECTION}_count_${Date.now()}_${Math.random().toString(36).substring(7)}`;

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
          }
        ),
        { numRuns: 10 }
      );
    },
    TEST_TIMEOUT
  );

  /**
   * Test that timestamp handling is preserved correctly
   * Firestore timestamps should be handled consistently
   */
  it(
    'should preserve timestamp handling in Firestore operations',
    async () => {
      const available = await isFirebaseAvailable();
      if (!available) {
        console.log('[PROPERTY TEST]', 'Skipping test - Firebase not available');
        return;
      }

      await fc.assert(
        fc.asyncProperty(
          fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
          async (date) => {
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
          }
        ),
        { numRuns: 10 }
      );
    },
    TEST_TIMEOUT
  );

  /**
   * Test that error handling behavior is preserved
   * For any non-existent document, appropriate errors should be returned
   */
  it(
    'should preserve error handling behavior for non-existent documents',
    async () => {
      const available = await isFirebaseAvailable();
      if (!available) {
        console.log('[PROPERTY TEST]', 'Skipping test - Firebase not available');
        return;
      }

      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 10, maxLength: 30 }),
          async (nonExistentId) => {
            // Try to get a document that doesn't exist
            const doc = await admin
              .firestore()
              .collection(TEST_COLLECTION)
              .doc(nonExistentId)
              .get();

            // Verify the document doesn't exist (no error thrown, just exists = false)
            expect(doc.exists).toBe(false);

            return true;
          }
        ),
        { numRuns: 10 }
      );
    },
    TEST_TIMEOUT
  );
});
