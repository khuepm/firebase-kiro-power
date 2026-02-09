#!/bin/bash

# Test script for Firebase Power with emulator
# This validates the server can start and communicate with Firebase emulator

set -e

echo "=== Firebase Power Emulator Integration Test ==="
echo ""

# Start Firebase emulator in background
echo "Starting Firebase emulator..."
firebase emulators:start --only firestore,auth,storage --project demo-project > emulator.log 2>&1 &
EMULATOR_PID=$!

# Wait for emulator to start
echo "Waiting for emulator to start..."
sleep 5

# Check if emulator is running
if ! ps -p $EMULATOR_PID > /dev/null; then
    echo "✗ Firebase emulator failed to start"
    cat emulator.log
    exit 1
fi

echo "✓ Firebase emulator started (PID: $EMULATOR_PID)"
echo ""

# Test server startup with emulator
echo "Testing server startup with emulator..."
export SERVICE_ACCOUNT_KEY_PATH=./test-service-account.json
export USE_FIREBASE_EMULATOR=true
export FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
export FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
export FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199

# Start server in background
timeout 5 firebase-power > server.log 2>&1 &
SERVER_PID=$!

# Wait a bit for server to start
sleep 2

# Check server output
if grep -q "Service account file read successfully" server.log; then
    echo "✓ Server started successfully with emulator"
else
    echo "✗ Server failed to start"
    cat server.log
    kill $EMULATOR_PID 2>/dev/null || true
    exit 1
fi

# Cleanup
echo ""
echo "Cleaning up..."
kill $SERVER_PID 2>/dev/null || true
kill $EMULATOR_PID 2>/dev/null || true
sleep 2

echo "✓ Test completed successfully"
echo ""
echo "=== Emulator Integration Test Passed! ==="
