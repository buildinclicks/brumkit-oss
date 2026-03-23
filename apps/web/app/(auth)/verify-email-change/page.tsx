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
import { useEffect, useState, Suspense } from 'react';
import { toast } from 'sonner';

import { verifyEmailChange } from '@/app/actions/email-change';
import { useAuthMessages } from '@/lib/hooks/use-translations';

type VerificationState = 'verifying' | 'success' | 'error' | 'no-token';

function VerifyEmailChangeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const t = useAuthMessages();

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
          toast.success(t('verify_email_change.success_title'), {
            description: t('verify_email_change.success_message'),
          });

          // Redirect after a short delay
          setTimeout(() => {
            if (isMounted) {
              router.push('/profile');
            }
          }, 1500);
        } else {
          setState('error');
          setErrorMessage(
            result.error || t('verify_email_change.error_message')
          );
          toast.error(t('verify_email_change.error_title'), {
            description: result.error || t('verify_email_change.error_message'),
          });
        }
      } catch (error: unknown) {
        if (!isMounted) return;

        setState('error');
        setErrorMessage(
          error instanceof Error
            ? error.message
            : t('verify_email_change.error_message')
        );
        toast.error(t('verify_email_change.error_title'), {
          description: t('verify_email_change.error_message'),
        });
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [token, router, t]);

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
              {state === 'verifying' && t('verify_email_change.verifying')}
              {state === 'success' && t('verify_email_change.success_title')}
              {(state === 'error' || state === 'no-token') &&
                t('verify_email_change.error_title')}
            </h1>
          </CardTitle>
          <CardDescription className="text-center">
            {state === 'verifying' && t('verify_email_change.verifying')}
            {state === 'success' && t('verify_email_change.success_message')}
            {state === 'no-token' && t('verify_email_change.invalid_token')}
            {state === 'error' && errorMessage}
          </CardDescription>
        </CardHeader>

        {(state === 'success' || state === 'error' || state === 'no-token') && (
          <CardFooter className="flex justify-center">
            <Button asChild className="cursor-pointer">
              <Link href="/profile">
                {state === 'success'
                  ? t('verify_email_change.go_to_login').replace(
                      'Login',
                      'Profile'
                    )
                  : 'Back to Profile'}
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
