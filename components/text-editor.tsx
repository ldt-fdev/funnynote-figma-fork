'use client';
import { Textarea } from '@/components/ui/textarea';

interface TextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function TextEditor({ content, onChange }: TextEditorProps) {
  return (
    <div className="h-full p-6">
      <div className="h-full max-w-4xl mx-auto">
        <Textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Bắt đầu viết ghi chú của bạn tại đây..."
          className="h-full resize-none border-0 focus:ring-0 text-base leading-relaxed p-0"
          style={{ minHeight: '100%' }}
        />
      </div>
    </div>
  );
}
