import { EditorClient } from './components/extension-page';
import { Suspense } from 'react';
import Loading from './components/loading';

export default function EditorPage() {
  return (
    <Suspense fallback={<Loading />}>
      <EditorClient />
    </Suspense>
  );
}
