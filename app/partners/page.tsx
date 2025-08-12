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
import { Checkbox } from "@/components/ui/checkbox"
import { Building, Heart, Star, MapPin, ArrowLeft, CheckCircle, Award, TrendingUp, Clock, Package } from "lucide-react"
import Link from "next/link"

interface Partner {
  id: string
  name: string
  type: "restaurant" | "grocery" | "bakery" | "farm" | "catering" | "nonprofit" | "other"
  description: string
  location: {
    address: string
    city: string
    state: string
    zipCode: string
  }
  contact: {
    email: string
    phone: string
    website?: string
  }
  businessHours: string
  capacity: {
    dailyDonations: number
    storageSpace: string
  }
  certifications: string[]
  joinedDate: Date
  totalDonations: number
  impactMetrics: {
    mealsProvided: number
    wasteReduced: number
    peopleHelped: number
  }
  verified: boolean
  rating: number
  logo?: string
}

const mockPartners: Partner[] = [
  {
    id: "1",
    name: "Green Leaf Cafe",
    type: "restaurant",
    description:
      "Sustainable farm-to-table restaurant committed to reducing food waste through daily donations of fresh, high-quality surplus food.",
    location: {
      address: "123 Main St",
      city: "Downtown",
      state: "NY",
      zipCode: "10001",
    },
    contact: {
      email: "contact@greenleaf.com",
      phone: "(555) 123-4567",
      website: "https://greenleafcafe.com",
    },
    businessHours: "Mon-Sun: 7:00 AM - 9:00 PM",
    capacity: {
      dailyDonations: 50,
      storageSpace: "Large refrigerated storage",
    },
    certifications: ["Food Safety Certified", "Organic Certified", "Sustainable Business"],
    joinedDate: new Date("2023-08-10"),
    totalDonations: 156,
    impactMetrics: {
      mealsProvided: 2340,
      wasteReduced: 1200,
      peopleHelped: 890,
    },
    verified: true,
    rating: 4.8,
    logo: "/restaurant-logo.png",
  },
  {
    id: "2",
    name: "FreshMart Grocery",
    type: "grocery",
    description:
      "Community-focused grocery store chain dedicated to fighting hunger by donating surplus produce, dairy, and packaged goods daily.",
    location: {
      address: "321 Shopping Plaza",
      city: "Westside",
      state: "NY",
      zipCode: "10002",
    },
    contact: {
      email: "partnerships@freshmart.com",
      phone: "(555) 987-6543",
      website: "https://freshmart.com",
    },
    businessHours: "Mon-Sun: 6:00 AM - 11:00 PM",
    capacity: {
      dailyDonations: 200,
      storageSpace: "Multiple cold storage units",
    },
    certifications: ["Food Safety Certified", "Community Partner"],
    joinedDate: new Date("2023-06-15"),
    totalDonations: 324,
    impactMetrics: {
      mealsProvided: 4860,
      wasteReduced: 2800,
      peopleHelped: 1650,
    },
    verified: true,
    rating: 4.6,
    logo: "/grocery-logo.png",
  },
  {
    id: "3",
    name: "Community Care Kitchen",
    type: "nonprofit",
    description:
      "Non-profit organization preparing and distributing nutritious meals to families in need while coordinating food rescue efforts.",
    location: {
      address: "789 Community Ave",
      city: "Uptown",
      state: "NY",
      zipCode: "10003",
    },
    contact: {
      email: "info@communitycare.org",
      phone: "(555) 456-7890",
      website: "https://communitycare.org",
    },
    businessHours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 4:00 PM",
    capacity: {
      dailyDonations: 100,
      storageSpace: "Commercial kitchen and pantry",
    },
    certifications: ["501(c)(3) Nonprofit", "Food Handler Certified", "Community Service Award"],
    joinedDate: new Date("2023-03-20"),
    totalDonations: 89,
    impactMetrics: {
      mealsProvided: 1780,
      wasteReduced: 950,
      peopleHelped: 1200,
    },
    verified: true,
    rating: 5.0,
    logo: "/nonprofit-logo.png",
  },
]

