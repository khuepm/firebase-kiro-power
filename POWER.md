# Firebase Power

> A comprehensive Kiro Power for Firebase services integration - Firestore, Storage, and Authentication

## Overview

Firebase Power enables AI assistants in Kiro IDE to work directly with Firebase services through the Model Context Protocol (MCP). This power provides seamless integration with Firebase Firestore database, Firebase Storage for file management, and Firebase Authentication for user management.

With Firebase Power, you can:
- **Manage Firestore databases**: Create, read, update, delete, and query documents across collections
- **Handle file storage**: Upload, download, list, and manage files in Firebase Storage
- **Manage users**: Retrieve and verify user information from Firebase Authentication
- **Work with real-time data**: Query and filter data with advanced Firestore capabilities
- **Automate workflows**: Integrate Firebase operations into your AI-powered development workflows

## What is a Kiro Power?

A Kiro Power is a packaged bundle of MCP servers, documentation, and configuration that extends Kiro IDE's capabilities. Powers are designed to be:
- **Easy to install**: One-click installation through Kiro's Powers panel
- **Well-documented**: Comprehensive guides and examples
- **Production-ready**: Built on stable, tested Firebase Admin SDK
- **Flexible**: Works with both Firebase production and emulator environments

Firebase Power brings enterprise-grade Firebase functionality directly into your AI assistant's toolkit, enabling sophisticated database operations, file management, and user authentication workflows.

## Features

### 🔥 Firestore Database Operations
- Add documents with auto-generated IDs
- List documents with filtering, ordering, and pagination
- Get specific documents by ID
- Update existing documents
- Delete documents
- List collections and subcollections
- Query across collection groups
- Count documents with optional filters

### 📦 Firebase Storage
- List files in directories with pagination
- Get detailed file information and metadata
- Upload files from local paths, base64 data, or plain text
- Upload files directly from external URLs
- Automatic content type detection
- Generate permanent download URLs

### 👤 Firebase Authentication
- Get user information by email or UID
- Retrieve user metadata and verification status
- Access user profile information

## Installation

### Prerequisites

Before installing Firebase Power, ensure you have:

