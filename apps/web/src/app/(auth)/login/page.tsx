'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [form, setForm] = useState({ tenantId: 'acme-corp', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.tenantId, form.email, form.password);
      toast.success('Welcome to 2coms! 🎉');

      // Get user from store to determine redirect
      const { user } = useAuthStore.getState();
      if (user?.role === 'TENANT_ADMIN') {
        router.push('/admin-dashboard');
      } else {
        router.push('/employee-dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (email: string) => {
    setForm({ ...form, email, password: 'Password123!' });
  };

  return (
    <div className="relative w-full">
      <div className="relative rounded-3xl border border-white/10 bg-background/95 backdrop-blur-xl p-8 sm:p-10 lg:p-12 shadow-2xl w-full">
        {/* Logo & Header */}
        <div className="mb-8 text-center">
          <div className="relative mx-auto mb-6 inline-flex">
            <div className="flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 shadow-2xl">
              <svg
                className="h-9 w-9 lg:h-11 lg:w-11 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
          </div>

          <h1 className="mb-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent">
            Welcome to 2coms
          </h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2 text-sm lg:text-base">
            <Sparkles className="h-4 w-4 text-cyan-500" />
            Your modern workplace hub
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Mail className="h-4 w-4 text-cyan-500" />
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@2coms.com"
                className="w-full rounded-xl border-2 border-border bg-background/50 px-4 py-3.5 text-sm backdrop-blur-sm transition-all focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/10"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Lock className="h-4 w-4 text-purple-500" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-xl border-2 border-border bg-background/50 px-4 py-3.5 pr-12 text-sm backdrop-blur-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 px-6 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to 2coms
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </span>
            </button>
          </div>
        </form>

        {/* Quick Login */}
        <div className="mt-8 border-t border-border/50 pt-6">
          <p className="text-muted-foreground mb-3 text-center text-xs font-medium">
            Quick Demo Login
          </p>
          <div className="flex gap-2">
            {[
              { email: 'admin@acme.com', label: 'Admin', color: 'from-red-500 to-orange-500' },
              { email: 'sarah@acme.com', label: 'Sarah', color: 'from-blue-500 to-cyan-500' },
              { email: 'marcus@acme.com', label: 'Marcus', color: 'from-purple-500 to-pink-500' },
            ].map((user) => (
              <button
                key={user.email}
                type="button"
                onClick={() => quickLogin(user.email)}
                className={`flex-1 rounded-lg bg-gradient-to-r ${user.color} px-3 py-2 text-xs font-medium text-white shadow-md hover:shadow-lg transition-all`}
              >
                {user.label}
              </button>
            ))}
          </div>
          <p className="text-muted-foreground mt-3 text-center text-[10px]">
            Password: Password123!
          </p>
        </div>
      </div>
    </div>
  );
}
