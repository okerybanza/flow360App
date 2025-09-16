import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useCompanySettings } from '@/hooks/useCompanySettings'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import NotificationBell from '@/components/NotificationBell'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Package,
  FileText
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Portfolio', href: '/clients', icon: Users },
  { name: 'Matériaux', href: '/materials', icon: Package },
  { name: 'Templates', href: '/templates', icon: FileText },
  { name: 'Paramètres', href: '/settings', icon: Settings },
]

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const { settings, applyCustomColors } = useCompanySettings()
  const location = useLocation()
  const navigate = useNavigate()

  // Apply custom colors when settings change
  useEffect(() => {
    if (settings) {
      applyCustomColors()
    }
  }, [settings, applyCustomColors])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // Header component with logo and company name
  const HeaderContent = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center space-x-3 ${className}`}>
      {settings?.logo ? (
        <img 
          src={settings.logo} 
          alt={`${settings.name} logo`}
          className="h-8 w-8 object-contain"
        />
      ) : (
        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">
            {settings?.name?.charAt(0) || 'I'}
          </span>
        </div>
      )}
      <h1 className="text-xl font-semibold text-gray-900">
        {settings?.name || 'IT Build Flow System'}
      </h1>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <HeaderContent />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'nav-item-active'
                      : 'nav-item-inactive'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <Avatar 
                className="h-8 w-8"
                src={user?.avatarUrl || undefined} 
                alt="Photo de profil"
                fallback={
                  <span className="text-xs font-medium text-white bg-blue-600">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                }
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          <div className="flex h-16 items-center px-4 border-b border-gray-200">
            <HeaderContent />
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'nav-item-active'
                      : 'nav-item-inactive'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <Avatar 
                className="h-8 w-8"
                src={user?.avatarUrl || undefined} 
                alt="Photo de profil"
                fallback={
                  <span className="text-xs font-medium text-white bg-blue-600">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                }
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar for mobile */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <HeaderContent />
          </div>
          <div className="flex items-center space-x-2">
            <NotificationBell />
          </div>
        </div>

        {/* Top bar for desktop */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:flex hidden">
          <div className="flex-1" />
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center space-x-3">
              <Avatar 
                className="h-8 w-8"
                src={user?.avatarUrl || undefined} 
                alt="Photo de profil"
                fallback={
                  <span className="text-xs font-medium text-white bg-blue-600">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                }
              />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
