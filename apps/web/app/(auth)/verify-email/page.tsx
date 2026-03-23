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
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { verifyEmail } from '@/app/actions';

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

async function VerifyEmailContent({ token }: { token: string | undefined }) {
  const t = await getTranslations('auth.verify_email');

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <XCircle className="h-6 w-6 text-destructive" />
            <CardTitle>{t('invalid_link_title')}</CardTitle>
          </div>
          <CardDescription>{t('invalid_link_description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t('invalid_link_instruction')}
          </p>
          <Button asChild className="w-full cursor-pointer">
            <Link href="/dashboard">{t('go_to_dashboard')}</Link>
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
            <CardTitle>{t('title')}</CardTitle>
          </div>
          <CardDescription>{t('subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t('access_features')}
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
            <li>{t('feature_publish')}</li>
            <li>{t('feature_comment')}</li>
            <li>{t('feature_follow')}</li>
            <li>{t('feature_notifications')}</li>
          </ul>
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full cursor-pointer">
              <Link href="/dashboard">{t('go_to_dashboard')}</Link>
            </Button>
            <Button asChild variant="outline" className="w-full cursor-pointer">
              <Link href="/">{t('explore_articles')}</Link>
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
          <CardTitle>{t('failed_title')}</CardTitle>
        </div>
        <CardDescription>{t('failed_subtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-destructive">{result.error}</p>
        <p className="text-sm text-muted-foreground">
          {t('failed_instruction')}
        </p>
        <div className="flex flex-col gap-2">
          <Button asChild className="w-full cursor-pointer">
            <Link href="/dashboard">{t('go_to_dashboard')}</Link>
          </Button>
          <Button asChild variant="outline" className="w-full cursor-pointer">
            <Link href="/resend-verification">{t('resend_email')}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const t = await getTranslations('auth.verify_email');

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense
        fallback={
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                {t('verifying')}
              </CardTitle>
              <CardDescription>{t('verifying_description')}</CardDescription>
            </CardHeader>
          </Card>
        }
      >
        <VerifyEmailContent token={params.token} />
      </Suspense>
    </div>
  );
}
