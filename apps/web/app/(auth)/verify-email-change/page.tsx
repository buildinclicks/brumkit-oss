'use client';

import { Button } from '@repo/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Suspense } from 'react';
import { toast } from 'sonner';

import { verifyEmailChange } from '@/app/actions/email-change';

type VerificationState = 'verifying' | 'success' | 'error' | 'no-token';

function VerifyEmailChangeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [state, setState] = useState<VerificationState>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Only run once
    let isMounted = true;

    const verify = async () => {
      if (!token) {
        setState('no-token');
        return;
      }

      try {
        const result = await verifyEmailChange({ token });

        if (!isMounted) return;

        if (result.success) {
          setState('success');
          toast.success('Email Changed Successfully', {
            description: 'Your email address has been updated.',
          });

          // Redirect after a short delay
          setTimeout(() => {
            if (isMounted) {
              router.push('/profile');
            }
          }, 1500);
        } else {
          setState('error');
          setErrorMessage(result.error || 'Failed to verify email change');
          toast.error('Failed to Verify Email Change', {
            description:
              result.error || 'Please try again or request a new link.',
          });
        }
      } catch (error: any) {
        if (!isMounted) return;

        setState('error');
        setErrorMessage(error.message || 'Failed to verify email change');
        toast.error('Failed to Verify Email Change', {
          description: 'An unexpected error occurred.',
        });
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {state === 'verifying' && (
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            )}
            {state === 'success' && (
              <CheckCircle className="h-12 w-12 text-green-500" />
            )}
            {(state === 'error' || state === 'no-token') && (
              <XCircle className="h-12 w-12 text-destructive" />
            )}
          </div>
          <CardTitle className="text-center">
            <h1 className="text-2xl font-semibold leading-none tracking-tight">
              {state === 'verifying' && 'Verifying Email Change'}
              {state === 'success' && 'Email Changed Successfully'}
              {(state === 'error' || state === 'no-token') &&
                'Verification Failed'}
            </h1>
          </CardTitle>
          <CardDescription className="text-center">
            {state === 'verifying' &&
              'Please wait while we verify your email change...'}
            {state === 'success' &&
              'Your email address has been updated successfully. Redirecting to your profile...'}
            {state === 'no-token' &&
              'No verification token provided. Please check your email for the verification link.'}
            {state === 'error' && errorMessage}
          </CardDescription>
        </CardHeader>

        {(state === 'success' || state === 'error' || state === 'no-token') && (
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/profile">
                {state === 'success' ? 'Go to Profile' : 'Back to Profile'}
              </Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default function VerifyEmailChangePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyEmailChangeContent />
    </Suspense>
  );
}
