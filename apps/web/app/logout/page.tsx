'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { useEffect } from 'react';

import { useLogout } from '@/lib/hooks';

export default function LogoutPage() {
  const logoutMutation = useLogout();

  useEffect(() => {
    // Automatically trigger logout when page loads
    logoutMutation.mutate();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Logging Out</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          {logoutMutation.isPending ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Signing you out...</p>
            </div>
          ) : logoutMutation.isError ? (
            <div className="space-y-4">
              <p className="text-destructive">
                Failed to log out. Please try again.
              </p>
              <button
                onClick={() => logoutMutation.mutate()}
                className="text-primary hover:underline"
              >
                Retry
              </button>
            </div>
          ) : (
            <p className="text-muted-foreground">Redirecting...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
