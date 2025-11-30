import { Link } from "react-router-dom"
import news from "../data/news"
import { ChevronRight } from "../components/Icons"

export default function Home() {
  return (
    <div className="animate-fade-in">
      <main className="w-full">
        <div className="max-w-5xl mx-auto px-6 md:px-8 py-16 md:py-24">
         


          {/* About Section - No Grid Layout */}
          <section className="mb-2 md:mb-4 animate-slide-up" style={{ animationDelay: "50ms" }}>
            <p className="text-xs font-semibold text-foreground/60 uppercase tracking-widest mb-8">About</p>
            <div className="space-y-4 text-foreground/90 leading-[1.8]">
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
                  className="group flex gap-6 md:gap-8 py-5 md:py-6 px-4 md:px-5 rounded-lg hover:bg-muted/30 transition-all duration-200 border border-border/50 hover:border-foreground/20 animate-slide-up"
                  style={{ animationDelay: `${(idx + 1) * 25}ms` }}
                >
                  <div className="w-28 md:w-32 shrink-0 text-xs font-mono text-foreground/50 pt-0.5">{n.date}</div>
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
