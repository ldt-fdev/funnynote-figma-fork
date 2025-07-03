'use client';

import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Palette,
  Eraser,
  Circle,
  Square,
  Minus,
  Brain,
  Save,
  Share,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ToolbarProps {
  fileType: string;
  fileName: string;
  onGenerateFlashcards: () => void;
}

export function Toolbar({ fileType, fileName, onGenerateFlashcards }: ToolbarProps) {
  const renderTextTools = () => (
    <>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Underline className="h-4 w-4" />
        </Button>
      </div>
      <Separator orientation="vertical" className="h-6" />
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      <Separator orientation="vertical" className="h-6" />
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
    </>
  );

  const renderDrawingTools = () => (
    <>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm">
          <Palette className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Eraser className="h-4 w-4" />
        </Button>
      </div>
      <Separator orientation="vertical" className="h-6" />
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm">
          <Circle className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Square className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Minus className="h-4 w-4" />
        </Button>
      </div>
    </>
  );

  return (
    <div className="h-12 border-b bg-gray-50 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h2 className="font-medium text-gray-900 truncate max-w-20">{fileName}</h2>
        <div className="flex items-center space-x-2">
          {fileType === 'text' && renderTextTools()}
          {fileType === 'drawing' && renderDrawingTools()}

          {(fileType === 'text' || fileType === 'drawing') && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 hover:from-purple-700 hover:to-blue-700"
                onClick={onGenerateFlashcards}
              >
                <Brain className="h-4 w-4 mr-2" />
                Tạo thẻ ghi nhớ AI
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm">
          <Save className="h-4 w-4 mr-2" />
          Lưu lại
        </Button>
        <Button variant="ghost" size="sm">
          <Share className="h-4 w-4 mr-2" />
          Chia sẻ
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Xuất dưới dạng PDF</DropdownMenuItem>
            <DropdownMenuItem>In</DropdownMenuItem>
            <DropdownMenuItem>Lịch sử phiên bản</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
