import dynamic from 'next/dynamic';

// Import client component động
const EditorClient = dynamic(() => import('./components/extension-page'), { ssr: false });

export default function EditorPage({ searchParams }: { searchParams: { [key: string]: string } }) {
  const videoUrl = searchParams.videoUrl ?? null;
  const courseUrl = searchParams.courseUrl ?? null;

  return <EditorClient videoUrl={videoUrl} courseUrl={courseUrl} />;
}
