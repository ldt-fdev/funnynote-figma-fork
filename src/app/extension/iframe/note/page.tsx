'use client';
import { Iframe } from './components/extension-iframe';
import { useSearchParams } from 'next/navigation';

export default function EditorPage() {
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get('videoUrl');
  const courseUrl = searchParams.get('courseUrl');

  return <Iframe videoUrl={videoUrl} courseUrl={courseUrl} />;
}
