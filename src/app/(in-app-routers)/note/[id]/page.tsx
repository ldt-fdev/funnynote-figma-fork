import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { type NoteResponse, getNote } from '@/lib/apiServer';
import { NoteTiptap } from '../components/note-tiptap';
import { Suspense } from 'react';
import Loading from '../components/loading';

const noteContent: NoteResponse['result'] = {
  id: '',
  title: '',
  data: '',
  folderId: null,
  lessonLink: null,
};

export default async function NoteEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const response = await getNote(id);
    if (response.success) {
      noteContent.id = response.result.id;
      noteContent.title = response.result.title;
      noteContent.data = response.result.data;
      noteContent.folderId = response.result.folderId;
      noteContent.lessonLink = response.result.lessonLink;
    } else {
      console.error('Failed to fetch note:', response.messageDTO.message);
      redirect(`/note?getNote=${id}`);
    }
  } catch (error) {
    console.error('Failed to fetch note:', error);
    redirect(`/note?getNote=${id}`);
  }

  return (
    <Suspense fallback={<Loading />}>
      <NoteTiptap
        data={noteContent.data}
        id={id}
        title={noteContent.title}
        folderId={noteContent.folderId}
        lessonLink={noteContent.lessonLink}
      />
    </Suspense>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const response = await getNote(id);
    if (response.success) {
      return {
        title: `${response.result.title} | FunnyNote`,
      };
    }
  } catch (error) {
    console.error('Failed to fetch note for metadata:', error);
  }

  return {
    title: 'Ghi chú | FunnyNote',
  };
}
