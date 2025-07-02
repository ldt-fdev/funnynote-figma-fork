'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, RotateCcw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Flashcard {
  id: number;
  front: string;
  back: string;
}

interface FlashcardPanelProps {
  isOpen: boolean;
  onClose: () => void;
  flashcards: Flashcard[];
}

export function FlashcardPanel({ isOpen, onClose, flashcards }: FlashcardPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  if (!isOpen) return null;

  const currentCard = flashcards[currentIndex];

  return (
    <div className="w-96 h-full bg-white border-l border-gray-200 shadow-xl flex-shrink-0">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900">Thẻ ghi nhớ AI</h3>
            <Badge variant="secondary">{flashcards.length} thẻ</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col overflow-y-auto">
          {flashcards.length > 0 && (
            <>
              {/* Card Counter */}
              <div className="text-center mb-4">
                <span className="text-sm text-gray-600">
                  {currentIndex + 1} trong {flashcards.length}
                </span>
              </div>

              {/* Flashcard */}
              <div className="flex-1 flex items-center justify-center mb-6">
                <Card
                  className="w-full h-64 cursor-pointer transition-transform hover:scale-105 perspective-1000"
                  onClick={flipCard}
                >
                  <CardContent className="p-6 h-full flex items-center justify-center relative">
                    <div
                      className={`absolute inset-0 p-6 flex items-center justify-center transition-opacity duration-300 ${
                        isFlipped ? 'opacity-0' : 'opacity-100'
                      }`}
                    >
                      <div className="text-center">
                        <p className="text-base font-medium text-gray-900 mb-2">{currentCard?.front}</p>
                        <p className="text-xs text-gray-500">Nhấn để lật thẻ</p>
                      </div>
                    </div>
                    <div
                      className={`absolute inset-0 p-6 flex items-center justify-center transition-opacity duration-300 ${
                        isFlipped ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <div className="text-center">
                        <p className="text-base text-gray-900 mb-2">{currentCard?.back}</p>
                        <p className="text-xs text-gray-500">Nhấn để xem câu hỏi</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mb-4">
                <Button variant="outline" size="sm" onClick={prevCard} disabled={flashcards.length <= 1}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Thẻ trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentIndex(0);
                    setIsFlipped(false);
                  }}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Đặt lại
                </Button>
                <Button variant="outline" size="sm" onClick={nextCard} disabled={flashcards.length <= 1}>
                  Thẻ tiếp theo
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm">Lưu thẻ ghi nhớ</Button>
                <Button variant="outline" className="w-full bg-transparent text-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Xuất thẻ
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
