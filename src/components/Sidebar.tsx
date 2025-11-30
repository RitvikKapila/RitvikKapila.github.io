import { MapPin, Mail, GraduationCap } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./Icons";
import { Link, NavLink } from "react-router-dom";

export default function Sidebar() {
  const socialLinks = [
    { icon: MapPin, label: "San Francisco, CA", href: null },
    { icon: Mail, label: "Email", href: "mailto:ritvik.iitd@gmail.com" },
    {
      icon: GithubIcon,
      label: "GitHub",
      href: "https://github.com/RitvikKapila",
    },
    { icon: TwitterIcon, label: "X", href: "https://x.com/RitvikKapila" },
    {
      icon: LinkedinIcon,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/ritvik-kapila/",
    },
    {
      icon: GraduationCap,
      label: "Scholar",
      href: "https://scholar.google.com/citations?user=vTYNQkwAAAAJ",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-full md:w-1/3 bg-white dark:bg-gray-950 overflow-y-auto flex flex-col z-40 md:z-auto pt-16 px-6 md:px-8">
      {/* Name and Title */}
      <div className="mb-8 flex justify-center gap-3">
        <Link
          to="/"
          className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white transition-opacity hover:opacity-70 block mb-2"
        >
          Ritvik Kapila
        </Link>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
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

      {/* Profile Image */}
      <div className="mb-8">
        <div className="w-full max-w-sm mx-auto">
          <div className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 shadow-xl ring-1 ring-gray-200 dark:ring-gray-800">
            <img
              src="/assets/images/profile.webp"
              alt="Ritvik Kapila"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Navigation Links - Vertical */}
      <nav className="mb-8">
        <div className="flex flex-col gap-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-all py-2 px-4 rounded-lg ${
                isActive
                  ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900"
                  : "text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/50"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/news"
            className={({ isActive }) =>
              `text-sm font-medium transition-all py-2 px-4 rounded-lg ${
                isActive
                  ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900"
                  : "text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/50"
              }`
            }
          >
            News
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `text-sm font-medium transition-all py-2 px-4 rounded-lg ${
                isActive
                  ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900"
                  : "text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/50"
              }`
            }
          >
            Contact
          </NavLink>
        </div>
      </nav>

      {/* Social Links - at bottom */}
      <div className="mt-auto py-8">
        <div className="flex flex-wrap justify-center gap-3">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            if (!link.href) {
              return (
                <div
                  key={link.label}
                  className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-900"
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{link.label}</span>
                </div>
              );
            }
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
                title={link.label}
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}