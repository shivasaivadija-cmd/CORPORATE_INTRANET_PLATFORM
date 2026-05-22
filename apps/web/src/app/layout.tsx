import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { SocketProvider } from '@/components/providers/socket-provider';
import { Toaster } from 'sonner';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: { default: '2coms - Workplace Hub', template: '%s | 2coms' },
  description: 'Modern corporate intranet platform for collaboration and communication',
  icons: { 
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function (l) {
                if (l.search[1] === '/') {
                  var decoded = l.search
                    .slice(1)
                    .split('&')
                    .map(function (s) {
                      return s.replace(/~and~/g, '&');
                    })
                    .join('?');
                  window.history.replaceState(
                    null,
                    null,
                    l.pathname.slice(0, -1) + decoded + l.hash
                  );
                }
              })(window.location);
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <AuthProvider>
              <SocketProvider>
                {children}
                <Toaster richColors position="top-right" />
              </SocketProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
