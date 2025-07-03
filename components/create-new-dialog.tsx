'use client';

import { useState } from 'react';
import { FileText, Palette, Brain, Folder } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface FolderItem {
  id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  files: any[];
}

interface CreateNewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNew: (type: string, name: string, folderId?: string) => void;
  folders: FolderItem[];
}

export function CreateNewDialog({ isOpen, onClose, onCreateNew, folders }: CreateNewDialogProps) {
  const [selectedType, setSelectedType] = useState<string>('');
  const [name, setName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('recent');

  const createOptions = [
    {
      type: 'text',
      icon: FileText,
      label: 'Ghi chú văn bản',
      description: 'Tạo một tài liệu văn bản mới để viết ghi chú',
    },
    {
      type: 'drawing',
      icon: Palette,
      label: 'Bảng vẽ',
      description: 'Tạo một bảng vẽ mới để vẽ và phác thảo',
    },
    {
      type: 'flashcard',
      icon: Brain,
      label: 'Thẻ ghi nhớ',
      description: 'Tạo một bộ thẻ ghi nhớ mới để học tập',
    },
    {
      type: 'folder',
      icon: Folder,
      label: 'Thư mục mới',
      description: 'Tạo một thư mục mới để tổ chức các tệp của bạn',
    },
  ];

  const handleCreate = () => {
    if (!selectedType || !name.trim()) return;

    onCreateNew(selectedType, name.trim(), selectedType !== 'folder' ? selectedFolder : undefined);

    // Reset form
    setSelectedType('');
    setName('');
    setSelectedFolder('recent');
  };

  const handleClose = () => {
    setSelectedType('');
    setName('');
    setSelectedFolder('recent');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo Mới</DialogTitle>
          <DialogDescription>Chọn loại bạn muốn tạo và đặt tên cho nó.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Type Selection */}
          <div className="space-y-3">
            <Label>Bạn muốn tạo mới gì?</Label>
            <div className="grid grid-cols-2 gap-3">
              {createOptions.map((option) => (
                <Card
                  key={option.type}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedType === option.type ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedType(option.type)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <option.icon className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Name Input */}
          {selectedType && (
            <div className="space-y-2">
              <Label htmlFor="name">Tên</Label>
              <Input
                id="name"
                placeholder={`Nhập tên ${createOptions.find((o) => o.type === selectedType)?.label.toLowerCase()}...`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>
          )}

          {/* Folder Selection (only for non-folder items) */}
          {selectedType && selectedType !== 'folder' && (
            <div className="space-y-2">
              <Label htmlFor="folder">Lưu vào thư mục</Label>
              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a folder" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      <div className="flex items-center">
                        <Folder className="mr-2 h-4 w-4" />
                        {folder.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Huỷ
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!selectedType || !name.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Tạo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
