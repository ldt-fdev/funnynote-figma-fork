'use client';

import { Iframe } from './extension-iframe';
import { useSearchParams } from 'next/navigation';

export function EditorClient() {
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get('videoUrl') || null;
  const courseUrl = searchParams.get('courseUrl') || null;

  return <Iframe videoUrl={videoUrl} courseUrl={courseUrl} />;
}
