// Test file to verify base TypeScript configuration
// This should compile without errors

// Test 1: Strict null checks
function testStrictNullChecks(value: string | null): string {
  if (value === null) {
    return 'null';
  }
  return value.toUpperCase();
}

// Test 2: No implicit any
function testNoImplicitAny(x: number, y: number): number {
  return x + y;
}

// Test 3: Unused locals should error if enabled
function testUnusedLocals(): void {
  const used = 'used';
  console.log(used);
}

// Test 4: Array index access
function testArrayAccess(arr: string[]): string | undefined {
  return arr[0]; // Should require undefined check
}

// Test 5: Const assertions
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} as const;

type Config = typeof config;

// Export to avoid unused file error
export {
  testStrictNullChecks,
  testNoImplicitAny,
  testUnusedLocals,
  testArrayAccess,
  config,
};
export type { Config };
