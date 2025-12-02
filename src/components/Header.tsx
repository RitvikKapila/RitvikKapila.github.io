import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md bg-white/95 dark:bg-gray-950/95 border-b border-gray-100 dark:border-gray-900">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/" className="text-lg md:text-xl font-semibold tracking-tight text-gray-900 dark:text-white transition-opacity hover:opacity-70">
            Ritvik Kapila
          </Link>
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-500">
            <span>|</span>
            <span className="hidden md:inline">Founder</span>
            <a
              href="https://www.neosigma.ai/"
              target="_blank"
              rel="noreferrer"
              className="text-gray-900 dark:text-white hover:opacity-70 transition-opacity font-medium"
            >
              @NeoSigma
            </a>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-10">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-all ${
                isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/news"
            className={({ isActive }) =>
              `text-sm font-medium transition-all ${
                isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            News
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `text-sm font-medium transition-all ${
                isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            Contact
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-900 dark:text-white" />
          ) : (
            <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
          )}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4 space-y-3 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900'
                  : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/50'
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/news"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900'
                  : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/50'
              }`
            }
          >
            News
          </NavLink>

          <NavLink
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900'
                  : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/50'
              }`
            }
          >
            Contact
          </NavLink>
        </div>
      </div>
    </header>
  )
}