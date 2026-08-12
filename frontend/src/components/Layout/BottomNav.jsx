import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  DollarSign,
  ArrowLeftRight,
  BarChart3,
} from 'lucide-react'

const navItems = [
  { label: "Home", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Customers", icon: Users, path: "/customers" },
  { label: "Contribute", icon: DollarSign, path: "/contributions" },
  { label: "Withdrawals", icon: ArrowLeftRight, path: "/withdrawals" },
  { label: "Reports", icon: BarChart3, path: "/reports" },
]

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0
                    bg-primary border-t border-white/15
                    flex items-center justify-around
                    h-16 px-2 z-50 lg:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex flex-col items-center gap-1
            px-3 py-1 rounded-lg
            transition-colors duration-150
            ${isActive
              ? "text-white"
              : "text-white/50"
            }
          `}
        >
          <item.icon size={18} />
          <span className="text-xs">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav