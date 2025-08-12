"use client"

export interface FoodListing {
  id: string
  title: string
  description: string
  donorId: string
  donorName: string
  donorType: "individual" | "family" | "organization" | "business"
  donorRating: number
  items: {
    id: string
    name: string
    category: string
    quantity: string
    unit: string
    expiryDate?: string
    condition: "excellent" | "good" | "fair"
  }[]
  location: {
    address: string
    lat: number
    lng: number
    distance?: number
  }
  availableFrom: Date
  availableUntil: Date
  contactMethod: string
  specialInstructions?: string
  status: "available" | "claimed" | "expired"
  createdAt: Date
  claimedBy?: string
  claimedAt?: Date
  tags: string[]
  imageUrl?: string
}

// Mock food listings data
export const mockFoodListings: FoodListing[] = [
  {
    id: "1",
    title: "Fresh Bakery Items - End of Day",
    description:
      "Assorted fresh bread, pastries, and sandwiches from our bakery. All items are from today and still fresh!",
    donorId: "2",
    donorName: "Green Leaf Cafe",
    donorType: "business",
    donorRating: 4.8,
    items: [
      {
        id: "1a",
        name: "Sourdough Bread",
        category: "Baked Goods",
        quantity: "6",
        unit: "loaves",
        condition: "excellent",
      },
      {
        id: "1b",
        name: "Croissants",
        category: "Baked Goods",
        quantity: "12",
        unit: "pieces",
        condition: "excellent",
      },
      {
        id: "1c",
        name: "Sandwiches",
        category: "Prepared Meals",
        quantity: "8",
        unit: "pieces",
        expiryDate: "2024-12-09",
        condition: "good",
      },
    ],
    location: {
      address: "123 Main St, Downtown",
      lat: 40.7128,
      lng: -74.006,
      distance: 0.8,
    },
    availableFrom: new Date("2024-12-08T18:00:00"),
    availableUntil: new Date("2024-12-08T21:00:00"),
    contactMethod: "phone",
    specialInstructions: "Please come to the back entrance after 6 PM",
    status: "available",
    createdAt: new Date("2024-12-08T17:30:00"),
    tags: ["bakery", "fresh", "same-day"],
    imageUrl: "/bakery-items.jpg",
  },
  {
    id: "2",
    title: "Surplus Vegetables from Farmers Market",
    description:
      "Fresh organic vegetables that didn't sell at today's farmers market. Perfect for families or food preparation.",
    donorId: "3",
    donorName: "Organic Harvest Co",
    donorType: "business",
    donorRating: 4.9,
    items: [
      {
        id: "2a",
        name: "Carrots",
        category: "Fresh Produce",
        quantity: "5",
        unit: "kg",
        condition: "excellent",
      },
      {
        id: "2b",
        name: "Bell Peppers",
        category: "Fresh Produce",
        quantity: "3",
        unit: "kg",
        condition: "good",
      },
      {
        id: "2c",
        name: "Leafy Greens Mix",
        category: "Fresh Produce",
        quantity: "2",
        unit: "kg",
        expiryDate: "2024-12-10",
        condition: "excellent",
      },
    ],
    location: {
      address: "456 Market Square, Midtown",
      lat: 40.7589,
      lng: -73.9851,
      distance: 2.3,
    },
    availableFrom: new Date("2024-12-08T16:00:00"),
    availableUntil: new Date("2024-12-09T10:00:00"),
    contactMethod: "phone",
    specialInstructions: "Bring your own bags. Available at the market stall #15",
    status: "available",
    createdAt: new Date("2024-12-08T15:45:00"),
    tags: ["organic", "vegetables", "farmers-market"],
    imageUrl: "/vegetables.jpg",
  },
  {
    id: "3",
    title: "Prepared Meals - Community Kitchen",
    description:
      "Nutritious prepared meals made with love. Perfect for individuals or families in need of ready-to-eat food.",
    donorId: "4",
    donorName: "Community Care Kitchen",
    donorType: "organization",
    donorRating: 5.0,
    items: [
      {
        id: "3a",
        name: "Vegetable Curry with Rice",
        category: "Prepared Meals",
        quantity: "15",
        unit: "portions",
        expiryDate: "2024-12-09",
        condition: "excellent",
      },
      {
        id: "3b",
        name: "Chicken Soup",
        category: "Prepared Meals",
        quantity: "10",
        unit: "portions",
        expiryDate: "2024-12-09",
        condition: "excellent",
      },
    ],
    location: {
      address: "789 Community Ave, Uptown",
      lat: 40.7831,
      lng: -73.9712,
      distance: 1.5,
    },
    availableFrom: new Date("2024-12-08T17:00:00"),
    availableUntil: new Date("2024-12-08T19:00:00"),
    contactMethod: "phone",
    specialInstructions: "Please bring containers for the meals. Ring the community center bell.",
    status: "available",
    createdAt: new Date("2024-12-08T16:30:00"),
    tags: ["prepared-meals", "community", "ready-to-eat"],
    imageUrl: "/prepared-meals.jpg",
  },
  {
    id: "4",
    title: "Grocery Store Surplus - Dairy & Frozen",
    description: "Various dairy products and frozen items approaching sell-by date but still perfectly good.",
    donorId: "5",
    donorName: "FreshMart Grocery",
    donorType: "business",
    donorRating: 4.6,
    items: [
      {
        id: "4a",
        name: "Milk (2% Fat)",
        category: "Dairy Products",
        quantity: "8",
        unit: "liters",
        expiryDate: "2024-12-11",
        condition: "good",
      },
      {
        id: "4b",
        name: "Yogurt Cups",
        category: "Dairy Products",
        quantity: "20",
        unit: "pieces",
        expiryDate: "2024-12-12",
        condition: "good",
      },
      {
        id: "4c",
        name: "Frozen Vegetables",
        category: "Frozen Items",
        quantity: "6",
        unit: "bags",
        condition: "excellent",
      },
    ],
    location: {
      address: "321 Shopping Plaza, Westside",
      lat: 40.7282,
      lng: -74.0776,
      distance: 3.2,
    },
    availableFrom: new Date("2024-12-08T20:00:00"),
    availableUntil: new Date("2024-12-09T08:00:00"),
    contactMethod: "phone",
    specialInstructions: "Come to the loading dock at the back of the store",
    status: "available",
    createdAt: new Date("2024-12-08T19:15:00"),
    tags: ["dairy", "frozen", "grocery-surplus"],
    imageUrl: "/dairy-frozen.jpg",
  },
]

