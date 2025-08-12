"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Package, Plus, X, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface FoodItem {
  id: string
  name: string
  category: string
  quantity: string
  unit: string
  expiryDate: string
  condition: "excellent" | "good" | "fair"
}

export default function ReportFoodPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [currentItem, setCurrentItem] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "kg",
    expiryDate: "",
    condition: "good" as const,
  })

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pickupAddress: user?.location?.address || "",
    availableFrom: "",
    availableUntil: "",
    contactMethod: "phone",
    specialInstructions: "",
  })

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

  const units = ["kg", "lbs", "pieces", "boxes", "bags", "liters", "gallons"]

  const addFoodItem = () => {
    if (currentItem.name && currentItem.category && currentItem.quantity) {
      const newItem: FoodItem = {
        id: Date.now().toString(),
        ...currentItem,
      }
      setFoodItems([...foodItems, newItem])
      setCurrentItem({
        name: "",
        category: "",
        quantity: "",
        unit: "kg",
        expiryDate: "",
        condition: "good",
      })
    }
  }

  const removeFoodItem = (id: string) => {
    setFoodItems(foodItems.filter((item) => item.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert("Please log in to report food")
      return
    }

    if (foodItems.length === 0) {
      alert("Please add at least one food item")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock successful submission
    alert("Food report submitted successfully! You'll receive notifications when someone is interested.")

    // Reset form
    setFormData({
      title: "",
      description: "",
      pickupAddress: user?.location?.address || "",
      availableFrom: "",
      availableUntil: "",
      contactMethod: "phone",
      specialInstructions: "",
    })
    setFoodItems([])
    setIsSubmitting(false)

    router.push("/")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-slate-800">Login Required</CardTitle>
            <CardDescription>Please log in to report surplus food</CardDescription>
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
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-emerald-700 hover:text-emerald-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Report Surplus Food</h1>
              <p className="text-slate-600">Help reduce waste by sharing your surplus food</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Package className="w-5 h-5 text-emerald-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Listing Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Fresh vegetables from restaurant closing"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the food items, their condition, and any special notes..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Food Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-slate-800">Food Items</CardTitle>
              <CardDescription>Add the specific food items you want to share</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Item Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    id="itemName"
                    value={currentItem.name}
                    onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                    placeholder="e.g., Apples"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={currentItem.category}
                    onValueChange={(value) => setCurrentItem({ ...currentItem, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      value={currentItem.quantity}
                      onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                      placeholder="10"
                    />
                  </div>
                  <div className="w-20">
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                      value={currentItem.unit}
                      onValueChange={(value) => setCurrentItem({ ...currentItem, unit: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-end">
                  <Button type="button" onClick={addFoodItem} className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>

              {/* Added Items List */}
              {foodItems.length > 0 && (
                <div className="space-y-2">
                  <Label>Added Items ({foodItems.length})</Label>
                  <div className="space-y-2">
                    {foodItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{item.category}</Badge>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-slate-600">
                            {item.quantity} {item.unit}
                          </span>
                          {item.expiryDate && (
                            <span className="text-sm text-slate-500">Expires: {item.expiryDate}</span>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFoodItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pickup Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Pickup Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Pickup Address</Label>
                <Input
                  id="address"
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                  placeholder="Enter pickup address"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="availableFrom">Available From</Label>
                  <Input
                    id="availableFrom"
                    type="datetime-local"
                    value={formData.availableFrom}
                    onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="availableUntil">Available Until</Label>
                  <Input
                    id="availableUntil"
                    type="datetime-local"
                    value={formData.availableUntil}
                    onChange={(e) => setFormData({ ...formData, availableUntil: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="instructions">Special Instructions</Label>
                <Textarea
                  id="instructions"
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  placeholder="Any special pickup instructions, access codes, etc."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || foodItems.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 px-8 py-2"
            >
              {isSubmitting ? "Submitting..." : "Submit Food Report"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
