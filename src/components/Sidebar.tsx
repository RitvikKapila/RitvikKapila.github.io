import { Link, useLocation } from "react-router-dom";
import {
  MapPin,
  Mail,
  Github,
  Twitter,
  Linkedin,
  GraduationCap,
} from "./Icons";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact" },
  ];

  const socialLinks = [
    { icon: MapPin, label: "San Francisco, CA", href: null },
    { icon: Mail, label: "Email", href: "mailto:ritvik.iitd@gmail.com" },
    { icon: Github, label: "GitHub", href: "https://github.com/RitvikKapila" },
    { icon: Twitter, label: "X", href: "https://x.com/RitvikKapila" },
    {
      icon: Linkedin,
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
    <aside className="fixed left-0 top-0 h-screen w-full md:w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto flex flex-col z-40 md:z-auto">
      {/* Header with name */}
      <div className="p-6 md:p-5 border-b border-sidebar-border sticky top-0 bg-sidebar">
        <Link to="/" className="block group">
          <h1 className="text-base md:text-lg font-bold text-sidebar-foreground group-hover:text-sidebar-primary transition-colors duration-200">
            Ritvik Kapila
          </h1>

          <a
            href="https://www.neosigma.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-sidebar-primary hover:text-sidebar-primary/80 font-medium mt-2 inline-flex items-center group/link"
          >
            Founder @{" "}
            <a
              href="https://www.neosigma.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              NeoSigma
            </a>
          </a>
        </Link>
      </div>

      {/* Profile Image */}
      <div className="px-5 py-6 md:py-8">
        <div className="w-full rounded-xl overflow-hidden bg-sidebar-accent shadow-sm aspect-square border border-sidebar-border/40">
          <img
            src="/assets/images/profile.webp"
            alt="Ritvik Kapila"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 border-b border-sidebar-border">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === item.href
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Social Links - Flex to bottom */}
      <div className="flex-1 px-5 py-6 flex flex-col">
        <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-widest mb-4">
          Connect
        </p>
        <div className="space-y-2">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            if (!link.href) {
              return (
                <div
                  key={link.label}
                  className="flex items-center gap-3 text-xs text-sidebar-foreground/70 px-3 py-2"
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{link.label}</span>
                </div>
              );
            }
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                className="flex items-center gap-3 text-xs text-sidebar-foreground hover:text-sidebar-primary transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-sidebar-accent/50 group"
              >
                <Icon className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span className="truncate">{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Theme toggle removed from here - now in fixed top right */}
      <div className="h-16 md:h-12" />
    </aside>
  );
}
