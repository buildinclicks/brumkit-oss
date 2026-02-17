import { Button } from '@repo/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { verifyEmail } from '@/app/actions';

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

async function VerifyEmailContent({ token }: { token: string | undefined }) {
  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <XCircle className="h-6 w-6 text-destructive" />
            <CardTitle>Invalid Link</CardTitle>
          </div>
          <CardDescription>
            The verification link is invalid or missing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please check your email for the correct verification link, or
            request a new one.
          </p>
          <Button asChild className="w-full">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const result = await verifyEmail(token);

  if (result.success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <CardTitle>Email Verified!</CardTitle>
          </div>
          <CardDescription>
            Your email has been successfully verified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You now have full access to all features:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
            <li>Publish articles</li>
            <li>Comment on posts</li>
            <li>Follow other users</li>
            <li>Receive notifications</li>
          </ul>
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Explore Articles</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <XCircle className="h-6 w-6 text-destructive" />
          <CardTitle>Verification Failed</CardTitle>
        </div>
        <CardDescription>
          We couldn't verify your email address.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-destructive">{result.error}</p>
        <p className="text-sm text-muted-foreground">
          The link may have expired or already been used. Please request a new
          verification email.
        </p>
        <div className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/resend-verification">Resend Verification Email</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense
        fallback={
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                Verifying...
              </CardTitle>
              <CardDescription>
                Please wait while we verify your email address.
              </CardDescription>
            </CardHeader>
          </Card>
        }
      >
        <VerifyEmailContent token={params.token} />
      </Suspense>
    </div>
  );
}
