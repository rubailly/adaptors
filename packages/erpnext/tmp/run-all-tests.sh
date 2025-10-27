#!/bin/bash

# Script to run all ERPNext adaptor tests sequentially
# Usage: bash tmp/run-all-tests.sh

export OPENFN_ADAPTORS_REPO=/home/rbailly/eclipse-workspace/openfnerpnext/adaptors
BASE_DIR="/home/rbailly/eclipse-workspace/openfnerpnext/adaptors/packages/erpnext"

echo "=== Starting ERPNext Adaptor Integration Tests ==="
echo ""

# Test 1: GetCount
echo "Test 1: GetCount - Counting customers..."
openfn "$BASE_DIR/tmp/test-1-getcount.js" -ma erpnext -s "$BASE_DIR/tmp/state.json" -o "$BASE_DIR/tmp/output-1-getcount.json" 2>&1 | grep -E "(✔|✘|completed|aborted)"
echo ""

# Test 2: GetList
echo "Test 2: GetList - Listing customers..."
openfn "$BASE_DIR/tmp/test-2-getlist.js" -ma erpnext -s "$BASE_DIR/tmp/state.json" -o "$BASE_DIR/tmp/output-2-getlist.json" 2>&1 | grep -E "(✔|✘|completed|aborted)"
echo ""

# Test 3: Create
echo "Test 3: Create - Creating new customer..."
openfn "$BASE_DIR/tmp/test-3-create.js" -ma erpnext -s "$BASE_DIR/tmp/state.json" -o "$BASE_DIR/tmp/output-3-create.json" 2>&1 | grep -E "(✔|✘|completed|aborted)"
echo "Check output-3-create.json for the created customer ID"
echo ""

# Test 4: Read
echo "Test 4: Read - Reading existing customer..."
openfn "$BASE_DIR/tmp/test-4-read.js" -ma erpnext -s "$BASE_DIR/tmp/state.json" -o "$BASE_DIR/tmp/output-4-read.json" 2>&1 | grep -E "(✔|✘|completed|aborted)"
echo ""

# Test 5: Update
echo "Test 5: Update - Updating customer..."
openfn "$BASE_DIR/tmp/test-5-update.js" -ma erpnext -s "$BASE_DIR/tmp/state.json" -o "$BASE_DIR/tmp/output-5-update.json" 2>&1 | grep -E "(✔|✘|completed|aborted)"
echo ""

# Test 6: Delete (optional)
read -p "Do you want to run the DELETE test? This will remove the test customer. (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Test 6: Delete - Deleting customer..."
    openfn "$BASE_DIR/tmp/test-6-delete.js" -ma erpnext -s "$BASE_DIR/tmp/state.json" -o "$BASE_DIR/tmp/output-6-delete.json" 2>&1 | grep -E "(✔|✘|completed|aborted)"
else
    echo "Skipping Test 6: Delete"
fi

echo ""
echo "=== All Tests Complete ==="
echo "Check the output-*.json files in tmp/ for detailed results"
