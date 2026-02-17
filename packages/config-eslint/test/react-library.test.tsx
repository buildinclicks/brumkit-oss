// Test file for React library ESLint config
// This file intentionally contains linting violations
import React from 'react';

// Test 1: missing key in list (should error)
export function ListWithoutKeys() {
  const items = ['a', 'b', 'c'];
  return (
    <ul>
      {items.map((item) => (
        <li>{item}</li>
      ))}
    </ul>
  );
}

// Test 2: boolean prop with explicit true (should error)
export function ExplicitBoolean() {
  return <button disabled={true}>Click me</button>;
}

// Test 3: unnecessary curly braces (should error)
export function UnnecessaryCurly() {
  return <div>{'text'}</div>;
}

// Test 4: missing alt text (should error)
export function ImageWithoutAlt() {
  return <img src="/test.jpg" />;
}

// Test 5: array index as key (should warn)
export function ListWithIndexKeys() {
  const items = ['a', 'b', 'c'];
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
