// Test file to verify Next.js TypeScript configuration
// This should compile with JSX support

import React from 'react';

// Test 1: JSX syntax
function TestComponent(): React.ReactElement {
  return <div>Hello Next.js</div>;
}

// Test 2: Server Component (async)
async function ServerComponent(): Promise<React.ReactElement> {
  const data = await fetch('https://api.example.com/data');
  return <div>{JSON.stringify(data)}</div>;
}

// Test 3: Client Component
('use client');
function ClientComponent(): React.ReactElement {
  const [count, setCount] = React.useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// Test 4: Path aliases should work
// import { something } from '@/lib/utils';
// import { another } from '@modules/helpers';

export { TestComponent, ServerComponent, ClientComponent };
