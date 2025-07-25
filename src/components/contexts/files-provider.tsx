'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface Note {
  id: string;
  title: string;
  type?: 'text' | 'drawing' | 'flashcard';
  data: string;
  folderId?: string | null;
  lessonLink?: string | null;
}

interface FilesContextType {
  files: Note[];
  setFiles: (notes: Note[]) => void;
  addFile: (note: Note) => void;
  updateFile: (note: Note) => void;
  removeFile: (id: string) => void;
}

const FilesContext = createContext<FilesContextType | undefined>(undefined);

export function FilesProvider({ children, initialFiles }: { children: ReactNode; initialFiles?: Note[] }) {
  const [files, setFiles] = useState<Note[]>(initialFiles || []);

  const addFile = (note: Note) => setFiles((prev) => [note, ...prev]);

  const updateFile = (updated: Note) => setFiles((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));

  const removeFile = (id: string) => setFiles((prev) => prev.filter((n) => n.id !== id));

  return (
    <FilesContext.Provider value={{ files, setFiles, addFile, updateFile, removeFile }}>
      {children}
    </FilesContext.Provider>
  );
}

export function useFiles() {
  const context = useContext(FilesContext);
  if (context === undefined) {
    throw new Error('useFiles must be used within a FilesProvider');
  }
  return context;
}
