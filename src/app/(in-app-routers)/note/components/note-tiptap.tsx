'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import { useSearchParams } from 'next/navigation';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Heading1, Heading2, Heading3, Quote, Loader2 } from 'lucide-react';
import { Undo, Redo, LinkIcon, Unlink, Eraser, Brain, Save } from 'lucide-react';
import { Bold, Italic, Strikethrough, Code, List, ListOrdered, Highlighter } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LinkDialog } from '@/components/dialogs/link-dialog';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { updateNote, generateFlashCardsFromNote } from '@/lib/apiClient';
import { useRouter } from 'next/navigation';
import { CustomDialog } from '@/components/dialogs/custom-dialog';
import { useFiles } from '@/components/contexts/files-provider';
import Loading from './loading';

interface NoteTiptapProps {
  id?: string;
  title?: string;
  data?: string;
  folderId?: string | null;
  lessonLink?: string | null;
}

export function NoteTiptap({ id, title, data, folderId, lessonLink }: NoteTiptapProps) {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const getNote = searchParams.get('getNote') || null;
  const saveNote = searchParams.get('saveNote') || null;
  const router = useRouter();
  const { removeFile, addFile } = useFiles();

  const [loading, setLoading] = useState(false);
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
    content: data || '',
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none p-4 focus:outline-none leading-none min-h-[200px] overflow-y-auto',
      },
    },
    immediatelyRender: false, // Giữ nguyên để tránh lỗi SSR
  });

  const openLinkDialog = () => {
    setIsLinkDialogOpen(true);
  };

  useEffect(() => {
    if (getNote) {
      setTimeout(() => {
        toast.error('Không tìm thấy ghi chú.');
      }, 5000);
    }
    if (saveNote) {
      toast.success('Ghi chú đã được lưu thành công!');
    }
  }, [getNote, saveNote]);

  const handleSaveNote = async (newTitle: string) => {
    if (!editor) return;
    const content = editor.getHTML();
    try {
      if (id) {
        const response = await updateNote(id, {
          title: newTitle || title || '',
          data: content,
          lessonLink,
        });
        if (response.success) {
          removeFile(id); // Xóa ghi chú cũ
          addFile({
            id: response.result.id,
            title: newTitle || title || '',
            data: content,
            folderId,
            lessonLink,
          });
          router.push(`/note/${id}?saveNote=success`);
          return;
        } else {
          toast.error('Không thể cập nhật ghi chú.');
        }
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Không thể lưu ghi chú.');
    }
  };

  const generateFlashCards = async () => {
    if (!editor || !id) return;
    const content = editor.getHTML();
    setLoading(true);
    try {
      const response = await generateFlashCardsFromNote(id, title || '', content);
      if (response.success) {
        addFile({
          id: response.result.groupId,
          title: title || 'Thẻ ghi nhớ từ ghi chú',
          folderId: null,
          lessonLink: null,
          data: '',
          type: 'flashcard',
        });
        router.push(`/flashcard/${response.result.groupId}?create=success`);
      } else {
        toast.error('Không thể tạo thẻ ghi nhớ từ ghi chú.');
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast.error('Không thể tạo thẻ ghi nhớ từ ghi chú.');
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị trạng thái tải trong khi trình chỉnh sửa đang khởi tạo
  if (!editor) {
    return <Loading />;
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="h-[8vh] flex justify-between items-center p-2 border-b bg-muted/50">
        <div className="flex flex-wrap items-center gap-1 p-2">
          {/* Bold */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive('bold')}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
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
          {lessonLink && (
            <>
              <div className="h-[8vh] w-1 border-l-1 border-gray-200 mx-4"></div>
              <a
                href={lessonLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 underline"
              >
                Đi đến bài học
              </a>
            </>
          )}
        </div>
        {/* AI and Save Buttons */}
        <div className="flex items-center gap-2 p-2">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 hover:from-purple-700 hover:to-blue-700 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              onClick={() => {
                generateFlashCards();
              }}
            >
              <Brain className="h-4 w-4 mr-2" />
              Tạo thẻ ghi nhớ AI
            </Button>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsDialogOpen(true)}>
            <Save className="h-4 w-4 mr-2" />
            Lưu lại
          </Button>
        </div>
      </div>
      {/* Hiển thị Link bài học riêng biệt, không nằm trong nội dung editor */}
      <EditorContent editor={editor} className="h-[84vh] p-4 overflow-y-auto" />
      <LinkDialog editor={editor} isOpen={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen} />
      <CustomDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Nhập tên ghi chú"
        description="Vui lòng nhập tên cho ghi chú của bạn."
        inputLabel="Tên ghi chú"
        placeholder="Nhập tên ghi chú..."
        onConfirm={handleSaveNote}
        onCancel={() => setIsDialogOpen(false)}
        initialValue={title || ''}
      />
    </TooltipProvider>
  );
}
