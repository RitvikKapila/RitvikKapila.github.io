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
    <aside className="fixed left-0 top-0 h-screen w-full md:w-1/3 bg-white dark:bg-gray-950 overflow-y-auto flex flex-col z-40 md:z-auto pt-16 ">
      {/* Profile Image - takes most of the space */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-8">
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

      {/* Social Links - at bottom */}
      <div className="px-6 md:px-8 py-8 ">
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
