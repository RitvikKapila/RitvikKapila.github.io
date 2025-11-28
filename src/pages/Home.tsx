import { useState } from "react";
import Sidebar from "../components/Sidebar";
import news from "../data/news";

export default function Home() {
  const [showAll, setShowAll] = useState(false);

  return (
    // Two-column layout: fixed left sidebar (1/3) and scrollable right content (2/3)
    <div className="animate-fade-in">
      <div className="md:flex">
        {/* Left: fixed sidebar on medium+ screens */}
        <aside className="hidden md:block md:fixed md:top-16 md:bottom-0 md:w-1/3 md:overflow-auto">
          <div className="h-full p-6 flex justify-center items-center">
            <Sidebar />
          </div>
        </aside>

        {/* Right: main content - add left margin equal to sidebar width on md+ */}
        <main className="w-full md:ml-[33.3333%] md:w-2/3">
          <div className="max-w-[680px] mx-auto px-6 py-16 md:py-24">
            

            {/* Replaced News Section with About content (moved here per request) */}
            <section
              className="mb-12 animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-6">
                About Me
              </h2>

              <div className="space-y-4 text-foreground/90 leading-[1.8]">
                <p>
                  Most recently, data research @ <a href="https://www.essential.ai/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Essential AI</a> with <a href="https://www.linkedin.com/in/ashish-vaswani-99892181/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Ashish Vaswani</a>, where I built large-scale data pipelines and evaluations for pre-training large language models.
                </p>

                <p>
                  Before that, I was a software engineer on AWS's Cryptography team, working on client-side encryption libraries, where I built the <a href="https://crates.io/crates/aws-esdk" target="_blank" rel="noopener noreferrer" className="text-primary underline">AWS Encryption SDK in Rust</a>.
                </p>

                <p>
                  During my Master's at UC San Diego, I built foundation models for scarce domains like time-series data, and worked on privacy-preserving machine learning and cryptography, co-advised by <a href="https://www.linkedin.com/in/rajeshgupta4/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Prof. Rajesh Gupta</a>, <a href="https://shangjingbo1226.github.io/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Prof. Jingbo Shang</a>, and <a href="https://farinaz.eng.ucsd.edu/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Prof. Farinaz Koushanfar</a>.
                </p>

                <p>
                  Prior to that, I worked as a Quantitative Researcher at a high-frequency trading firm, building low latency trading systems and algorithmic trading strategies for futures and options.
                </p>

                <p>
                  I did my Bachelor's in Electrical Engineering from IIT Delhi, which also included an internship at Goldman Sachs. I spent one semester as an exchange student at INSA Lyon, France, splitting my time between research and backpacking across Europe.
                </p>

                <p>
                  Outside of work, you'll find me chasing waves while surfing, exploring new cities, or (almost :p) dunking on the basketball court.
                </p>
              </div>
            </section>
            {/* News Section (top 5, expandable) */}
            <section
              className="mb-12 animate-slide-up"
              style={{ animationDelay: "250ms" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  News
                </h2>
                <button
                  onClick={() => setShowAll((s) => !s)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showAll ? "Show less" : "Show more"}
                </button>
              </div>

              <div className="space-y-4">
                {(showAll ? news : news.slice(0, 5)).map((n, idx) => (
                  <div
                    key={idx}
                    className="flex gap-6 group hover:bg-muted/30 -mx-3 px-3 py-2 rounded-lg transition-colors duration-200"
                  >
                    <div className="w-24 shrink-0 text-sm text-muted-foreground font-mono">
                      {n.date}
                    </div>
                    <div
                      className="flex-1 text-foreground/90 leading-[1.7] news-content"
                      dangerouslySetInnerHTML={{ __html: n.content }}
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
