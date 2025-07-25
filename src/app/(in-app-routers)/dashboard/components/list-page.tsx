'use client';

// React imports
import React, { useState, useMemo } from 'react';

// Next.js imports
import { useRouter } from 'next/navigation';

// Components imports
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenuContent, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { GridIcon, MoreHorizontalIcon, ChevronRightIcon, HomeIcon } from 'lucide-react';
import { FolderIcon, FileTextIcon, PaletteIcon, BrainIcon, ListIcon } from 'lucide-react';
import { toast } from 'sonner';

// Contexts imports
import { useFiles } from '@/components/contexts/files-provider';
import { useFolders } from '@/components/contexts/folders-provider';

// Define interfaces to match the Contexts
interface Note {
  id: string;
  title: string;
  type?: 'text' | 'drawing' | 'flashcard';
  data: string;
  folderId?: string | null;
  lessonLink?: string | null;
  modified?: string; // Added for sorting
}

interface FolderData {
  id: string;
  name: string;
  parentFolderId: string | null;
  children: string[] | null; // Children are IDs, not objects
  modified?: string; // Added for sorting
}

export function ListPage() {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState<string[]>([]); // Array of folder IDs
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'name' | 'modified'>('name');
  const [sortOrder, setSortByOrder] = useState<'asc' | 'desc'>('asc');

  const { files } = useFiles(); // Get files from context
  const { folders, getFolderById } = useFolders(); // Get folders and getFolderById from context

  // Determine the current folder data based on the path
  const currentFolderData = useMemo(() => {
    const currentFolderId = currentPath.length > 0 ? currentPath[currentPath.length - 1] : null;

    if (!currentFolderId) {
      // Root view: Display all top-level folders and files without folderId
      const topLevelFolderIds = folders.filter((f) => f.parentFolderId === null).map((f) => f.id);
      const filesWithoutFolderIds = files
        .filter((file) => file.folderId === null || file.folderId === undefined)
        .map((f) => f.id);
      return {
        id: 'root',
        name: 'Tất cả các tệp',
        parentFolderId: null,
        children: [...topLevelFolderIds, ...filesWithoutFolderIds],
        modified: new Date().toISOString(), // Default modified for root
      } as FolderData;
    }
    // If there's a currentFolderId, find that folder
    return getFolderById(currentFolderId);
  }, [currentPath, folders, files, getFolderById]);

  // Resolve displayed items from current folder's children IDs
  const displayedItems = useMemo(() => {
    if (!currentFolderData || !currentFolderData.children) return [];

    const items: (Note | FolderData)[] = currentFolderData.children
      .filter((id): id is string => typeof id === 'string')
      .map((id) => {
        const folder = getFolderById(id);
        if (folder) return folder;
        const file = files.find((f) => f.id === id);
        if (file) return file;
        return null;
      })
      .filter((item) => item !== null) as (Note | FolderData)[];

    // Sort items
    return items.sort((a, b) => {
      // Prioritize folders first
      const isAFolder = 'children' in a;
      const isBFolder = 'children' in b;

      if (isAFolder && !isBFolder) return -1;
      if (!isAFolder && isBFolder) return 1;

      // Sort by name or modified date
      const aName = 'name' in a ? a.name : 'title' in a ? a.title : '';
      const bName = 'name' in b ? b.name : 'title' in b ? b.title : '';

      if (sortBy === 'name') {
        return sortOrder === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
      } else {
        // sortBy === 'modified'
        const aModified = a.modified || '';
        const bModified = b.modified || '';
        return sortOrder === 'asc' ? aModified.localeCompare(bModified) : bModified.localeCompare(aModified);
      }
    });
  }, [currentFolderData, sortBy, sortOrder, files, getFolderById]);

  // const handleFolderClick = (folderId: string) => {
  //   setCurrentPath((prev) => [...prev, folderId]);
  // };

  const handleBreadcrumbClick = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  const handleFileClick = (fileId: string, type: Note['type']) => {
    if (type === 'text') {
      router.push(`/note/${fileId}`);
    } else if (type === 'flashcard') {
      router.push(`/flashcard/${fileId}`);
    } else if (type === 'drawing') {
      router.push(`/drawing/${fileId}`);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'text':
        return FileTextIcon;
      case 'drawing':
        return PaletteIcon;
      case 'flashcard':
        return BrainIcon;
      default:
        return FileTextIcon;
    }
  };

  return (
    <TooltipProvider>
      <div className="h-[92vh] flex flex-col w-full bg-gray-50">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col p-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Sắp xếp theo: {sortBy === 'name' ? 'Tên' : 'Sửa đổi'} (
                    {sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setSortBy('name')}>Tên</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info('Tính năng này đang được phát triển')}>
                    Sửa đổi
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortByOrder('asc')}>Tăng dần</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortByOrder('desc')}>Giảm dần</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    {viewMode === 'grid' ? <GridIcon className="h-4 w-4" /> : <ListIcon className="h-4 w-4" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setViewMode('grid')}>
                    <GridIcon className="h-4 w-4 mr-2" />
                    Dạng lưới
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewMode('list')}>
                    <ListIcon className="h-4 w-4 mr-2" />
                    Dạng danh sách
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {/* Breadcrumbs */}
          <nav className="mb-4 text-sm text-gray-600 flex items-center">
            <Button variant="ghost" size="sm" onClick={() => setCurrentPath([])} className="p-0 h-auto">
              <HomeIcon className="h-4 w-4 mr-1" />
              Trang chủ
            </Button>
            {currentPath.map((folderId, index) => {
              const folder = getFolderById(folderId);
              return (
                <React.Fragment key={folderId}>
                  <ChevronRightIcon className="h-4 w-4 mx-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // router.push(`/dashboard/${folderId}?folderName=${folder?.name}`);
                      handleBreadcrumbClick(index);
                    }}
                    className="p-0 h-auto"
                  >
                    {folder?.name}
                  </Button>
                </React.Fragment>
              );
            })}
          </nav>
          {/* File/Folder Display */}
          <div className="flex-1 overflow-y-auto">
            {displayedItems.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>Không có tệp hoặc thư mục nào ở đây.</p>
                <p>Hãy tạo một cái mới!</p>
              </div>
            )}
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
                  : 'space-y-2'
              }
            >
              {displayedItems.map((item) => {
                // Check if item is a Folder
                if ('children' in item) {
                  return (
                    <Card
                      key={item.id}
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        viewMode === 'list' ? 'flex items-center p-3' : 'flex flex-col items-center p-4'
                      }`}
                      onClick={() => {
                        // handleFolderClick(item.id);
                        router.push(`/dashboard/${item.id}?folderName=${item.name}`);
                      }}
                    >
                      <CardContent className="p-0 flex items-center w-full">
                        <div className="flex items-center w-full">
                          <FolderIcon className="h-8 w-8 text-blue-500 flex-shrink-0" />
                          <div className={`flex-1 min-w-0 ${viewMode === 'list' ? 'ml-3' : 'mt-2 text-center'}`}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="font-medium truncate">{item.name}</p>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                <p>{item.name}</p>
                              </TooltipContent>
                            </Tooltip>
                            {/* {viewMode === 'list' && (
                              <p className="text-xs text-gray-500">
                                {Array.isArray(item.children) ? item.children.length : 0} tệp
                              </p>
                            )} */}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
                                <MoreHorizontalIcon className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert('Chức năng đổi tên chưa được triển khai với mock data');
                                }}
                              >
                                Đổi tên
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert('Chức năng xóa chưa được triển khai với mock data');
                                }}
                              >
                                Xoá
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  );
                } else {
                  // It's a file (Note)
                  const FileIcon = getFileIcon(item.type || 'text');
                  return (
                    <Card
                      key={item.id}
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        viewMode === 'list' ? 'flex items-center p-3' : 'flex flex-col items-center p-4'
                      }`}
                      onClick={() => handleFileClick(item.id, item.type || 'text')}
                    >
                      <CardContent className="p-0 flex items-center w-full">
                        <div className="flex items-center w-full">
                          <FileIcon className="h-8 w-8 text-gray-600 flex-shrink-0" />
                          <div className={`flex-1 min-w-0 ${viewMode === 'list' ? 'ml-3' : 'mt-2 text-center'}`}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="font-medium truncate">{item.title}</p>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                <p>{item.title}</p>
                              </TooltipContent>
                            </Tooltip>
                            {viewMode === 'list' && <p className="text-xs text-gray-500">Ghi chú</p>}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
                                <MoreHorizontalIcon className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert('Chức năng đổi tên chưa được triển khai với mock data');
                                }}
                              >
                                Đổi tên
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert('Chức năng xóa chưa được triển khai với mock data');
                                }}
                              >
                                Xoá
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
