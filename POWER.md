# Firebase Power

## Overview

Firebase Power is a Kiro Power that enables AI assistants to work directly with Firebase services through the Model Context Protocol (MCP). This power provides seamless integration with Firebase's core services, allowing you to manage your Firebase projects directly from Kiro IDE.

With Firebase Power, you can:
- **Manage Firestore databases**: Create, read, update, and delete documents, query collections, and manage database structure
- **Handle file storage**: Upload, download, and manage files in Firebase Storage with support for various content types
- **Manage user authentication**: Retrieve user information and manage authentication data

Firebase Power brings the full capabilities of Firebase Admin SDK to your AI assistant, making it easy to build, test, and manage Firebase-powered applications without leaving your development environment.

## What is a Kiro Power?

A Kiro Power is a packaged integration that extends the capabilities of AI assistants in Kiro IDE. Powers bundle together:

- **MCP Servers**: Backend services that provide tools and functionality through the Model Context Protocol
- **Documentation**: Comprehensive guides and API references to help you use the power effectively
- **Configuration**: Pre-configured settings that make installation and setup straightforward

Powers are designed to be plug-and-play extensions that give your AI assistant access to external services, APIs, and tools. They follow a standardized format that ensures consistent installation, configuration, and usage across the Kiro ecosystem.

Firebase Power specifically packages the Firebase MCP server, making it easy to connect your Kiro IDE to any Firebase project with just a few configuration steps.

## Features

Firebase Power provides comprehensive access to three core Firebase services:

### Firestore Database Operations
- Add documents to collections
- List and filter documents with pagination support
- Retrieve specific documents by ID
- Update existing documents with partial or full data
- Delete documents from collections
- List all root-level collections in your database
- Query across collection groups for advanced data retrieval
- Count documents in collections

### Firebase Storage Management
- List files and directories in your storage bucket
- Get detailed file metadata and download URLs
- Upload files from content with automatic content type detection
- Upload files directly from URLs
- Manage file organization and structure

### Firebase Authentication
- Retrieve user information by email or UID
- Access user metadata and authentication details
- Verify user accounts and authentication status

## Installation

### Prerequisites

Before installing Firebase Power, ensure you have the following:

1. **Kiro IDE**: Firebase Power is designed to work within Kiro IDE. Make sure you have Kiro IDE installed and running.

2. **Firebase Project**: You need an active Firebase project with the services you want to use (Firestore, Storage, and/or Authentication). If you don't have one:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select an existing one
   - Enable the services you need (Firestore Database, Storage, Authentication)

3. **Firebase Service Account Key**: Firebase Power requires a service account key for authentication:
   - In the Firebase Console, go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file securely on your local machine
   - Note the file path - you'll need it for configuration

4. **Node.js Environment**: Firebase Power requires Node.js to be installed on your system. The power will be executed via npx, which comes with Node.js.

### Installation Steps

Installing Firebase Power in Kiro IDE is straightforward using the Powers panel:

1. **Open the Powers Panel**
   - In Kiro IDE, navigate to the Powers panel
   - You can typically find this in the sidebar or main menu

2. **Search for Firebase Power**
   - In the Powers panel, use the search function
   - Type "Firebase Power" or "firebase" to find the power

3. **Install the Power**
   - Click on "Firebase Power" in the search results
   - Click the "Install" button
   - Wait for the installation to complete

4. **Configure Environment Variables**
   - After installation, you'll need to configure the required environment variables
   - In the Powers panel, locate Firebase Power in your installed powers
   - Click on the configuration or settings option
   - Add the following required environment variable:
     - `SERVICE_ACCOUNT_KEY_PATH`: The full path to your Firebase service account key JSON file
   - Optionally, add:
     - `FIREBASE_STORAGE_BUCKET`: Your Firebase Storage bucket name (e.g., `your-project-id.firebasestorage.app`)
       - If not provided, the default bucket from your service account will be used

5. **Verify Installation**
   - Once configured, Firebase Power should be ready to use
   - You can test it by asking your AI assistant to perform a simple Firebase operation
   - For example: "List the collections in my Firestore database"

### Alternative Installation (For Other MCP Clients)

If you're using Firebase Power with other MCP clients (Claude Desktop, VS Code, Cursor, etc.), you can install it via npx:

```bash
npx @khuepm/firebase-kiro-power
```

For detailed configuration instructions for other MCP clients, see the Configuration section below.

## Configuration

Firebase Power requires proper configuration to connect to your Firebase project. This section covers the environment variables needed and provides configuration examples for different MCP clients.

### Environment Variables

#### Required Environment Variables

