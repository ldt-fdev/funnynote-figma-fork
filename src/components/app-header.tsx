'use client';
import { Search, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

export function Header() {
  return (
    <header className="sticky top-0 h-[8vh] border-b bg-white px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Link href="/">
          <Image src="/funnynote-logo.png" alt="FunnyNote Logo" width={72} height={36} />
        </Link>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm ghi chú hoặc thẻ ghi nhớ..."
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600"
          onClick={() => toast.info('Tính năng này đang được phát triển')}
        >
          <Bell className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600"
          onClick={() => toast.info('Tính năng này đang được phát triển')}
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
