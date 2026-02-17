// Test file for Next.js ESLint config
// This file intentionally contains linting violations
import React from 'react';

// Test 1: missing key in list (should error)
function ListWithoutKeys() {
  const items = ['a', 'b', 'c'];
  return (
    <ul>
      {items.map((item) => (
        <li>{item}</li>
      ))}
    </ul>
  );
}

// Test 2: target="_blank" without rel (should error)
function UnsafeLink() {
  return (
    <a href="https://example.com" target="_blank">
      Click me
    </a>
  );
}

// Test 3: array index as key (should warn)
function ListWithIndexKeys() {
  const items = ['a', 'b', 'c'];
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

// Test 4: missing alt text (should error)
function ImageWithoutAlt() {
  return <img src="/test.jpg" />;
}

// Test 5: unstable nested component (should error)
function ParentComponent() {
  function NestedComponent() {
    return <div>Nested</div>;
  }
  return <NestedComponent />;
}

export {
  ListWithoutKeys,
  UnsafeLink,
  ListWithIndexKeys,
  ImageWithoutAlt,
  ParentComponent,
};
