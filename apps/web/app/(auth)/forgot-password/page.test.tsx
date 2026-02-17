/**
 * Forgot Password Page Tests (TDD)
 *
 * 🟢 GREEN: Tests should now PASS with implementation
 *
 * Test Coverage:
 * - Page rendering ✓
 * - Email validation ✓
 * - Form submission ✓
 * - Success/error states ✓
 * - Rate limiting ✓
 * - Accessibility ✓
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { renderWithProviders, screen, waitFor, userEvent } from '@/lib/test';

// Import the component
import ForgotPasswordPage from './page';

// Mock server action
const mockRequestPasswordReset = vi.fn();
vi.mock('@/app/actions', () => ({
  requestPasswordReset: (...args: any[]) => mockRequestPasswordReset(...args),
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('🟢 GREEN: ForgotPasswordPage (TDD)', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render forgot password form', () => {
      renderWithProviders(<ForgotPasswordPage />, { disableTheme: true });

      expect(
        screen.getByText(/forgot password/i, { selector: 'div' })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /send reset link/i })
      ).toBeInTheDocument();
    });

    it('should show helpful instructions', () => {
      renderWithProviders(<ForgotPasswordPage />, { disableTheme: true });

      expect(screen.getByText(/enter your email address/i)).toBeInTheDocument();
      expect(screen.getByText(/we'll send you a link/i)).toBeInTheDocument();
    });

    it('should have link back to login', () => {
      renderWithProviders(<ForgotPasswordPage />, { disableTheme: true });

      const loginLink = screen.getByRole('link', { name: /back to login/i });
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });

  describe('Email Validation', () => {
    it('should show validation error for invalid email', async () => {
      renderWithProviders(<ForgotPasswordPage />, { disableTheme: true });

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(
          screen.getByText(/please enter a valid email/i)
        ).toBeInTheDocument();
      });
    });

    it('should show error for empty email', async () => {
      renderWithProviders(<ForgotPasswordPage />, { disableTheme: true });

      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });

    it('should not show errors on initial render', () => {
      renderWithProviders(<ForgotPasswordPage />, { disableTheme: true });

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should successfully send reset link', async () => {
      mockRequestPasswordReset.mockResolvedValue({
        success: true,
        data: { message: 'Reset link sent' },
      });

      renderWithProviders(<ForgotPasswordPage />, { disableTheme: true });

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.click(
        screen.getByRole('button', { name: /send reset link/i })
      );

      await waitFor(() => {
        expect(mockRequestPasswordReset).toHaveBeenCalledWith(
          'test@example.com'
        );
      });
    });

    it('should show success message after submission', async () => {
      const { toast } = await import('sonner');
      mockRequestPasswordReset.mockResolvedValue({
        success: true,
        data: { message: 'Reset link sent' },
      });

      renderWithProviders(<ForgotPasswordPage />, { disableTheme: true });

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.click(
        screen.getByRole('button', { name: /send reset link/i })
      );

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Email Sent',
          expect.any(Object)
        );
      });
    });

    it('should disable button while submitting', async () => {
      mockRequestPasswordReset.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      renderWithProviders(<ForgotPasswordPage />, { disableTheme: true });

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
    });

    it('should show error toast on server error', async () => {
      const { toast } = await import('sonner');
      mockRequestPasswordReset.mockResolvedValue({
        success: false,
        error: 'Server error occurred',
      });

      renderWithProviders(<ForgotPasswordPage />, { disableTheme: true });

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.click(
        screen.getByRole('button', { name: /send reset link/i })
      );

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });
  });

  describe('Security & Rate Limiting', () => {
    it('should not reveal if email exists (security)', async () => {
      // Should show same success message whether email exists or not
      mockRequestPasswordReset.mockResolvedValue({
        success: true,
        data: { message: 'If that email exists, we sent a reset link' },
      });

      renderWithProviders(<ForgotPasswordPage />, { disableTheme: true });

      await user.type(
        screen.getByLabelText(/email/i),
        'nonexistent@example.com'
      );
      await user.click(
        screen.getByRole('button', { name: /send reset link/i })
      );

      await waitFor(() => {
        expect(screen.getByText(/if that email exists/i)).toBeInTheDocument();
      });
    });

    it('should handle rate limit error', async () => {
      const { toast } = await import('sonner');
      mockRequestPasswordReset.mockResolvedValue({
        success: false,
        error: 'Too many requests. Please try again later.',
      });

      renderWithProviders(<ForgotPasswordPage />, { disableTheme: true });

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.click(
        screen.getByRole('button', { name: /send reset link/i })
      );

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for input', () => {
      renderWithProviders(<ForgotPasswordPage />, { disableTheme: true });

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('should display errors with role="alert"', async () => {
      renderWithProviders(<ForgotPasswordPage />, { disableTheme: true });

      const submitButton = screen.getByRole('button', {
        name: /send reset link/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });

    it('should have descriptive button text', () => {
      renderWithProviders(<ForgotPasswordPage />, { disableTheme: true });

      expect(
        screen.getByRole('button', { name: /send reset link/i })
      ).toBeInTheDocument();
    });
  });

  describe('User Experience', () => {
    it('should show success state after submission', async () => {
      mockRequestPasswordReset.mockResolvedValue({
        success: true,
        data: { message: 'Reset link sent' },
      });

      renderWithProviders(<ForgotPasswordPage />, { disableTheme: true });

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.click(
        screen.getByRole('button', { name: /send reset link/i })
      );

      await waitFor(() => {
        expect(
          screen.getByText(/check your email/i, { selector: 'div' })
        ).toBeInTheDocument();
      });
    });

    it('should allow retry after error', async () => {
      const { toast } = await import('sonner');
      mockRequestPasswordReset
        .mockResolvedValueOnce({ success: false, error: 'Network error' })
        .mockResolvedValueOnce({ success: true, data: { message: 'Sent' } });

      renderWithProviders(<ForgotPasswordPage />, { disableTheme: true });

      // First attempt - fails
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.click(
        screen.getByRole('button', { name: /send reset link/i })
      );

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });

      // Second attempt - succeeds
      await user.click(
        screen.getByRole('button', { name: /send reset link/i })
      );

      await waitFor(() => {
        expect(mockRequestPasswordReset).toHaveBeenCalledTimes(2);
      });
    });
  });
});
