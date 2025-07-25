import { http } from '@/lib/httpClient';

interface Folder {
  id: string;
  name: string;
  parentFolderId: string | null;
  children: string[] | Folder[] | null;
}

interface FlashCard {
  question: string;
  answer: string;
}

interface ResponseStatus {
  success: boolean;
  messageDTO: {
    code: string;
    message: string;
  };
}

export interface MyInfoResponse {
  success: boolean;
  messageDTO: {
    code: string;
    message: string;
  };
  result: {
    id: string;
    username: string;
    email: string | null;
    status: string;
    role: string;
    created: string;
    createdAt: string;
    referral: boolean;
    enable2FA: boolean;
  };
}

export interface FoldersTreeResponse {
  success: boolean;
  messageDTO: {
    code: string;
    message: string;
  };
  result: {
    folders: Folder[];
  };
}

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
    folderId?: string | null;
    lessonLink?: string | null;
  };
}

export interface NoteListResponse {
  success: boolean;
  messageDTO: {
    code: string;
    message: string;
  };
  result: {
    id: string;
    title: string;
    data: string;
    folderId?: string | null;
    lessonLink?: string | null;
  }[];
}

export interface FolderResponse {
  success: boolean;
  messageDTO: {
    code: string;
    message: string;
  };
  result: Folder;
}

export interface FolderListResponse {
  success: boolean;
  messageDTO: {
    code: string;
    message: string;
  };
  result: Folder[];
}

export interface FlashCardResponse {
  success: boolean;
  messageDTO: {
    code: string;
    message: string;
  };
  result: FlashCard[];
}

export interface FlashCardGroupResponse {
  success: boolean;
  messageDTO: {
    code: string;
    message: string;
  };
  result: {
    id?: string;
    title: string;
    noteId?: string | null;
    flashcards?: FlashCard[];
  };
}

export interface FlashCardGenerationResponse {
  success: boolean;
  messageDTO: {
    code: string;
    message: string;
  };
  result: {
    groupId: string;
    noteId: string;
    flashcards: FlashCard[];
  };
}

export interface FlashCardListResponse {
  success: boolean;
  messageDTO: {
    code: string;
    message: string;
  };
  result: {
    id: string;
    noteId: string;
    title: string;
    description: string;
  }[];
}

export const getMyInfo = (): Promise<MyInfoResponse> =>
  http.get<MyInfoResponse>('/users/my-info', {
    withCredentials: true,
  });

export const getFoldersTree = (): Promise<FoldersTreeResponse> =>
  http.get<FoldersTreeResponse>('/folders/tree', {
    withCredentials: true,
  });

export const getFolderList = (): Promise<FolderListResponse> =>
  http.get<FolderListResponse>('/folders', {
    withCredentials: true,
  });

export const generateNoteFromVideo = (videoUrl: string, title: string, courseUrl: string): Promise<NoteResponse> =>
  http.post<NoteResponse>(
    '/notes/from-video',
    { videoUrl, title, folderId: null, lessonLink: courseUrl },
    { withCredentials: true },
  );

export const createNote = (body: {
  title: string;
  data: string;
  folderId?: string | null;
  lessonLink?: string | null;
}): Promise<NoteResponse> =>
  http.post<NoteResponse>('/notes', body, {
    withCredentials: true,
  });

export const updateNote = (
  id: string,
  body: { title: string; data: string; lessonLink?: string | null },
): Promise<NoteResponse> =>
  http.put<NoteResponse>(`/notes/${id}`, body, {
    withCredentials: true,
  });

export const deleteNote = (id: string): Promise<ResponseStatus> =>
  http.delete<ResponseStatus>(`/notes/${id}`, {
    withCredentials: true,
  });

export const getNoteFromLessonLink = (lessonLink: string): Promise<NoteResponse> =>
  http.get<NoteResponse>(`/notes/lesson-link`, {
    params: { url: lessonLink },
    withCredentials: true,
  });

export const getNoteWithoutFolder = (): Promise<NoteListResponse> =>
  http.get<NoteListResponse>('/notes/no-folder', {
    withCredentials: true,
  });

export const createNewFolder = (name: string, parentFolderId?: string | null): Promise<FolderResponse> =>
  http.post<FolderResponse>(
    '/folders',
    { name, parentFolderId },
    {
      withCredentials: true,
    },
  );

export const getNotesFromFolder = (folderId: string): Promise<NoteListResponse> =>
  http.get<NoteListResponse>(`/notes/folder/${folderId}`, {
    withCredentials: true,
  });

export const getFlashCardByGroupId = (id: string): Promise<FlashCardGroupResponse> =>
  http.get<FlashCardGroupResponse>(`/flashcards/group/${id}/flashcards`, {
    withCredentials: true,
  });

export const createFlashCardGroup = (
  groupTitle: string,
  description?: string,
  flashcards?: FlashCard[],
  noteId?: string | null,
): Promise<FlashCardGroupResponse> =>
  http.post<FlashCardGroupResponse>(
    '/flashcards/group',
    { groupTitle, description, flashcards, noteId },
    {
      withCredentials: true,
    },
  );

export const updateFlashCardGroup = (
  groupId: string,
  noteId: string | null,
  groupTitle: string | '',
  description: string | '',
  flashcards: FlashCard[],
): Promise<FlashCardGroupResponse> =>
  http.put<FlashCardGroupResponse>(
    `/flashcards/group/${groupId}`,
    { groupTitle, description, flashcards, noteId },
    {
      withCredentials: true,
    },
  );

export const generateFlashCardsFromNote = (
  noteId: string,
  groupTitle: string,
  text: string,
): Promise<FlashCardGenerationResponse> =>
  http.post<FlashCardGenerationResponse>(
    '/flashcards/auto-create-from-text',
    { noteId, groupTitle, text },
    {
      withCredentials: true,
    },
  );

export const getRecentNotes = (limit: number): Promise<NoteListResponse> =>
  http.get<NoteListResponse>('/notes/recent', {
    params: { limit },
    withCredentials: true,
  });

export const getFlashCardList = (): Promise<FlashCardListResponse> =>
  http.get<FlashCardListResponse>('/flashcards/groups/by-user', {
    withCredentials: true,
  });
