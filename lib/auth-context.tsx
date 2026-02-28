"use client"
import { login as apiLogin, getToken, getStoredUser } from "@/app/api/auth"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  username: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true, login: async () => {}, logout: () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    const storedUser = getStoredUser()
    if (token && storedUser) {
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
      const data = await apiLogin(email, password)
      setUser(data.user)
    
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    window.location.href = "/login" // redirige al login después de cerrar sesión
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
