import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/providers/StoreProvider';
import PlaybackBar from '@/components/playback-bar';
import AudioPlayer from '@/components/AudioPlayer';
import AuthProvider from '@/providers/AuthProvider';
import UserManager from '@/components/UserManager';
import SleepTimerManager from '@/components/sleep-timer/SleepTimerManager';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Lunatune',
  description: 'Music for the moon',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <StoreProvider>
          <AuthProvider>
            <UserManager />
            <AudioPlayer>
              <div className="bg-background relative min-h-screen">
                {/* Background gradients */}
                <div className="from-background via-background-light/10 to-primary/5 absolute inset-0 bg-gradient-to-br" />
                <div className="from-primary/10 via-background to-background absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]" />

                {/* Content */}
                <div className="relative">
                  {children}
                  <PlaybackBar />
                  <SleepTimerManager />
                </div>
              </div>
            </AudioPlayer>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
