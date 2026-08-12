import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react'
import Avatar from '../ui/Avatar'

const pageTitles = {
  "/dashboard":             "Dashboard",
  "/customers":             "Customers",
  "/customers/add":         "Add Customer",
  "/packages":              "Savings Packages",
  "/packages/create":       "Create Package",
  "/contributions":         "Contributions",
  "/contributions/record":  "Record Contribution",
  "/withdrawals":           "Withdrawals",
  "/agents":                "Agents",
  "/reports":               "Reports",
  "/settings":              "Settings",
  "/portal":                "My Savings",
  "/admin":                 "Tenant Management",
}

const Navbar = ({ role }) => {
  const location = useLocation()
  const navigate  = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)

  const pageTitle = pageTitles[location.pathname] || "Dashboard"

  const handleLogout = () => {
    setShowDropdown(false)
    // Clear auth state here later e.g. localStorage.removeItem('token')
    navigate('/login')
  }

  const handleSettings = () => {
    setShowDropdown(false)
    navigate('/settings')
  }

  // Customer navbar
  if (role === "customer") {
    return (
      <header className="bg-primary h-14 px-6 flex items-center justify-between flex-shrink-0">
        <p className="text-white font-medium text-base">Digital Ajo Platform</p>
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar name="Adaeze Okonkwo" size="sm" />
          <span className="text-white text-sm font-medium">Adaeze Okonkwo</span>
          <ChevronDown size={14} className="text-white/70" />
        </div>
      </header>
    )
  }

  // Admin navbar
  if (role === "admin") {
    return (
      <header className="bg-textprimary h-14 px-6 flex items-center justify-between flex-shrink-0">
        <p className="text-white font-medium text-base">Digital Ajo — Admin Panel</p>
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar name="Super Admin" size="sm" />
          <span className="text-white/80 text-sm">Super Admin</span>
        </div>
      </header>
    )
  }

  // Runner navbar
  return (
    <header className="bg-white border-b border-border h-14 px-6
                       flex items-center justify-between
                       flex-shrink-0 sticky top-0 z-10">

      {/* Page Title */}
      <p className="text-base font-medium text-textprimary">{pageTitle}</p>

      {/* Right side */}
      <div className="flex items-center gap-3">

        {/* Notification Bell */}
        <div className="relative">
          <button className="w-8 h-8 bg-pagebg rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Bell size={16} className="text-textsecondary" />
          </button>
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-danger rounded-full" />
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 hover:bg-pagebg px-2 py-1 rounded-lg transition-colors"
          >
            <Avatar name="Pec Concepts" size="sm" />
            <div className="hidden md:block text-left">
              <p className="text-xs font-medium text-textprimary leading-tight">Pec Concepts</p>
              <p className="text-xs text-textsecondary leading-tight">Ajo Runner</p>
            </div>
            <ChevronDown size={14} className="text-textsecondary" />
          </button>

          {showDropdown && (
            <>
              {/* Backdrop to close on outside click */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-border rounded-lg shadow-lg z-50 py-1">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-xs font-medium text-textprimary">Pec Concepts</p>
                  <p className="text-xs text-textsecondary">runner@pec.com</p>
                </div>
                <button
                  onClick={() => { setShowDropdown(false); navigate('/profile') }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-textprimary hover:bg-pagebg transition-colors"
                >
                  <User size={13} /> My Profile
                </button>
                <button
                  onClick={handleSettings}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-textprimary hover:bg-pagebg transition-colors"
                >
                  <Settings size={13} /> Settings
                </button>
                <div className="border-t border-border mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-danger hover:bg-danger-light transition-colors"
                  >
                    <LogOut size={13} /> Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar