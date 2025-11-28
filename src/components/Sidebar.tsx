import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Github,
  Twitter,
  Linkedin,
  GraduationCap,
  News,
  Contact,
} from "./Icons";

export default function Sidebar() {
  const socialLinks = [
    { icon: MapPin, label: "San Francisco, CA", href: null },
    { icon: Mail, label: "Email", href: "mailto:ritvik.iitd@gmail.com" },
    { icon: Github, label: "GitHub", href: "https://github.com/RitvikKapila" },
    { icon: Twitter, label: "X (Twitter)", href: "https://x.com/RitvikKapila" },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/ritvik-kapila/",
    },
    {
      icon: GraduationCap,
      label: "Google Scholar",
      href: "https://scholar.google.com/citations?user=vTYNQkwAAAAJ",
    },
  ];

  return (
    <aside className="w-full md:w-72 shrink-0">
      <div className="flex flex-col gap-8">
        {/* Profile Image */}
        <div className="h-64 w-64 rounded-lg overflow-hidden bg-muted">
          <img
            src="/assets/images/profile.webp"
            alt="Ritvik Kapila"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* About Section */}
        <div>
          <h3 className="text-2xl font-semibold mb-2">Ritvik Kapila</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="block text-sm font-normal text-muted-foreground mt-0.5">
            Founder @
            <a
              href="https://www.neosigma.ai/"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              NeoSigma
            </a>{" "}
          </span>
          </p>
        </div>

        {/* Social Links */}
        <div className="space-y-3">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            if (!link.href) {
              return (
                <div
                  key={link.label}
                  className="flex items-center gap-3 text-sm"
                >
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{link.label}</span>
                </div>
              );
            }
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                className="flex items-center gap-3 text-sm hover:text-primary transition-colors group"
              >
                <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>

        {/* Navigation Links (visible on md+ where sidebar is shown) */}
        <div className="hidden md:flex md:flex-col gap-2">
          <Link
            to="/contact"
            className="flex items-center gap-2 text-sm hover:text-primary transition-colors font-medium"
          >
            <Contact className="w-4 h-4 text-muted-foreground" />
            <span>Contact</span>
          </Link>
          <Link
            to="/news"
            className="flex items-center gap-2 text-sm hover:text-primary transition-colors font-medium"
          >
            <News className="w-4 h-4 text-muted-foreground" />
            <span>News</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
