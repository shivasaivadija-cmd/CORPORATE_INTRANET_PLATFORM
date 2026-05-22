'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Loader2 } from 'lucide-react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize, isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initialize();
  }, [initialize]);

  // Redirect based on auth status
  useEffect(() => {
    if (!mounted) return;

    const publicRoutes = ['/login', '/register'];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isAuthenticated && !isPublicRoute) {
      router.push('/login');
    } else if (isAuthenticated && isPublicRoute) {
      // Redirect to appropriate dashboard based on role
      if (user?.role === 'TENANT_ADMIN' || user?.role === 'SUPER_ADMIN') {
        router.push('/admin-dashboard');
      } else {
        router.push('/employee-dashboard');
      }
    }
  }, [isAuthenticated, user, pathname, router, mounted]);

  // No loading screen, just render immediately
  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
