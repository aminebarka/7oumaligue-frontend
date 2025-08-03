"use client"

import type React from "react"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useLanguage } from "../contexts/LanguageContext"
import { Menu, X, Users, Trophy, Calendar, BarChart3, Globe, Shield, UserCheck, User, MapPin, ShoppingBag } from "lucide-react"
import ThemeToggle from "./ThemeToggle"
import LogoWithText from "./LogoWithText"
import Logo3D from "./Logo3D"

const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const { language, setLanguage, isRTL, t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "ar" : "fr")
  }

  const navigation = [
    { name: t("nav.teams"), href: "/teams", icon: Users },
    { name: t("nav.players"), href: "/players", icon: UserCheck },
    { name: t("nav.tournaments"), href: "/tournaments", icon: Trophy },
    { name: language === 'fr' ? 'Groupes' : 'المجموعات', href: "/groups", icon: Users },
    { name: t("nav.matches"), href: "/matches", icon: Calendar },
    { name: language === 'fr' ? 'Stades' : 'الملاعب', href: "/stadiums", icon: MapPin },
    { name: t("nav.stats"), href: "/stats", icon: BarChart3 },
    { name: language === 'fr' ? 'Store' : 'المتجر', href: "/store", icon: ShoppingBag },
  ]

  // Add admin link if user is admin
  if (user?.role === "admin") {
    navigation.push({ name: t("nav.admin"), href: "/admin", icon: Shield })
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <header className={
      `bg-black/20 backdrop-blur-md sticky top-0 z-50 transition-all duration-300`
    }>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 px-2">
          {/* Logo - Position ajustée */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center min-w-0 ml-4">
              <Logo3D size="md" variant="header" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <nav className={`hidden md:flex ${isRTL ? "space-x-reverse space-x-6" : "space-x-6"} ml-4`}>
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"} px-3 py-2 rounded-lg transition-colors ${
                      location.pathname === item.href
                        ? "text-white bg-white/20 backdrop-blur-sm"
                        : "text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          )}

          {/* Right side */}
          <div className={`flex items-center space-x-4 ${isRTL ? "space-x-reverse" : ""}`}>
            {/* Theme Toggle - Toujours visible */}
            <ThemeToggle />

            {/* Language Toggle - Toujours visible */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-colors"
            >
              <Globe size={18} />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Profile Menu - Seulement si utilisateur connecté */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-colors"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="hidden lg:block">{user.name}</span>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-md rounded-lg shadow-lg border border-white/20 py-1 z-50">
                    <div className="px-4 py-2 border-b border-white/20">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-sm text-white/70">{user.email}</p>
                      <p className="text-xs text-white/50 capitalize">{user.role}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <User size={16} />
                      <span>{t("common.profile")}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <X size={16} />
                      <span>{t("common.logout")}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button - Seulement si utilisateur connecté */}
            {user && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation - Seulement si utilisateur connecté */}
        {user && isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-4 bg-black/20 backdrop-blur-md rounded-lg mt-2">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? "text-white bg-white/20"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
