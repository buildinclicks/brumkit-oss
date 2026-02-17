import { screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { renderWithProviders } from '@/lib/test/render';

import Error from './error';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      title: 'Server Error',
      heading: '500 - Server Error',
      description: 'Oops! Something went wrong on our end.',
      message: "We're working on fixing this. Please try again later.",
      go_home: 'Go to Home',
      try_again: 'Try Again',
    };
    return translations[key] || key;
  }),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('🔴 RED: Error Page (500)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear console.error mock
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('Rendering', () => {
    it('should render the 500 heading', () => {
      renderWithProviders(
        <Error error={new Error('Test error')} reset={() => {}} />
      );

      expect(
        screen.getByRole('heading', { name: /500.*server error/i })
      ).toBeInTheDocument();
    });

    it('should display descriptive error message', () => {
      renderWithProviders(
        <Error error={new Error('Test error')} reset={() => {}} />
      );

      expect(
        screen.getByText(/something went wrong on our end/i)
      ).toBeInTheDocument();
    });

    it('should render navigation links', () => {
      renderWithProviders(
        <Error error={new Error('Test error')} reset={() => {}} />
      );

      // Should have "Go to Home" link
      const homeLink = screen.getByRole('link', { name: /go to home/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should render try again button', () => {
      renderWithProviders(
        <Error error={new Error('Test error')} reset={() => {}} />
      );

      expect(
        screen.getByRole('button', { name: /try again/i })
      ).toBeInTheDocument();
    });

    it('should render helpful message', () => {
      renderWithProviders(
        <Error error={new Error('Test error')} reset={() => {}} />
      );

      expect(screen.getByText(/working on fixing this/i)).toBeInTheDocument();
    });
  });

  describe('Functionality', () => {
    it('should call reset function when try again is clicked', () => {
      const resetMock = vi.fn();
      renderWithProviders(
        <Error error={new Error('Test error')} reset={resetMock} />
      );

      const tryAgainButton = screen.getByRole('button', {
        name: /try again/i,
      });
      tryAgainButton.click();

      expect(resetMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderWithProviders(
        <Error error={new Error('Test error')} reset={() => {}} />
      );

      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);

      // Main heading should be h1
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
    });
  });
});
