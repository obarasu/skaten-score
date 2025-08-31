export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">
            Skaten
          </h1>
          <p className="text-xl text-gray-300">
            Modern Web Application Platform
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all">
            <h2 className="text-2xl font-semibold text-white mb-3">Fast</h2>
            <p className="text-gray-300">
              Built with Next.js 15 and optimized for performance
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all">
            <h2 className="text-2xl font-semibold text-white mb-3">Scalable</h2>
            <p className="text-gray-300">
              Deployed on Vercel with automatic scaling and edge functions
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all">
            <h2 className="text-2xl font-semibold text-white mb-3">Modern</h2>
            <p className="text-gray-300">
              TypeScript, Tailwind CSS, and the latest web technologies
            </p>
          </div>
        </section>

        <div className="text-center mt-16">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </main>
  );
}