export default function PartnersPage() {
  const { user } = useAuth()
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    email: "",
    phone: "",
    website: "",
    businessHours: "",
    dailyDonations: "",
    storageSpace: "",
    certifications: [] as string[],
    agreeToTerms: false,
  })

  const businessTypes = [
    { value: "restaurant", label: "Restaurant" },
    { value: "grocery", label: "Grocery Store" },
    { value: "bakery", label: "Bakery" },
    { value: "farm", label: "Farm/Producer" },
    { value: "catering", label: "Catering Company" },
    { value: "nonprofit", label: "Non-Profit Organization" },
    { value: "other", label: "Other" },
  ]

  const availableCertifications = [
    "Food Safety Certified",
    "Organic Certified",
    "Sustainable Business",
    "Community Partner",
    "501(c)(3) Nonprofit",
    "Food Handler Certified",
    "HACCP Certified",
  ]

  const handleCertificationChange = (certification: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, certification],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        certifications: prev.certifications.filter((c) => c !== certification),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    alert(
      "Partner registration submitted successfully! We'll review your application and contact you within 2-3 business days.",
    )

    // Reset form
    setFormData({
      businessName: "",
      businessType: "",
      description: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      email: "",
      phone: "",
      website: "",
      businessHours: "",
      dailyDonations: "",
      storageSpace: "",
      certifications: [],
      agreeToTerms: false,
    })
    setShowRegistrationForm(false)
    setIsSubmitting(false)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "restaurant":
        return Building
      case "grocery":
        return Package
      case "nonprofit":
        return Heart
      default:
        return Building
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "restaurant":
        return "bg-blue-100 text-blue-800"
      case "grocery":
        return "bg-green-100 text-green-800"
      case "nonprofit":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
                <h1 className="text-2xl font-bold text-slate-800">Partner Network</h1>
                <p className="text-slate-600">Join our community of food waste warriors</p>
              </div>
            </div>
            <Button onClick={() => setShowRegistrationForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
              Become a Partner
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Partner Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-slate-800">Why Partner With Us?</CardTitle>
            <CardDescription className="text-center">
              Join a network of businesses and organizations making a real impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Reduce Waste Costs</h3>
                <p className="text-sm text-slate-600">Save money on waste disposal while helping your community</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Build Brand Reputation</h3>
                <p className="text-sm text-slate-600">
                  Showcase your commitment to sustainability and social responsibility
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Make Real Impact</h3>
                <p className="text-sm text-slate-600">Directly help families and individuals in your community</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Partners */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Our Trusted Partners</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockPartners.map((partner) => {
              const TypeIcon = getTypeIcon(partner.type)
              return (
                <Card key={partner.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TypeIcon className="w-8 h-8 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                              {partner.name}
                              {partner.verified && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getTypeColor(partner.type)}>
                                {businessTypes.find((t) => t.value === partner.type)?.label}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm text-slate-600">{partner.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 mb-3">{partner.description}</p>

                        <div className="grid grid-cols-3 gap-4 mb-3 text-center">
                          <div>
                            <p className="text-lg font-semibold text-emerald-600">
                              {partner.impactMetrics.mealsProvided.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-500">Meals Provided</p>
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-blue-600">
                              {partner.impactMetrics.wasteReduced.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-500">lbs Waste Reduced</p>
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-purple-600">
                              {partner.impactMetrics.peopleHelped.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-500">People Helped</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {partner.location.city}, {partner.location.state}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Partner since {partner.joinedDate.getFullYear()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Registration Form Modal */}
        {showRegistrationForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-slate-800">Partner Registration</CardTitle>
                <CardDescription>Join our network and start making a difference in your community</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessName">Business/Organization Name</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessType">Type</Label>
                      <Select
                        value={formData.businessType}
                        onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Tell us about your business and why you want to partner with us..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Certifications (select all that apply)</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {availableCertifications.map((cert) => (
                        <div key={cert} className="flex items-center space-x-2">
                          <Checkbox
                            id={cert}
                            checked={formData.certifications.includes(cert)}
                            onCheckedChange={(checked) => handleCertificationChange(cert, checked as boolean)}
                          />
                          <Label htmlFor={cert} className="text-sm">
                            {cert}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the terms and conditions and privacy policy
                    </Label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowRegistrationForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
