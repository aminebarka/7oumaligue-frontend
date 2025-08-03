"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { login as apiLogin, register as apiRegister, setAuthToken } from "../services/api"
import type { AuthUser } from "../types"

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role?: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<AuthUser>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
          setAuthToken(storedToken)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        // Clear invalid data
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await apiLogin({ email, password })

      if (response.success && response.data) {
        const { user: userData, token: userToken } = response.data

        setUser(userData)
        setToken(userToken)

        // Store in localStorage
        localStorage.setItem("token", userToken)
        localStorage.setItem("user", JSON.stringify(userData))
      } else {
        throw new Error(response.error || "Login failed")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      throw new Error(error.response?.data?.error || error.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, role = "player"): Promise<void> => {
    try {
      setIsLoading(true)
      console.log("🔍 Inscription avec le rôle:", role);
      const response = await apiRegister({ name, email, password, role })

      if (response.success && response.data) {
        const { user: userData, token: userToken } = response.data

        console.log("✅ Inscription réussie avec le rôle:", userData.role);
        setUser(userData)
        setToken(userToken)

        // Store in localStorage
        localStorage.setItem("token", userToken)
        localStorage.setItem("user", JSON.stringify(userData))
      } else {
        throw new Error(response.error || "Registration failed")
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      throw new Error(error.response?.data?.error || error.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  const updateUser = (userData: Partial<AuthUser>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