1. **Kiro IDE installed** - Download from [Kiro website](https://kiro.ai)
2. **Firebase project** - Create one at [Firebase Console](https://console.firebase.google.com)
3. **Service account credentials** - Download from Firebase Console:
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file securely
4. **Node.js 16+** - Required for running the MCP server

### Installation Steps

1. **Open Kiro IDE**
2. **Navigate to Powers panel** (View → Powers or Cmd/Ctrl+Shift+P → "Powers")
3. **Search for "Firebase Power"**
4. **Click "Install"**
5. **Configure environment variables** (see Configuration section below)

The power will be automatically installed and ready to use with your Firebase project.

## Configuration

### Required Environment Variables

Firebase Power requires the following environment variable to function:

- **`SERVICE_ACCOUNT_KEY_PATH`** (required): Absolute path to your Firebase service account key JSON file
  - Example: `/Users/username/firebase-credentials/serviceAccountKey.json`
  - This file contains your Firebase project credentials
  - Keep this file secure and never commit it to version control

### Optional Environment Variables

- **`FIREBASE_STORAGE_BUCKET`** (optional): Your Firebase Storage bucket name
  - Example: `my-project.firebasestorage.app` or `my-project.appspot.com`
  - If not provided, the power will attempt to use the default bucket based on your project ID
  - Required for Storage operations

- **`USE_FIREBASE_EMULATOR`** (optional): Set to `true` to use Firebase Emulator Suite
  - Example: `USE_FIREBASE_EMULATOR=true`
  - Useful for local development and testing
  - Requires Firebase Emulator Suite to be running

### Kiro IDE Configuration

Add the following configuration to your Kiro Powers settings:

```json
{
  "firebase-power": {
    "command": "npx",
    "args": ["-y", "@khuepm/firebase-kiro-power"],
    "env": {
      "SERVICE_ACCOUNT_KEY_PATH": "/absolute/path/to/serviceAccountKey.json",
      "FIREBASE_STORAGE_BUCKET": "your-project.firebasestorage.app"
    }
  }
}
```

**Important**: Replace the paths and values with your actual Firebase project details.

### Configuration for Other MCP Clients

#### Claude Desktop Configuration

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "firebase": {
      "command": "npx",
      "args": ["-y", "@khuepm/firebase-kiro-power"],
      "env": {
        "SERVICE_ACCOUNT_KEY_PATH": "/absolute/path/to/serviceAccountKey.json",
        "FIREBASE_STORAGE_BUCKET": "your-project.firebasestorage.app"
      }
    }
  }
}
```

#### VS Code / Cursor

Add to your MCP settings:

```json
{
  "mcp": {
    "servers": {
      "firebase": {
        "command": "npx",
        "args": ["-y", "@khuepm/firebase-kiro-power"],
        "env": {
          "SERVICE_ACCOUNT_KEY_PATH": "/absolute/path/to/serviceAccountKey.json",
          "FIREBASE_STORAGE_BUCKET": "your-project.firebasestorage.app"
        }
      }
    }
  }
}
```

## Available Tools

### Firestore Tools

#### firestore_add_document

Add a new document to a Firestore collection with an auto-generated ID.

**Parameters:**
- `collection` (string, required): The collection path (e.g., "users", "posts/123/comments")
- `data` (object, required): The document data to store

**Returns:** Document ID and path

**Example:**
```javascript
// Add a new user
{
  "collection": "users",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00Z",
    "active": true
  }
}
```

**Special Features:**
- Automatically converts ISO date strings to Firestore Timestamps
- Supports server timestamps with `{ "__serverTimestamp": true }`
- Returns the generated document ID for reference

---

#### firestore_list_documents

List documents from a collection with advanced filtering, ordering, and pagination.

**Parameters:**
- `collection` (string, required): The collection path
- `filters` (array, optional): Array of filter conditions
  - `field` (string): Field name to filter
  - `operator` (string): Comparison operator (`==`, `>`, `<`, `>=`, `<=`, `array-contains`, `in`, `array-contains-any`)
  - `value` (any): Value to compare against
- `orderBy` (array, optional): Array of ordering specifications
  - `field` (string): Field name to order by
  - `direction` (string): Sort direction (`asc` or `desc`)
- `limit` (number, optional): Maximum documents to return (default: 20, max: 100)
- `pageToken` (string, optional): Token for pagination (from previous response)

**Returns:** Array of documents with IDs, paths, and data, plus `nextPageToken` for pagination

**Example:**
```javascript
// List active users ordered by creation date
{
  "collection": "users",
  "filters": [
    { "field": "active", "operator": "==", "value": true },
    { "field": "createdAt", "operator": ">", "value": "2024-01-01T00:00:00Z" }
  ],
  "orderBy": [
    { "field": "createdAt", "direction": "desc" }
  ],
  "limit": 10
}
```

**Pagination Example:**
```javascript
// Get next page using token from previous response
{
  "collection": "users",
  "limit": 10,
  "pageToken": "users/abc123"
}
```

---

#### firestore_get_document

Retrieve a specific document by its ID.

**Parameters:**
- `collection` (string, required): The collection path
- `id` (string, required): The document ID

**Returns:** Document data with ID and path

**Example:**
```javascript
{
  "collection": "users",
  "id": "user123"
}
```

---

#### firestore_update_document

Update an existing document in a collection. Only specified fields are updated (merge behavior).

**Parameters:**
- `collection` (string, required): The collection path
- `id` (string, required): The document ID
- `data` (object, required): Fields to update

**Returns:** Confirmation with document ID and path

**Example:**
```javascript
{
  "collection": "users",
  "id": "user123",
  "data": {
    "lastLogin": "2024-01-15T14:30:00Z",
    "loginCount": 42
  }
}
```

---

#### firestore_delete_document

Delete a document from a collection.

**Parameters:**
- `collection` (string, required): The collection path
- `id` (string, required): The document ID

**Returns:** Confirmation of deletion

**Example:**
```javascript
{
  "collection": "users",
  "id": "user123"
}
```

---

#### firestore_list_collections

List all root-level collections in your Firestore database.

**Parameters:** None required

**Returns:** Array of collection IDs, paths, and Firebase Console URLs

**Example:**
```javascript
{}
```

**Response includes:**
- Collection IDs and paths
- Direct links to Firebase Console for each collection
- Project ID information

---

#### firestore_query_collection_group

Query across all subcollections with the same name, regardless of parent document. This is powerful for searching data across multiple parent documents.

**Parameters:**
- `collectionId` (string, required): The collection ID to query (without parent path)
- `filters` (array, optional): Filter conditions (same format as `list_documents`)
- `orderBy` (array, optional): Ordering specifications (same format as `list_documents`)
- `limit` (number, optional): Maximum documents to return (default: 20, max: 100)
- `pageToken` (string, optional): Token for pagination

**Returns:** Documents from all matching subcollections with full paths

**Example:**
```javascript
// Find all comments across all posts with rating > 3
{
  "collectionId": "comments",
  "filters": [
    { "field": "rating", "operator": ">", "value": 3 }
  ],
  "orderBy": [
    { "field": "rating", "direction": "desc" }
  ],
  "limit": 20
}
```

**Note:** Collection group queries may require composite indexes. Firebase will provide an index creation link if needed.

---

#### firestore_count_documents

Count the number of documents in a collection, optionally with filters.

**Parameters:**
- `collection` (string, required): The collection path
- `filters` (array, optional): Filter conditions (same format as `list_documents`)

**Returns:** Document count

**Example:**
```javascript
// Count active users
{
  "collection": "users",
  "filters": [
    { "field": "active", "operator": "==", "value": true }
  ]
}
```

---

### Storage Tools

#### storage_list_files

List files in a Firebase Storage directory with pagination support.

**Parameters:**
- `directoryPath` (string, optional): Path to list files from (e.g., "images/", "documents/2024/")
  - If not provided, lists files from the root directory

**Returns:** Array of files with metadata (name, size, content type, updated date, download URL)

**Example:**
```javascript
// List files in images directory
{
  "directoryPath": "images/"
}

