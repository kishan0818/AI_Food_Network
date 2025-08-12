// Mock database with realistic data structures
export interface FoodItem {
  id: string
  title: string
  description: string
  quantity: number
  unit: string
  category: "prepared" | "fresh" | "packaged" | "bakery"
  expiryDate: Date
  location: {
    address: string
    lat: number
    lng: number
    distance?: number
  }
  provider: {
    name: string
    type: "restaurant" | "grocery" | "bakery" | "catering"
    rating: number
    verified: boolean
  }
  status: "available" | "claimed" | "expired"
  createdAt: Date
  claimedBy?: string
  claimedAt?: Date
}

export interface User {
  id: string
  name: string
  email: string
  type: "individual" | "family" | "organization"
  location: {
    address: string
    lat: number
    lng: number
  }
  verified: boolean
  joinedAt: Date
  totalClaimed: number
  rating: number
}

export interface Partner {
  id: string
  name: string
  type: "restaurant" | "grocery" | "bakery" | "catering" | "ngo" | "volunteer"
  description: string
  location: {
    address: string
    lat: number
    lng: number
  }
  contact: {
    email: string
    phone: string
    website?: string
  }
  verified: boolean
  joinedAt: Date
  totalDonations: number
  rating: number
  status: "active" | "inactive"
}

// Mock data
export const mockFoodItems: FoodItem[] = [
  {
    id: "1",
    title: "Fresh Sandwiches & Salads",
    description: "Assorted sandwiches and fresh salads from lunch service",
    quantity: 25,
    unit: "portions",
    category: "prepared",
    expiryDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    location: {
      address: "123 Main St, Downtown",
      lat: 40.7128,
      lng: -74.006,
      distance: 0.8,
    },
    provider: {
      name: "Green Leaf Cafe",
      type: "restaurant",
      rating: 4.8,
      verified: true,
    },
    status: "available",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    title: "Day-Old Bread & Pastries",
    description: "Fresh baked goods from yesterday, still perfectly good",
    quantity: 40,
    unit: "items",
    category: "bakery",
    expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    location: {
      address: "456 Baker Ave, Midtown",
      lat: 40.7589,
      lng: -73.9851,
      distance: 1.2,
    },
    provider: {
      name: "Sunrise Bakery",
      type: "bakery",
      rating: 4.9,
      verified: true,
    },
    status: "available",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "3",
    title: "Organic Vegetables",
    description: "Slightly imperfect but fresh organic vegetables",
    quantity: 15,
    unit: "kg",
    category: "fresh",
    expiryDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
    location: {
      address: "789 Market St, Uptown",
      lat: 40.7831,
      lng: -73.9712,
      distance: 2.1,
    },
    provider: {
      name: "Fresh Market Co",
      type: "grocery",
      rating: 4.6,
      verified: true,
    },
    status: "available",
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
]

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@email.com",
    type: "family",
    location: {
      address: "321 Oak St, Downtown",
      lat: 40.715,
      lng: -74.007,
    },
    verified: true,
    joinedAt: new Date("2024-01-15"),
    totalClaimed: 23,
    rating: 4.9,
  },
]

export const mockPartners: Partner[] = [
  {
    id: "1",
    name: "Green Leaf Cafe",
    type: "restaurant",
    description: "Sustainable cafe committed to zero food waste",
    location: {
      address: "123 Main St, Downtown",
      lat: 40.7128,
      lng: -74.006,
    },
    contact: {
      email: "contact@greenleaf.com",
      phone: "+1-555-0123",
      website: "https://greenleaf.com",
    },
    verified: true,
    joinedAt: new Date("2023-08-10"),
    totalDonations: 156,
    rating: 4.8,
    status: "active",
  },
  {
    id: "2",
    name: "City Food Rescue",
    type: "ngo",
    description: "Non-profit organization dedicated to food rescue and distribution",
    location: {
      address: "555 Community Blvd, Central",
      lat: 40.7505,
      lng: -73.9934,
    },
    contact: {
      email: "info@cityfoodrescue.org",
      phone: "+1-555-0456",
    },
    verified: true,
    joinedAt: new Date("2023-05-20"),
    totalDonations: 89,
    rating: 4.9,
    status: "active",
  },
]

// Mock API functions
export const mockAPI = {
  // Food items
  getFoodItems: async (filters?: { category?: string; maxDistance?: number }): Promise<FoodItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
    let items = [...mockFoodItems]

    if (filters?.category) {
      items = items.filter((item) => item.category === filters.category)
    }

    if (filters?.maxDistance) {
      items = items.filter((item) => (item.location.distance || 0) <= filters.maxDistance)
    }

    return items.filter((item) => item.status === "available")
  },

  claimFoodItem: async (itemId: string, userId: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const item = mockFoodItems.find((item) => item.id === itemId)
    if (item && item.status === "available") {
      item.status = "claimed"
      item.claimedBy = userId
      item.claimedAt = new Date()
      return true
    }
    return false
  },

  // Partners
  getPartners: async (): Promise<Partner[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return mockPartners.filter((partner) => partner.status === "active")
  },

  registerPartner: async (
    partnerData: Omit<Partner, "id" | "joinedAt" | "totalDonations" | "rating" | "status">,
  ): Promise<Partner> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const newPartner: Partner = {
      ...partnerData,
      id: Date.now().toString(),
      joinedAt: new Date(),
      totalDonations: 0,
      rating: 5.0,
      status: "active",
    }
    mockPartners.push(newPartner)
    return newPartner
  },

  // Food reporting
  reportFood: async (foodData: Omit<FoodItem, "id" | "createdAt" | "status">): Promise<FoodItem> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    const newItem: FoodItem = {
      ...foodData,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: "available",
    }
    mockFoodItems.push(newItem)
    return newItem
  },

  // Statistics
  getStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return {
      totalMeals: mockFoodItems.reduce((sum, item) => sum + item.quantity, 0),
      totalPartners: mockPartners.length,
      totalUsers: mockUsers.length,
      co2Saved: Math.floor(mockFoodItems.reduce((sum, item) => sum + item.quantity, 0) * 2.3), // kg CO2 per meal
      activeToday: mockFoodItems.filter((item) => item.createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000)).length,
    }
  },
}
