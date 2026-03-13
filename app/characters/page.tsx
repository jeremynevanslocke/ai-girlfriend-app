import Link from 'next/link'

const characters = [
  {
    id: '1',
    name: 'Luna',
    age: 24,
    location: 'Los Angeles',
    bio: '24 year old dreamy artist from LA. Romantic soul.',
    emoji: '🌙',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: '2',
    name: 'Aria',
    age: 22,
    location: 'Tokyo',
    bio: '22 y/o gamer girl from Tokyo. Love anime and EDM.',
    emoji: '🎮',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: '3',
    name: 'Sophia',
    age: 26,
    location: 'New York',
    bio: '26 year old CEO from New York. Passionate about life.',
    emoji: '👑',
    color: 'from-amber-500 to-orange-500'
  },
]

export default function CharactersPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">

        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h1 className="text-2xl font-black">
            <span className="text-black">Dream</span>
            <span className="text-pink-500">companion</span>
          </h1>
        </div>

        {/* Contacts Header */}
        <div className="px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Your contacts</h2>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {characters.map((char) => (
            <Link key={char.id} href={`/chat/${char.id}`}>
              <div className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition border-b border-gray-50">
                {/* Avatar */}
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${char.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {char.emoji}
                </div>
                {/* Info */}
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900">{char.name}</span>
                    <span className="text-blue-500 text-sm">✓</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-snug">{char.bio}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Area - No character selected */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">💕</div>
          <h3 className="text-xl font-semibold text-gray-700">Select a companion</h3>
          <p className="text-gray-400 mt-2">Choose someone from your contacts to start chatting</p>
        </div>
      </div>

    </div>
  )
}