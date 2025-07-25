'use client';

// React imports
import { useState, useMemo, useEffect } from 'react';
// Next.js imports
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

// Components imports
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenuContent, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { GridIcon, MoreHorizontalIcon, ChevronLeftIcon } from 'lucide-react';
import { FileTextIcon, PaletteIcon, BrainIcon, ListIcon } from 'lucide-react';
import { getNotesFromFolder } from '@/lib/apiClient';
import { toast } from 'sonner';
import Loading from '../components/loading';

// Contexts imports
// import { useFiles } from '@/components/contexts/files-provider';

// Define Note interface to match the Context
interface Note {
  id: string;
  title: string;
  type?: 'text' | 'drawing' | 'flashcard';
  data: string;
  folderId?: string | null;
  lessonLink?: string | null;
  modified?: string; // Added for sorting
}

export function FileListPage({ folderId }: { folderId: string }) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'name' | 'modified'>('name');
  const [sortOrder, setSortByOrder] = useState<'asc' | 'desc'>('asc');
  const searchParams = useSearchParams();
  const folderName = searchParams.get('folderName') || null;
  const [files, setFiles] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // const { files } = useFiles(); // Get files from context

  useEffect(() => {
    console.log('Fetching notes for folder:', folderId);
    if (folderId) {
      setLoading(true);
      getNotesFromFolder(folderId)
        .then((response) => {
          console.log('Fetched notes:', response);
          if (response.success) {
            setFiles(response.result);
          }
        })
        .catch((error) => {
          toast.error('Không thể tải tệp từ thư mục này.');
          console.error('Failed to fetch notes:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [folderId]);

  // Filter and sort only files
  const displayedFiles = useMemo(() => {
    const items: Note[] = files;

    // Sort items
    return items.sort((a, b) => {
      const aName = a.title || '';
      const bName = b.title || '';

      if (sortBy === 'name') {
        return sortOrder === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
      } else {
        // sortBy === 'modified'
        const aModified = a.modified || '';
        const bModified = b.modified || '';
        return sortOrder === 'asc' ? aModified.localeCompare(bModified) : bModified.localeCompare(aModified);
      }
    });
  }, [files, sortBy, sortOrder]);

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
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                <ChevronLeftIcon className="h-4 w-4" />
                Quay lại
              </Button>
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
          {/* No Breadcrumbs for file-only view */}
          <h1 className="text-2xl font-bold mb-4">Tất cả các tệp {folderName ? `của ${folderName}` : ''}</h1>
          {/* File Display */}
          {loading ? (
            <Loading />
          ) : (
            <div className="flex-1 overflow-y-auto">
              {displayedFiles.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>Không có tệp nào ở đây.</p>
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
                {displayedFiles.map((item) => {
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
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
