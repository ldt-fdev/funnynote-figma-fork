'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Dialog, DialogContent, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  inputLabel: string;
  initialValue?: string;
  placeholder?: string;
  onConfirm: (inputValue: string) => void;
  onCancel: () => void;
}

export function CustomDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  inputLabel,
  initialValue = '',
  placeholder = '',
  onConfirm,
  onCancel,
}: CustomDialogProps) {
  const [inputValue, setInputValue] = React.useState(initialValue);

  // Reset input value when dialog opens with a new initialValue
  React.useEffect(() => {
    if (isOpen) {
      setInputValue(initialValue);
    }
  }, [isOpen, initialValue]);

  const handleConfirm = () => {
    onConfirm(inputValue);
    onOpenChange(false); // Close dialog after confirm
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false); // Close dialog after cancel
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="inputString" className="text-right">
              {inputLabel}
            </Label>
            <Input
              id="inputString"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          <Button onClick={handleConfirm}>Đồng ý</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
