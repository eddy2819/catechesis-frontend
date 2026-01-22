"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { getToken } from "@/app/api/auth"

interface AuthContextType {
  user: any
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true })

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

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
