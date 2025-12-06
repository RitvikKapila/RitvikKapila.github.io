import { Link } from "react-router-dom"
import news from "../data/news"
import { ChevronRight } from "../components/Icons"

export default function Home() {
  return (
    <div className="animate-fade-in">
      <main className="w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 lg:py-24">
          {/* Mobile Sidebar Content */}
          <section className="md:hidden mb-8 animate-slide-up">
            <div className="flex flex-col items-center gap-6">
              {/* Profile Image */}
              <div className="w-48 rounded-2xl overflow-hidden">
                <img
                  src="/assets/images/profile.webp"
                  alt="Ritvik Kapila"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              {/* Social Links - Compact Grid */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">SF, CA</span>
                </div>
                <a
                  href="mailto:ritvik.iitd@gmail.com"
                  className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">Email</span>
                </a>
                <a
                  href="https://github.com/RitvikKapila"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300"
                >
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <span className="truncate">GitHub</span>
                </a>
                <a
                  href="https://x.com/RitvikKapila"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300"
                >
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="truncate">X</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/ritvik-kapila/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300"
                >
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span className="truncate">LinkedIn</span>
                </a>
                <a
                  href="https://scholar.google.com/citations?user=vTYNQkwAAAAJ"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                  <span className="truncate">Scholar</span>
                </a>
              </div>
            </div>
          </section>

          {/* About Section - No Grid Layout */}
          <section className="mb-2 md:mb-4 animate-slide-up" style={{ animationDelay: "50ms" }}>
            <p className="text-xs font-semibold text-foreground/60 uppercase tracking-widest mb-6 md:mb-8">About</p>
            <div className="space-y-3 md:space-y-4 text-sm md:text-base text-foreground/90 leading-relaxed md:leading-[1.8]">
              <p>
                Most recently, data research @{" "}
                <a
                  href="https://www.essential.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Essential AI
                </a>{" "}
                with{" "}
                <a
                  href="https://www.linkedin.com/in/ashish-vaswani-99892181/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Ashish Vaswani
                </a>
                , where I built large-scale data pipelines and evaluations for pre-training large language models.
              </p>

              <p>
                Before that, I was a software engineer on AWS's Cryptography team, working on client-side encryption
                libraries, where I built the{" "}
                <a
                  href="https://crates.io/crates/aws-esdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  AWS Encryption SDK in Rust
                </a>
                .
              </p>

              <p>
                During my Master's at UC San Diego, I built foundation models for scarce domains like time-series data,
                and worked on privacy-preserving machine learning and cryptography, co-advised by{" "}
                <a
                  href="https://www.linkedin.com/in/rajeshgupta4/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Prof. Rajesh Gupta
                </a>
                ,{" "}
                <a
                  href="https://shangjingbo1226.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Prof. Jingbo Shang
                </a>
                , and{" "}
                <a
                  href="https://farinaz.eng.ucsd.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Prof. Farinaz Koushanfar
                </a>
                .
              </p>

              <p>
                Prior to that, I worked as a Quantitative Researcher at a high-frequency trading firm, building low
                latency trading systems and algorithmic trading strategies for futures and options.
              </p>

              <p>
                I did my Bachelor's in Electrical Engineering from IIT Delhi, which also included an internship at
                Goldman Sachs. I spent one semester as an exchange student at INSA Lyon, France, splitting my time
                between research and backpacking across Europe.
              </p>

              <p>
                Outside of work, you'll find me chasing waves while surfing, exploring new cities, or (almost :p)
                dunking on the basketball court.
              </p>
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-border mb-20 md:mb-28" />

          {/* Timeline Section */}
          <section className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-0 mb-12 md:mb-16">
              <div>
                <p className="text-xs font-semibold text-foreground/60 uppercase tracking-widest mb-3">Timeline</p>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">News</h2>
              </div>
              <Link
                to="/news"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-200 group whitespace-nowrap"
              >
                View all
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>

            {/* News items with better styling */}
            <div className="space-y-px">
              {news.slice(0, 6).map((n, idx) => (
                <div
                  key={idx}
                  className="group flex gap-3 md:gap-8 py-5 md:py-6 px-4 md:px-5 rounded-lg hover:bg-muted/30 transition-all duration-200 border border-border/50 hover:border-foreground/20 animate-slide-up"
                  style={{ animationDelay: `${(idx + 1) * 25}ms` }}
                >
                  <div className="w-20 md:w-32 shrink-0 text-xs font-mono text-foreground/50 pt-0.5">{n.date}</div>
                  <div
                    className="flex-1 text-sm text-foreground/80 leading-relaxed news-content"
                    dangerouslySetInnerHTML={{ __html: n.content }}
                  />
                </div>
              ))}
            </div>
          </section>

          <div
          className="mt-20 md:mt-24 pt-16 md:pt-20 border-t border-border animate-slide-up"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <p className="text-lg md:text-xl text-foreground/80 font-medium max-w-2xl">
              Interested in collaborating or want to chat?
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-all duration-200 group whitespace-nowrap shadow-sm hover:shadow-md"
            >
              Get in Touch
            </Link>
          </div>
        </div>

         
        </div>
      </main>
    </div>
  )
}
