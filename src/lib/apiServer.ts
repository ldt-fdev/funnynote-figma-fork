'use server';

import { http } from '@/lib/httpServer';

export interface NoteResponse {
  success: boolean;
  messageDTO: {
    code: string;
    message: string;
  };
  result: {
    id: string;
    title: string;
    data: string;
    folderId: string | null;
    lessonLink: string | null;
  };
}

export interface FlashCardGroupResponse {
  success: boolean;
  messageDTO: {
    code: string;
    message: string;
  };
  result: {
    question: string;
    answer: string;
  }[];
}

export async function getNote(id: string): Promise<NoteResponse> {
  return http.get<NoteResponse>(`/notes/${id}`, {
    withCredentials: true,
  });
}

export async function getFlashCardGroup(id: string): Promise<FlashCardGroupResponse> {
  return http.get<FlashCardGroupResponse>(`/flashcards/group/${id}/flashcards`, {
    withCredentials: true,
  });
}
