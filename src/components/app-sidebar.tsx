'use client';
// React imports
import { useState, useEffect } from 'react';
import { useUser } from '@/components/user-provider';
// Next.js imports
import { useRouter } from 'next/navigation';
// Component imports
import { FileText, Palette, Brain, Folder, Plus, LogOut, LogIn } from 'lucide-react';
import { ChevronRight, ChevronDown, User, Settings, MoreHorizontal, LayoutDashboard } from 'lucide-react';
// Component imports
import { Button } from '@/components/ui/button';
import { CreateNewDialog } from '@/components/create-new-dialog';
import { SidebarMenuAction, SidebarSeparator } from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup } from '@/components/ui/sidebar';
import { SidebarGroupContent, SidebarGroupLabel, SidebarHeader } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// Library imports
import { toast } from 'sonner';
import { type MyInfoResponse, getMyInfo } from '@/lib/apis';
interface FileItem {
  id: string | number;
  name: string;
  type: 'text' | 'drawing' | 'flashcard';
  modified: string;
  folderId?: string;
}

export function AppSidebar() {
  const { user, setUser } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<MyInfoResponse['result'] | null>(null);

  const [expandedFolder, setExpandedFolder] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [recentFolder, setRecentFolder] = useState<FileItem[]>([
    {
      id: 'recent',
      name: 'Gần đây',
      type: 'text',
      modified: 'Vừa xong',
    },
  ]);

  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getMyInfo();
        if (response.success) {
          setUserInfo(response.result);
          setUser(response.result);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          if (response.messageDTO.code === 'M006') {
            toast.error('Chưa đăng nhập!');
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        setIsLoggedIn(false);
      }
    };

    if (!user) {
      fetchUserInfo();
    }
  }, [user, setUser]);

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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
    setUser(null);
    // clear accessToken in cookes
    document.cookie =
      'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.' + process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
    toast.success('Đăng xuất thành công!');
    router.push('/');
  };

  const onFileSelect = (file: FileItem) => {
    // Handle file selection logic here
    console.log('Selected file:', file);
  };
  const onCreateNew = () => {
    // Handle create new file/folder logic here
    console.log('Create new file/folder');
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
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push('/dashboard')} className="justify-start">
                <LayoutDashboard className="mr-2 h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-700">Quản lý thư mục và tệp</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarSeparator className="-ml-2" />

          <Collapsible open={expandedFolder} onOpenChange={() => setExpandedFolder((prev) => !prev)}>
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-100 rounded-md">
                  <div className="flex items-center min-w-0">
                    <Folder className="mr-2 h-4 w-4 text-gray-600 flex-shrink-0" />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="font-medium text-gray-700 truncate">Tệp gần đây</span>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p>Tệp gần đây</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  {!!expandedFolder ? (
                    <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  )}
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {recentFolder.map((file) => {
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
        </SidebarContent>

        <SidebarFooter className="p-4">
          <SidebarMenu>
            {isLoggedIn && userInfo ? (
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="w-full justify-start">
                      <User className="mr-2 h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 text-left min-w-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-sm font-medium truncate">{userInfo.username}</div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <div>
                              <p className="font-medium">{userInfo.username}</p>
                              <p className="text-xs text-gray-400">{userInfo.email}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                        <div className="text-xs text-gray-500 truncate">{userInfo.email || 'Chưa cài đặt email'}</div>
                      </div>
                      <MoreHorizontal className="h-3 w-3 flex-shrink-0" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" className="w-56">
                    <DropdownMenuItem onClick={() => toast.info('Tính năng này đang được phát triển')}>
                      <User className="mr-2 h-4 w-4" />
                      Trang cá nhân
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info('Tính năng này đang được phát triển')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Cài đặt
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push('/login')} className="justify-start">
                  <LogIn className="mr-2 h-4 w-4 text-gray-600" />
                  Đăng nhập
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <CreateNewDialog isOpen={false} onClose={() => {}} onCreateNew={() => {}} folders={[]} />
    </TooltipProvider>
  );
}
