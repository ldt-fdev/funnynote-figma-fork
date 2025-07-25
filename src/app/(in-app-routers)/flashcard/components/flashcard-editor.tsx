'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Play, Edit, ChevronLeft, ChevronRight, RotateCcw, Save } from 'lucide-react';
import { updateFlashCardGroup } from '@/lib/apiClient';

interface Flashcard {
  question: string;
  answer: string;
}

interface FlashcardEditorProps {
  initialFlashcards?: { question: string; answer: string }[];
  id?: string;
}

export function FlashcardEditor({ initialFlashcards, id }: FlashcardEditorProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    if (initialFlashcards && initialFlashcards.length > 0) {
      return initialFlashcards;
    }
    return [{ question: '', answer: '' }];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const searchParams = useSearchParams();
  const getFlashCard = searchParams.get('getFlashCard') || null;
  const createFlashCard = searchParams.get('create') || null;
  const defaultTab = searchParams.get('tab') || 'study';

  useEffect(() => {
    if (getFlashCard) {
      toast.error('Không tìm thấy thẻ ghi nhớ.');
    }
    if (createFlashCard) {
      toast.success('Tạo thẻ ghi nhớ thành công.');
    }
  }, [getFlashCard, createFlashCard]);

  const addFlashcard = () => {
    setFlashcards([...flashcards, { question: '', answer: '' }]);
  };

  const removeFlashcard = (indexToRemove: number) => {
    if (flashcards.length > 1) {
      const updatedFlashcards = flashcards.filter((_, idx) => idx !== indexToRemove);
      setFlashcards(updatedFlashcards);
      // Adjust currentIndex if the removed card was before or at the current one
      if (currentIndex >= updatedFlashcards.length) {
        setCurrentIndex(updatedFlashcards.length - 1);
      }
      setIsFlipped(false); // Reset flip state when card changes
    }
  };

  const updateFlashcard = (indexToUpdate: number, field: 'question' | 'answer', value: string) => {
    setFlashcards(flashcards.map((card, idx) => (idx === indexToUpdate ? { ...card, [field]: value } : card)));
  };

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

  const resetStudy = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Helper function to render text with newlines as <br /> tags
  const renderTextWithNewlines = (text: string) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  async function saveFlashcards() {
    if (id) {
      updateFlashCardGroup(id, null, '', '', flashcards)
        .then((response) => {
          if (response.success) {
            toast.success('Thẻ ghi nhớ đã được lưu thành công.');
          } else {
            toast.error('Không thể lưu thẻ ghi nhớ. Vui lòng thử lại sau.');
          }
        })
        .catch((error) => {
          console.error('Error saving flashcards:', error);
          toast.error('Không thể lưu thẻ ghi nhớ. Vui lòng thử lại sau.');
        });
    }
  }

  const currentFlashcard = flashcards[currentIndex];
  const hasContent = currentFlashcard?.question && currentFlashcard?.answer;

  if (!id) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Không tìm thấy thẻ ghi nhớ.</p>
      </div>
    );
  }

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit" className="flex items-center">
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </TabsTrigger>
            <TabsTrigger value="study" className="flex items-center">
              <Play className="h-4 w-4 mr-2" />
              Học tập
            </TabsTrigger>
          </TabsList>
          {/* Edit Mode */}
          <TabsContent value="edit" className="space-y-6">
            {flashcards.map((card, index) => (
              <Card key={index} className="border-2 border-gray-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-700">Thẻ {index + 1}</h4>
                    {flashcards.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFlashcard(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mặt trước</label>
                      <Textarea
                        value={card.question}
                        onChange={(e) => updateFlashcard(index, 'question', e.target.value)}
                        placeholder="Nhập câu hỏi hoặc lời nhắc..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mặt sau</label>
                      <Textarea
                        value={card.answer}
                        onChange={(e) => updateFlashcard(index, 'answer', e.target.value)}
                        placeholder="Nhập câu trả lời hoặc giải thích..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="mt-2 border-gray-300 bg-transparent"
                onClick={() => {
                  saveFlashcards();
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                Lưu lại
              </Button>
              <Button size="sm" onClick={addFlashcard} className="mt-2 bg-blue-600 text-white hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Thêm thẻ ghi nhớ
              </Button>
            </div>
          </TabsContent>
          {/* Study Mode */}
          <TabsContent value="study" className="space-y-6">
            {flashcards.length > 0 && hasContent ? (
              <div className="flex flex-col items-center space-y-6">
                {/* Card Counter */}
                <div className="text-center">
                  <span className="text-sm text-gray-600">
                    Thẻ {currentIndex + 1} / {flashcards.length}
                  </span>
                </div>
                {/* Flashcard */}
                <div className="w-full max-w-2xl">
                  <Card
                    className="h-80 cursor-pointer transition-transform hover:scale-105 perspective-1000"
                    onClick={flipCard}
                  >
                    <CardContent className="p-8 h-full flex items-center justify-center relative">
                      <div
                        className={`absolute inset-0 p-8 flex items-center justify-center transition-opacity duration-300 ${
                          isFlipped ? 'opacity-0' : 'opacity-100'
                        }`}
                      >
                        <div className="text-center">
                          <p className="text-xl font-medium text-gray-900 mb-4">
                            {renderTextWithNewlines(currentFlashcard.question)}
                          </p>
                          <p className="text-sm text-gray-500">Nhấp để xem câu trả lời</p>
                        </div>
                      </div>
                      <div
                        className={`absolute inset-0 p-8 flex items-center justify-center transition-opacity duration-300 ${
                          isFlipped ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <div className="text-center">
                          <p className="text-xl text-gray-900 mb-4">
                            {renderTextWithNewlines(currentFlashcard.answer)}
                          </p>
                          <p className="text-sm text-gray-500">Nhấp để xem câu hỏi</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {/* Navigation Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <Button variant="outline" size="sm" onClick={prevCard} disabled={flashcards.length <= 1}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Trước
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetStudy}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Đặt lại
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextCard} disabled={flashcards.length <= 1}>
                    Sau
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                {/* Study Progress */}
                <div className="w-full max-w-2xl">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    Tiến độ học tập: {Math.round(((currentIndex + 1) / flashcards.length) * 100)}%
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Play className="h-16 w-16 mx-auto" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Chưa có thẻ ghi nhớ để học</h4>
                <p className="text-gray-600 mb-4">
                  Hãy chuyển sang tab &quot;Chỉnh sửa&quot; để tạo thẻ ghi nhớ trước khi bắt đầu học tập.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
