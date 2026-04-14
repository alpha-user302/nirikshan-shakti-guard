import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Building2, 
  Video, 
  AlertTriangle,
  Brain,
  Settings as SettingsIcon,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import madapeLogo from '@/assets/madape-logo.png';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Separator } from '@/components/ui/separator';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Workers', url: '/workers', icon: Users },
  { title: 'Attendance', url: '/attendance', icon: Calendar },
  { title: 'Factory Overview', url: '/factory', icon: Building2 },
  { title: 'Cameras', url: '/cameras', icon: Video },
  { title: 'Alerts', url: '/alerts', icon: AlertTriangle },
  { title: 'AI Monitoring', url: '/ai-monitoring', icon: Brain },
  { title: 'Settings', url: '/settings', icon: SettingsIcon },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className={isCollapsed ? 'w-16' : 'w-64'} collapsible="icon">
      <SidebarContent>
        <div className={`p-4 ${isCollapsed ? 'px-2' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <img src={madapeLogo} alt="Madape" className={`${isCollapsed ? 'h-8 w-8' : 'h-10 w-10'} object-contain`} />
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-primary text-xl">Madape</h1>
                <p className="text-xs text-muted-foreground">La vision de demain</p>
              </div>
            )}
          </div>
        </div>
        
        <Separator />

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? 'justify-center' : ''}>
            {isCollapsed ? '•' : 'Navigation'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 text-foreground ${
                          isActive
                            ? 'bg-primary text-primary-foreground font-medium'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        } ${isCollapsed ? 'justify-center' : ''}`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className={`p-2 space-y-2 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          <Button
            variant="outline"
            size={isCollapsed ? 'icon' : 'default'}
            onClick={toggleTheme}
            className="w-full"
          >
            {theme === 'light' ? (
              <>
                <Moon className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">Dark Mode</span>}
              </>
            ) : (
              <>
                <Sun className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">Light Mode</span>}
              </>
            )}
          </Button>
          
          <Button
            variant="destructive"
            size={isCollapsed ? 'icon' : 'default'}
            onClick={logout}
            className="w-full"
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
