import { Routes, Route } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth.tsx'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import ClientsPage from '@/pages/ClientsPage'
import ProjectPage from '@/pages/ProjectPage'
import MaterialsPage from '@/pages/MaterialsPage'
import TemplatesPage from '@/pages/TemplatesPage'
import SettingsPage from '@/pages/SettingsPage'
import ClientProjectFlow from '@/components/ClientProjectFlow'
import Layout from '@/components/Layout'
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext'

function App() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If not authenticated, show login page
  if (!user) {
    return <LoginPage />
  }

  // If authenticated, show the main app with layout
  return (
    <UserPreferencesProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/new-client" element={<ClientProjectFlow />} />
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </Layout>
    </UserPreferencesProvider>
  )
}

export default App
