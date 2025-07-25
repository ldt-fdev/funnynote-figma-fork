import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/app-header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <Header />
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
