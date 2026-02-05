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
npx @kiro/firebase-power
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
      "args": ["-y", "@kiro/firebase-power"],
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
      "args": ["-y", "@kiro/firebase-power"],
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
        "args": ["-y", "@kiro/firebase-power"],
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
      "args": ["-y", "@kiro/firebase-power"],
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
      "args": ["-y", "@kiro/firebase-power"],
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
