'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Play, Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Flashcard {
  id: number;
  front: string;
  back: string;
}

interface FlashcardPanelProps {
  isOpen: boolean;
  onClose: () => void;
  flashcards: Flashcard[];
  onUpdateFlashcards: (flashcards: Flashcard[]) => void;
  isEditMode?: boolean;
}

export function FlashcardPanel({
  isOpen,
  onClose,
  flashcards,
  onUpdateFlashcards,
  isEditMode = false,
}: FlashcardPanelProps) {
  const [localFlashcards, setLocalFlashcards] = useState<Flashcard[]>(flashcards);
  const [currentMode, setCurrentMode] = useState<'edit' | 'study'>(isEditMode ? 'edit' : 'study');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const addFlashcard = () => {
    const newId = Math.max(...localFlashcards.map((f) => f.id), 0) + 1;
    const newCard = { id: newId, front: '', back: '' };
    setLocalFlashcards([...localFlashcards, newCard]);
  };

  const removeFlashcard = (id: number) => {
    if (localFlashcards.length > 1) {
      setLocalFlashcards(localFlashcards.filter((f) => f.id !== id));
    }
  };

  const updateFlashcard = (id: number, field: 'front' | 'back', value: string) => {
    setLocalFlashcards(localFlashcards.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const saveFlashcards = () => {
    onUpdateFlashcards(localFlashcards);
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % localFlashcards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + localFlashcards.length) % localFlashcards.length);
    setIsFlipped(false);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  if (!isOpen) return null;

  const currentCard = localFlashcards[currentIndex];

  return (
    <div className="w-96 h-full bg-white border-l border-gray-200 shadow-xl flex-shrink-0">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900">Thẻ ghi nhớ AI</h3>
            <Badge variant="secondary">{localFlashcards.length} thẻ</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={saveFlashcards}>
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="px-4 pt-4">
          <Tabs value={currentMode} onValueChange={(value: string) => setCurrentMode(value as 'edit' | 'study')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit" className="flex items-center">
                <Edit className="h-4 w-4 mr-1" />
                Chỉnh sửa
              </TabsTrigger>
              <TabsTrigger value="study" className="flex items-center">
                <Play className="h-4 w-4 mr-1" />
                Học
              </TabsTrigger>
            </TabsList>

            {/* Edit Mode */}
            <TabsContent value="edit" className="mt-4">
              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {localFlashcards.map((card, index) => (
                  <Card key={card.id} className="border-2 border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-700 text-sm">Thẻ {index + 1}</h4>
                        {localFlashcards.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFlashcard(card.id)}
                            className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Mặt trước</label>
                          <Textarea
                            value={card.front}
                            onChange={(e) => updateFlashcard(card.id, 'front', e.target.value)}
                            placeholder="Nhập câu hỏi..."
                            className="min-h-[60px] text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Mặt sau</label>
                          <Textarea
                            value={card.back}
                            onChange={(e) => updateFlashcard(card.id, 'back', e.target.value)}
                            placeholder="Nhập câu trả lời..."
                            className="min-h-[60px] text-sm"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button onClick={addFlashcard} className="w-full mb-4 bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm thẻ
                </Button>
              </div>
            </TabsContent>

            {/* Study Mode */}
            <TabsContent value="study" className="mt-4">
              <div className="flex flex-col h-[calc(100vh-200px)]">
                {localFlashcards.length > 0 && (
                  <>
                    {/* Card Counter */}
                    <div className="text-center mb-4">
                      <span className="text-sm text-gray-600">
                        {currentIndex + 1} trong {localFlashcards.length}
                      </span>
                    </div>

                    {/* Flashcard */}
                    <div className="flex-1 flex items-center justify-center mb-6">
                      <Card
                        className="w-full h-64 cursor-pointer transition-transform hover:scale-105"
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
                              <p className="text-xs text-gray-500">Nhấn để hiện câu trả lời</p>
                            </div>
                          </div>
                          <div
                            className={`absolute inset-0 p-6 flex items-center justify-center transition-opacity duration-300 ${
                              isFlipped ? 'opacity-100' : 'opacity-0'
                            }`}
                          >
                            <div className="text-center">
                              <p className="text-base text-gray-900 mb-2">{currentCard?.back}</p>
                              <p className="text-xs text-gray-500">Nhấn để hiện câu hỏi</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-6">
                      <Button variant="outline" size="sm" onClick={prevCard} disabled={localFlashcards.length <= 1}>
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
                        Đặt lại
                      </Button>
                      <Button variant="outline" size="sm" onClick={nextCard} disabled={localFlashcards.length <= 1}>
                        Thẻ tiếp theo
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
