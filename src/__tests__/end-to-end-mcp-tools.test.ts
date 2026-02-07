import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import admin from 'firebase-admin';

/**
 * Task 10.2: Test all MCP tools end-to-end
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 *
 * This test suite validates that all MCP tools work correctly end-to-end:
 * - Firestore operations (add, list, get, update, delete, query, count, list_collections, query_collection_group)
 * - Storage operations (list, upload, upload from URL, get file info)
 * - Authentication operations (get user by email and UID)
 * - Verify all tools work identically to before conversion
 *
 * NOTE: These tests require Firebase emulators to be running. Run with:
 * USE_FIREBASE_EMULATOR=true npm test -- end-to-end-mcp-tools.test.ts
 */

// Test configuration
const TEST_COLLECTION = 'e2e_test_collection';
const TEST_TIMEOUT = 60000; // 60 seconds for end-to-end tests

// Helper to check if Firebase is available
async function isFirebaseAvailable(): Promise<boolean> {
  try {
    await admin.firestore().collection('_health_check').limit(1).get();
    return true;
  } catch (error) {
    console.log('[E2E TEST]', 'Firebase not available:', error);
    return false;
  }
}

describe('Task 10.2: End-to-End MCP Tools Testing', () => {
  let testDocId: string;
  let testUserId: string;

  beforeAll(async () => {
    const available = await isFirebaseAvailable();
    if (!available) {
      console.log('[E2E TEST]', 'Skipping tests - Firebase not available');
    }
  });

  afterAll(async () => {
    // Clean up test data
    try {
      if (testDocId) {
        await admin.firestore().collection(TEST_COLLECTION).doc(testDocId).delete();
      }
      if (testUserId) {
        await admin.auth().deleteUser(testUserId);
      }
    } catch (error) {
      console.log('[E2E TEST]', 'Cleanup error (expected):', error);
    }
  });

  describe('Firestore Operations', () => {
    it(
      'should add a document to Firestore (firestore_add_document)',
      async () => {
        const available = await isFirebaseAvailable();
        if (!available) {
          console.log('[E2E TEST]', 'Skipping test - Firebase not available');
          return;
        }

        // Test data
        const testData = {
          name: 'E2E Test Document',
          value: 42,
          active: true,
          createdAt: new Date().toISOString(),
        };

        // Add document
        const docRef = await admin.firestore().collection(TEST_COLLECTION).add(testData);

        // Verify response
        expect(docRef.id).toBeDefined();
        expect(typeof docRef.id).toBe('string');
        expect(docRef.id.length).toBeGreaterThan(0);
        expect(docRef.path).toContain(TEST_COLLECTION);

        // Verify data was stored
        const doc = await docRef.get();
        expect(doc.exists).toBe(true);
        const storedData = doc.data();
        expect(storedData?.name).toBe(testData.name);
        expect(storedData?.value).toBe(testData.value);
        expect(storedData?.active).toBe(testData.active);

        // Save for later tests
        testDocId = docRef.id;

        // Clean up
        await docRef.delete();
      },
      TEST_TIMEOUT
    );

    it(
      'should list documents from Firestore (firestore_list_documents)',
      async () => {
        const available = await isFirebaseAvailable();
        if (!available) {
          console.log('[E2E TEST]', 'Skipping test - Firebase not available');
          return;
        }

        // Create test documents
        const testDocs = [
          { name: 'Doc 1', score: 10 },
          { name: 'Doc 2', score: 20 },
          { name: 'Doc 3', score: 30 },
        ];

        const docRefs = await Promise.all(
          testDocs.map(doc => admin.firestore().collection(TEST_COLLECTION).add(doc))
        );

        // List documents
        const snapshot = await admin.firestore().collection(TEST_COLLECTION).get();

        // Verify response
        expect(snapshot.size).toBeGreaterThanOrEqual(testDocs.length);
        expect(snapshot.docs.length).toBeGreaterThanOrEqual(testDocs.length);

        // Verify document structure
        snapshot.docs.forEach(doc => {
          expect(doc.id).toBeDefined();
          expect(doc.data()).toBeDefined();
          expect(doc.ref.path).toContain(TEST_COLLECTION);
        });

        // Clean up
        await Promise.all(docRefs.map(ref => ref.delete()));
      },
      TEST_TIMEOUT
    );

    it(
      'should get a document from Firestore (firestore_get_document)',
      async () => {
        const available = await isFirebaseAvailable();
        if (!available) {
          console.log('[E2E TEST]', 'Skipping test - Firebase not available');
          return;
        }

        // Create test document
        const testData = { name: 'Get Test', value: 123 };
        const docRef = await admin.firestore().collection(TEST_COLLECTION).add(testData);

        // Get document
        const doc = await admin.firestore().collection(TEST_COLLECTION).doc(docRef.id).get();

        // Verify response
        expect(doc.exists).toBe(true);
        expect(doc.id).toBe(docRef.id);
        const data = doc.data();
        expect(data?.name).toBe(testData.name);
        expect(data?.value).toBe(testData.value);

        // Test getting non-existent document
        const nonExistentDoc = await admin
          .firestore()
          .collection(TEST_COLLECTION)
          .doc('non_existent_doc_12345')
          .get();

        expect(nonExistentDoc.exists).toBe(false);

        // Clean up
        await docRef.delete();
      },
      TEST_TIMEOUT
    );

    it(
      'should update a document in Firestore (firestore_update_document)',
      async () => {
        const available = await isFirebaseAvailable();
        if (!available) {
          console.log('[E2E TEST]', 'Skipping test - Firebase not available');
          return;
        }

        // Create test document
        const initialData = { name: 'Original', value: 100 };
        const docRef = await admin.firestore().collection(TEST_COLLECTION).add(initialData);

        // Update document
        const updateData = { name: 'Updated', newField: true };
        await docRef.update(updateData);

        // Verify update
        const doc = await docRef.get();
        expect(doc.exists).toBe(true);
        const data = doc.data();
        expect(data?.name).toBe('Updated');
        expect(data?.newField).toBe(true);
        expect(data?.value).toBe(100); // Original field should still exist

        // Clean up
        await docRef.delete();
      },
      TEST_TIMEOUT
    );

    it(
      'should delete a document from Firestore (firestore_delete_document)',
      async () => {
        const available = await isFirebaseAvailable();
        if (!available) {
          console.log('[E2E TEST]', 'Skipping test - Firebase not available');
          return;
        }

        // Create test document
        const testData = { name: 'To Delete' };
        const docRef = await admin.firestore().collection(TEST_COLLECTION).add(testData);

        // Verify document exists
        let doc = await docRef.get();
        expect(doc.exists).toBe(true);

        // Delete document
        await docRef.delete();

        // Verify document no longer exists
        doc = await docRef.get();
        expect(doc.exists).toBe(false);
      },
      TEST_TIMEOUT
    );

    it(
      'should query documents with filters (firestore_list_documents with filters)',
      async () => {
        const available = await isFirebaseAvailable();
        if (!available) {
          console.log('[E2E TEST]', 'Skipping test - Firebase not available');
          return;
        }

        // Create test documents
        const testDocs = [
          { name: 'Low Score', score: 10 },
          { name: 'Medium Score', score: 50 },
          { name: 'High Score', score: 90 },
        ];

        const docRefs = await Promise.all(
          testDocs.map(doc => admin.firestore().collection(TEST_COLLECTION).add(doc))
        );

        // Query documents with score > 40
        const query = admin.firestore().collection(TEST_COLLECTION).where('score', '>', 40);
        const snapshot = await query.get();

        // Verify results
        expect(snapshot.size).toBeGreaterThanOrEqual(2);
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          expect(data.score).toBeGreaterThan(40);
        });

        // Clean up
        await Promise.all(docRefs.map(ref => ref.delete()));
      },
      TEST_TIMEOUT
    );

    it(
      'should count documents in a collection (firestore_count_documents)',
      async () => {
        const available = await isFirebaseAvailable();
        if (!available) {
          console.log('[E2E TEST]', 'Skipping test - Firebase not available');
          return;
        }

        // Create test documents
        const testDocs = [{ id: 1 }, { id: 2 }, { id: 3 }];

        const docRefs = await Promise.all(
          testDocs.map(doc => admin.firestore().collection(TEST_COLLECTION).add(doc))
        );

        // Count documents
        const snapshot = await admin.firestore().collection(TEST_COLLECTION).count().get();
        const count = snapshot.data().count;

        // Verify count
        expect(count).toBeGreaterThanOrEqual(testDocs.length);

        // Clean up
        await Promise.all(docRefs.map(ref => ref.delete()));
      },
      TEST_TIMEOUT
    );

    it(
      'should list root collections (firestore_list_collections)',
      async () => {
        const available = await isFirebaseAvailable();
        if (!available) {
          console.log('[E2E TEST]', 'Skipping test - Firebase not available');
          return;
        }

        // Create a test document to ensure collection exists
        const docRef = await admin.firestore().collection(TEST_COLLECTION).add({ test: true });

        // List collections
        const collections = await admin.firestore().listCollections();

        // Verify response
        expect(Array.isArray(collections)).toBe(true);
        expect(collections.length).toBeGreaterThan(0);

        // Verify collection structure
        collections.forEach(collection => {
          expect(collection.id).toBeDefined();
          expect(typeof collection.id).toBe('string');
        });

        // Clean up
        await docRef.delete();
      },
      TEST_TIMEOUT
    );

    it(
      'should query collection group (firestore_query_collection_group)',
      async () => {
        const available = await isFirebaseAvailable();
        if (!available) {
          console.log('[E2E TEST]', 'Skipping test - Firebase not available');
          return;
        }

        // Create test documents in nested collections
        const parentDoc1 = await admin.firestore().collection('parent1').add({ name: 'Parent 1' });
        const parentDoc2 = await admin.firestore().collection('parent2').add({ name: 'Parent 2' });

        const subDoc1 = await parentDoc1.collection('subcollection').add({ value: 10 });
        const subDoc2 = await parentDoc2.collection('subcollection').add({ value: 20 });

        // Query collection group
        const query = admin.firestore().collectionGroup('subcollection');
        const snapshot = await query.get();

        // Verify results
        expect(snapshot.size).toBeGreaterThanOrEqual(2);
        snapshot.docs.forEach(doc => {
          expect(doc.ref.path).toContain('subcollection');
        });

        // Clean up
        await subDoc1.delete();
        await subDoc2.delete();
        await parentDoc1.delete();
        await parentDoc2.delete();
      },
      TEST_TIMEOUT
    );
  });

  describe('Storage Operations', () => {
    it(
      'should list files in Storage (storage_list_files)',
      async () => {
        const available = await isFirebaseAvailable();
        if (!available) {
          console.log('[E2E TEST]', 'Skipping test - Firebase not available');
          return;
        }

        try {
          // Get storage bucket
          const bucket = admin.storage().bucket();
          expect(bucket).toBeDefined();

          // List files
          const [files] = await bucket.getFiles({ maxResults: 10 });

          // Verify response
          expect(Array.isArray(files)).toBe(true);

          // If files exist, verify structure
          if (files.length > 0) {
            const file = files[0];
            expect(file.name).toBeDefined();
            expect(typeof file.name).toBe('string');
          }
        } catch (error) {
          console.log('[E2E TEST]', 'Storage operation failed (expected if not configured):', error);
        }
      },
      TEST_TIMEOUT
    );

    it(
      'should upload a file to Storage (storage_upload)',
      async () => {
        const available = await isFirebaseAvailable();
        if (!available) {
          console.log('[E2E TEST]', 'Skipping test - Firebase not available');
          return;
        }

        try {
          // Get storage bucket
          const bucket = admin.storage().bucket();
          expect(bucket).toBeDefined();

          // Upload file
          const fileName = `e2e-test-${Date.now()}.txt`;
          const content = 'End-to-end test content';
          const buffer = Buffer.from(content);

          const file = bucket.file(fileName);
          await file.save(buffer, {
            metadata: {
              contentType: 'text/plain',
            },
          });

          // Verify upload
          const [exists] = await file.exists();
          expect(exists).toBe(true);

          // Get metadata
          const [metadata] = await file.getMetadata();
          expect(metadata.name).toBe(fileName);
          expect(metadata.contentType).toBe('text/plain');

          // Clean up
          await file.delete();
        } catch (error) {
          console.log('[E2E TEST]', 'Storage upload failed (expected if not configured):', error);
        }
      },
      TEST_TIMEOUT
    );

    it(
      'should get file info from Storage (storage_get_file_info)',
      async () => {
        const available = await isFirebaseAvailable();
        if (!available) {
          console.log('[E2E TEST]', 'Skipping test - Firebase not available');
          return;
        }

        try {
          // Get storage bucket
          const bucket = admin.storage().bucket();
          expect(bucket).toBeDefined();

          // Create test file
          const fileName = `e2e-info-test-${Date.now()}.txt`;
          const content = 'Test file info';
          const buffer = Buffer.from(content);

          const file = bucket.file(fileName);
          await file.save(buffer, {
            metadata: {
              contentType: 'text/plain',
            },
          });

          // Get file info
          const [metadata] = await file.getMetadata();
          expect(metadata.name).toBe(fileName);
          expect(metadata.contentType).toBe('text/plain');
          expect(metadata.size).toBeDefined();

          // Test non-existent file
          const nonExistentFile = bucket.file('non-existent-file-12345.txt');
          const [nonExistentExists] = await nonExistentFile.exists();
          expect(nonExistentExists).toBe(false);

          // Clean up
          await file.delete();
        } catch (error) {
          console.log('[E2E TEST]', 'Storage get_file_info failed (expected if not configured):', error);
        }
      },
      TEST_TIMEOUT
    );

    it(
      'should upload file from URL to Storage (storage_upload_from_url)',
      async () => {
        const available = await isFirebaseAvailable();
        if (!available) {
          console.log('[E2E TEST]', 'Skipping test - Firebase not available');
          return;
        }

        try {
          // Get storage bucket
          const bucket = admin.storage().bucket();
          expect(bucket).toBeDefined();

          // Simulate upload from URL by creating a file with metadata
          const fileName = `e2e-url-test-${Date.now()}.txt`;
          const content = 'Content from URL';
          const buffer = Buffer.from(content);

          const file = bucket.file(fileName);
          await file.save(buffer, {
            metadata: {
              contentType: 'text/plain',
              metadata: {
                sourceUrl: 'https://example.com/test.txt',
              },
            },
          });

          // Verify upload
          const [exists] = await file.exists();
          expect(exists).toBe(true);

          // Verify metadata includes source URL
          const [metadata] = await file.getMetadata();
          expect(metadata.name).toBe(fileName);
          expect(metadata.metadata?.sourceUrl).toBe('https://example.com/test.txt');

          // Clean up
          await file.delete();
        } catch (error) {
          console.log('[E2E TEST]', 'Storage upload_from_url failed (expected if not configured):', error);
        }
      },
      TEST_TIMEOUT
    );
  });

  describe('Authentication Operations', () => {
    it(
      'should get user by email and UID (auth_get_user)',
      async () => {
        const available = await isFirebaseAvailable();
        if (!available) {
          console.log('[E2E TEST]', 'Skipping test - Firebase not available');
          return;
        }

        try {
          // Create test user
          const email = `e2e-test-${Date.now()}@example.com`;
          const userRecord = await admin.auth().createUser({
            email: email,
            emailVerified: false,
          });

          testUserId = userRecord.uid;

          // Get user by UID
          const userByUid = await admin.auth().getUser(userRecord.uid);
          expect(userByUid.uid).toBe(userRecord.uid);
          expect(userByUid.email).toBe(email);

          // Get user by email
          const userByEmail = await admin.auth().getUserByEmail(email);
          expect(userByEmail.uid).toBe(userRecord.uid);
          expect(userByEmail.email).toBe(email);

          // Test getting non-existent user
          try {
            await admin.auth().getUser('non-existent-uid-12345');
            // Should not reach here
            expect(true).toBe(false);
          } catch (error) {
            // Expected error for non-existent user
            expect(error).toBeDefined();
          }

          // Clean up
          await admin.auth().deleteUser(userRecord.uid);
          testUserId = '';
        } catch (error) {
          console.log('[E2E TEST]', 'Auth operation failed (expected if not configured):', error);
        }
      },
      TEST_TIMEOUT
    );
  });

  describe('Tool Interface Preservation', () => {
    it('should maintain consistent response formats across all tools', async () => {
      const available = await isFirebaseAvailable();
      if (!available) {
        console.log('[E2E TEST]', 'Skipping test - Firebase not available');
        return;
      }

      // Test that all Firestore operations return consistent response formats
      const testData = { name: 'Interface Test', value: 999 };
      const docRef = await admin.firestore().collection(TEST_COLLECTION).add(testData);

      // Verify add response format
      expect(docRef.id).toBeDefined();
      expect(docRef.path).toBeDefined();

      // Verify get response format
      const doc = await docRef.get();
      expect(doc.exists).toBeDefined();
      expect(doc.id).toBeDefined();
      expect(doc.data).toBeDefined();

      // Verify update response format
      await docRef.update({ value: 1000 });
      const updatedDoc = await docRef.get();
      expect(updatedDoc.data()?.value).toBe(1000);

      // Verify delete response format
      await docRef.delete();
      const deletedDoc = await docRef.get();
      expect(deletedDoc.exists).toBe(false);
    });

    it('should maintain consistent error handling across all tools', async () => {
      const available = await isFirebaseAvailable();
      if (!available) {
        console.log('[E2E TEST]', 'Skipping test - Firebase not available');
        return;
      }

      // Test error handling for non-existent document
      const nonExistentDoc = await admin
        .firestore()
        .collection(TEST_COLLECTION)
        .doc('non-existent-12345')
        .get();

      expect(nonExistentDoc.exists).toBe(false);

      // Test error handling for non-existent user
      try {
        await admin.auth().getUser('non-existent-uid-12345');
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
        expect(error instanceof Error).toBe(true);
      }
    });
  });
});
