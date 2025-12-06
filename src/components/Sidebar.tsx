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
          <div className="rounded-2xl overflow-hidden">
            <img
              src="/assets/images/profile.webp"
              alt="Ritvik Kapila"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Social Links - Vertical Layout */}
      <div className="flex flex-col gap-3 md:gap-4 max-w-xs md:max-w-sm mx-auto w-full">
        <div className="flex flex-col gap-3 md:gap-4 max-w-xs md:max-w-sm mx-auto w-full">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            if (!link.href) {
              return (
                <div
                  key={link.label}
                  className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"
                >
                  <Icon className="w-4 h-4 shrink-0" />
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
                className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
                title={link.label}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}