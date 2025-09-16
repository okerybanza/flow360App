import { useState, useEffect, createContext, useContext } from 'react'
import { authAPI } from '@/lib/api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'ARCHITECT' | 'CLIENT'
  avatarUrl?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const initAuth = () => {
    console.log('initAuth - token:', localStorage.getItem('token') ? 'exists' : 'missing')
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        console.log('Parsed user:', parsedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password })
      
      localStorage.setItem('token', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      setUser(response.user)
      setIsLoading(false)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (userData: any) => {
    try {
      const response = await authAPI.register(userData)
      
      localStorage.setItem('token', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      setUser(response.user)
      setIsLoading(false)
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
