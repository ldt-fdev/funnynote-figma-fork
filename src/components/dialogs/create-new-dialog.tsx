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
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createNewFolder, createNote, createFlashCardGroup } from '@/lib/apiClient';
import { useFolders } from '@/components/contexts/folders-provider';
import { useFiles } from '@/components/contexts/files-provider';

interface FolderItem {
  id: string;
  name: string;
  parentFolderId: string | null;
  children: FolderItem[] | string[] | null;
}

interface CreateNewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  folders: FolderItem[];
}

export function CreateNewDialog({ isOpen, onClose, folders }: CreateNewDialogProps) {
  const [selectedType, setSelectedType] = useState<string>('');
  const [name, setName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const router = useRouter();
  const { addFolder } = useFolders();
  const { addFile } = useFiles();

  const handleFolderCreate = async (folderName: string, parentFolderId?: string | null) => {
    if (!folderName.trim()) {
      toast.error('Vui lòng nhập tên thư mục');
      return;
    }
    try {
      const newFolder = await createNewFolder(folderName, parentFolderId);
      addFolder(newFolder?.result);
      toast.success('Thư mục đã được tạo thành công');
    } catch (error) {
      toast.error('Không thể tạo thư mục mới. Vui lòng thử lại sau.');
      console.error(error);
    }
  };

  const handleNoteCreate = async (name: string) => {
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên ghi chú');
      return;
    }
    try {
      const newNoteResponse = await createNote({
        title: name.trim(),
        folderId: selectedFolder !== 'null' ? selectedFolder : null,
        lessonLink: null,
        data: '',
      });
      if (newNoteResponse.success) {
        toast.success('Ghi chú đã được tạo thành công');
        addFile({
          id: newNoteResponse.result.id,
          title: newNoteResponse.result.title,
          folderId: newNoteResponse.result.folderId || null,
          lessonLink: null,
          data: '',
          type: 'text',
        });
        router.push(`/note/${newNoteResponse.result.id}`);
      } else {
        toast.error('Không thể tạo ghi chú mới. Vui lòng thử lại sau.');
      }
    } catch (error) {
      toast.error('Không thể tạo ghi chú mới. Vui lòng thử lại sau.');
      console.error(error);
    }
  };

  const handleFlashCardCreate = async (title: string, description?: string) => {
    if (!title.trim()) {
      toast.error('Vui lòng nhập tên thẻ ghi nhớ');
      return;
    }
    try {
      console.log('Creating flashcard group with title:', title, 'description:', description);
      const newGroup = await createFlashCardGroup(title, description, [], null);
      if (newGroup.success) {
        toast.success('Thẻ ghi nhớ đã được tạo thành công');
        addFile({
          id: newGroup.result.id || newGroup.result.title,
          title: newGroup.result.title,
          folderId: null,
          lessonLink: null,
          data: '',
          type: 'flashcard',
        });
        router.push(`/flashcard/${newGroup.result.id}`);
      } else {
        toast.error('Không thể tạo thẻ ghi nhớ mới. Vui lòng thử lại sau.');
      }
    } catch (error) {
      toast.error('Không thể tạo thẻ ghi nhớ mới. Vui lòng thử lại sau.');
      console.error(error);
    }
  };

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

    if (selectedType === 'drawing') {
      onClose();
      router.push('/draw');
      return;
    }

    if (selectedType === 'folder') {
      handleFolderCreate(name, selectedFolder);
      onClose();
      return;
    }

    if (selectedType === 'text') {
      handleNoteCreate(name);
      onClose();
      return;
    }

    if (selectedType === 'flashcard') {
      handleFlashCardCreate(name);
      onClose();
      return;
    }

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
                  onClick={() => {
                    setSelectedType(option.type);
                    setName('');
                  }}
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
          {selectedType && (
            <div className="space-y-2">
              <Label htmlFor="folder">Lưu vào thư mục</Label>
              <Select value={selectedFolder || ''} onValueChange={setSelectedFolder}>
                <SelectTrigger disabled={selectedType === 'drawing' || selectedType === 'flashcard'}>
                  <SelectValue placeholder="Select a folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="null" value="null">
                    <div className="flex items-center">
                      <Folder className="mr-2 h-4 w-4" />
                      [Trống]
                    </div>
                  </SelectItem>
                  {folders.map((folder) => {
                    if (folder.id === 'recent') return null;

                    return (
                      <SelectItem key={folder.id} value={folder.id}>
                        <div className="flex items-center">
                          <Folder className="mr-2 h-4 w-4" />
                          {folder.name}
                        </div>
                      </SelectItem>
                    );
                  })}
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
