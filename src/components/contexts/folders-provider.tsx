'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface Folder {
  id: string;
  name: string;
  parentFolderId: string | null;
  children: Folder[] | string[] | null;
}

interface FoldersContextType {
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  addFolder: (folder: Folder) => void;
  updateFolder: (folder: Folder) => void;
  removeFolder: (id: string) => void;
  getFolderById: (id: string) => Folder | undefined;
}

const FoldersContext = createContext<FoldersContextType | undefined>(undefined);

export function FoldersProvider({ children, initialFolders }: { children: ReactNode; initialFolders?: Folder[] }) {
  const [folders, setFolders] = useState<Folder[]>(initialFolders || []);

  const addFolder = (folder: Folder) => setFolders((prev) => [folder, ...prev]);

  const updateFolder = (updated: Folder) => setFolders((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));

  const removeFolder = (id: string) => setFolders((prev) => prev.filter((f) => f.id !== id));

  const getFolderById = (id: string): Folder | undefined => folders.find((f) => f.id === id);

  return (
    <FoldersContext.Provider value={{ folders, setFolders, addFolder, updateFolder, removeFolder, getFolderById }}>
      {children}
    </FoldersContext.Provider>
  );
}

export function useFolders() {
  const context = useContext(FoldersContext);
  if (!context) {
    throw new Error('useFolders must be used within a FoldersProvider');
  }
  return context;
}
