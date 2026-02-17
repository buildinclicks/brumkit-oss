// Test file to verify React Library TypeScript configuration
import React from 'react';

// Test 1: React component with props
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({
  label,
  onClick,
  disabled = false,
}: ButtonProps): React.ReactElement {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// Test 2: Generic component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

export function List<T>({
  items,
  renderItem,
}: ListProps<T>): React.ReactElement {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Test 3: Hook
export function useCounter(initialValue = 0) {
  const [count, setCount] = React.useState(initialValue);
  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);
  return { count, increment, decrement };
}

// Test 4: Type exports
export type { ButtonProps, ListProps };
