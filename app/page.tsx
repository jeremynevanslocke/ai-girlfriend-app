import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-pink-500">💕 DreamCompanion</h1>
        <div className="flex gap-4">
          <Link href="/characters" className="text-gray-300 hover:text-white transition">
            Browse
          </Link>
          <Link href="/login" className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <h2 className="text-5xl font-bold mb-6 leading-tight">
          Your Perfect AI <span className="text-pink-500">Companion</span>
        </h2>
        <p className="text-gray-400 text-xl max-w-xl mb-10">
          Chat with beautiful AI characters. Build real connections. Always here for you, 24/7.
        </p>
        <Link href="/characters" className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition">
          Meet Your Companion →
        </Link>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-20 max-w-5xl mx-auto">
        <div className="bg-gray-900 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-xl font-bold mb-2">Real Conversations</h3>
          <p className="text-gray-400">Powered by the latest AI — every conversation feels natural and personal.</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-xl font-bold mb-2">AI Generated Images</h3>
          <p className="text-gray-400">Request images of your companion anytime. Every image uniquely made for you.</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-bold mb-2">Private & Safe</h3>
          <p className="text-gray-400">Your conversations are completely private. No judgment, no limits.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-600 py-10 border-t border-gray-800">
        <p>© 2026 DreamCompanion · <Link href="/privacy" className="hover:text-gray-400">Privacy</Link> · <Link href="/terms" className="hover:text-gray-400">Terms</Link></p>
      </footer>

    </main>
  )
}