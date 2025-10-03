'use client';

import dynamic from 'next/dynamic';

const MainContent = dynamic(() => import('@/components/app/MainContent'), { ssr: false });

export default function ChronosViewPage() {
  return <MainContent />;
}
