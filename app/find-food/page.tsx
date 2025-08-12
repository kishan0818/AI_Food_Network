"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getFoodListings, claimFoodListing, type FoodListing } from "@/lib/food-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Clock,
  Package,
  Star,
  Search,
  ArrowLeft,
  Phone,
  CheckCircle,
  AlertCircle,
  Users,
  Building,
  Home,
  Heart,
} from "lucide-react"
import Link from "next/link"

export default function FindFoodPage() {
  const { user } = useAuth()
  const [listings, setListings] = useState<FoodListing[]>([])
  const [filteredListings, setFilteredListings] = useState<FoodListing[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [distanceFilter, setDistanceFilter] = useState("any")
  const [donorTypeFilter, setDonorTypeFilter] = useState("all")
  const [claimingId, setClaimingId] = useState<string | null>(null)

  const categories = [
    "Fresh Produce",
    "Dairy Products",
    "Baked Goods",
    "Prepared Meals",
    "Canned Goods",
    "Frozen Items",
    "Beverages",
    "Snacks",
    "Other",
  ]

  const donorTypes = [
    { value: "individual", label: "Individual", icon: Users },
    { value: "family", label: "Family", icon: Home },
    { value: "business", label: "Business", icon: Building },
    { value: "organization", label: "Organization", icon: Heart },
  ]

  useEffect(() => {
    // Load initial listings
    const initialListings = getFoodListings({ status: "available" })
    setListings(initialListings)
    setFilteredListings(initialListings)
  }, [])

  useEffect(() => {
    // Apply filters
    let filtered = listings

    if (searchQuery) {
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((listing) => listing.items.some((item) => item.category === categoryFilter))
    }

    if (distanceFilter !== "any") {
      const maxDistance = Number.parseFloat(distanceFilter)
      filtered = filtered.filter((listing) => (listing.location.distance || 0) <= maxDistance)
    }

    if (donorTypeFilter !== "all") {
      filtered = filtered.filter((listing) => listing.donorType === donorTypeFilter)
    }

    setFilteredListings(filtered)
  }, [listings, searchQuery, categoryFilter, distanceFilter, donorTypeFilter])

  const handleClaimFood = async (listingId: string) => {
    if (!user) {
      alert("Please log in to claim food")
      return
    }

    setClaimingId(listingId)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const success = claimFoodListing(listingId, user.id)

    if (success) {
      // Update local state
      setListings((prev) => prev.filter((listing) => listing.id !== listingId))
      setFilteredListings((prev) => prev.filter((listing) => listing.id !== listingId))
      alert("Food claimed successfully! The donor will be notified with your contact information.")
    } else {
      alert("Sorry, this food has already been claimed by someone else.")
    }

    setClaimingId(null)
  }

  const formatTimeRemaining = (availableUntil: Date) => {
    const now = new Date()
    const diff = availableUntil.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days} day${days > 1 ? "s" : ""} left`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m left`
    } else if (minutes > 0) {
      return `${minutes}m left`
    } else {
      return "Expired"
    }
  }

  const getDonorIcon = (type: string) => {
    const donorType = donorTypes.find((dt) => dt.value === type)
    return donorType ? donorType.icon : Users
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-slate-800">Login Required</CardTitle>
            <CardDescription>Please log in to find and claim food</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Go to Homepage</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-emerald-700 hover:text-emerald-800">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Find Food</h1>
                <p className="text-slate-600">Discover surplus food available in your area</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Available listings</p>
              <p className="text-2xl font-bold text-emerald-600">{filteredListings.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Search className="w-5 h-5 text-emerald-600" />
              Search & Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search food, donor, location..."
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="distance">Max Distance</Label>
                <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any distance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any distance</SelectItem>
                    <SelectItem value="1">Within 1 km</SelectItem>
                    <SelectItem value="2">Within 2 km</SelectItem>
                    <SelectItem value="5">Within 5 km</SelectItem>
                    <SelectItem value="10">Within 10 km</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="donorType">Donor Type</Label>
                <Select value={donorTypeFilter} onValueChange={setDonorTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All donors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All donors</SelectItem>
                    {donorTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Food Listings */}
        <div className="space-y-4">
          {filteredListings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No food listings found</h3>
                <p className="text-slate-500">
                  Try adjusting your search criteria or check back later for new listings.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredListings.map((listing) => {
              const DonorIcon = getDonorIcon(listing.donorType)
              const timeRemaining = formatTimeRemaining(listing.availableUntil)
              const isExpiringSoon = listing.availableUntil.getTime() - new Date().getTime() < 2 * 60 * 60 * 1000 // 2 hours

              return (
                <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Main Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-1">{listing.title}</h3>
                            <div className="flex items-center gap-2 text-slate-600">
                              <DonorIcon className="w-4 h-4" />
                              <span>{listing.donorName}</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{listing.donorRating}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-slate-600 mb-1">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{listing.location.distance} km away</span>
                            </div>
                            <div
                              className={`flex items-center gap-1 text-sm ${
                                isExpiringSoon ? "text-orange-600" : "text-slate-600"
                              }`}
                            >
                              <Clock className="w-4 h-4" />
                              <span>{timeRemaining}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-600 mb-4">{listing.description}</p>

                        {/* Food Items */}
                        <div className="mb-4">
                          <h4 className="font-medium text-slate-800 mb-2">Available Items:</h4>
                          <div className="flex flex-wrap gap-2">
                            {listing.items.map((item) => (
                              <Badge key={item.id} variant="secondary" className="text-xs">
                                {item.name} ({item.quantity} {item.unit})
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Location and Instructions */}
                        <div className="space-y-2 text-sm text-slate-600">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{listing.location.address}</span>
                          </div>
                          {listing.specialInstructions && (
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span>{listing.specialInstructions}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Panel */}
                      <div className="lg:w-64 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="text-center p-3 bg-emerald-50 rounded-lg">
                            <p className="text-sm text-slate-600">Available</p>
                            <p className="text-xs text-slate-500">
                              {listing.availableFrom.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              -{" "}
                              {listing.availableUntil.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {listing.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 mt-4">
                          <Button
                            onClick={() => handleClaimFood(listing.id)}
                            disabled={claimingId === listing.id}
                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                          >
                            {claimingId === listing.id ? (
                              "Claiming..."
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Claim Food
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            <Phone className="w-4 h-4 mr-2" />
                            Contact Donor
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
