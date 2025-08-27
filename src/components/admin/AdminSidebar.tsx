import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  FolderOpen,
  Plus,
  Tags,
  LogOut,
  Menu,
  Home,
  Search,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { t } from "@/lib/translations";

const adminNavItems = [
  { title: t('dashboard'), url: "/admin", icon: LayoutDashboard, end: true },
  { title: t('projects'), url: "/admin/projects", icon: FolderOpen },
  { title: t('newProject'), url: "/admin/projects/new", icon: Plus },
  { title: t('categories'), url: "/admin/categories", icon: Tags },
  { title: 'SEO', url: "/admin/seo", icon: Search },
];

export function AdminSidebar() {
  const { signOut } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";
  
  const isActive = (path: string, end?: boolean) => {
    if (end) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const getNavClassName = (path: string, end?: boolean) => {
    return isActive(path, end)
      ? "bg-primary text-primary-foreground"
      : "hover:bg-accent hover:text-accent-foreground";
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold px-4 py-2">
            {!isCollapsed && t('adminPanel')}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <NavLink 
                    to="/" 
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent"
                  >
                    <Home className="h-4 w-4" />
                    {!isCollapsed && <span>Ver Sitio Web</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${getNavClassName(item.url, item.end)}`}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 space-y-2">
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            size={isCollapsed ? "icon" : "default"}
            className="w-full"
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">{t('logout')}</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}