'use client';

import { useState } from 'react';
import { Toolbar } from '@/components/toolbar';
import { TextEditor } from '@/components/text-editor';
import { DrawingBoard } from '@/components/drawing-board';
import { FlashcardEditor } from '@/components/flashcard-editor';

interface MainContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeFile: any;
  onGenerateFlashcards: () => void;
  hasFlashcards?: boolean;
}

export function MainContent({ activeFile, onGenerateFlashcards, hasFlashcards = false }: MainContentProps) {
  const [content, setContent] = useState('');

  if (!activeFile) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-gray-400">📝</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Chào mừng đến với FunnyNote</h2>
          <p className="text-gray-600 mb-4">Chọn một tệp từ thanh bên hoặc tạo một tệp mới để bắt đầu.</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeFile.type) {
      case 'text':
        return <TextEditor content={content} onChange={setContent} />;
      case 'drawing':
        return <DrawingBoard />;
      case 'flashcard':
        return <FlashcardEditor />;
      default:
        return <TextEditor content={content} onChange={setContent} />;
    }
  };

  return (
    <div className={`h-full flex flex-col bg-white transition-all duration-300 ${hasFlashcards ? 'flex-1' : 'w-full'}`}>
      <Toolbar fileType={activeFile.type} fileName={activeFile.name} onGenerateFlashcards={onGenerateFlashcards} />
      <div className="flex-1 overflow-hidden">{renderContent()}</div>
    </div>
  );
}
