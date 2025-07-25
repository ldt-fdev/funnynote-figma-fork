'use client';

import * as React from 'react';
import type { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LinkDialogProps {
  editor: Editor | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LinkDialog({ editor, isOpen, onOpenChange }: LinkDialogProps) {
  const [url, setUrl] = React.useState('');

  React.useEffect(() => {
    if (editor && isOpen) {
      const previousUrl = editor.getAttributes('link').href;
      setUrl(previousUrl || '');
    }
  }, [editor, isOpen]);

  const handleSetLink = () => {
    if (!editor) return;

    // empty string was set
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      // update link
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm liên kết</DialogTitle>
          <DialogDescription>Nhập URL cho liên kết của bạn.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL
            </Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://example.com"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSetLink}>Thêm liên kết</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
