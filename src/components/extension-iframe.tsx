'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Quote, Undo, Redo, LinkIcon, Unlink, Eraser, Brain } from 'lucide-react';
import { Bold, Italic, Strikethrough, Code, List, ListOrdered, Save } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LinkDialog } from '@/components/link-dialog'; // Import the new LinkDialog
import { useState } from 'react';

export function Iframe() {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder: 'Bắt đầu viết ở đây...',
      }),
    ],
    content: `
<h1>Phân tích nội dung file .docx</h1>
<h2>Tổng quan</h2>
<p>Nội dung cung cấp là dữ liệu thô của một file <code>.docx</code>. File <code>.docx</code> thực chất là một file nén <code>.zip</code> chứa nhiều file XML và các file liên quan khác, mô tả cấu trúc, nội dung và định dạng của văn bản.</p>

<h2>Cấu trúc file .docx</h2>
<p>File nén chứa các thư mục và file sau:</p>
<ul>
  <li><code>[Content_Types].xml</code>: Mô tả các kiểu nội dung (content types) của các phần trong gói.</li>
  <li><code>_rels/.rels</code>:  File quan hệ (relationships) ở cấp độ gói, xác định mối quan hệ giữa các phần trong gói.</li>
  <li><code>word/document.xml</code>: Chứa nội dung chính của tài liệu văn bản.</li>
  <li><code>word/_rels/document.xml.rels</code>:  File quan hệ cho <code>word/document.xml</code>, xác định các tài nguyên liên kết với tài liệu (ví dụ: hình ảnh, chú thích chân trang).</li>
  <li><code>word/theme/theme1.xml</code>: Định nghĩa chủ đề giao diện (colors, fonts) cho tài liệu.</li>
  <li><code>word/settings.xml</code>: Chứa các thiết lập của ứng dụng Word cho tài liệu.</li>
  <li><code>customXml/item*.xml</code>: Chứa các phần XML tùy chỉnh (custom XML parts) được nhúng trong tài liệu.</li>
  <li><code>customXml/_rels/item*.xml.rels</code>: Files quan hệ cho các custom XML parts.</li>
  <li><code>word/numbering.xml</code>: Định nghĩa các kiểu đánh số (numbering schemes) cho tài liệu.</li>
  <li><code>word/styles.xml</code>: Định nghĩa các kiểu định dạng (styles) cho tài liệu.</li>
  <li><code>word/webSettings.xml</code>:  Chứa các thiết lập liên quan đến việc hiển thị tài liệu trên web.</li>
  <li><code>word/fontTable.xml</code>:  Bảng phông chữ (font table) được sử dụng trong tài liệu.</li>
  <li><code>docProps/core.xml</code>: Chứa các thuộc tính cốt lõi của tài liệu (ví dụ: tiêu đề, tác giả, ngày tạo).</li>
  <li><code>docProps/app.xml</code>:  Chứa các thuộc tính ứng dụng (application properties) của tài liệu (ví dụ: số trang, số từ).</li>
   <li><code>docProps/custom.xml</code>: Chứa các thuộc tính tùy chỉnh của tài liệu.</li>
</ul>

<h2>Các thành phần chính và chức năng</h2>
<p>Dưới đây là mô tả chi tiết hơn về một số thành phần quan trọng:</p>

<h3>word/document.xml</h3>
<p>Đây là file quan trọng nhất, chứa nội dung văn bản thực tế.
Nội dung được lưu trữ dưới dạng XML, sử dụng các thẻ để xác định các đoạn văn, định dạng, hình ảnh và các thành phần khác.</p>

<h3>word/styles.xml</h3>
<p>File này định nghĩa các kiểu định dạng (styles) khác nhau được sử dụng trong tài liệu.  Kiểu định dạng cho phép bạn áp dụng một tập hợp các thuộc tính định dạng (ví dụ: phông chữ, cỡ chữ, màu sắc, khoảng cách) cho các phần khác nhau của tài liệu một cách nhất quán.</p>

<h3>docProps/core.xml</h3>
<p>File này chứa các metadata cơ bản của tài liệu, chẳng hạn như tiêu đề (title), tác giả (creator), mô tả (description), ngày tạo (created), và lần chỉnh sửa cuối cùng (modified).  Thông tin này hữu ích cho việc quản lý và tìm kiếm tài liệu.</p>

<h2>Lưu ý quan trọng</h2>
<p>Dữ liệu thô này rất khó đọc và chỉnh sửa trực tiếp.  Để làm việc với file <code>.docx</code> một cách hiệu quả, bạn nên sử dụng các thư viện hoặc công cụ chuyên dụng có khả năng phân tích cú pháp và thao tác với định dạng Office Open XML (OOXML).</p>
`,
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('bold')}
                  onPressedChange={() => editor.chain().focus().toggleBold().run()}
                  disabled={!editor.can().chain().focus().toggleBold().run()}
                  aria-label="Toggle bold"
                >
                  <Bold className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>In đậm</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('italic')}
                  onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                  disabled={!editor.can().chain().focus().toggleItalic().run()}
                  aria-label="Toggle italic"
                >
                  <Italic className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>In nghiêng</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('strike')}
                  onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                  disabled={!editor.can().chain().focus().toggleStrike().run()}
                  aria-label="Toggle strikethrough"
                >
                  <Strikethrough className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Gạch ngang</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('code')}
                  onPressedChange={() => editor.chain().focus().toggleCode().run()}
                  disabled={!editor.can().chain().focus().toggleCode().run()}
                  aria-label="Toggle code"
                >
                  <Code className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Mã</TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('bulletList')}
                  onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                  disabled={!editor.can().chain().focus().toggleBulletList().run()}
                  aria-label="Toggle bullet list"
                >
                  <List className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Danh sách không thứ tự</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('orderedList')}
                  onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                  disabled={!editor.can().chain().focus().toggleOrderedList().run()}
                  aria-label="Toggle ordered list"
                >
                  <ListOrdered className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Danh sách có thứ tự</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('blockquote')}
                  onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                  disabled={!editor.can().chain().focus().toggleBlockquote().run()}
                  aria-label="Toggle blockquote"
                >
                  <Quote className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Trích dẫn</TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openLinkDialog} // Open the custom dialog
                  className={editor.isActive('link') ? 'is-active' : ''}
                  aria-label="Set link"
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Thêm liên kết</TooltipContent>
            </Tooltip>
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} aria-label="Undo">
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Hoàn tác</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} aria-label="Redo">
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Làm lại</TooltipContent>
            </Tooltip>
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
