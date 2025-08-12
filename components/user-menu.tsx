"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Settings, LogOut, Star, Package, Heart } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "./auth/auth-modal"

export function UserMenu() {
  const { user, logout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  if (!user) {
    return (
      <>
        <Button
          onClick={() => setShowAuthModal(true)}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg"
        >
          Join Network
        </Button>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "business":
        return "bg-amber-100 text-amber-800"
      case "organization":
        return "bg-violet-100 text-violet-800"
      case "family":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-cyan-100 text-cyan-800"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-emerald-200">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          {user.verified && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              {user.verified && <div className="w-2 h-2 bg-emerald-500 rounded-full" />}
            </div>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <div className="flex items-center space-x-2">
              <Badge className={getTypeColor(user.type)} variant="secondary">
                {user.type}
              </Badge>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Star className="w-3 h-3 text-amber-400 fill-current" />
                <span>{user.rating}</span>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="px-2 py-2">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <Heart className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-semibold">{user.totalClaimed}</span>
              </div>
              <p className="text-xs text-muted-foreground">Claimed</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <Package className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold">{user.totalDonated}</span>
              </div>
              <p className="text-xs text-muted-foreground">Donated</p>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
