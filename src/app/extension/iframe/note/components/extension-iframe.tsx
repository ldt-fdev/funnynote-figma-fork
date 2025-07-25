'use client';
import { useEditor, EditorContent } from '@tiptap/react';
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
import { LinkDialog } from '@/components/dialogs/link-dialog'; // Assuming this component exists
import { useState, useEffect } from 'react';
import { type NoteResponse, generateNoteFromVideo, getNoteFromLessonLink } from '@/lib/apiClient'; // Assuming these types and functions exist
import { createNote, updateNote } from '@/lib/apiClient';
import { toast } from 'sonner'; // Assuming sonner is installed
import { CustomDialog } from '@/components/dialogs/custom-dialog';
import { ConfirmDialog } from '@/components/dialogs/confirm-dialog'; // Assuming this component exists
import Loading from './loading';

interface IframeProps {
  videoUrl: string | null;
  courseUrl: string | null;
}

export function Iframe({ videoUrl, courseUrl }: IframeProps) {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [note, setNote] = useState<NoteResponse['result'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
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

  const handleGenerateNote = async () => {
    if (!videoUrl || !courseUrl || !editor) return;
    try {
      setLoading(true);
      const response: NoteResponse = await generateNoteFromVideo(videoUrl, courseUrl, courseUrl);
      if (response.success) {
        editor.commands.setContent(response.result.data);
        setNote(response.result);
      } else {
        toast.error('Không thể tạo ghi chú từ video.');
      }
    } catch (error) {
      toast.error('Không thể tạo ghi chú từ video.');
      console.error('Error generating note:', error);
    }
    setLoading(false);
  };

  const handleSaveNote = async (newTitle: string) => {
    if (editor && note) {
      try {
        const updatedNote: NoteResponse = await updateNote(note.id, {
          title: newTitle,
          data: editor.getHTML(),
          lessonLink: courseUrl || null,
        });
        if (updatedNote.success) {
          toast.success('Ghi chú đã được lưu thành công.');
          setNote(updatedNote.result);
        } else {
          toast.error('Không thể lưu ghi chú.');
        }
      } catch (error) {
        toast.error('Không thể lưu ghi chú.');
        console.error('Error saving note:', error);
      }
    } else if (editor && !note) {
      try {
        const newNote: NoteResponse = await createNote({
          title: newTitle,
          data: editor.getHTML(),
          lessonLink: courseUrl || null,
        });
        if (newNote.success) {
          toast.success('Ghi chú đã được tạo thành công.');
          setNote(newNote.result);
        } else {
          toast.error('Không thể tạo ghi chú mới.');
        }
      } catch (error) {
        toast.error('Không thể tạo ghi chú mới.');
        console.error('Error creating note:', error);
      }
    }
  };

  useEffect(() => {
    (async function fetchNoteFromLessonLink() {
      if (videoUrl && courseUrl && editor) {
        try {
          const response = await getNoteFromLessonLink(courseUrl);
          if (response.success) {
            editor.commands.setContent(response.result.data);
            setNote(response.result);
          }
        } catch (error) {
          toast.error('Không thể tải ghi chú từ liên kết bài học.');
          console.error('Error fetching note from lesson link:', error);
        }
      }
    })();
    // fetchNoteFromLessonLink();
  }, [videoUrl, courseUrl, editor]);

  // Hiển thị trạng thái tải trong khi trình chỉnh sửa đang khởi tạo
  if (!editor) {
    return <Loading />;
  }

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
          </div>
          {/* AI and Save Buttons */}
          <div className="flex items-center gap-2 p-2">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                disabled={loading || !videoUrl || !courseUrl}
                className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 hover:from-purple-700 hover:to-blue-700 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                onClick={() => {
                  if (!editor.isEmpty) {
                    setIsConfirmDialogOpen(true);
                  } else {
                    handleGenerateNote();
                  }
                }}
              >
                <Brain className="h-4 w-4 mr-2" />
                Tạo ghi chú AI
              </Button>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsNameDialogOpen(true);
              }}
            >
              <Save className="h-4 w-4 mr-2" />
              Lưu lại
            </Button>
          </div>
        </div>
        <EditorContent editor={editor} className="h-[80vh] p-4 overflow-y-scroll" />
      </div>
      <LinkDialog editor={editor} isOpen={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen} />
      <CustomDialog
        isOpen={isNameDialogOpen}
        onOpenChange={setIsNameDialogOpen}
        title="Nhập tên ghi chú"
        description="Vui lòng nhập tên cho ghi chú của bạn."
        onConfirm={(newTitle) => handleSaveNote(newTitle)}
        placeholder="Nhập tên ghi chú..."
        initialValue={note ? note.title : ''}
        inputLabel="Tên ghi chú"
        onCancel={() => setIsNameDialogOpen(false)}
      />
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title="Tạo ghi chú từ AI?"
        description="Hành động này sẽ xoá nội dung hiện tại, bạn có chắc chắn muốn tiếp tục?"
        onConfirm={() => {
          handleGenerateNote();
          setIsConfirmDialogOpen(false);
        }}
        onCancel={() => setIsConfirmDialogOpen(false)}
      />
    </TooltipProvider>
  );
}
