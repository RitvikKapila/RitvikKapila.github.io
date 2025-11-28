import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"
import Header from "./components/Header"
import Home from "./pages/Home"
import NewsPage from "./pages/News"
import ContactPage from "./pages/Contact"

function App() {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
        <BrowserRouter>
          <Header />
          <main className="flex-1">
            <Routes>
               <Route path="/" element={<Home />} />
              {/*<Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogPost />} /> */}
              <Route path="/news" element={<NewsPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </main>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  )
}

export default App
