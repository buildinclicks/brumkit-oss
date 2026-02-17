// Test file for base ESLint config
// This file intentionally contains linting violations

import { something } from './nonexistent';
import fs from 'fs';
import type { SomeType } from './types';
import path from 'path';

// Test 1: unused variable (should error)
const unusedVariable = 'test';

// Test 2: any type (should error)
function testAny(param: any) {
  return param;
}

// Test 3: var usage (should error)
var oldStyleVar = 'bad';

// Test 4: console.log (should warn)
console.log('This should warn');

// Test 5: prefer const (should error)
let shouldBeConst = 'never changes';

// Export to avoid file-level unused errors
export { testAny, oldStyleVar, shouldBeConst };
