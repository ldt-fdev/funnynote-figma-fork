'use client';

import { useState } from 'react';
import {
  FileText,
  Palette,
  Brain,
  Folder,
  Plus,
  ChevronRight,
  ChevronDown,
  User,
  Settings,
  LogOut,
  MoreHorizontal,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface AppSidebarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFileSelect: (file: any) => void;
}

export function AppSidebar({ onFileSelect }: AppSidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['recent']);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId],
    );
  };

  const createOptions = [
    { icon: FileText, label: 'Ghi chú bằng chữ', type: 'text' },
    { icon: Palette, label: 'Bảng vẽ', type: 'drawing' },
    { icon: Brain, label: 'Bộ thẻ ghi nhớ', type: 'flashcard' },
    { icon: Folder, label: 'Thư mục mới', type: 'folder' },
  ];

  const folders = [
    {
      id: 'recent',
      name: 'Gần đây',
      files: [
        { id: 1, name: 'Ghi chú Machine Learning', type: 'text', modified: '2 giờ trước' },
        { id: 2, name: 'Sơ đồ Vật lý', type: 'drawing', modified: '1 ngày trước' },
        { id: 3, name: 'Thẻ ghi nhớ Lịch sử', type: 'flashcard', modified: '3 ngày trước' },
      ],
    },
    {
      id: 'mathematics',
      name: 'Toán học',
      files: [
        { id: 4, name: 'Ghi chú Giải tích', type: 'text', modified: '1 tuần trước' },
        { id: 5, name: 'Sơ đồ Hình học', type: 'drawing', modified: '2 tuần trước' },
      ],
    },
    {
      id: 'science',
      name: 'Khoa học',
      files: [
        { id: 6, name: 'Ghi chú Phòng thí nghiệm Hóa học', type: 'text', modified: '3 ngày trước' },
        { id: 7, name: 'Thẻ ghi nhớ Sinh học', type: 'flashcard', modified: '1 tuần trước' },
      ],
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'text':
        return FileText;
      case 'drawing':
        return Palette;
      case 'flashcard':
        return Brain;
      default:
        return FileText;
    }
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Tạo mới
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            {createOptions.map((option) => (
              <DropdownMenuItem key={option.type} className="cursor-pointer">
                <option.icon className="mr-2 h-4 w-4" />
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2">
        {folders.map((folder) => (
          <Collapsible
            key={folder.id}
            open={expandedFolders.includes(folder.id)}
            onOpenChange={() => toggleFolder(folder.id)}
          >
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-100 rounded-md">
                  <div className="flex items-center">
                    <Folder className="mr-2 h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-700">{folder.name}</span>
                  </div>
                  {expandedFolders.includes(folder.id) ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {folder.files.map((file) => {
                      const FileIcon = getFileIcon(file.type);
                      return (
                        <SidebarMenuItem key={file.id}>
                          <SidebarMenuButton
                            onClick={() => onFileSelect(file)}
                            className="w-full justify-start text-left hover:bg-gray-50"
                          >
                            <FileIcon className="mr-2 h-4 w-4 text-gray-500" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">{file.name}</div>
                              <div className="text-xs text-gray-500">{file.modified}</div>
                            </div>
                          </SidebarMenuButton>
                          <SidebarMenuAction>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                {/* <Button variant="ghost" size="icon" className="h-6 w-6"> */}
                                <MoreHorizontal className="h-3 w-3" />
                                {/* </Button> */}
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Đổi tên</DropdownMenuItem>
                                <DropdownMenuItem>Di chuyển</DropdownMenuItem>
                                <DropdownMenuItem>Nhân đôi</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Xoá</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </SidebarMenuAction>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">Nguyễn Văn A</div>
                    <div className="text-xs text-gray-500">anv@example.com</div>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Trang cá nhân
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Cài đặt
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
