import { FileListPage } from '../components/file-list-page';
import { Suspense } from 'react';
import Loading from '../components/loading';

export default async function DashboardFilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  console.log('DashboardFilePage folderId:', id);
  return (
    <Suspense fallback={<Loading />}>
      <FileListPage folderId={id} />
    </Suspense>
  );
}
