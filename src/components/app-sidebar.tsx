'use client';

import { useState } from 'react';
import { FileText, Palette, Brain, Folder, Plus, LogOut } from 'lucide-react';
import { ChevronRight, ChevronDown, User, Settings, MoreHorizontal } from 'lucide-react';

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup } from '@/components/ui/sidebar';
import { SidebarGroupContent, SidebarGroupLabel, SidebarHeader } from '@/components/ui/sidebar';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuAction } from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FileItem {
  id: number;
  name: string;
  type: 'text' | 'drawing' | 'flashcard';
  modified: string;
  folderId?: string;
}

interface FolderItem {
  id: string;
  name: string;
  files: FileItem[];
}

interface AppSidebarProps {
  folders: FolderItem[];
  onFileSelect: (file: FileItem) => void;
  onCreateNew: () => void;
}

export function AppSidebar({ folders, onFileSelect, onCreateNew }: AppSidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['recent']);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId],
    );
  };

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
    <TooltipProvider>
      <Sidebar className="border-r border-gray-200">
        <SidebarHeader className="p-4">
          <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white" onClick={onCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo mới
          </Button>
        </SidebarHeader>

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
                    <div className="flex items-center min-w-0">
                      <Folder className="mr-2 h-4 w-4 text-gray-600 flex-shrink-0" />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="font-medium text-gray-700 truncate">{folder.name}</span>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p>{folder.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    {expandedFolders.includes(folder.id) ? (
                      <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500 flex-shrink-0" />
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
                              <FileIcon className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="text-sm font-medium text-gray-900 truncate">{file.name}</div>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="max-w-xs">
                                    <div>
                                      <p className="font-medium">{file.name}</p>
                                      <p className="text-xs text-gray-400 mt-1">
                                        {file.type === 'text' && 'Ghi chú văn bản'}
                                        {file.type === 'drawing' && 'Bảng vẽ'}
                                        {file.type === 'flashcard' && 'Thẻ ghi nhớ'}
                                      </p>
                                      <p className="text-xs text-gray-400">Sửa đổi: {file.modified}</p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                                <div className="text-xs text-gray-500">{file.modified}</div>
                              </div>
                            </SidebarMenuButton>
                            <SidebarMenuAction>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <MoreHorizontal className="h-3 w-3" />
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
                    <User className="mr-2 h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 text-left min-w-0">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-sm font-medium truncate">Nguyễn Văn A</div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <div>
                            <p className="font-medium">Nguyễn Văn A</p>
                            <p className="text-xs text-gray-400">anv@example.com</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                      <div className="text-xs text-gray-500 truncate">anv@example.com</div>
                    </div>
                    <MoreHorizontal className="h-3 w-3 flex-shrink-0" />
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
    </TooltipProvider>
  );
}
