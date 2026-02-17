'use client';

import { Button } from '@repo/ui/button';
import { X, AlertCircle, Mail } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { resendVerificationEmail } from '@/app/actions';

interface VerificationBannerProps {
  email: string;
}

export function VerificationBanner({ email }: VerificationBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (dismissed) return null;

  const handleResend = async () => {
    setLoading(true);
    try {
      const result = await resendVerificationEmail(email);

      if (result.success) {
        toast.success('Verification Email Sent', {
          description: 'Please check your inbox and spam folder.',
        });
      } else {
        toast.error('Failed to send email', {
          description: result.error,
        });
      }
    } catch (_error) {
      toast.error('An error occurred', {
        description: 'Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-yellow-50 border-b border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                Please verify your email address
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                Check your inbox for a verification link to unlock all features.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResend}
              disabled={loading}
              className="text-yellow-900 border-yellow-300 hover:bg-yellow-100 dark:text-yellow-100 dark:border-yellow-700 dark:hover:bg-yellow-900/40"
            >
              <Mail className="h-4 w-4 mr-2" />
              {loading ? 'Sending...' : 'Resend Email'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed(true)}
              className="text-yellow-700 hover:text-yellow-900 hover:bg-yellow-100 dark:text-yellow-300 dark:hover:text-yellow-100 dark:hover:bg-yellow-900/40"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
