import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import Loading from '../components/loading';
import type { Metadata } from 'next';
import { type FlashCardGroupResponse, getFlashCardGroup } from '@/lib/apiServer';
import { FlashcardEditor } from '../components/flashcard-editor';

export default async function FlashcardEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let flashcardGroup: FlashCardGroupResponse['result'] = [];

  try {
    const response = await getFlashCardGroup(id);
    console.log('Flashcard group response:', response);
    if (response.success) {
      flashcardGroup = response.result.map((card) => ({
        question: card.question,
        answer: card.answer,
      }));
    } else {
      console.error('Failed to fetch flashcard group:', response.messageDTO.message);
      redirect(`/flashcard?getFlashCard=${id}&tab=edit`);
    }
  } catch (error) {
    console.error('E: Failed to fetch flashcard group:', error);
    redirect(`/flashcard?getFlashCard=${id}&tab=edit`);
  }

  return (
    <Suspense fallback={<Loading />}>
      <FlashcardEditor initialFlashcards={flashcardGroup} id={id} />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: `Flashcard | FunnyNote`,
};
