'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user) {
      if (user.role === 'TENANT_ADMIN' || user.role === 'SUPER_ADMIN') {
        router.replace('/admin-dashboard');
      } else {
        router.replace('/employee-dashboard');
      }
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, user, isLoading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-60 blur-xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        </div>
        <p className="text-muted-foreground animate-pulse">Redirecting...</p>
      </div>
    </div>
  );
}