// Function to get food listings with optional filtering
export function getFoodListings(filters?: {
  category?: string
  maxDistance?: number
  status?: string
  donorType?: string
}) {
  let listings = [...mockFoodListings]

  if (filters) {
    if (filters.category) {
      listings = listings.filter((listing) => listing.items.some((item) => item.category === filters.category))
    }

    if (filters.maxDistance) {
      listings = listings.filter((listing) => (listing.location.distance || 0) <= filters.maxDistance!)
    }

    if (filters.status) {
      listings = listings.filter((listing) => listing.status === filters.status)
    }

    if (filters.donorType) {
      listings = listings.filter((listing) => listing.donorType === filters.donorType)
    }
  }

  // Sort by distance and creation date
  return listings.sort((a, b) => {
    const distanceA = a.location.distance || 0
    const distanceB = b.location.distance || 0
    if (distanceA !== distanceB) {
      return distanceA - distanceB
    }
    return b.createdAt.getTime() - a.createdAt.getTime()
  })
}

// Function to add a new food listing
export function addFoodListing(listing: Omit<FoodListing, "id" | "createdAt">) {
  const newListing: FoodListing = {
    ...listing,
    id: Date.now().toString(),
    createdAt: new Date(),
  }
  mockFoodListings.unshift(newListing)
  return newListing
}

// Function to claim a food listing
export function claimFoodListing(listingId: string, userId: string) {
  const listing = mockFoodListings.find((l) => l.id === listingId)
  if (listing && listing.status === "available") {
    listing.status = "claimed"
    listing.claimedBy = userId
    listing.claimedAt = new Date()
    return true
  }
  return false
}
