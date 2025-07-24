import { http } from '@/lib/httpClient';

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
    folders: {
      id: string;
      name: string;
      parentFolderId: string | null;
      children: {
        id: string;
        name: string;
        type: 'text' | 'drawing' | 'flashcard';
        modified: string;
        folderId?: string;
      }[];
    }[];
  };
}

export const getMyInfo = (): Promise<MyInfoResponse> =>
  http.get<MyInfoResponse>('/users/my-info', {
    withCredentials: true,
  });

export const getFoldersTree = (): Promise<FoldersTreeResponse> =>
  http.get<FoldersTreeResponse>('/folders/tree', {
    withCredentials: true,
  });
