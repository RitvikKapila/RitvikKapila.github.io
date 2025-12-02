import { Link, NavLink } from 'react-router-dom'

export default function Header() {

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md bg-white/95 dark:bg-gray-950/95 border-b border-gray-100 dark:border-gray-900">
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white transition-opacity hover:opacity-70">
            Ritvik Kapila
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
            <span>|</span>
            <span>Founder</span>
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

        {/* Navigation Links */}
        <div className="flex items-center gap-10">
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
      </nav>
    </header>
  )
}