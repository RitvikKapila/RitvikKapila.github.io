import { Link } from "react-router-dom"
import news from "../data/news"
import { ArrowLeft } from "../components/Icons"

export default function NewsPage() {
  return (
    <div className="animate-fade-in">
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to home
        </Link>

        {/* Header */}
        <header className="mb-16 md:mb-20 animate-slide-up">
          <p className="text-xs font-semibold text-foreground/60 uppercase tracking-widest mb-3">Timeline</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight mb-4">News</h1>
          <p className="text-lg text-foreground/70 font-light">Recent milestones, announcements, and career updates.</p>
        </header>

        {/* News List with improved styling */}
        <div className="space-y-px">
          {news.map((n, idx) => (
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
    </div>
  )
}