// List all files in root
{}
```

---

#### storage_get_file_info

Get detailed information about a specific file, including metadata and download URLs.

**Parameters:**
- `filePath` (string, required): The complete path to the file (e.g., "images/logo.png")

**Returns:** File metadata including:
- Name, size, content type
- Last updated timestamp
- Permanent download URL
- Temporary signed URL (15-minute expiration)
- Bucket name and path

**Example:**
```javascript
{
  "filePath": "documents/report.pdf"
}
```

---

#### storage_upload

Upload a file to Firebase Storage from various sources: local file paths, base64 data, or plain text.

**Parameters:**
- `filePath` (string, required): Destination path in Firebase Storage (e.g., "images/logo.png")
  - Tip: Use URL-friendly names (e.g., "my-document.pdf" instead of "My Document.pdf")
- `content` (string, required): File content, which can be:
  - **Local file path** (recommended): `/path/to/file.pdf` - Best for all file types, especially binary files
  - **Data URL**: `data:image/png;base64,iVBORw0...` - May have issues with large files
  - **Plain text**: Direct text content for text files
- `contentType` (string, optional): MIME type (auto-detected if not provided)
- `metadata` (object, optional): Additional custom metadata

**Returns:** File information with permanent download URL

**Example - Local File (Recommended):**
```javascript
{
  "filePath": "documents/report.pdf",
  "content": "/Users/username/Downloads/report.pdf"
}
```

**Example - Base64 Data:**
```javascript
{
  "filePath": "images/logo.png",
  "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "contentType": "image/png"
}
```

**Example - Plain Text:**
```javascript
{
  "filePath": "logs/info.txt",
  "content": "Application started successfully",
  "contentType": "text/plain"
}
```

**Important Notes:**
- Local file paths are the fastest and most reliable method
- Base64 encoding may fail for very large files due to LLM limitations
- File paths are automatically sanitized for URL compatibility
- Returns a permanent, non-expiring download URL

---

#### storage_upload_from_url

Upload a file to Firebase Storage directly from an external URL. Perfect for images, documents, or any web-accessible file.

**Parameters:**
- `filePath` (string, required): Destination path in Firebase Storage
- `url` (string, required): Source URL to download from
  - For GitHub files, use raw URLs (add `?raw=true`)
- `contentType` (string, optional): MIME type (auto-detected from URL/headers if not provided)
- `metadata` (object, optional): Additional custom metadata

**Returns:** File information with permanent download URL and source URL

**Example:**
```javascript
{
  "filePath": "images/photo.jpg",
  "url": "https://example.com/photo.jpg"
}
```

**Example - GitHub File:**
```javascript
{
  "filePath": "documents/readme.md",
  "url": "https://raw.githubusercontent.com/user/repo/main/README.md"
}
```

---

### Authentication Tools

#### auth_get_user

Retrieve user information from Firebase Authentication by email address or user ID (UID).

**Parameters:**
- `identifier` (string, required): User email address or UID
  - Automatically detects if input is email (contains '@') or UID

**Returns:** User information including:
- UID, email, email verification status
- Display name and photo URL
- Account disabled status
- Metadata (creation time, last sign-in time)

**Example - By Email:**
```javascript
{
  "identifier": "user@example.com"
}
```

**Example - By UID:**
```javascript
{
  "identifier": "abc123xyz456"
}
```

## Usage Examples

### Example 1: User Registration Workflow

```javascript
// 1. Add a new user to Firestore
firestore_add_document({
  "collection": "users",
  "data": {
    "email": "newuser@example.com",
    "name": "Jane Smith",
    "role": "member",
    "createdAt": "2024-01-15T10:00:00Z",
    "active": true
  }
})

