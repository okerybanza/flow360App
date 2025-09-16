import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNotifications } from '@/hooks/useNotifications'
import { handleApiError, getSuccessMessage } from '@/lib/errorHandler'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const { showNotification } = useNotifications()

  // Auto-redirect when user is authenticated
  useEffect(() => {
    if (user) {
      console.log('User authenticated, redirecting to dashboard...')
      // No need to navigate - App.tsx will handle the routing
    }
  }, [user]) // Only depend on user

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('Starting login process...')
      await login(email, password)
      console.log('Login successful, user state should update...')
      
      const success = getSuccessMessage('LOGIN', '')
      showNotification({
        type: 'success',
        title: success.title,
        message: success.message
      })
      
      // Force navigation to dashboard after successful login
      navigate('/dashboard')
    } catch (err: any) {
      console.error('Login error caught:', err)
      const errorNotification = handleApiError(err)
      setError(errorNotification.message)
      
      showNotification({
        type: errorNotification.type,
        title: errorNotification.title,
        message: errorNotification.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f9fa] to-[#e8f2ff]">
      <Card className="card-dropbox w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-[#202124]">
            360Flow
          </CardTitle>
          <CardDescription className="text-[#5f6368]">
            Plateforme de gestion de projets pour architectes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-[#d93025] bg-[#fce8e6] border border-[#fad2cf] rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[#3c4043]">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                disabled={isLoading}
                className="input-dropbox"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-[#3c4043]">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="input-dropbox"
              />
            </div>

            <Button
              type="submit"
              className="w-full btn-dropbox-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connexion en cours...
                </div>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#5f6368]">
            <p>Comptes de test disponibles :</p>
            <div className="mt-2 space-y-1 text-xs">
              <p>Admin: admin2@360flow.com / password123</p>
              <p>Admin (ancien): admin@360flow.com / password</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
