export interface FileItem {
  id: number;
  name: string;
  type: 'text' | 'drawing' | 'flashcard';
  modified: string;
  folderId?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  files: FileItem[];
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  tags?: string[];
}