import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  User, 
  Settings, 
  LogOut, 
  GraduationCap,
  Shield,
  Menu,
  X,
  FileSpreadsheet,
  DollarSign,
  BookOpen,
  CreditCard,
  FileText,
  Clock,
  Edit3
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: User,
      roles: ['STUDENT', 'ADMIN']
    },
    ...(isAdmin ? [
      {
        name: 'All Students',
        href: '/admin/students',
        icon: Users,
        roles: ['ADMIN']
      },
      {
        name: 'Programs',
        href: '/admin/programs',
        icon: GraduationCap,
        roles: ['ADMIN']
      },
      {
        name: 'Courses',
        href: '/admin/courses',
        icon: Shield,
        roles: ['ADMIN']
      },
      {
        name: 'Enrollments',
        href: '/admin/enrollments',
        icon: FileSpreadsheet,
        roles: ['ADMIN']
      },
      {
        name: 'Enrollment Requests',
        href: '/admin/enrollment-requests',
        icon: Clock,
        roles: ['ADMIN']
      },
      {
        name: 'Bulk Operations',
        href: '/admin/bulk-operations',
        icon: FileSpreadsheet,
        roles: ['ADMIN']
      },
      {
        name: 'Fee Management',
        href: '/admin/fee-management',
        icon: DollarSign,
        roles: ['ADMIN']
      }
    ] : [
      {
        name: 'My Courses',
        href: '/student/courses',
        icon: BookOpen,
        roles: ['STUDENT']
      },
      {
        name: 'Course Catalog',
        href: '/student/course-catalog',
        icon: GraduationCap,
        roles: ['STUDENT']
      },
      {
        name: 'Fee Statement',
        href: '/student/fees',
        icon: DollarSign,
        roles: ['STUDENT']
      },
      {
        name: 'Payment History',
        href: '/student/payments',
        icon: CreditCard,
        roles: ['STUDENT']
      },
      {
        name: 'Academic Records',
        href: '/student/records',
        icon: FileText,
        roles: ['STUDENT']
      }
    ]),
    {
      name: 'Profile Settings',
      href: '/profile',
      icon: Settings,
      roles: ['STUDENT', 'ADMIN']
    }
  ];

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn(
      "flex flex-col h-full bg-card border-r border-border",
      mobile ? "w-full" : "w-64"
    )}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Student Portal</h1>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {isAdmin && <Shield className="h-3 w-3" />}
              <span>{isAdmin ? 'Admin' : 'Student'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={() => mobile && setSidebarOpen(false)}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-primary text-primary-foreground shadow-soft" 
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-border">
        <div className="mb-3 p-3 rounded-lg bg-accent/50">
          <div className="text-sm font-medium text-foreground">{user?.firstName} {user?.lastName}</div>
          <div className="text-xs text-muted-foreground">{user?.registrationNumber}</div>
          <div className="text-xs text-muted-foreground">{user?.email}</div>
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="w-full justify-start"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold text-foreground">Student Portal</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex h-screen lg:h-auto">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="fixed inset-y-0 left-0 w-80 bg-background animate-slide-in">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold">Navigation</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <Sidebar mobile />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 overflow-auto">
          <div className="p-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};