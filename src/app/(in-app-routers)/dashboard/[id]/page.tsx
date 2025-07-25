import { FileListPage } from '../components/file-list-page';

export default async function DashboardFilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  console.log('DashboardFilePage folderId:', id);
  return <FileListPage folderId={id} />;
}
