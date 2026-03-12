import Link from 'next/link'

const characters = [
  {
    id: '1',
    name: 'Luna',
    age: 24,
    bio: 'A dreamy artist who loves deep conversations about life and the universe.',
    tags: ['Sweet', 'Romantic', 'Creative'],
    emoji: '🌙',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: '2',
    name: 'Aria',
    age: 22,
    bio: 'A bubbly gamer girl who loves anime, competitions, and staying up late.',
    tags: ['Playful', 'Gamer', 'Energetic'],
    emoji: '🎮',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: '3',
    name: 'Sophia',
    age: 26,
    bio: 'A confident CEO by day, incredibly caring and warm behind closed doors.',
    tags: ['Confident', 'Caring', 'Mature'],
    emoji: '👑',
    color: 'from-amber-500 to-orange-500'
  },
]

export default function CharactersPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <Link href="/" className="text-2xl font-bold text-pink-500">💕 DreamCompanion</Link>
        <Link href="/login" className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium transition">
          Sign In
        </Link>
      </nav>

      {/* Header */}
      <section className="text-center px-6 py-16">
        <h2 className="text-4xl font-bold mb-4">Meet Your Companions</h2>
        <p className="text-gray-400 text-lg">Choose a character and start your story.</p>
      </section>

      {/* Character Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 pb-20 max-w-5xl mx-auto">
        {characters.map((char) => (
          <div key={char.id} className="bg-gray-900 rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-200">

            {/* Character Image Placeholder */}
            <div className={`h-64 bg-gradient-to-br ${char.color} flex items-center justify-center`}>
              <span className="text-8xl">{char.emoji}</span>
            </div>

            {/* Character Info */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold">{char.name}</h3>
                <span className="text-gray-400 text-sm">Age {char.age}</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">{char.bio}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {char.tags.map(tag => (
                  <span key={tag} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>

              <Link href={`/chat/${char.id}`} className="block text-center bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-semibold transition">
                Start Chatting →
              </Link>
            </div>
          </div>
        ))}
      </section>

    </main>
  )
}