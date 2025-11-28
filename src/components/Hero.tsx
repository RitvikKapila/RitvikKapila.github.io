import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"

export default function Hero() {
  return (
    <section id="home" className="py-12">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
        <div className="shrink-0">
          <Avatar className="size-32">
            <AvatarImage src="/assets/images/RitvikKapila.png" alt="Ritvik Kapila" />
            <AvatarFallback>RK</AvatarFallback>
          </Avatar>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Ritvik Kapila</h1>
          <p className="text-sm mt-1">Loading...</p>
          <p className="mt-4 max-w-xl">Loading...</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <a href="mailto:ritvik.iitd@gmail.com">
              <Button variant="secondary" size="sm">Email</Button>
            </a>
            <a href="https://scholar.google.com/citations?user=vTYNQkwAAAAJ" target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm">Scholar</Button>
            </a>
            <a href="https://www.linkedin.com/in/ritvik-kapila/" target="_blank" rel="noreferrer">
              <Button variant="ghost" size="sm">LinkedIn</Button>
            </a>
            <a href="https://github.com/RitvikKapila" target="_blank" rel="noreferrer">
              <Button variant="ghost" size="sm">GitHub</Button>
            </a>
            <a href="https://x.com/RitvikKapila" target="_blank" rel="noreferrer">
              <Button variant="ghost" size="sm">𝕏</Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