- **`SERVICE_ACCOUNT_KEY_PATH`** (Required)
  - **Description**: The absolute path to your Firebase service account key JSON file
  - **Example**: `/Users/username/firebase-keys/my-project-serviceAccountKey.json` (macOS/Linux) or `C:\Users\username\firebase-keys\my-project-serviceAccountKey.json` (Windows)
  - **How to obtain**: 
    1. Go to [Firebase Console](https://console.firebase.google.com/)
    2. Select your project
    3. Navigate to Project Settings > Service Accounts
    4. Click "Generate New Private Key"
    5. Save the JSON file securely and note its full path
  - **Security Note**: Keep this file secure and never commit it to version control. The service account key provides full administrative access to your Firebase project.

#### Optional Environment Variables

- **`FIREBASE_STORAGE_BUCKET`** (Optional)
  - **Description**: The name of your Firebase Storage bucket
  - **Example**: `my-project-id.firebasestorage.app` or `my-project-id.appspot.com`
  - **Default Behavior**: If not provided, Firebase Power will use the default storage bucket associated with your service account
  - **When to use**: Specify this if you have multiple storage buckets or want to use a non-default bucket
  - **How to find**: 
    1. Go to [Firebase Console](https://console.firebase.google.com/)
    2. Select your project
    3. Navigate to Storage
    4. The bucket name is displayed at the top of the Storage page

### Configuration Examples

#### Kiro IDE Configuration

When using Firebase Power in Kiro IDE, the configuration is managed through the Powers panel. However, if you need to manually configure it or understand the underlying configuration format, here's the JSON structure:

```json
{
  "mcpServers": {
    "firebase-power": {
      "command": "npx",
      "args": ["-y", "@khuepm/firebase-kiro-power"],
      "env": {
        "SERVICE_ACCOUNT_KEY_PATH": "/absolute/path/to/your/serviceAccountKey.json",
        "FIREBASE_STORAGE_BUCKET": "your-project-id.firebasestorage.app"
      }
    }
  }
}
```

**Configuration Notes for Kiro IDE:**
- Replace `/absolute/path/to/your/serviceAccountKey.json` with the actual path to your service account key file
- Replace `your-project-id.firebasestorage.app` with your actual Firebase Storage bucket name
- The `FIREBASE_STORAGE_BUCKET` line is optional and can be omitted if you're using the default bucket
- Use forward slashes (`/`) in paths even on Windows, or use double backslashes (`\\`) for Windows paths

#### Claude Desktop Configuration

For Claude Desktop, add the following to your Claude configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "firebase": {
      "command": "npx",
      "args": ["-y", "@khuepm/firebase-kiro-power"],
      "env": {
        "SERVICE_ACCOUNT_KEY_PATH": "/absolute/path/to/your/serviceAccountKey.json",
        "FIREBASE_STORAGE_BUCKET": "your-project-id.firebasestorage.app"
      }
    }
  }
}
```

#### VS Code / Cursor Configuration

For VS Code or Cursor with MCP extensions, add to your settings or MCP configuration file:

```json
{
  "mcp": {
    "servers": {
      "firebase": {
        "command": "npx",
        "args": ["-y", "@khuepm/firebase-kiro-power"],
        "env": {
          "SERVICE_ACCOUNT_KEY_PATH": "/absolute/path/to/your/serviceAccountKey.json",
          "FIREBASE_STORAGE_BUCKET": "your-project-id.firebasestorage.app"
        }
      }
    }
  }
}
```

#### Cline Configuration

For Cline (VS Code extension), add to your Cline MCP settings:

```json
{
  "mcpServers": {
    "firebase": {
      "command": "npx",
      "args": ["-y", "@khuepm/firebase-kiro-power"],
      "env": {
        "SERVICE_ACCOUNT_KEY_PATH": "/absolute/path/to/your/serviceAccountKey.json",
        "FIREBASE_STORAGE_BUCKET": "your-project-id.firebasestorage.app"
      }
    }
  }
}
```

#### HTTP Transport Configuration

Firebase Power also supports HTTP transport for scenarios where stdio is not suitable. To use HTTP transport:

```json
{
  "mcpServers": {
    "firebase": {
      "command": "npx",
      "args": ["-y", "@khuepm/firebase-kiro-power"],
      "env": {
        "SERVICE_ACCOUNT_KEY_PATH": "/absolute/path/to/your/serviceAccountKey.json",
        "FIREBASE_STORAGE_BUCKET": "your-project-id.firebasestorage.app",
        "TRANSPORT": "http",
        "PORT": "3000"
      }
    }
  }
}
```

**HTTP Transport Environment Variables:**
- `TRANSPORT`: Set to `"http"` to enable HTTP transport (default is `"stdio"`)
- `PORT`: The port number for the HTTP server (default is `3000`)

### Configuration Validation

When Firebase Power starts, it validates your configuration:

1. **Missing SERVICE_ACCOUNT_KEY_PATH**: If this required variable is not set, you'll see an error message:
   ```
   Error: SERVICE_ACCOUNT_KEY_PATH environment variable is required.
   Please set it to the path of your Firebase service account key JSON file.
   ```

2. **Invalid Service Account Key**: If the file doesn't exist or is not valid JSON, you'll see:
   ```
   Error: Failed to initialize Firebase Admin SDK.
   Please check that SERVICE_ACCOUNT_KEY_PATH points to a valid service account key file.
   ```

3. **Invalid Storage Bucket**: If you specify a FIREBASE_STORAGE_BUCKET that doesn't exist, storage operations will fail with:
   ```
   Error: Storage bucket not found. Please check your FIREBASE_STORAGE_BUCKET configuration.
   ```

### Testing Your Configuration

To verify your configuration is working correctly:

1. **Test Firestore Access**: Ask your AI assistant to list collections:
   ```
   "List all collections in my Firestore database"
   ```

2. **Test Storage Access**: Ask your AI assistant to list files:
   ```
   "List files in my Firebase Storage"
   ```

3. **Test Authentication Access**: Ask your AI assistant to get user information:
   ```
   "Get user information for email: user@example.com"
   ```

If any of these operations fail, check your configuration and ensure:
- The service account key path is correct and the file exists
- The service account has the necessary permissions in your Firebase project
- Your Firebase project has the required services enabled (Firestore, Storage, Authentication)

### Using Firebase Emulator (Development)

For development and testing, you can use the Firebase Emulator Suite instead of connecting to a live Firebase project:

1. **Install Firebase Tools**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase Emulators**:
   ```bash
   firebase init emulators
   ```

3. **Start the Emulators**:
   ```bash
   firebase emulators:start
   ```

4. **Configure Firebase Power to Use Emulator**:
   Add the following environment variables to your configuration:
   ```json
   {
     "env": {
       "SERVICE_ACCOUNT_KEY_PATH": "/path/to/serviceAccountKey.json",
       "FIRESTORE_EMULATOR_HOST": "localhost:8080",
       "FIREBASE_STORAGE_EMULATOR_HOST": "localhost:9199",
       "FIREBASE_AUTH_EMULATOR_HOST": "localhost:9099"
     }
   }
   ```

Using the emulator is recommended for development as it allows you to test Firebase operations without affecting your production data.

## Available Tools

Firebase Power provides a comprehensive set of tools for working with Firebase services. This section documents all available tools, their parameters, and usage examples.

### Firestore Tools

Firebase Power provides eight Firestore tools for managing your Firestore database. All tools return links to the Firebase Console for easy navigation to your data.

#### firestore_add_document

Add a new document to a Firestore collection with an auto-generated ID.

**Parameters:**
- `collection` (string, required): The collection path where the document will be added
- `data` (object, required): The document data to store

**Returns:**
- `id`: The auto-generated document ID
- `url`: Direct link to the document in Firebase Console

**Example Usage:**

```javascript
// Add a new user document
{
  "collection": "users",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response:**
```json
{
  "id": "abc123xyz",
  "url": "https://console.firebase.google.com/project/my-project/firestore/data/users/abc123xyz"
}
```

**Notes:**
- Document IDs are automatically generated by Firestore
- Timestamps can be provided as ISO 8601 strings (e.g., "2024-01-15T10:30:00.000Z")
- Use `"__serverTimestamp__"` as a value to use Firebase server timestamp
- Nested objects and arrays are fully supported

---

#### firestore_list_documents

List documents from a Firestore collection with optional filtering, ordering, and pagination.

**Parameters:**
- `collection` (string, required): The collection path to query
- `filters` (array, optional): Array of filter conditions to apply
  - `field` (string): Field name to filter on
  - `operator` (string): Comparison operator (`==`, `>`, `<`, `>=`, `<=`, `array-contains`, `in`, `array-contains-any`)
  - `value` (any): Value to compare against (use ISO format for dates)
- `orderBy` (array, optional): Array of fields to order results by
  - `field` (string): Field name to order by
  - `direction` (string): Sort direction (`asc` or `desc`, default: `asc`)
- `limit` (number, optional): Maximum number of documents to return (default: 20, max: 100)
- `pageToken` (string, optional): Token for pagination to get the next page of results

**Returns:**
- `documents`: Array of documents with `id`, `data`, and `url` fields
- `nextPageToken`: Token to use for fetching the next page (if more results exist)

**Example Usage:**

```javascript
// List all users
{
  "collection": "users",
  "limit": 10
}

// List users with filtering
{
  "collection": "users",
  "filters": [
    { "field": "age", "operator": ">=", "value": 21 },
    { "field": "status", "operator": "==", "value": "active" }
  ],
  "limit": 20
}

// List users with ordering
{
  "collection": "users",
  "orderBy": [
    { "field": "createdAt", "direction": "desc" }
  ],
  "limit": 10
}

// Pagination - get next page
{
  "collection": "users",
  "limit": 10,
  "pageToken": "users/abc123xyz"
}
```

**Response:**
```json
{
  "documents": [
    {
      "id": "user1",
      "data": {
        "name": "John Doe",
        "email": "john@example.com",
        "age": 30
      },
      "url": "https://console.firebase.google.com/project/my-project/firestore/data/users/user1"
    }
  ],
  "nextPageToken": "users/user1"
}
```

**Notes:**
- Multiple filters are combined with AND logic
- When using `orderBy`, you may need to create composite indexes in Firestore
- The `pageToken` is the full document path of the last document from the previous page
- Timestamps in filter values should be in ISO 8601 format

---

#### firestore_get_document

Retrieve a specific document from a Firestore collection by its ID.

**Parameters:**
- `collection` (string, required): The collection path containing the document
- `id` (string, required): The document ID to retrieve

**Returns:**
- `id`: The document ID
- `data`: The document data
- `url`: Direct link to the document in Firebase Console

**Example Usage:**

```javascript
// Get a specific user document
{
  "collection": "users",
  "id": "user123"
}

// Get a document from a subcollection
{
  "collection": "users/user123/orders",
  "id": "order456"
}
```

**Response:**
```json
{
  "id": "user123",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "url": "https://console.firebase.google.com/project/my-project/firestore/data/users/user123"
}
```

**Error Response:**
```json
{
  "error": "Document not found: user123"
}
```

**Notes:**
- Returns an error if the document doesn't exist
- Firestore Timestamps are automatically converted to ISO 8601 strings
- Supports documents in subcollections using path notation

---

#### firestore_update_document

Update an existing document in a Firestore collection. Fields not included in the update data are preserved.

**Parameters:**
- `collection` (string, required): The collection path containing the document
- `id` (string, required): The document ID to update
- `data` (object, required): The fields to update (partial update supported)

**Returns:**
- `success`: Boolean indicating successful update
- `url`: Direct link to the document in Firebase Console

**Example Usage:**

```javascript
// Update specific fields
{
  "collection": "users",
  "id": "user123",
  "data": {
    "status": "inactive",
    "lastUpdated": "2024-01-20T15:45:00.000Z"
  }
}

// Update nested fields
{
  "collection": "users",
  "id": "user123",
  "data": {
    "profile.bio": "Updated bio text",
    "settings.notifications": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://console.firebase.google.com/project/my-project/firestore/data/users/user123"
}
```

**Notes:**
- Only the fields specified in `data` are updated; other fields remain unchanged
- Use dot notation (e.g., `"profile.bio"`) to update nested fields
- The document must exist; use `firestore_add_document` to create new documents
- Use `"__serverTimestamp__"` as a value to update with Firebase server timestamp

---

#### firestore_delete_document

Delete a document from a Firestore collection.

**Parameters:**
- `collection` (string, required): The collection path containing the document
- `id` (string, required): The document ID to delete

**Returns:**
- `success`: Boolean indicating successful deletion

**Example Usage:**

```javascript
// Delete a user document
{
  "collection": "users",
  "id": "user123"
}

// Delete a document from a subcollection
{
  "collection": "users/user123/orders",
  "id": "order456"
}
```

**Response:**
```json
{
  "success": true
}
```

**Error Response:**
```json
{
  "error": "no entity to delete"
}
```

**Notes:**
- Returns an error if the document doesn't exist
- Deleting a document does not delete its subcollections
- This operation is permanent and cannot be undone
- Consider using a "soft delete" pattern (updating a `deleted` field) for important data

---

#### firestore_list_collections

List all root-level collections in your Firestore database.

**Parameters:**
None required.

**Returns:**
- `collections`: Array of collection objects with `id`, `path`, and `url` fields
- `path`: The path that was queried (always "root" for this tool)
- `projectId`: Your Firebase project ID

**Example Usage:**

```javascript
// List all root collections
{}
```

**Response:**
```json
{
  "collections": [
    {
      "id": "users",
      "path": "users",
      "url": "https://console.firebase.google.com/project/my-project/firestore/data/users"
    },
    {
      "id": "products",
      "path": "products",
      "url": "https://console.firebase.google.com/project/my-project/firestore/data/products"
    }
  ],
  "path": "root",
  "projectId": "my-project"
}
```

**Notes:**
- This tool only lists root-level collections
- To list subcollections of a document, you would need to query the document's subcollections separately
- Empty collections may not appear in the list (Firestore doesn't store empty collections)
- The URLs link directly to each collection in the Firebase Console

---

#### firestore_query_collection_group

Query documents across all subcollections with the same collection ID, regardless of their parent document. This is useful for searching data across multiple parent documents.

**Parameters:**
- `collectionId` (string, required): The collection ID to query (without parent path)
- `filters` (array, optional): Array of filter conditions to apply
  - `field` (string): Field name to filter on
  - `operator` (string): Comparison operator (`==`, `!=`, `<`, `<=`, `>`, `>=`, `array-contains`, `array-contains-any`, `in`, `not-in`)
  - `value` (any): Value to compare against
- `orderBy` (array, optional): Array of fields to order results by
  - `field` (string): Field name to order by
  - `direction` (string): Sort direction (`asc` or `desc`, default: `asc`)
- `limit` (number, optional): Maximum number of documents to return (default: 20, max: 100)
- `pageToken` (string, optional): Token for pagination (document path to start after)

**Returns:**
- `documents`: Array of documents with `id`, `path`, `data`, and `url` fields
- `nextPageToken`: Token to use for fetching the next page (if more results exist)

**Example Usage:**

```javascript
// Query all 'comments' subcollections across all documents
{
  "collectionId": "comments",
  "limit": 50
}

// Query with filtering
{
  "collectionId": "comments",
  "filters": [
    { "field": "rating", "operator": ">", "value": 3 },
    { "field": "approved", "operator": "==", "value": true }
  ],
  "orderBy": [
    { "field": "createdAt", "direction": "desc" }
  ],
  "limit": 20
}
```

**Response:**
```json
{
  "documents": [
    {
      "id": "comment1",
      "path": "posts/post123/comments/comment1",
      "data": {
        "text": "Great post!",
        "rating": 5,
        "createdAt": "2024-01-15T10:30:00.000Z"
      },
      "url": "https://console.firebase.google.com/project/my-project/firestore/data/posts/post123/comments/comment1"
    },
    {
      "id": "comment2",
      "path": "articles/article456/comments/comment2",
      "data": {
        "text": "Very helpful",
        "rating": 4,
        "createdAt": "2024-01-14T09:20:00.000Z"
      },
      "url": "https://console.firebase.google.com/project/my-project/firestore/data/articles/article456/comments/comment2"
    }
  ],
  "nextPageToken": "articles/article456/comments/comment2"
}
```

**Notes:**
- Collection group queries search across ALL subcollections with the specified ID
- The `path` field shows the full path to each document, including parent documents
- You may need to create indexes for collection group queries with filters or ordering
- This is particularly useful for querying data like comments, ratings, or orders across multiple parent entities
- The query ignores the parent document structure and treats all matching subcollections as one logical collection

---

#### firestore_count_documents

Count the number of documents in a Firestore collection, with optional filtering.

**Parameters:**
- `collection` (string, required): The collection path to count documents in
- `filters` (array, optional): Array of filter conditions to apply
  - `field` (string): Field name to filter on
  - `operator` (string): Comparison operator (`==`, `>`, `<`, `>=`, `<=`, `array-contains`, `in`, `array-contains-any`)
  - `value` (any): Value to compare against (use ISO format for dates)

**Returns:**
- `count`: The number of documents matching the query

**Example Usage:**

```javascript
// Count all users
{
  "collection": "users"
}

// Count active users
{
  "collection": "users",
  "filters": [
    { "field": "status", "operator": "==", "value": "active" }
  ]
}

// Count users created after a specific date
{
  "collection": "users",
  "filters": [
    { "field": "createdAt", "operator": ">", "value": "2024-01-01T00:00:00.000Z" }
  ]
}
```

**Response:**
```json
{
  "count": 42
}
```

**Notes:**
- This is more efficient than fetching all documents and counting them
- Multiple filters are combined with AND logic
- The count operation is subject to Firestore's query limitations
- For very large collections, consider using aggregation queries or maintaining a counter document

---

### Storage Tools

Firebase Power provides four Storage tools for managing files in Firebase Storage. All tools support automatic content type detection and provide permanent download URLs.

#### storage_list_files

List files and directories in a specified path in Firebase Storage with pagination support.

**Parameters:**
- `directoryPath` (string, optional): The path to list files from (e.g., 'images/' or 'documents/2023/')
  - If not provided, lists files from the root directory
  - Use trailing slash for directory paths

**Returns:**
- `files`: Array of file objects with metadata
  - `name`: Full path to the file
  - `size`: File size in bytes
  - `contentType`: MIME type of the file
  - `updated`: Last modified timestamp
  - `downloadUrl`: Direct download URL
- `nextPageToken`: Token for pagination (if more results exist)

**Example Usage:**

```javascript
// List all files in root directory
{}

// List files in a specific directory
{
  "directoryPath": "images/"
}

// List files in a nested directory
{
  "directoryPath": "documents/2024/reports/"
}
```

**Response:**
```json
{
  "files": [
    {
      "name": "images/logo.png",
      "size": 15234,
      "contentType": "image/png",
      "updated": "2024-01-15T10:30:00.000Z",
      "downloadUrl": "https://firebasestorage.googleapis.com/v0/b/my-project.appspot.com/o/images%2Flogo.png?alt=media"
    },
    {
      "name": "images/banner.jpg",
      "size": 45678,
      "contentType": "image/jpeg",
      "updated": "2024-01-14T15:20:00.000Z",
      "downloadUrl": "https://firebasestorage.googleapis.com/v0/b/my-project.appspot.com/o/images%2Fbanner.jpg?alt=media"
    }
  ],
  "nextPageToken": null
}
```

**Notes:**
- Results are paginated with a default page size of 10 items
- Use `nextPageToken` from the response to fetch the next page
- The `downloadUrl` is a permanent public URL that doesn't expire
- Directory paths should end with a forward slash (/)
- Empty directories may not appear in listings

---

#### storage_get_file_info

Retrieve detailed information about a specific file in Firebase Storage, including metadata and download URLs.

**Parameters:**
- `filePath` (string, required): The complete path to the file in storage (e.g., 'images/logo.png')

**Returns:**
- `name`: File name
- `size`: File size in bytes
- `contentType`: MIME type of the file
- `updated`: Last modified timestamp
- `downloadUrl`: Permanent public download URL
- `temporaryUrl`: Temporary signed URL (expires in 15 minutes)
- `bucket`: Storage bucket name
- `path`: Full path to the file

**Example Usage:**

```javascript
// Get information about a specific file
{
  "filePath": "images/logo.png"
}

// Get information about a file in a subdirectory
{
  "filePath": "documents/2024/report.pdf"
}
```

**Response:**
```json
{
  "name": "images/logo.png",
  "size": 15234,
  "contentType": "image/png",
  "updated": "2024-01-15T10:30:00.000Z",
  "downloadUrl": "https://firebasestorage.googleapis.com/v0/b/my-project.appspot.com/o/images%2Flogo.png?alt=media",
  "temporaryUrl": "https://storage.googleapis.com/my-project.appspot.com/images/logo.png?X-Goog-Algorithm=...",
  "bucket": "my-project.appspot.com",
  "path": "images/logo.png"
}
```

**Error Response:**
```json
{
  "error": "File not found: images/missing.png"
}
```

**Notes:**
- Returns an error if the file doesn't exist
- The `downloadUrl` is a permanent public URL that doesn't expire
- The `temporaryUrl` is a signed URL that expires in 15 minutes (useful for private files)
- Use this tool to verify a file exists before performing operations on it
- The response includes both permanent and temporary URLs for flexibility

---

#### storage_upload

Upload a file to Firebase Storage from local file paths, base64 data, or plain text content. This tool supports automatic content type detection and handles various input formats.

**Parameters:**
- `filePath` (string, required): The destination path in Firebase Storage (e.g., "images/logo.png")
  - File paths are automatically sanitized for URL compatibility
  - Spaces are replaced with hyphens, special characters are removed
  - Example: "My Document.pdf" becomes "my-document.pdf"
- `content` (string, required): The file content in one of three formats:
  1. **Local file path** (RECOMMENDED): Absolute path to a file on your system
     - Example: `/Users/username/Downloads/document.pdf`
     - Works for all file types, especially binary files (PDFs, images, videos)
     - Fastest and most reliable method
  2. **Data URL**: Base64-encoded data with MIME type
     - Example: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`
     - May have issues with large files due to encoding limitations
  3. **Plain text**: Direct text content
     - Example: `"This is the file content"`
     - Best for small text files only
- `contentType` (string, optional): MIME type (e.g., "image/png", "application/pdf")
  - If not provided, automatically detected from file extension or data URL
- `metadata` (object, optional): Additional custom metadata to store with the file

**Returns:**
- `name`: File name in storage
- `size`: File size in bytes
- `contentType`: MIME type of the uploaded file
- `updated`: Upload timestamp
- `downloadUrl`: Permanent public download URL
- `temporaryUrl`: Temporary signed URL (expires in 15 minutes)
- `bucket`: Storage bucket name
- `path`: Full path to the file in storage

**Example Usage:**

```javascript
// Upload from a local file path (RECOMMENDED)
{
  "filePath": "documents/report.pdf",
  "content": "/Users/username/Downloads/quarterly-report.pdf"
}

// Upload from base64 data
{
  "filePath": "images/logo.png",
  "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...",
  "contentType": "image/png"
}

// Upload plain text content
{
  "filePath": "logs/app.log",
  "content": "Application started at 2024-01-15T10:30:00Z\nUser logged in: john@example.com",
  "contentType": "text/plain"
}

// Upload with custom metadata
{
  "filePath": "images/profile-photo.jpg",
  "content": "/Users/username/Pictures/photo.jpg",
  "metadata": {
    "uploadedBy": "user123",
    "category": "profile-photos",
    "version": "1.0"
  }
}
```

**Response:**
```json
{
  "name": "documents/report.pdf",
  "size": 245678,
  "contentType": "application/pdf",
  "updated": "2024-01-15T10:30:00.000Z",
  "downloadUrl": "https://firebasestorage.googleapis.com/v0/b/my-project.appspot.com/o/documents%2Freport.pdf?alt=media",
  "temporaryUrl": "https://storage.googleapis.com/my-project.appspot.com/documents/report.pdf?X-Goog-Algorithm=...",
  "bucket": "my-project.appspot.com",
  "path": "documents/report.pdf"
}
```

**Error Responses:**

```json
// Invalid base64 data
{
  "error": "Invalid base64 data: The data appears to be truncated or corrupted. LLMs like Claude sometimes have issues with large base64 strings. Try using a local file path or URL instead."
}

// Document reference error
{
  "error": "Document references cannot be directly accessed by external tools. Instead, please use one of these approaches: 1. Use a direct file path to the document on your system..."
}

// Local file not found
{
  "error": "Error reading local file: ENOENT: no such file or directory"
}
```

**Notes:**
- **Local file paths are strongly recommended** for binary files (PDFs, images, videos, etc.)
- File paths are automatically sanitized: spaces become hyphens, converted to lowercase
- Base64 encoding may fail for large files due to LLM limitations
- Document references (like `/antml:document`) cannot be accessed - use actual file paths
- Content type is automatically detected if not provided
- Supports a wide range of MIME types including images, documents, videos, and more
- The `downloadUrl` is permanent and doesn't expire
- Custom metadata is stored with the file and can be retrieved later

---

#### storage_upload_from_url

Upload a file to Firebase Storage directly from an external URL. This tool downloads the file from the URL and uploads it to your Firebase Storage bucket.

**Parameters:**
- `filePath` (string, required): The destination path in Firebase Storage (e.g., "images/photo.jpg")
  - File paths are automatically sanitized for URL compatibility
  - Example: "My Photo.jpg" becomes "my-photo.jpg"
- `url` (string, required): The source URL to download from
  - Must be a publicly accessible URL
  - For GitHub files, use the raw URL (add `?raw=true` to the URL)
  - Example: `https://example.com/image.jpg`
- `contentType` (string, optional): MIME type (e.g., "image/jpeg", "application/pdf")
  - If not provided, automatically detected from URL extension or response headers
- `metadata` (object, optional): Additional custom metadata to store with the file
  - The source URL is automatically added to metadata as `sourceUrl`

**Returns:**
- `name`: File name in storage
- `size`: File size in bytes
- `contentType`: MIME type of the uploaded file
- `updated`: Upload timestamp
- `downloadUrl`: Permanent public download URL
- `temporaryUrl`: Temporary signed URL (expires in 15 minutes)
- `sourceUrl`: The original URL the file was downloaded from
- `bucket`: Storage bucket name
- `path`: Full path to the file in storage

**Example Usage:**

```javascript
// Upload an image from a URL
{
  "filePath": "images/banner.jpg",
  "url": "https://example.com/images/banner.jpg"
}

// Upload a PDF from a URL with custom metadata
{
  "filePath": "documents/whitepaper.pdf",
  "url": "https://example.com/files/whitepaper.pdf",
  "metadata": {
    "category": "marketing",
    "version": "2.0"
  }
}

// Upload from GitHub (use raw URL)
{
  "filePath": "assets/logo.svg",
  "url": "https://github.com/user/repo/blob/main/logo.svg?raw=true"
}

// Upload with explicit content type
{
  "filePath": "media/video.mp4",
  "url": "https://example.com/videos/demo.mp4",
  "contentType": "video/mp4"
}
```

**Response:**
```json
{
  "name": "images/banner.jpg",
  "size": 125678,
  "contentType": "image/jpeg",
  "updated": "2024-01-15T10:30:00.000Z",
  "downloadUrl": "https://firebasestorage.googleapis.com/v0/b/my-project.appspot.com/o/images%2Fbanner.jpg?alt=media",
  "temporaryUrl": "https://storage.googleapis.com/my-project.appspot.com/images/banner.jpg?X-Goog-Algorithm=...",
  "sourceUrl": "https://example.com/images/banner.jpg",
  "bucket": "my-project.appspot.com",
  "path": "images/banner.jpg"
}
```

**Error Responses:**

```json
// URL fetch error
{
  "error": "Error fetching or processing URL: Request failed with status code 404"
}

// Invalid image data
{
  "error": "Invalid image data: downloaded file is too small to be a valid image"
}
```

**Notes:**
- The URL must be publicly accessible (no authentication required)
- For GitHub files, always use the raw URL format with `?raw=true`
- Content type is automatically detected from URL extension or HTTP response headers
- The source URL is automatically stored in the file's metadata
- File paths are automatically sanitized for better URL compatibility
- This method is ideal for copying files from other web services to Firebase Storage
- The tool validates downloaded data to ensure it's not corrupted
- For private URLs or authenticated endpoints, download the file locally first and use `storage_upload`


---

### Authentication Tools

Firebase Power provides authentication tools for managing and retrieving user information from Firebase Authentication. These tools allow you to look up users by their email address or unique user ID (UID).

#### auth_get_user

Retrieve detailed information about a user from Firebase Authentication using either their email address or user ID (UID). This tool automatically detects whether the identifier is an email (contains '@') or a UID and uses the appropriate lookup method.

**Parameters:**
- `identifier` (string, required): The user's email address or UID
  - **Email format**: Any valid email address (e.g., "user@example.com")
  - **UID format**: Firebase-generated user ID (e.g., "abc123xyz456")

**Returns:**
- `uid`: The user's unique identifier
- `email`: The user's email address
- `emailVerified`: Boolean indicating if the email is verified
- `displayName`: The user's display name (if set)
- `photoURL`: URL to the user's profile photo (if set)
- `disabled`: Boolean indicating if the account is disabled
- `metadata`: Object containing account creation and last sign-in timestamps
  - `creationTime`: When the account was created
  - `lastSignInTime`: When the user last signed in
- `providerData`: Array of authentication provider information
- `tokensValidAfterTime`: Timestamp after which tokens are valid
- `customClaims`: Custom claims set on the user (if any)

**Example Usage:**

```javascript
// Get user by email address
{
  "identifier": "john.doe@example.com"
}

// Get user by UID
{
  "identifier": "abc123xyz456def789"
}

// Get user with Firebase-generated UID
{
  "identifier": "kF8xQzY2mNPqRsT3vWxY4zA5bC6"
}
```

**Response (Email Lookup):**
```json
{
  "uid": "kF8xQzY2mNPqRsT3vWxY4zA5bC6",
  "email": "john.doe@example.com",
  "emailVerified": true,
  "displayName": "John Doe",
  "photoURL": "https://example.com/photos/john.jpg",
  "disabled": false,
  "metadata": {
    "creationTime": "2024-01-10T08:30:00.000Z",
    "lastSignInTime": "2024-01-15T14:22:00.000Z"
  },
  "providerData": [
    {
      "uid": "john.doe@example.com",
      "email": "john.doe@example.com",
      "providerId": "password"
    }
  ],
  "tokensValidAfterTime": "2024-01-10T08:30:00.000Z"
}
```

**Response (UID Lookup):**
```json
{
  "uid": "abc123xyz456def789",
  "email": "jane.smith@example.com",
  "emailVerified": false,
  "displayName": "Jane Smith",
  "disabled": false,
  "metadata": {
    "creationTime": "2024-01-12T10:15:00.000Z",
    "lastSignInTime": "2024-01-14T16:45:00.000Z"
  },
  "providerData": [
    {
      "uid": "jane.smith@example.com",
      "email": "jane.smith@example.com",
      "providerId": "password"
    },
    {
      "uid": "112233445566778899",
      "displayName": "Jane Smith",
      "photoURL": "https://lh3.googleusercontent.com/...",
      "providerId": "google.com"
    }
  ],
  "tokensValidAfterTime": "2024-01-12T10:15:00.000Z"
}
```

**Error Response:**
```json
{
  "error": "User not found: nonexistent@example.com"
}
```

**Notes:**
- The tool automatically detects whether the identifier is an email or UID based on the presence of '@'
- Returns an error if the user doesn't exist in Firebase Authentication
- The `providerData` array shows all authentication providers linked to the account (password, Google, Facebook, etc.)
- `emailVerified` indicates whether the user has verified their email address
- `disabled` accounts cannot sign in but their data is preserved
- `metadata` provides useful information for user analytics and account management
- `customClaims` can be used for role-based access control (RBAC) if you've set custom claims on users
- This tool requires the Firebase service account to have appropriate permissions for Firebase Authentication

**Common Use Cases:**

1. **Verify User Existence**: Check if a user account exists before performing operations
   ```javascript
   { "identifier": "newuser@example.com" }
   ```

2. **Get User Details for Support**: Retrieve user information when handling support requests
   ```javascript
   { "identifier": "support-ticket-user@example.com" }
   ```

3. **Check Email Verification Status**: Verify if a user has confirmed their email
   ```javascript
   { "identifier": "user@example.com" }
   // Check the emailVerified field in the response
   ```

4. **Audit User Activity**: Review last sign-in time and account creation date
   ```javascript
   { "identifier": "audit-user@example.com" }
   // Check metadata.lastSignInTime and metadata.creationTime
   ```

5. **Lookup by UID from Firestore**: If you store UIDs in Firestore documents, look up full user details
   ```javascript
   { "identifier": "kF8xQzY2mNPqRsT3vWxY4zA5bC6" }
   ```

---
## Usage Examples

This section provides practical examples of common workflows using Firebase Power. These examples demonstrate how to combine multiple tools to accomplish real-world tasks.

### Example 1: Creating a User Profile System

This workflow demonstrates creating a complete user profile system with Firestore and Storage.

**Step 1: Add a new user document**
```javascript
// Create a user profile in Firestore
{
  "tool": "firestore_add_document",
  "collection": "users",
  "data": {
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "editor",
    "status": "active",
    "createdAt": "__serverTimestamp__"
  }
}
// Response: { "id": "user123", "url": "..." }
```

**Step 2: Upload a profile photo**
```javascript
// Upload the user's profile photo
{
  "tool": "storage_upload",
  "filePath": "profiles/user123/avatar.jpg",
  "content": "/Users/alice/Pictures/profile-photo.jpg",
  "metadata": {
    "userId": "user123",
    "uploadedBy": "alice@example.com"
  }
}
// Response: { "downloadUrl": "https://...", ... }
```

**Step 3: Update user document with photo URL**
```javascript
// Add the photo URL to the user's profile
{
  "tool": "firestore_update_document",
  "collection": "users",
  "id": "user123",
  "data": {
    "photoURL": "https://firebasestorage.googleapis.com/..."
  }
}
```

### Example 2: Building a Blog System

This workflow shows how to create and manage blog posts with images.

**Step 1: Upload blog post images**
```javascript
// Upload a featured image from a URL
{
  "tool": "storage_upload_from_url",
  "filePath": "blog/images/post-featured.jpg",
  "url": "https://example.com/images/featured.jpg",
  "metadata": {
    "category": "blog",
    "postId": "pending"
  }
}
```

**Step 2: Create the blog post**
```javascript
// Create a new blog post document
{
  "tool": "firestore_add_document",
  "collection": "posts",
  "data": {
    "title": "Getting Started with Firebase",
    "author": "Alice Johnson",
    "content": "Firebase is a powerful platform...",
    "featuredImage": "https://firebasestorage.googleapis.com/.../post-featured.jpg",
    "tags": ["firebase", "tutorial", "backend"],
    "published": true,
    "publishedAt": "__serverTimestamp__",
    "views": 0
  }
}
// Response: { "id": "post456", "url": "..." }
```

**Step 3: Query published posts**
```javascript
// List all published posts, newest first
{
  "tool": "firestore_list_documents",
  "collection": "posts",
  "filters": [
    { "field": "published", "operator": "==", "value": true }
  ],
  "orderBy": [
    { "field": "publishedAt", "direction": "desc" }
  ],
  "limit": 10
}
```

### Example 3: Managing Product Inventory

This workflow demonstrates an e-commerce inventory management system.

**Step 1: Add products with images**
```javascript
// Upload product image
{
  "tool": "storage_upload",
  "filePath": "products/laptop-pro-2024.jpg",
  "content": "/Users/admin/products/laptop.jpg"
}

// Create product document
{
  "tool": "firestore_add_document",
  "collection": "products",
  "data": {
    "name": "Laptop Pro 2024",
    "sku": "LAP-2024-001",
    "price": 1299.99,
    "stock": 50,
    "category": "electronics",
    "imageUrl": "https://firebasestorage.googleapis.com/.../laptop-pro-2024.jpg",
    "createdAt": "__serverTimestamp__"
  }
}
```

**Step 2: Update inventory after a sale**
```javascript
// Decrease stock count
{
  "tool": "firestore_get_document",
  "collection": "products",
  "id": "product789"
}
// Check current stock, then update

{
  "tool": "firestore_update_document",
  "collection": "products",
  "id": "product789",
  "data": {
    "stock": 49,
    "lastSold": "__serverTimestamp__"
  }
}
```

**Step 3: Query low-stock products**
```javascript
// Find products that need restocking
{
  "tool": "firestore_list_documents",
  "collection": "products",
  "filters": [
    { "field": "stock", "operator": "<", "value": 10 }
  ],
  "orderBy": [
    { "field": "stock", "direction": "asc" }
  ]
}
```

### Example 4: User Activity Tracking

This workflow shows how to track and analyze user activity across your application.

**Step 1: Log user activities**
```javascript
// Add activity log entries
{
  "tool": "firestore_add_document",
  "collection": "users/user123/activities",
  "data": {
    "action": "login",
    "timestamp": "__serverTimestamp__",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  }
}
```

**Step 2: Query recent activities**
```javascript
// Get user's recent activities
{
  "tool": "firestore_list_documents",
  "collection": "users/user123/activities",
  "orderBy": [
    { "field": "timestamp", "direction": "desc" }
  ],
  "limit": 20
}
```

**Step 3: Query all login activities across all users**
```javascript
// Use collection group query to find all login activities
{
  "tool": "firestore_query_collection_group",
  "collectionId": "activities",
  "filters": [
    { "field": "action", "operator": "==", "value": "login" }
  ],
  "orderBy": [
    { "field": "timestamp", "direction": "desc" }
  ],
  "limit": 50
}
```

### Example 5: File Management System

This workflow demonstrates building a document management system with folders and files.

**Step 1: Create folder structure**
```javascript
// Upload files to organized folders
{
  "tool": "storage_upload",
  "filePath": "documents/2024/Q1/financial-report.pdf",
  "content": "/Users/admin/reports/q1-2024.pdf",
  "metadata": {
    "department": "finance",
    "quarter": "Q1",
    "year": "2024",
    "confidential": "true"
  }
}
```

**Step 2: Create metadata in Firestore**
```javascript
// Store file metadata for searching
{
  "tool": "firestore_add_document",
  "collection": "files",
  "data": {
    "name": "Q1 2024 Financial Report",
    "path": "documents/2024/Q1/financial-report.pdf",
    "type": "pdf",
    "size": 245678,
    "department": "finance",
    "uploadedBy": "admin@example.com",
    "uploadedAt": "__serverTimestamp__",
    "tags": ["financial", "quarterly", "2024"]
  }
}
```

**Step 3: List files in a directory**
```javascript
// List all Q1 2024 documents
{
  "tool": "storage_list_files",
  "directoryPath": "documents/2024/Q1/"
}
```

**Step 4: Search files by metadata**
```javascript
// Find all financial documents
{
  "tool": "firestore_list_documents",
  "collection": "files",
  "filters": [
    { "field": "department", "operator": "==", "value": "finance" },
    { "field": "tags", "operator": "array-contains", "value": "quarterly" }
  ],
  "orderBy": [
    { "field": "uploadedAt", "direction": "desc" }
  ]
}
```

### Example 6: User Authentication and Profile Lookup

This workflow shows how to work with Firebase Authentication and user profiles.

**Step 1: Get user authentication details**
```javascript
// Look up user by email
{
  "tool": "auth_get_user",
  "identifier": "alice@example.com"
}
// Response includes: uid, email, emailVerified, displayName, etc.
```

**Step 2: Get user's Firestore profile**
```javascript
// Use the UID from auth to get Firestore profile
{
  "tool": "firestore_get_document",
  "collection": "users",
  "id": "kF8xQzY2mNPqRsT3vWxY4zA5bC6"
}
```

**Step 3: Verify email status and update profile**
```javascript
// If email is verified, update profile status
{
  "tool": "firestore_update_document",
  "collection": "users",
  "id": "kF8xQzY2mNPqRsT3vWxY4zA5bC6",
  "data": {
    "emailVerified": true,
    "verifiedAt": "__serverTimestamp__"
  }
}
```

### Example 7: Analytics and Reporting

This workflow demonstrates how to generate reports using Firestore queries.

**Step 1: Count total users**
```javascript
// Get total user count
{
  "tool": "firestore_count_documents",
  "collection": "users"
}
```

**Step 2: Count active users**
```javascript
// Count users with active status
{
  "tool": "firestore_count_documents",
  "collection": "users",
  "filters": [
    { "field": "status", "operator": "==", "value": "active" }
  ]
}
```

**Step 3: Get recent signups**
```javascript
// List users who signed up in the last 7 days
{
  "tool": "firestore_list_documents",
  "collection": "users",
  "filters": [
    { "field": "createdAt", "operator": ">", "value": "2024-01-08T00:00:00.000Z" }
  ],
  "orderBy": [
    { "field": "createdAt", "direction": "desc" }
  ]
}
```

### Example 8: Batch Operations with Pagination

This workflow shows how to process large datasets using pagination.

**Step 1: Process all documents in batches**
```javascript
// First batch
{
  "tool": "firestore_list_documents",
  "collection": "products",
  "limit": 100
}
// Response includes: documents array and nextPageToken

// Second batch using pageToken
{
  "tool": "firestore_list_documents",
  "collection": "products",
  "limit": 100,
  "pageToken": "products/product100"
}
// Continue until nextPageToken is null
```

**Step 2: Update documents in batches**
```javascript
// For each document in the batch, update as needed
{
  "tool": "firestore_update_document",
  "collection": "products",
  "id": "product1",
  "data": {
    "lastReviewed": "__serverTimestamp__",
    "reviewedBy": "admin@example.com"
  }
}
// Repeat for each document
```

---

## Troubleshooting

This section covers common issues you might encounter when using Firebase Power and how to resolve them.

### Configuration Issues

#### Issue: "SERVICE_ACCOUNT_KEY_PATH environment variable is required"

**Cause**: The required environment variable is not set in your configuration.

**Solution**:
1. Ensure you have downloaded your Firebase service account key JSON file
2. Note the absolute path to the file
3. Add the environment variable to your configuration:
   ```json
   {
     "env": {
       "SERVICE_ACCOUNT_KEY_PATH": "/absolute/path/to/serviceAccountKey.json"
     }
   }
   ```
4. Restart Kiro IDE or your MCP client
5. Verify the path is correct and the file exists

**Common mistakes**:
- Using a relative path instead of an absolute path
- Forgetting to escape backslashes on Windows (`C:\\Users\\...`)
- Having spaces in the path without proper quoting
- File permissions preventing access to the key file

---

#### Issue: "Failed to initialize Firebase Admin SDK"

**Cause**: The service account key file is invalid, corrupted, or has incorrect permissions.

**Solution**:
1. Verify the file exists at the specified path
2. Open the file and check it's valid JSON with these fields:
   - `type`: Should be "service_account"
   - `project_id`: Your Firebase project ID
   - `private_key`: Your private key
   - `client_email`: Service account email
3. If the file is corrupted, generate a new service account key:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Navigate to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Download and save the new file
   - Update your configuration with the new path
4. Check file permissions (should be readable by your user)
5. Ensure the service account has the necessary permissions in your Firebase project

---

#### Issue: "Storage bucket not found"

**Cause**: The specified storage bucket doesn't exist or the service account doesn't have access.

**Solution**:
1. Verify your Firebase project has Storage enabled:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Navigate to Storage
   - If not enabled, click "Get Started" to enable it
2. Check the bucket name in your configuration:
   - Should be in format: `project-id.appspot.com` or `project-id.firebasestorage.app`
   - Find the correct name in Firebase Console > Storage
3. If using a custom bucket, ensure it exists and is properly configured
4. Verify the service account has Storage Admin permissions:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to IAM & Admin > IAM
   - Find your service account
   - Ensure it has "Firebase Admin" or "Storage Admin" role
5. Try removing the `FIREBASE_STORAGE_BUCKET` variable to use the default bucket

---

### Firestore Issues

#### Issue: "Document not found"

**Cause**: The document ID doesn't exist in the specified collection.

**Solution**:
1. Verify the document ID is correct (case-sensitive)
2. Check the collection path is correct
3. Use `firestore_list_documents` to see available documents:
   ```javascript
   {
     "tool": "firestore_list_documents",
     "collection": "users",
     "limit": 10
   }
   ```
4. Verify you're using the correct Firebase project
5. Check if the document was deleted or never created

---

#### Issue: "The query requires an index"

**Cause**: Firestore requires a composite index for queries with multiple filters or ordering.

**Solution**:
1. The error message includes a direct link to create the index
2. Click the link in the error message (or copy it to your browser)
3. This will open Firebase Console with the index pre-configured
4. Click "Create Index"
5. Wait for the index to build (usually takes a few minutes)
6. Retry your query

**Example error**:
```
The query requires an index. You can create it here: 
https://console.firebase.google.com/project/my-project/firestore/indexes?create_composite=...
```

**Prevention**:
- Start with simple queries and add complexity gradually
- Test queries in Firebase Console first
- Create indexes proactively for known query patterns

---

#### Issue: "Permission denied" or "Missing or insufficient permissions"

**Cause**: The service account doesn't have the required permissions for the operation.

**Solution**:
1. Verify the service account has appropriate roles:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to IAM & Admin > IAM
   - Find your service account (ends with `@*.iam.gserviceaccount.com`)
   - Ensure it has "Firebase Admin SDK Administrator Service Agent" or "Cloud Datastore Owner" role
2. If using Firestore Security Rules, note that service accounts bypass security rules
3. Check if the collection or document path is correct
4. Verify your Firebase project is active and not suspended

---

#### Issue: "Invalid query filter operator"

**Cause**: Using an unsupported operator or combining operators incorrectly.

**Solution**:
1. Check the operator is one of: `==`, `!=`, `<`, `<=`, `>`, `>=`, `array-contains`, `array-contains-any`, `in`, `not-in`
2. Note these limitations:
   - Can't use `!=` with other operators
   - Can't use `not-in` with other operators
   - Can't use multiple `array-contains` operators
   - `in` and `array-contains-any` support max 10 values
3. Restructure your query to work within these constraints
4. Consider using multiple queries and combining results in your application

---

### Storage Issues

#### Issue: "File not found" when uploading from local path

**Cause**: The local file path is incorrect or the file doesn't exist.

**Solution**:
1. Verify the file exists at the specified path
2. Use absolute paths, not relative paths:
   - ✅ Good: `/Users/username/Documents/file.pdf`
   - ❌ Bad: `./Documents/file.pdf`
3. Check for typos in the file path
4. Ensure the file is readable (check permissions)
5. On Windows, use forward slashes or double backslashes:
   - ✅ Good: `C:/Users/username/file.pdf`
   - ✅ Good: `C:\\Users\\username\\file.pdf`
   - ❌ Bad: `C:\Users\username\file.pdf`

---

#### Issue: "Invalid base64 data" when uploading

**Cause**: The base64 string is truncated, corrupted, or too large for the LLM to handle.

**Solution**:
1. **Use local file paths instead** (strongly recommended):
   ```javascript
   {
     "filePath": "documents/file.pdf",
     "content": "/Users/username/Downloads/file.pdf"
   }
   ```
2. If you must use base64:
   - Ensure the data URL is complete and not truncated
   - Check the format: `data:image/png;base64,iVBORw0KG...`
   - Try with a smaller file
3. For large files, always use local file paths or URLs

---

#### Issue: "Error fetching or processing URL" when uploading from URL

**Cause**: The URL is not accessible, requires authentication, or returns invalid data.

**Solution**:
1. Verify the URL is publicly accessible (test in a browser)
2. For GitHub files, use the raw URL:
   - ✅ Good: `https://github.com/user/repo/blob/main/file.jpg?raw=true`
   - ❌ Bad: `https://github.com/user/repo/blob/main/file.jpg`
3. Check if the URL requires authentication (Firebase Power can't access authenticated URLs)
4. Verify the URL returns the actual file, not an HTML page
5. Try downloading the file locally first, then use `storage_upload` with a local path

---

#### Issue: "Document references cannot be directly accessed"

**Cause**: Trying to use an internal document reference (like `/antml:document`) as a file path.

**Solution**:
1. Use the actual file system path instead:
   ```javascript
   {
     "content": "/Users/username/Documents/file.pdf"
   }
   ```
2. If the file is in your workspace, provide the full path
3. For files from the web, use `storage_upload_from_url` instead

---

### Authentication Issues

#### Issue: "User not found"

**Cause**: The email or UID doesn't exist in Firebase Authentication.

**Solution**:
1. Verify the email address or UID is correct (case-sensitive for email)
2. Check you're using the correct Firebase project
3. Verify the user exists in Firebase Console:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Navigate to Authentication > Users
   - Search for the user
4. If the user should exist, they may have been deleted
5. Ensure you're not confusing Firebase Authentication users with Firestore user documents

---

#### Issue: "Insufficient permissions to access user data"

**Cause**: The service account doesn't have Firebase Authentication permissions.

**Solution**:
1. Verify the service account has appropriate roles:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to IAM & Admin > IAM
   - Find your service account
   - Ensure it has "Firebase Admin" or "Firebase Authentication Admin" role
2. Regenerate the service account key if needed
3. Ensure Firebase Authentication is enabled in your project

---

### Firebase Emulator Issues

#### Issue: "Connection refused" when using emulator

**Cause**: The Firebase emulator is not running or not configured correctly.

**Solution**:
1. Start the Firebase emulator:
   ```bash
   firebase emulators:start
   ```
2. Verify the emulator is running (you should see output showing which ports are active)
3. Add emulator environment variables to your configuration:
   ```json
   {
     "env": {
       "SERVICE_ACCOUNT_KEY_PATH": "/path/to/serviceAccountKey.json",
       "FIRESTORE_EMULATOR_HOST": "localhost:8080",
       "FIREBASE_STORAGE_EMULATOR_HOST": "localhost:9199",
       "FIREBASE_AUTH_EMULATOR_HOST": "localhost:9099"
     }
   }
   ```
4. Ensure the ports match your emulator configuration (check `firebase.json`)
5. Restart your MCP client after adding the environment variables

---

#### Issue: "Emulator data is lost after restart"

**Cause**: By default, emulators don't persist data between sessions.

**Solution**:
1. Export emulator data before stopping:
   ```bash
   firebase emulators:export ./emulator-data
   ```
2. Import data when starting:
   ```bash
   firebase emulators:start --import=./emulator-data
   ```
3. Or configure automatic export on shutdown in `firebase.json`:
   ```json
   {
     "emulators": {
       "firestore": {
         "port": 8080
       },
       "storage": {
         "port": 9199
       },
       "auth": {
         "port": 9099
       },
       "ui": {
         "enabled": true,
         "port": 4000
       },
       "export": {
         "path": "./emulator-data",
         "on_exit": true
       }
     }
   }
   ```

---

### Performance Issues

#### Issue: "Queries are slow or timing out"

**Cause**: Large collections, missing indexes, or inefficient queries.

**Solution**:
1. Add appropriate indexes for your queries
2. Use pagination with `limit` parameter:
   ```javascript
   {
     "collection": "users",
     "limit": 20,
     "pageToken": "users/lastDocId"
   }
   ```
3. Avoid fetching large documents unnecessarily
4. Use `firestore_count_documents` instead of listing all documents just to count them
5. Consider restructuring your data model for better query performance
6. Use collection group queries sparingly (they're slower than regular queries)

---

#### Issue: "File uploads are slow"

**Cause**: Large files, slow network, or inefficient upload method.

**Solution**:
1. For large files, use local file paths instead of base64:
   ```javascript
   {
     "content": "/path/to/large-file.mp4"
   }
   ```
2. For files on the web, use `storage_upload_from_url` instead of downloading and re-uploading
3. Check your internet connection speed
4. Consider compressing files before uploading
5. For very large files (>100MB), consider using Firebase's resumable upload API directly

---

### General Troubleshooting Tips

1. **Check Firebase Console**: Always verify your data in the [Firebase Console](https://console.firebase.google.com/) to ensure operations completed successfully

2. **Use Firebase Emulator for Development**: Test with the emulator to avoid affecting production data and to work offline

3. **Enable Debug Logging**: Set the `DEBUG` environment variable for more detailed logs:
   ```json
   {
     "env": {
       "DEBUG": "firebase-power:*"
     }
   }
   ```

4. **Verify Service Account Permissions**: Most issues stem from insufficient permissions. Check your service account roles in [Google Cloud Console](https://console.cloud.google.com/)

5. **Check Firebase Project Status**: Ensure your Firebase project is active and not suspended due to billing or policy issues

6. **Review Firebase Quotas**: Check if you've hit any Firebase quotas or limits:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Navigate to Usage and Billing
   - Review your current usage against quotas

7. **Test with Simple Operations First**: If something isn't working, start with a simple operation (like listing collections) to verify basic connectivity

8. **Keep Service Account Keys Secure**: Never commit service account keys to version control or share them publicly

---

### Getting Help

If you continue to experience issues after trying these troubleshooting steps:

1. **Check Firebase Status**: Visit [Firebase Status Dashboard](https://status.firebase.google.com/) to see if there are any ongoing service issues

2. **Review Firebase Documentation**: Consult the official [Firebase Documentation](https://firebase.google.com/docs) for detailed information about Firebase services

3. **Firebase Support**: For Firebase-specific issues, contact [Firebase Support](https://firebase.google.com/support)

4. **GitHub Issues**: Report bugs or request features for Firebase Power on the [GitHub repository](https://github.com/kiro-ai/firebase-power)

5. **Community Forums**: Ask questions in the [Firebase Community](https://firebase.google.com/community) or [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)

---

## Additional Resources

### Firebase Console Links

- **Firebase Console**: [https://console.firebase.google.com/](https://console.firebase.google.com/)
- **Google Cloud Console**: [https://console.cloud.google.com/](https://console.cloud.google.com/)
- **Firebase Status Dashboard**: [https://status.firebase.google.com/](https://status.firebase.google.com/)

### Firebase Documentation

- **Firebase Admin SDK**: [https://firebase.google.com/docs/admin/setup](https://firebase.google.com/docs/admin/setup)
- **Firestore Documentation**: [https://firebase.google.com/docs/firestore](https://firebase.google.com/docs/firestore)
- **Firebase Storage Documentation**: [https://firebase.google.com/docs/storage](https://firebase.google.com/docs/storage)
- **Firebase Authentication Documentation**: [https://firebase.google.com/docs/auth](https://firebase.google.com/docs/auth)
- **Firebase Emulator Suite**: [https://firebase.google.com/docs/emulator-suite](https://firebase.google.com/docs/emulator-suite)

### Development Tools

- **Firebase CLI**: [https://firebase.google.com/docs/cli](https://firebase.google.com/docs/cli)
- **Firebase Local Emulator Suite**: [https://firebase.google.com/docs/emulator-suite/install_and_configure](https://firebase.google.com/docs/emulator-suite/install_and_configure)

### Community and Support

- **Firebase Community**: [https://firebase.google.com/community](https://firebase.google.com/community)
- **Stack Overflow**: [https://stackoverflow.com/questions/tagged/firebase](https://stackoverflow.com/questions/tagged/firebase)
- **Firebase Blog**: [https://firebase.blog/](https://firebase.blog/)

---

## Technical Details

### MCP Protocol

Firebase Power implements the Model Context Protocol (MCP) version 1.11.0, which enables AI assistants to interact with Firebase services through a standardized interface.

### Transport Mechanisms

Firebase Power supports two transport mechanisms:

1. **stdio (Standard Input/Output)**: Default transport for most MCP clients
   - Used by Kiro IDE, Claude Desktop, VS Code extensions
   - Communication through standard input and output streams

2. **HTTP**: Alternative transport for web-based integrations
   - Enable by setting `TRANSPORT=http` environment variable
   - Configure port with `PORT` environment variable (default: 3000)

### Dependencies

Firebase Power is built on these core technologies:

- **Firebase Admin SDK** (v13.3.0): Official Firebase server-side SDK
- **@modelcontextprotocol/sdk** (v1.11.0): MCP protocol implementation
- **Node.js**: Runtime environment (requires Node.js 18 or higher)

### Security Considerations

- **Service Account Keys**: Store securely and never commit to version control
- **Permissions**: Service accounts have full administrative access to your Firebase project
- **Environment Variables**: Keep configuration files secure and don't share them
- **Firebase Security Rules**: Service accounts bypass Firestore and Storage security rules
- **Emulator for Development**: Use the Firebase emulator for development to protect production data

### Performance Characteristics

- **Firestore Operations**: Typically complete in 50-200ms
- **Storage Uploads**: Speed depends on file size and network connection
- **Authentication Lookups**: Usually complete in 50-100ms
- **Pagination**: Use `limit` parameter to control response size and improve performance
- **Indexes**: Required for complex queries; create them proactively for best performance

---

## License

Firebase Power is licensed under the MIT License. See the LICENSE file for details.

## Version

Current version: 1.4.9

For changelog and version history, see [CHANGELOG.md](./CHANGELOG.md).