// 2. Verify the user exists in Firebase Auth
auth_get_user({
  "identifier": "newuser@example.com"
})

// 3. Upload user's profile picture
storage_upload({
  "filePath": "profiles/newuser-avatar.jpg",
  "content": "/path/to/avatar.jpg"
})
```

### Example 2: Content Management

```javascript
// 1. List all blog posts
firestore_list_documents({
  "collection": "posts",
  "filters": [
    { "field": "published", "operator": "==", "value": true }
  ],
  "orderBy": [
    { "field": "publishedAt", "direction": "desc" }
  ],
  "limit": 10
})

// 2. Get a specific post
firestore_get_document({
  "collection": "posts",
  "id": "post123"
})

// 3. Update post view count
firestore_update_document({
  "collection": "posts",
  "id": "post123",
  "data": {
    "views": 150,
    "lastViewed": "2024-01-15T14:30:00Z"
  }
})
```

### Example 3: File Management

```javascript
// 1. Upload a document from URL
storage_upload_from_url({
  "filePath": "documents/annual-report-2024.pdf",
  "url": "https://example.com/reports/2024.pdf"
})

// 2. List all documents
storage_list_files({
  "directoryPath": "documents/"
})

// 3. Get file information and download URL
storage_get_file_info({
  "filePath": "documents/annual-report-2024.pdf"
})
```

### Example 4: Advanced Querying

```javascript
// Query all comments across all posts with high ratings
firestore_query_collection_group({
  "collectionId": "comments",
  "filters": [
    { "field": "rating", "operator": ">=", "value": 4 },
    { "field": "approved", "operator": "==", "value": true }
  ],
  "orderBy": [
    { "field": "rating", "direction": "desc" },
    { "field": "createdAt", "direction": "desc" }
  ],
  "limit": 20
})
```

### Example 5: Data Analytics

```javascript
// Count active users by status
firestore_count_documents({
  "collection": "users",
  "filters": [
    { "field": "active", "operator": "==", "value": true },
    { "field": "lastLogin", "operator": ">", "value": "2024-01-01T00:00:00Z" }
  ]
})

