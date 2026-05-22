import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Dashboard' };

export default function Page() {
  // This will be handled by middleware
  // Just redirect to appropriate dashboard
  redirect('/employee-dashboard');
}
