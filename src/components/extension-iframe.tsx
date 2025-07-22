'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';

import { Quote, Undo, Redo, LinkIcon, Unlink, Eraser, Brain, Save } from 'lucide-react';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';

import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LinkDialog } from '@/components/link-dialog';
import { useState } from 'react';

export function Iframe() {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder: 'Bắt đầu viết ở đây...',
      }),
      TextStyle,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: `<h1>Chào mừng đến với FunnyNote</h1><p>Đây là một trình soạn thảo văn bản đơn giản với các tính năng cơ bản.</p><p>Bạn có thể sử dụng các nút công cụ để định dạng văn bản của mình.</p><p>Ví dụ: <strong>In đậm</strong>, <em>In nghiêng</em>, <del>Gạch ngang</del>, <code>Mã</code>, và các danh sách.</p><p>Hãy thử thêm một liên kết bằng cách sử dụng nút <strong>Thêm liên kết</strong> bên dưới.</p><p>Bạn cũng có thể sử dụng các phím tắt như <kbd>Ctrl + B</kbd> để in đậm, <kbd>Ctrl + I</kbd> để in nghiêng.</p><p>Chúc bạn có những trải nghiệm thú vị với FunnyNote!</p>`,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none p-4 focus:outline-none leading-none min-h-[200px] overflow-y-auto',
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const openLinkDialog = () => {
    setIsLinkDialogOpen(true);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="border rounded-md">
        <div className="flex justify-between items-center p-2 border-b bg-muted/50">
          <div className="flex flex-wrap items-center gap-1 p-2">
            {/* Bold */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('bold')}
                  onPressedChange={() => editor.chain().focus().toggleBold().run()}
                  // disabled={!editor.can().chain().focus().toggleBold().run()}
                  aria-label="Toggle bold"
                >
                  <Bold className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>In đậm</TooltipContent>
            </Tooltip>

            {/* Italic */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('italic')}
                  onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                  // disabled={!editor.can().chain().focus().toggleItalic().run()}
                  aria-label="Toggle italic"
                >
                  <Italic className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>In nghiêng</TooltipContent>
            </Tooltip>

            {/* Strikethrough */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('strike')}
                  onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                  // disabled={!editor.can().chain().focus().toggleStrike().run()}
                  aria-label="Toggle strikethrough"
                >
                  <Strikethrough className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Gạch ngang</TooltipContent>
            </Tooltip>

            {/* Code */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('code')}
                  onPressedChange={() => editor.chain().focus().toggleCode().run()}
                  // disabled={!editor.can().chain().focus().toggleCode().run()}
                  aria-label="Toggle code"
                >
                  <Code className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Mã</TooltipContent>
            </Tooltip>

            {/* Highlight */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('highlight')}
                  onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
                  // disabled={!editor.can().chain().focus().toggleHighlight().run()}
                  aria-label="Toggle highlight"
                >
                  <Highlighter className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Đánh dấu</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Heading 1 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('heading', { level: 1 })}
                  onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  // disabled={!editor.can().chain().focus().toggleHeading({ level: 1 }).run()}
                  aria-label="Toggle heading 1"
                >
                  <Heading1 className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Tiêu đề 1</TooltipContent>
            </Tooltip>

            {/* Heading 2 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('heading', { level: 2 })}
                  onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  // disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
                  aria-label="Toggle heading 2"
                >
                  <Heading2 className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Tiêu đề 2</TooltipContent>
            </Tooltip>

            {/* Heading 3 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('heading', { level: 3 })}
                  onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  // disabled={!editor.can().chain().focus().toggleHeading({ level: 3 }).run()}
                  aria-label="Toggle heading 3"
                >
                  <Heading3 className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Tiêu đề 3</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Bullet List */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('bulletList')}
                  onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                  // disabled={!editor.can().chain().focus().toggleBulletList().run()}
                  aria-label="Toggle bullet list"
                >
                  <List className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Danh sách không thứ tự</TooltipContent>
            </Tooltip>

            {/* Ordered List */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('orderedList')}
                  onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                  // disabled={!editor.can().chain().focus().toggleOrderedList().run()}
                  aria-label="Toggle ordered list"
                >
                  <ListOrdered className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Danh sách có thứ tự</TooltipContent>
            </Tooltip>

            {/* Blockquote */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('blockquote')}
                  onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                  // disabled={!editor.can().chain().focus().toggleBlockquote().run()}
                  aria-label="Toggle blockquote"
                >
                  <Quote className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Trích dẫn</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Set Link */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openLinkDialog}
                  className={editor.isActive('link') ? 'is-active' : ''}
                  aria-label="Set link"
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Thêm liên kết</TooltipContent>
            </Tooltip>

            {/* Unset Link */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().unsetLink().run()}
                  aria-label="Unset link"
                >
                  <Unlink className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Xóa liên kết</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Undo */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} aria-label="Undo">
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Hoàn tác</TooltipContent>
            </Tooltip>

            {/* Redo */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} aria-label="Redo">
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Làm lại</TooltipContent>
            </Tooltip>

            {/* Clear Formatting */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
                  aria-label="Clear formatting"
                >
                  <Eraser className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Xóa định dạng</TooltipContent>
            </Tooltip>
          </div>

          {/* AI and Save Buttons */}
          <div className="flex items-center gap-2 p-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 hover:from-purple-700 hover:to-blue-700"
              onClick={() => {}}
            >
              <Brain className="h-4 w-4 mr-2" />
              Tạo ghi chú AI
            </Button>
            <Button variant="ghost" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Lưu lại
            </Button>
          </div>
        </div>
        <EditorContent editor={editor} className="h-[80vh] overflow-y-scroll" />
      </div>
      <LinkDialog editor={editor} isOpen={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen} />
    </TooltipProvider>
  );
}
