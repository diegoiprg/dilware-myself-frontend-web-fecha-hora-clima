'use client';

import dynamic from 'next/dynamic';

const MainContent = dynamic(() => import('@/components/app/MainContent'), {
  ssr: false,
  loading: () => (
    <div className="bg-background text-foreground h-screen w-screen flex items-center justify-center">
      <div className="font-headline text-2xl animate-pulse">Loading...</div>
    </div>
  ),
});

export default function ChronosViewPage() {
  return <MainContent />;
}
