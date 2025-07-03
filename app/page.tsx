'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { AppSidebar } from '@/components/app-sidebar';
import { MainContent } from '@/components/main-content';
import { FlashcardPanel } from '@/components/flashcard-panel';
import { CreateNewDialog } from '@/components/create-new-dialog';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

interface FileItem {
  id: number;
  name: string;
  type: 'text' | 'drawing' | 'flashcard';
  modified: string;
  folderId?: string;
}

interface FolderItem {
  id: string;
  name: string;
  files: FileItem[];
}

export default function NotePage() {
  const [activeFile, setActiveFile] = useState<FileItem | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileFlashcards, setFileFlashcards] = useState<{ [key: string]: any[] }>({});
  const [fileFlashcardStates, setFileFlashcardStates] = useState<{ [key: string]: boolean }>({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [folders, setFolders] = useState<FolderItem[]>([
    {
      id: 'recent',
      name: 'Gần đây',
      files: [
        { id: 1, name: 'Ghi chú Machine Learning', type: 'text', modified: '2 giờ trước' },
        { id: 2, name: 'Sơ đồ Vật lý', type: 'drawing', modified: '1 ngày trước' },
        { id: 3, name: 'Thẻ ghi nhớ Lịch sử', type: 'flashcard', modified: '3 ngày trước' },
      ],
    },
    {
      id: 'mathematics',
      name: 'Toán học',
      files: [
        { id: 4, name: 'Ghi chú Giải tích', type: 'text', modified: '1 tuần trước' },
        { id: 5, name: 'Phác thảo Hình học', type: 'drawing', modified: '2 tuần trước' },
      ],
    },
    {
      id: 'science',
      name: 'Khoa học',
      files: [
        { id: 6, name: 'Ghi chú Hóa học', type: 'text', modified: '3 ngày trước' },
        { id: 7, name: 'Thẻ ghi nhớ Sinh học', type: 'flashcard', modified: '1 tuần trước' },
      ],
    },
  ]);

  const handleFileSelect = (file: FileItem) => {
    setActiveFile(file);
  };

  const handleCreateNew = (type: string, name: string, folderId?: string) => {
    if (type === 'folder') {
      const newFolder: FolderItem = {
        id: `folder_${Date.now()}`,
        name,
        files: [],
      };
      setFolders((prev) => [...prev, newFolder]);
    } else {
      const newFile: FileItem = {
        id: Date.now(),
        name,
        type: type as 'text' | 'drawing' | 'flashcard',
        modified: 'Vừa xong',
        folderId,
      };

      const targetFolderId = folderId || 'recent';
      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === targetFolderId ? { ...folder, files: [newFile, ...folder.files] } : folder,
        ),
      );

      // Auto-select the new file
      setActiveFile(newFile);
    }
    setShowCreateDialog(false);
  };

  const handleGenerateFlashcards = () => {
    if (!activeFile) return;

    const generatedCards = [
      {
        id: 1,
        front: 'Khái niệm chính được thảo luận trong ghi chú này là gì?',
        back: 'Khái niệm chính bao trùm các nguyên tắc cơ bản của chủ đề với các giải thích và ví dụ chi tiết.',
      },
      {
        front: 'Điểm mấu chốt từ nội dung',
        back: 'Hiểu mối quan hệ giữa các yếu tố khác nhau và cách chúng tương tác trong các tình huống thực tế.',
      },
      {
        id: 3,
        front: 'Khái niệm quan trọng cần nhớ',
        back: 'Một định nghĩa toàn diện bao trùm tất cả các đặc điểm và thuộc tính thiết yếu.',
      },
    ];

    setFileFlashcards((prev) => ({
      ...prev,
      [activeFile.id]: generatedCards,
    }));
    setFileFlashcardStates((prev) => ({
      ...prev,
      [activeFile.id]: true,
    }));
  };

  const handleCloseFlashcards = () => {
    if (!activeFile) return;
    setFileFlashcardStates((prev) => ({
      ...prev,
      [activeFile.id]: false,
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateFlashcards = (flashcards: any[]) => {
    if (!activeFile) return;
    setFileFlashcards((prev) => ({
      ...prev,
      [activeFile.id]: flashcards,
    }));
  };

  const currentFileFlashcards = activeFile ? fileFlashcards[activeFile.id] || [] : [];
  const showFlashcards = activeFile ? fileFlashcardStates[activeFile.id] || false : false;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-gray-50">
        <AppSidebar folders={folders} onFileSelect={handleFileSelect} onCreateNew={() => setShowCreateDialog(true)} />
        <SidebarInset className="flex flex-col flex-1">
          <Header />
          <div className="flex-1 flex overflow-hidden">
            <MainContent
              activeFile={activeFile}
              onGenerateFlashcards={handleGenerateFlashcards}
              hasFlashcards={showFlashcards}
            />
            {showFlashcards && (
              <FlashcardPanel
                isOpen={showFlashcards}
                onClose={handleCloseFlashcards}
                flashcards={currentFileFlashcards}
                onUpdateFlashcards={handleUpdateFlashcards}
                isEditMode={true}
              />
            )}
          </div>
        </SidebarInset>
      </div>

      <CreateNewDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreateNew={handleCreateNew}
        folders={folders}
      />
    </SidebarProvider>
  );
}
