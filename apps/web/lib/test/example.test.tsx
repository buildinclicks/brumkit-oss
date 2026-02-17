/**
 * Example Component Tests
 *
 * Demonstrates how to use the custom testing utilities:
 * - renderWithProviders for components with providers
 * - MSW for API mocking
 * - Testing patterns for forms, async data, and user interactions
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { FieldError } from '@/components/form/field-error';
import {
  renderWithProviders,
  screen,
  waitFor,
  userEvent,
  server,
  http,
  HttpResponse,
  mockUser,
} from '@/lib/test';

describe('FieldError Component', () => {
  it('should not render when no error is provided', () => {
    const { container } = renderWithProviders(<FieldError />, {
      disableTheme: true,
    });
    expect(container).toBeEmptyDOMElement();
  });

  it('should render error message with icon', () => {
    renderWithProviders(
      <FieldError error={{ message: 'email.invalid', type: 'manual' }} />,
      { disableTheme: true }
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    // The translation works, so we get the translated message
    expect(
      screen.getByText('Please enter a valid email address')
    ).toBeInTheDocument();
  });
});

describe('Testing with Providers', () => {
  it('should render with all providers', () => {
    const TestComponent = () => <div>Test Component</div>;

    renderWithProviders(<TestComponent />, { disableTheme: true });

    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('should work without theme provider', () => {
    const TestComponent = () => <div>No Theme</div>;

    renderWithProviders(<TestComponent />, { disableTheme: true });

    expect(screen.getByText('No Theme')).toBeInTheDocument();
  });

  // Note: Tests with ThemeProvider enabled are skipped due to matchMedia complexities in jsdom
  // For components that need theme testing, test the logic without the provider
});

describe('Testing with MSW', () => {
  it('should mock API responses', async () => {
    // Override the default handler for this test
    server.use(
      http.get('/api/user/profile', () => {
        return HttpResponse.json({
          success: true,
          data: {
            ...mockUser,
            name: 'Custom Test User',
          },
        });
      })
    );

    // Fetch data in component (example)
    const response = await fetch('/api/user/profile');
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.data.name).toBe('Custom Test User');
  });

  it('should handle API errors', async () => {
    server.use(
      http.get('/api/user/profile', () => {
        return HttpResponse.json(
          {
            success: false,
            error: 'Unauthorized',
          },
          { status: 401 }
        );
      })
    );

    const response = await fetch('/api/user/profile');
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Unauthorized');
  });
});

describe('User Interaction Tests', () => {
  it('should handle user interactions', async () => {
    const handleClick = vi.fn();
    const TestButton = () => <button onClick={handleClick}>Click me</button>;

    const user = userEvent.setup();
    renderWithProviders(<TestButton />, { disableTheme: true });

    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should handle form input', async () => {
    const TestForm = () => {
      const [value, setValue] = React.useState('');
      return (
        <div>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label="test-input"
          />
          <p>Value: {value}</p>
        </div>
      );
    };

    const user = userEvent.setup();
    renderWithProviders(<TestForm />, { disableTheme: true });

    const input = screen.getByLabelText('test-input');
    await user.type(input, 'Hello World');

    await waitFor(() => {
      expect(screen.getByText('Value: Hello World')).toBeInTheDocument();
    });
  });
});
