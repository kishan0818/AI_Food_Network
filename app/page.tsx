"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Utensils, MapPin, Users, TrendingUp, ChefHat, Globe, Clock, Star, CheckCircle } from "lucide-react"
import { mockAPI, type FoodItem } from "@/lib/mock-database"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/lib/auth-context"
import { useNotifications } from "@/lib/notification-context"
import { NotificationCenter } from "@/components/notification-center"
import { ToastNotifications } from "@/components/toast-notification"

// Enhanced live stats with real functionality
const useLiveStats = () => {
  const [stats, setStats] = useState({
    mealsDelivered: 0,
    foodRescued: 0,
    co2Saved: 0,
    partnersActive: 0,
  })

  useEffect(() => {
    // Load initial stats from mock API
    mockAPI.getStats().then((data) => {
      setStats({
        mealsDelivered: data.totalMeals,
        foodRescued: Math.floor(data.totalMeals * 0.8),
        co2Saved: data.co2Saved,
        partnersActive: data.totalPartners,
      })
    })

    // Update stats periodically with realistic increments
    const interval = setInterval(() => {
      setStats((prev) => ({
        mealsDelivered: prev.mealsDelivered + Math.floor(Math.random() * 3),
        foodRescued: prev.foodRescued + Math.floor(Math.random() * 2),
        co2Saved: prev.co2Saved + Math.floor(Math.random() * 5),
        partnersActive: prev.partnersActive + (Math.random() > 0.9 ? 1 : 0),
      }))
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return stats
}

export default function HomePage() {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const stats = useLiveStats()
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [availableFood, setAvailableFood] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const taglineWords = [
    "Turning",
    "surplus",
    "into",
    "sustenance",
    "—",
    "using",
    "AI",
    "to",
    "make",
    "cities",
    "not",
    "just",
    "smarter,",
    "but",
    "kinder.",
  ]

  useEffect(() => {
    if (currentWordIndex < taglineWords.length) {
      const timer = setTimeout(() => {
        setCurrentWordIndex((prev) => prev + 1)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [currentWordIndex, taglineWords.length])

  useEffect(() => {
    loadAvailableFood()
  }, [])

  const loadAvailableFood = async () => {
    setIsLoading(true)
    try {
      const food = await mockAPI.getFoodItems({ maxDistance: 5 })
      setAvailableFood(food.slice(0, 3)) // Show top 3 items
    } catch (error) {
      console.error("Failed to load food items:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaimFood = async (itemId: string) => {
    try {
      const success = await mockAPI.claimFoodItem(itemId, "current-user-id")
      if (success) {
        // Remove claimed item from display
        setAvailableFood((prev) => prev.filter((item) => item.id !== itemId))
        addNotification({
          type: "success",
          title: "Food Claimed Successfully!",
          message: "The donor will be notified and will contact you with pickup details.",
          icon: "🎉",
        })
      }
    } catch (error) {
      console.error("Failed to claim food:", error)
      addNotification({
        type: "error",
        title: "Failed to Claim Food",
        message: "Please try again or contact support if the problem persists.",
        icon: "❌",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-violet-50">
      <ToastNotifications />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                AI Food Network
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {[
                { name: "Home", href: "/" },
                { name: "Find Food", href: "/find-food" },
                { name: "Report Food", href: "/report-food" },
                { name: "Partners", href: "/partners" },
              ].map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-emerald-600 font-medium relative transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {user && <NotificationCenter />}
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 via-cyan-400/30 to-violet-400/30" />
          <svg className="absolute inset-0 w-full h-full">
            {[...Array(25)].map((_, i) => (
              <motion.circle
                key={i}
                cx={`${Math.random() * 100}%`}
                cy={`${Math.random() * 100}%`}
                r="3"
                fill="currentColor"
                className="text-emerald-400"
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.3,
                }}
              />
            ))}
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <Badge className="mb-4 bg-gradient-to-r from-emerald-100 to-cyan-100 text-emerald-800 border-emerald-200 shadow-sm">
                <Users className="w-4 h-4 mr-1" />
                AI-Powered Food Rescue
              </Badge>

              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent">
                  Smart Cities,
                </span>
                <br />
                <span className="text-gray-800">Kinder Hearts</span>
              </h1>
            </motion.div>

            {/* Animated Tagline */}
            <div className="text-xl md:text-2xl text-gray-600 mb-12 h-16 flex flex-wrap justify-center items-center gap-2">
              {taglineWords.map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: index <= currentWordIndex ? 1 : 0,
                    y: index <= currentWordIndex ? 0 : 20,
                  }}
                  transition={{ duration: 0.3 }}
                  className={index === 6 ? "text-cyan-600 font-semibold" : ""}
                >
                  {word}
                </motion.span>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-8 py-4 text-lg shadow-lg"
                onClick={() => {
                  loadAvailableFood()
                  addNotification({
                    type: "info",
                    title: "Searching for Food",
                    message: "Looking for available food in your area...",
                    icon: "🔍",
                  })
                }}
              >
                Start Rescuing Food
                <Users className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg bg-white/80 backdrop-blur-sm"
              >
                Watch Demo
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Statistics Dashboard */}
      <section className="py-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Live Impact Dashboard</h2>
            <p className="text-gray-600 text-lg">Real-time AI predictions and community impact</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Meals Delivered Today",
                value: stats.mealsDelivered.toLocaleString(),
                icon: Users,
                color: "from-rose-500 to-pink-500",
                bgColor: "from-rose-50 to-pink-50",
              },
              {
                title: "Food Rescued (kg)",
                value: stats.foodRescued.toLocaleString(),
                icon: ChefHat,
                color: "from-amber-500 to-orange-500",
                bgColor: "from-amber-50 to-orange-50",
              },
              {
                title: "CO₂ Emissions Saved",
                value: `${stats.co2Saved.toLocaleString()} kg`,
                icon: Globe,
                color: "from-emerald-500 to-green-500",
                bgColor: "from-emerald-50 to-green-50",
              },
              {
                title: "Active Partners",
                value: stats.partnersActive.toLocaleString(),
                icon: Utensils,
                color: "from-cyan-500 to-blue-500",
                bgColor: "from-cyan-50 to-blue-50",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card
                  className={`bg-gradient-to-br ${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} shadow-md`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.title}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-emerald-50/50 to-cyan-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Food Near You</h2>
            <p className="text-gray-600 text-lg">Fresh food available for pickup right now</p>
          </motion.div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading available food...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availableFood.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg font-bold text-gray-900 mb-1">{item.title}</CardTitle>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{item.location.distance}km away</span>
                          </div>
                        </div>
                        <Badge
                          className={`${
                            item.category === "prepared"
                              ? "bg-rose-100 text-rose-800"
                              : item.category === "fresh"
                                ? "bg-emerald-100 text-emerald-800"
                                : item.category === "bakery"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-cyan-100 text-cyan-800"
                          }`}
                        >
                          {item.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 text-sm">{item.description}</p>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-semibold">
                            {item.quantity} {item.unit}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Expires:</span>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-amber-500" />
                            <span className="font-semibold text-amber-600">
                              {Math.ceil((item.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60))}h
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Provider:</span>
                          <div className="flex items-center space-x-1">
                            <span className="font-semibold">{item.provider.name}</span>
                            {item.provider.verified && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-amber-400 fill-current" />
                              <span className="text-xs">{item.provider.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
                        onClick={() => handleClaimFood(item.id)}
                      >
                        Claim Food
                        <CheckCircle className="ml-2 w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {availableFood.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-600">No food available in your area right now. Check back soon!</p>
              <Button
                className="mt-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                onClick={loadAvailableFood}
              >
                Refresh
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Quick Action Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Take Action Now</h2>
            <p className="text-gray-600 text-lg">Join our AI-powered network in three simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Report Surplus Food",
                description:
                  "Restaurants and businesses can instantly report excess food through our AI-powered platform",
                icon: Utensils,
                color: "from-amber-500 to-orange-500",
                bgColor: "from-amber-50 to-orange-50",
                action: "Report Now",
                href: "/report-food",
              },
              {
                title: "Find Food Nearby",
                description: "Individuals and families can locate available food resources in their neighborhood",
                icon: MapPin,
                color: "from-emerald-500 to-cyan-500",
                bgColor: "from-emerald-50 to-cyan-50",
                action: "Find Food",
                href: "/find-food",
              },
              {
                title: "Partner With Us",
                description: "NGOs, volunteers, and organizations can join our growing network of food rescuers",
                icon: Users,
                color: "from-cyan-500 to-violet-500",
                bgColor: "from-cyan-50 to-violet-50",
                action: "Join Network",
                href: "/partners",
              },
            ].map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
              >
                <Card
                  className={`h-full bg-gradient-to-br ${card.bgColor} border-0 shadow-lg hover:shadow-2xl transition-all duration-300`}
                >
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <card.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600 mb-6 text-base leading-relaxed">
                      {card.description}
                    </CardDescription>
                    <Button
                      className={`w-full bg-gradient-to-r ${card.color} hover:opacity-90 text-white group-hover:scale-105 transition-transform duration-300 shadow-md`}
                      onClick={() => (window.location.href = card.href)}
                    >
                      {card.action}
                      <Users className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AI Food Network</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Using artificial intelligence to connect surplus food with people in need, creating smarter and kinder
                cities worldwide.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Globe className="w-4 h-4" />
                <span>Making global impact, one meal at a time</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    Success Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Get Involved</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    Volunteer
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    Partner
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    Donate
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition-colors">
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI Food Network. Built with ❤️ for a better world.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
