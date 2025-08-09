import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Interactive Hero Section */}
      <Hero />
      
      {/* About Section for scroll testing */}
      <section id="about" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white">
              About Me
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              I'm a passionate full-stack developer with expertise in modern web technologies, 
              AI integration, and creating exceptional user experiences.
            </p>
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section id="projects" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white">
              My Projects
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Explore my latest work and creative solutions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}