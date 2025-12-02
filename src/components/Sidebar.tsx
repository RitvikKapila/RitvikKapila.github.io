import { MapPin, Mail, GraduationCap } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./Icons";

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
    <aside className="hidden md:flex fixed left-0 top-16 md:top-20 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] w-full md:w-1/3 bg-white dark:bg-gray-950 overflow-hidden flex-col justify-center z-40 md:z-auto px-6 md:px-8">
      {/* Profile Image */}
      <div className="shrink-0 mb-4 md:mb-6">
        <div className="w-full max-w-xs md:max-w-sm mx-auto">
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

      {/* Social Links - Vertical Layout */}
      <div className="flex flex-col gap-2 md:gap-2.5 max-w-xs md:max-w-sm mx-auto w-full">
        <div className="flex flex-col gap-2 md:gap-2.5 max-w-xs md:max-w-sm mx-auto w-full">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            if (!link.href) {
              return (
                <div
                  key={link.label}
                  className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-400 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-900"
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
                className="flex items-center gap-2.5 text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200"
                title={link.label}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}