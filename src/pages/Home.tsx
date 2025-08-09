import Hero from "@/components/Hero";
import LazyFeaturedProjects from "@/components/LazyFeaturedProjects";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--deep-black)]">
      {/* Interactive Hero Section */}
      <Hero />
      
      {/* Featured Projects Section */}
      <LazyFeaturedProjects />
      
      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--deep-black)] via-[var(--ai-purple)]/10 to-[var(--deep-black)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white font-heading">
              About Hunter & Cortana
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed font-body">
              We are a cutting-edge AI solutions engineering team that bridges the gap between 
              human creativity and artificial intelligence. Our mission is to transform innovative 
              ideas into intelligent, scalable solutions that push the boundaries of what's possible 
              in the digital landscape.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
              <div className="card-feature p-6 bg-[var(--deep-black)]/80 border border-[var(--electric-blue)]/30 rounded-xl">
                <h3 className="text-xl font-bold text-[var(--electric-blue)] mb-3 font-heading">Innovation</h3>
                <p className="text-white/70 font-body">Pioneering new approaches to AI integration and human-computer interaction.</p>
              </div>
              <div className="card-feature p-6 bg-[var(--deep-black)]/80 border border-[var(--ai-purple)]/30 rounded-xl">
                <h3 className="text-xl font-bold text-[var(--ai-purple)] mb-3 font-heading">Intelligence</h3>
                <p className="text-white/70 font-body">Leveraging advanced AI algorithms to create smarter, more intuitive applications.</p>
              </div>
              <div className="card-feature p-6 bg-[var(--deep-black)]/80 border border-[var(--hunter-green)]/30 rounded-xl">
                <h3 className="text-xl font-bold text-[var(--hunter-green)] mb-3 font-heading">Excellence</h3>
                <p className="text-white/70 font-body">Delivering high-quality solutions with meticulous attention to detail and performance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* AI Demonstrations Preview Section */}
      <section id="demonstrations" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--electric-blue)]/10 via-[var(--deep-black)] to-[var(--hunter-green)]/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white font-heading">
              AI Playground
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed font-body">
              Experience the power of artificial intelligence through our interactive demonstrations. 
              From natural language processing to computer vision, explore the cutting-edge technologies 
              that power our solutions.
            </p>
            <div className="mt-12">
              <button className="btn-cta px-8 py-4 bg-gradient-to-r from-[var(--electric-blue)] to-[var(--ai-purple)] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300">
                Coming Soon - AI Demos
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}