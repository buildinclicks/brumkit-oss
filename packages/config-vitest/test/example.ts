// Example utility functions for testing
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

export async function fetchData(url: string): Promise<{ data: string }> {
  // Simulated async operation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: `Data from ${url}` });
    }, 100);
  });
}