// List all collections to understand database structure
firestore_list_collections({})
```

## Troubleshooting

### Common Issues and Solutions

#### Issue: "SERVICE_ACCOUNT_KEY_PATH not set"

**Cause:** The required environment variable is missing or not configured correctly.

**Solution:**
1. Ensure you've downloaded your Firebase service account key from Firebase Console
2. Save the JSON file to a secure location on your system
3. Update your Kiro Powers configuration with the absolute path to this file
4. Restart Kiro IDE after updating the configuration

**Example:**
```json
{
  "env": {
    "SERVICE_ACCOUNT_KEY_PATH": "/Users/username/firebase/serviceAccountKey.json"
  }
}
```

---

#### Issue: "Storage bucket not available"

**Cause:** Firebase Storage bucket name is not configured or incorrect.

**Solution:**
1. Find your bucket name in Firebase Console → Storage
2. Add `FIREBASE_STORAGE_BUCKET` to your environment variables
3. Use the full bucket name (e.g., `project-id.firebasestorage.app`)

**Example:**
```json
{
  "env": {
    "SERVICE_ACCOUNT_KEY_PATH": "/path/to/key.json",
    "FIREBASE_STORAGE_BUCKET": "my-project.firebasestorage.app"
  }
}
```

---

#### Issue: "This query requires a composite index"

**Cause:** Firestore requires a composite index for queries with multiple filters or ordering.

**Solution:**
1. The error message includes a direct link to create the index
2. Click the link to open Firebase Console
3. Click "Create Index" and wait for it to build (usually 1-2 minutes)
4. Retry your query

**Note:** This is normal for complex queries. Firebase automatically generates the index creation link.

---

#### Issue: "Document not found"

**Cause:** The specified document ID doesn't exist in the collection.

**Solution:**
1. Verify the document ID is correct
2. Use `firestore_list_documents` to see available documents
3. Check if the document was deleted or moved
4. Ensure you're using the correct collection path

---

#### Issue: "File not found" in Storage

**Cause:** The specified file path doesn't exist in Firebase Storage.

**Solution:**
1. Use `storage_list_files` to see available files
2. Verify the file path is correct (case-sensitive)
3. Check if the file was deleted or moved
4. Ensure you're using the correct bucket

---

#### Issue: "Invalid base64 data" when uploading

**Cause:** Base64 data is truncated or corrupted, often due to LLM limitations with large files.

**Solution:**
1. **Use local file paths instead** (recommended):
   ```javascript
   {
     "filePath": "images/photo.jpg",
     "content": "/path/to/photo.jpg"
   }
   ```
2. Or use `storage_upload_from_url` if the file is accessible via URL
3. For text files, use plain text content instead of base64

---

#### Issue: "User not found" in Authentication

**Cause:** The specified email or UID doesn't exist in Firebase Authentication.

**Solution:**
1. Verify the email address or UID is correct
2. Check if the user exists in [Firebase Console](https://console.firebase.google.com) → Authentication
3. Ensure the user hasn't been deleted
4. For email lookups, ensure the email is exact (case-sensitive)

---

### Using Firebase Emulator for Development

For local development and testing, you can use the Firebase Emulator Suite:

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase in your project:**
   ```bash
   firebase init emulators
   ```

3. **Start the emulators:**
   ```bash
   firebase emulators:start
   ```

4. **Configure Firebase Power to use emulator:**
   ```json
   {
     "env": {
       "USE_FIREBASE_EMULATOR": "true",
       "SERVICE_ACCOUNT_KEY_PATH": "/path/to/serviceAccountKey.json"
     }
   }
   ```

The emulator provides a local environment for testing without affecting production data.

---

### Getting Help

If you encounter issues not covered here:

1. **Check Firebase Console** for service status and quotas
2. **Review Firebase documentation** at [firebase.google.com/docs](https://firebase.google.com/docs)
3. **Check the GitHub repository** for known issues: [github.com/khuepm/firebase-kiro-power](https://github.com/khuepm/firebase-kiro-power)
4. **Open an issue** on GitHub with:
   - Error message (remove sensitive information)
   - Steps to reproduce
   - Your configuration (remove credentials)
   - Firebase Power version

## Technical Details

### MCP Protocol
- **Protocol Version:** MCP v1.11.0
- **Transport:** Supports both stdio and HTTP
- **Response Format:** JSON-RPC 2.0 compliant

### Dependencies
- **Firebase Admin SDK:** v13.3.0
- **Node.js:** 16.0.0 or higher required
- **Model Context Protocol SDK:** v1.11.0

### Security
- Service account credentials are never transmitted
- All operations use Firebase Admin SDK with full security rules
- Supports Firebase Security Rules for access control
- Compatible with Firebase App Check for additional security

### Performance
- Efficient pagination for large datasets
- Automatic connection pooling
- Optimized for AI assistant workflows
- Supports Firebase Emulator for fast local testing

### Compatibility
- **Kiro IDE:** Full support with Powers panel integration
- **Claude Desktop:** Compatible via MCP configuration
- **VS Code / Cursor:** Compatible via MCP extension
- **Other MCP Clients:** Compatible with any MCP-compliant client

## Resources

- **Firebase Console:** [console.firebase.google.com](https://console.firebase.google.com)
- **Firebase Documentation:** [firebase.google.com/docs](https://firebase.google.com/docs)
- **GitHub Repository:** [github.com/khuepm/firebase-kiro-power](https://github.com/khuepm/firebase-kiro-power)
- **NPM Package:** [npmjs.com/package/@khuepm/firebase-kiro-power](https://www.npmjs.com/package/@khuepm/firebase-kiro-power)
- **Model Context Protocol:** [modelcontextprotocol.io](https://modelcontextprotocol.io)
- **Kiro IDE:** [kiro.ai](https://kiro.ai)

## License

MIT License - See LICENSE file for details

## Author

Khue Pham - [github.com/khuepm](https://github.com/khuepm)

---

**Version:** 1.4.9  
**Last Updated:** January 2024
