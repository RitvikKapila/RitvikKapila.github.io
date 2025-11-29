import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import ThemeToggle from "./components/ThemeToggle";
import Home from "./pages/Home";
import NewsPage from "./pages/News";
import ContactPage from "./pages/Contact";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
          <div className="fixed top-0 right-0 z-50 p-6">
            <ThemeToggle />
          </div>

          <Sidebar />

          <main className="flex-1 ml-0 md:ml-(--sidebar-width)">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
