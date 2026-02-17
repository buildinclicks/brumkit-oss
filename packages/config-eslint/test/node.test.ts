// Test file for Node.js ESLint config
// This file intentionally contains linting violations
import fs from 'fs';
import path from 'path';

// Test 1: process.exit (should error)
function exitProcess() {
  process.exit(1);
}

// Test 2: sync operations (should warn)
function syncRead() {
  return fs.readFileSync('/path/to/file', 'utf-8');
}

// Test 3: any type (should error)
function handleData(data: any) {
  return data;
}

// Test 4: var usage (should error)
var oldStyleVar = 'bad';

// Test 5: console is allowed in Node
console.log('This is fine in Node.js');
console.error('This is also fine');

// Export to avoid unused errors
export { exitProcess, syncRead, handleData, oldStyleVar };
