import { describe, it, expect, vi, beforeEach } from 'vitest';

import { changePassword } from '@/app/actions';
import { renderWithProviders, screen, waitFor, userEvent } from '@/lib/test';

import { ChangePasswordForm } from './change-password-form';

// Mock the server action
vi.mock('@/app/actions', () => ({
  changePassword: vi.fn(),
}));

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ChangePasswordForm', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render form with all password fields', () => {
      renderWithProviders(<ChangePasswordForm />, { disableTheme: true });

      expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
      expect(screen.getByLabelText('New Password')).toBeInTheDocument();
      expect(
        screen.getByLabelText(/confirm new password/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /update password/i })
      ).toBeInTheDocument();
    });

    it('should render all password fields as password type by default', () => {
      renderWithProviders(<ChangePasswordForm />, { disableTheme: true });

      expect(screen.getByLabelText(/current password/i)).toHaveAttribute(
        'type',
        'password'
      );
      expect(screen.getByLabelText('New Password')).toHaveAttribute(
        'type',
        'password'
      );
      expect(screen.getByLabelText(/confirm new password/i)).toHaveAttribute(
        'type',
        'password'
      );
    });

    it('should have show/hide toggle buttons for each password field', () => {
      renderWithProviders(<ChangePasswordForm />, { disableTheme: true });

      // Each password field should have a toggle button
      const toggleButtons = screen.getAllByRole('button', {
        name: /show password|hide password/i,
      });
      expect(toggleButtons).toHaveLength(3);
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle current password visibility', async () => {
      renderWithProviders(<ChangePasswordForm />, { disableTheme: true });

      const currentPasswordInput = screen.getByLabelText(/current password/i);
      const toggleButtons = screen.getAllByRole('button', {
        name: /show password|hide password/i,
      });

      expect(currentPasswordInput).toHaveAttribute('type', 'password');

      // Click first toggle (current password)
      await user.click(toggleButtons[0]);
      expect(currentPasswordInput).toHaveAttribute('type', 'text');

      // Click again to hide
      await user.click(toggleButtons[0]);
      expect(currentPasswordInput).toHaveAttribute('type', 'password');
    });

    it('should toggle new password visibility', async () => {
      renderWithProviders(<ChangePasswordForm />, { disableTheme: true });

      const newPasswordInput = screen.getByLabelText('New Password');
      const toggleButtons = screen.getAllByRole('button', {
        name: /show password|hide password/i,
      });

      expect(newPasswordInput).toHaveAttribute('type', 'password');

      // Click second toggle (new password)
      await user.click(toggleButtons[1]);
      expect(newPasswordInput).toHaveAttribute('type', 'text');
    });
  });

  describe('Validation', () => {
    it('should show error for empty current password', async () => {
      renderWithProviders(<ChangePasswordForm />, { disableTheme: true });

      const submitButton = screen.getByRole('button', {
        name: /update password/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        // The form should have validation errors (multiple fields will have errors)
        const alerts = screen.getAllByRole('alert');
        expect(alerts.length).toBeGreaterThan(0);
      });
    });

    it('should show error for weak new password', async () => {
      renderWithProviders(<ChangePasswordForm />, { disableTheme: true });

      await user.type(
        screen.getByLabelText(/current password/i),
        'OldPassword123!'
      );
      await user.type(screen.getByLabelText('New Password'), 'weak');
      await user.type(screen.getByLabelText(/confirm new password/i), 'weak');

      const submitButton = screen.getByRole('button', {
        name: /update password/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });

    it('should show error when passwords do not match', async () => {
      renderWithProviders(<ChangePasswordForm />, { disableTheme: true });

      await user.type(
        screen.getByLabelText(/current password/i),
        'OldPassword123!'
      );
      await user.type(screen.getByLabelText('New Password'), 'NewPassword123!');
      await user.type(
        screen.getByLabelText(/confirm new password/i),
        'DifferentPassword123!'
      );

      const submitButton = screen.getByRole('button', {
        name: /update password/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        // Check for validation error (form won't submit if passwords don't match)
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });

    it('should not show validation errors on initial render', () => {
      renderWithProviders(<ChangePasswordForm />, { disableTheme: true });

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call changePassword with correct data', async () => {
      vi.mocked(changePassword).mockResolvedValue({ success: true });

      renderWithProviders(<ChangePasswordForm />, { disableTheme: true });

      await user.type(
        screen.getByLabelText(/current password/i),
        'OldPassword123!'
      );
      await user.type(screen.getByLabelText('New Password'), 'NewPassword123!');
      await user.type(
        screen.getByLabelText(/confirm new password/i),
        'NewPassword123!'
      );

      const submitButton = screen.getByRole('button', {
        name: /update password/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(vi.mocked(changePassword)).toHaveBeenCalledWith({
          currentPassword: 'OldPassword123!',
          newPassword: 'NewPassword123!',
          confirmPassword: 'NewPassword123!',
        });
      });
    });

    it('should show success toast on successful password change', async () => {
      const { toast } = await import('sonner');
      vi.mocked(changePassword).mockResolvedValue({ success: true });

      renderWithProviders(<ChangePasswordForm />, { disableTheme: true });

      await user.type(
        screen.getByLabelText(/current password/i),
        'OldPassword123!'
      );
      await user.type(screen.getByLabelText('New Password'), 'NewPassword123!');
      await user.type(
        screen.getByLabelText(/confirm new password/i),
        'NewPassword123!'
      );

      await user.click(
        screen.getByRole('button', { name: /update password/i })
      );

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Password Updated',
          expect.objectContaining({
            description: 'Your password has been changed successfully.',
          })
        );
      });
    });

    it('should clear form after successful password change', async () => {
      vi.mocked(changePassword).mockResolvedValue({ success: true });

      renderWithProviders(<ChangePasswordForm />, { disableTheme: true });

      const currentPasswordInput = screen.getByLabelText(
        /current password/i
      ) as HTMLInputElement;
      const newPasswordInput = screen.getByLabelText(
        'New Password'
      ) as HTMLInputElement;
      const confirmPasswordInput = screen.getByLabelText(
        /confirm new password/i
      ) as HTMLInputElement;

      await user.type(currentPasswordInput, 'OldPassword123!');
      await user.type(newPasswordInput, 'NewPassword123!');
      await user.type(confirmPasswordInput, 'NewPassword123!');

      await user.click(
        screen.getByRole('button', { name: /update password/i })
      );

      await waitFor(() => {
        expect(currentPasswordInput.value).toBe('');
        expect(newPasswordInput.value).toBe('');
        expect(confirmPasswordInput.value).toBe('');
      });
    });

    it('should show error toast on failure', async () => {
      const { toast } = await import('sonner');
      vi.mocked(changePassword).mockResolvedValue({
        success: false,
        error: 'Current password is incorrect',
      });

      renderWithProviders(<ChangePasswordForm />, { disableTheme: true });

      await user.type(
        screen.getByLabelText(/current password/i),
        'WrongPassword123!'
      );
      await user.type(screen.getByLabelText('New Password'), 'NewPassword123!');
      await user.type(
        screen.getByLabelText(/confirm new password/i),
        'NewPassword123!'
      );

      await user.click(
        screen.getByRole('button', { name: /update password/i })
      );

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Failed to Change Password',
          expect.objectContaining({
            description: expect.stringContaining(
              'Current password is incorrect'
            ),
          })
        );
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all inputs', () => {
      renderWithProviders(<ChangePasswordForm />, { disableTheme: true });

      expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
      expect(screen.getByLabelText('New Password')).toBeInTheDocument();
      expect(
        screen.getByLabelText(/confirm new password/i)
      ).toBeInTheDocument();
    });

    it('should have aria-invalid on fields with errors', async () => {
      renderWithProviders(<ChangePasswordForm />, { disableTheme: true });

      await user.click(
        screen.getByRole('button', { name: /update password/i })
      );

      await waitFor(() => {
        const currentPasswordInput = screen.getByLabelText(/current password/i);
        expect(currentPasswordInput).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('should have descriptive button text', () => {
      renderWithProviders(<ChangePasswordForm />, { disableTheme: true });

      expect(
        screen.getByRole('button', { name: /update password/i })
      ).toBeInTheDocument();
    });

    it('should have aria-label on toggle buttons', () => {
      renderWithProviders(<ChangePasswordForm />, { disableTheme: true });

      const toggleButtons = screen.getAllByRole('button', {
        name: /show password|hide password/i,
      });
      toggleButtons.forEach((button) => {
        expect(button).toHaveAttribute('aria-label');
      });
    });
  });

  describe('Loading States', () => {
    it('should disable button while submitting', async () => {
      vi.mocked(changePassword).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ success: true }), 100)
          )
      );

      renderWithProviders(<ChangePasswordForm />, { disableTheme: true });

      await user.type(
        screen.getByLabelText(/current password/i),
        'OldPassword123!'
      );
      await user.type(screen.getByLabelText('New Password'), 'NewPassword123!');
      await user.type(
        screen.getByLabelText(/confirm new password/i),
        'NewPassword123!'
      );

      const submitButton = screen.getByRole('button', {
        name: /update password/i,
      });
      await user.click(submitButton);

      // Button should be disabled during submission
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Security', () => {
    it('should not expose password values in the DOM', () => {
      renderWithProviders(<ChangePasswordForm />, { disableTheme: true });

      const currentPasswordInput = screen.getByLabelText(/current password/i);
      const newPasswordInput = screen.getByLabelText('New Password');

      expect(currentPasswordInput).toHaveAttribute('type', 'password');
      expect(newPasswordInput).toHaveAttribute('type', 'password');
    });
  });
});
