import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type FontSize = 'small' | 'normal' | 'large'

interface UserPreferences {
  fontSize: FontSize
}

interface UserPreferencesContextType {
  preferences: UserPreferences
  setFontSize: (size: FontSize) => void
}

const defaultPreferences: UserPreferences = {
  fontSize: 'normal'
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined)

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext)
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider')
  }
  return context
}

interface UserPreferencesProviderProps {
  children: ReactNode
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    // Load preferences from localStorage on initialization
    const saved = localStorage.getItem('userPreferences')
    return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences
  })

  useEffect(() => {
    // Save preferences to localStorage whenever they change
    localStorage.setItem('userPreferences', JSON.stringify(preferences))
    
    // Apply font size to document
    const root = document.documentElement
    root.style.fontSize = preferences.fontSize === 'small' ? '14px' : 
                          preferences.fontSize === 'large' ? '18px' : '16px'
  }, [preferences])

  const setFontSize = (size: FontSize) => {
    setPreferences(prev => ({ ...prev, fontSize: size }))
  }

  const value = {
    preferences,
    setFontSize
  }

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  )
}
