"use client"
import { login as apiLogin, getToken } from "@/app/api/auth"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
  user: any
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true, login: async () => {}, logout: () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (token) {
      setUser({ token }) // opcional: decodifica el JWT si quieres info del usuario
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const data = await apiLogin(email, password)
      setUser({ token: data.access_token })
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
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
