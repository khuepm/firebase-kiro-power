#!/bin/bash

# Test script for npx installation (Task 10.1)
# This script validates that the Firebase Power package can be installed and run via npx

set -e

echo "=== Firebase Power NPX Installation Test ==="
echo ""

# Test 1: Verify package.json configuration
echo "Test 1: Verifying package.json configuration..."
if grep -q '"name": "@kiro/firebase-power"' package.json; then
    echo "✓ Package name is correct: @kiro/firebase-power"
else
    echo "✗ Package name is incorrect"
    exit 1
fi

if grep -q '"firebase-power": "./dist/index.js"' package.json; then
    echo "✓ Binary configuration is correct"
else
    echo "✗ Binary configuration is incorrect"
    exit 1
fi

echo ""

# Test 2: Verify dist/index.js has shebang
echo "Test 2: Verifying executable has shebang..."
if head -1 dist/index.js | grep -q "#!/usr/bin/env node"; then
    echo "✓ Shebang is present in dist/index.js"
else
    echo "✗ Shebang is missing in dist/index.js"
    exit 1
fi

echo ""

# Test 3: Verify dist/index.js is executable (after npm link)
echo "Test 3: Verifying firebase-power command is available..."
if command -v firebase-power &> /dev/null; then
    echo "✓ firebase-power command is available"
else
    echo "✗ firebase-power command is not available"
    echo "  Run 'npm link' to make it available"
    exit 1
fi

echo ""

# Test 4: Test server startup with missing SERVICE_ACCOUNT_KEY_PATH
echo "Test 4: Testing server startup without SERVICE_ACCOUNT_KEY_PATH..."
output=$(firebase-power 2>&1 || true)
if echo "$output" | grep -q "SERVICE_ACCOUNT_KEY_PATH not set"; then
    echo "✓ Server correctly reports missing SERVICE_ACCOUNT_KEY_PATH"
else
    echo "✗ Server did not report missing SERVICE_ACCOUNT_KEY_PATH"
    exit 1
fi

echo ""

# Test 5: Verify POWER.md is included in distribution
echo "Test 5: Verifying POWER.md is included..."
if [ -f "POWER.md" ]; then
    echo "✓ POWER.md exists"
else
    echo "✗ POWER.md is missing"
    exit 1
fi

if grep -q "POWER.md" package.json; then
    echo "✓ POWER.md is listed in package.json files array"
else
    echo "✗ POWER.md is not listed in package.json files array"
    exit 1
fi

echo ""

# Test 6: Verify all required files are present
echo "Test 6: Verifying all required distribution files..."
required_files=("dist/index.js" "dist/config.js" "README.md" "LICENSE" "POWER.md")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file exists"
    else
        echo "✗ $file is missing"
        exit 1
    fi
done

echo ""

# Test 7: Test with dummy service account (will fail but should start)
echo "Test 7: Testing server initialization with test service account..."
if [ -f "test-service-account.json" ]; then
    output=$(SERVICE_ACCOUNT_KEY_PATH=./test-service-account.json firebase-power 2>&1 || true)
    if echo "$output" | grep -q "Service account file read successfully"; then
        echo "✓ Server reads service account file"
    else
        echo "✗ Server failed to read service account file"
        exit 1
    fi
else
    echo "⚠ test-service-account.json not found, skipping this test"
fi

echo ""
echo "=== All NPX Installation Tests Passed! ==="
echo ""
echo "Summary:"
echo "- Package is correctly configured for npx installation"
echo "- Binary executable is properly set up"
echo "- All required files are present"
echo "- Server starts and validates configuration correctly"
echo ""
echo "Note: Full end-to-end testing requires:"
echo "  1. Publishing to npm registry"
echo "  2. Running: npx @kiro/firebase-power"
echo "  3. Testing with a real Firebase project"
