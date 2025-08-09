import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import Portfolio from "@/pages/Portfolio";
import Bio from "@/pages/Bio";
import Contact from "@/pages/Contact";
import Navigation from "@/components/Navigation";
import "./css/hero.css";
import "./css/projects.css";
import "./css/navigation.css";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <main className="pt-16 lg:pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/bio" element={<Bio />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
