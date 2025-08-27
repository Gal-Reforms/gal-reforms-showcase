import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from './AdminSidebar';

export function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b bg-background px-4">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-lg font-semibold">Painel Administrativo</h1>
          </header>
          
          <main className="flex-1 p-6 bg-muted/50">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}