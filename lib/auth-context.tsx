"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  name: string
  email: string
  type: "individual" | "family" | "organization" | "business"
  location?: {
    address: string
    lat: number
    lng: number
  }
  verified: boolean
  joinedAt: Date
  totalClaimed: number
  totalDonated: number
  rating: number
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (userData: {
    name: string
    email: string
    password: string
    type: User["type"]
    address?: string
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    password: "password123",
    type: "family",
    location: {
      address: "321 Oak St, Downtown",
      lat: 40.715,
      lng: -74.007,
    },
    verified: true,
    joinedAt: new Date("2024-01-15"),
    totalClaimed: 23,
    totalDonated: 5,
    rating: 4.9,
    avatar: "/woman-profile.png",
  },
  {
    id: "2",
    name: "Green Leaf Cafe",
    email: "contact@greenleaf.com",
    password: "business123",
    type: "business",
    location: {
      address: "123 Main St, Downtown",
      lat: 40.7128,
      lng: -74.006,
    },
    verified: true,
    joinedAt: new Date("2023-08-10"),
    totalClaimed: 0,
    totalDonated: 156,
    rating: 4.8,
    avatar: "/restaurant-logo.png",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("ai-food-network-user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (error) {
        console.error("Failed to parse stored user data:", error)
        localStorage.removeItem("ai-food-network-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("ai-food-network-user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return { success: true }
    } else {
      setIsLoading(false)
      return { success: false, error: "Invalid email or password" }
    }
  }

  const signup = async (userData: {
    name: string
    email: string
    password: string
    type: User["type"]
    address?: string
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === userData.email)
    if (existingUser) {
      setIsLoading(false)
      return { success: false, error: "User with this email already exists" }
    }

    // Create new user
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      type: userData.type,
      location: userData.address
        ? {
            address: userData.address,
            lat: 40.7128 + (Math.random() - 0.5) * 0.1,
            lng: -74.006 + (Math.random() - 0.5) * 0.1,
          }
        : undefined,
      verified: false,
      joinedAt: new Date(),
      totalClaimed: 0,
      totalDonated: 0,
      rating: 5.0,
    }

    mockUsers.push(newUser)

    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("ai-food-network-user", JSON.stringify(userWithoutPassword))
    setIsLoading(false)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("ai-food-network-user")
  }

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem("ai-food-network-user", JSON.stringify(updatedUser))

    // Update in mock database
    const userIndex = mockUsers.findIndex((u) => u.id === user.id)
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates }
    }

    setIsLoading(false)
    return true
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
