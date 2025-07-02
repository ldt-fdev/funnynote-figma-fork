'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

interface Flashcard {
  id: number;
  front: string;
  back: string;
}

export function FlashcardEditor() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([{ id: 1, front: '', back: '' }]);

  const addFlashcard = () => {
    const newId = Math.max(...flashcards.map((f) => f.id)) + 1;
    setFlashcards([...flashcards, { id: newId, front: '', back: '' }]);
  };

  const removeFlashcard = (id: number) => {
    if (flashcards.length > 1) {
      setFlashcards(flashcards.filter((f) => f.id !== id));
    }
  };

  const updateFlashcard = (id: number, field: 'front' | 'back', value: string) => {
    setFlashcards(flashcards.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Thẻ ghi nhớ</h3>
        </div>

        {flashcards.map((card, index) => (
          <Card key={card.id} className="border-2 border-gray-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-700">Thẻ {index + 1}</h4>
                {flashcards.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFlashcard(card.id)}
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
                    value={card.front}
                    onChange={(e) => updateFlashcard(card.id, 'front', e.target.value)}
                    placeholder="Nhập câu hỏi hoặc lời nhắc..."
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mặt sau</label>
                  <Textarea
                    value={card.back}
                    onChange={(e) => updateFlashcard(card.id, 'back', e.target.value)}
                    placeholder="Nhập câu trả lời hoặc giải thích..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <div className="flex justify-end">
          <Button size="sm" onClick={addFlashcard} className="mt-2 bg-blue-600 text-white hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Thêm thẻ ghi nhớ
          </Button>
        </div>
      </div>
    </div>
  );
}
