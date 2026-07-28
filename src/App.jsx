import { useEffect, useState } from 'react'
import './App.css'
import CanvasBackground from './CanvasBackground'
import { incrementPlayCount } from './firebase'
import StatsPage from './StatsPage'

export const games = [
  {
    title: 'Space Survival Shooter',
    slug: 'space-survival-shooter',
    description: 'Battle through 10 levels of space combat. Manage ammo, missiles, and shields as you face increasingly dangerous enemies and a final boss encounter.',
    url: 'https://juha-rajamaki.github.io/SpaceSurvivalShooter/',
    icon: '🚀',
    accent: '#a855f7',
    gradient: 'linear-gradient(135deg, #7c3aed, #a855f7, #e879f9)',
    canvasType: 'starfield',
    tags: ['Shooter', 'Space', '10 Levels'],
  },
  {
    title: 'Space Invaders',
    slug: 'space-invaders',
    description: 'The classic arcade experience reborn in the browser. Defend Earth from waves of descending alien invaders using arrow keys and spacebar.',
    url: 'https://juha-rajamaki.github.io/spaceinvaders/',
    icon: '👾',
    accent: '#10b981',
    gradient: 'linear-gradient(135deg, #059669, #10b981, #6ee7b7)',
    canvasType: 'matrix',
    tags: ['Arcade', 'Classic', 'Retro'],
  },
  {
    title: 'Naqu Fight',
    slug: 'naqu-fight',
    description: 'A pixel-art fighting game with 3D elements. Battle opponents in this retro-styled combat game rendered with both Canvas 2D and Three.js.',
    url: 'https://juha-rajamaki.github.io/naqufight/',
    icon: '⚔️',
    accent: '#f97316',
    gradient: 'linear-gradient(135deg, #ea580c, #f97316, #fdba74)',
    canvasType: 'fire',
    tags: ['Fighting', 'Pixel Art', '3D'],
  },
  {
    title: 'Frankie\'s Jeep Game',
    slug: 'jeep-game',
    description: 'Take the wheel and drive Frankie\'s jeep through the terrain. A browser-based driving adventure with simple, fun vehicle controls.',
    url: 'https://juha-rajamaki.github.io/jeepgame/',
    icon: '🚙',
    accent: '#65a30d',
    gradient: 'linear-gradient(135deg, #4d7c0f, #65a30d, #a3e635)',
    canvasType: 'platforms',
    tags: ['Driving', 'Adventure', 'Casual'],
  },
  {
    title: 'Platform Hopper',
    slug: 'platform-hopper',
    description: 'Jump across 50 platforms with precision timing. Charge your jump, land perfectly, and earn bonus lives. Progressive difficulty with bobbing platforms!',
    url: 'https://juha-rajamaki.github.io/jumpgame/',
    icon: '🦘',
    accent: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8, #7dd3fc)',
    canvasType: 'platforms',
    tags: ['Platformer', 'Skill', 'Mobile Friendly'],
  },
  {
    title: 'SuperJerry',
    slug: 'superjerry',
    description: 'Help Jerry navigate through challenging levels in this fun browser-based platformer adventure.',
    url: 'https://juha-rajamaki.github.io/superjerry/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 32" width="48" height="55" style={{imageRendering:'pixelated'}}>
        {/* Overalls */}
        <rect x="4" y="14" width="20" height="18" fill="#2255cc"/>
        {/* Shirt */}
        <rect x="4" y="8" width="20" height="10" fill="#dd2222"/>
        {/* Skin */}
        <rect x="6" y="2" width="16" height="12" fill="#f4b06a"/>
        {/* Cap */}
        <rect x="4" y="0" width="20" height="6" fill="#dd2222"/>
        <rect x="2" y="4" width="4" height="4" fill="#dd2222"/>
        {/* Eyes */}
        <rect x="10" y="6" width="3" height="3" fill="#000"/>
        <rect x="16" y="6" width="3" height="3" fill="#000"/>
        {/* Mustache */}
        <rect x="8" y="11" width="12" height="3" fill="#5c2e00"/>
        {/* Buttons */}
        <rect x="12" y="18" width="4" height="3" fill="#ffdd00"/>
        {/* Shoes */}
        <rect x="2" y="28" width="10" height="4" fill="#4a2200"/>
        <rect x="16" y="28" width="10" height="4" fill="#4a2200"/>
        {/* Badge */}
        <rect x="5" y="17" width="4" height="4" fill="#ffaa00"/>
        <rect x="6" y="18" width="2" height="2" fill="#ff4400"/>
      </svg>
    ),
    accent: '#f59e0b',
    gradient: 'linear-gradient(135deg, #d97706, #f59e0b, #fcd34d)',
    canvasType: 'starfield',
    tags: ['Platformer', 'Adventure', 'Casual'],
  },
]

function GameCard({ game }) {
  return (
    <a
      href={game.url}
      target="_blank"
      rel="noopener noreferrer"
      className="game-card"
      style={{ '--card-accent': game.accent, '--card-gradient': game.gradient }}
      onClick={() => incrementPlayCount(game.slug)}
    >
      <div className="game-thumbnail-wrapper">
        <CanvasBackground type={game.canvasType} />
        <div className="game-thumbnail">
          <span className="game-icon" style={typeof game.icon !== 'string' ? {fontSize:'inherit',lineHeight:1} : {}}>{game.icon}</span>
        </div>
      </div>
      <div className="game-info">
        <h2>{game.title}</h2>
        <p>{game.description}</p>
        <div className="game-tags">
          {game.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <div className="play-button">
          ▶ Play Now
        </div>
      </div>
    </a>
  )
}

function App() {
  const [page, setPage] = useState('home')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const redirect = params.get('p')
    if (redirect) {
      const isSafePath = /^\/[^/]/.test(redirect) || redirect === '/'
      if (isSafePath) {
        window.history.replaceState(null, '', redirect)
      }
    }

    const path = window.location.pathname.replace(/\/+$/, '') || '/'
    if (path === '/stats') {
      setPage('stats')
    }
  }, [])

  if (page === 'stats') {
    return <StatsPage />
  }

  return (
    <div className="app">
      <header className="header">
        <h1>NAQUGAMES</h1>
        <p>A collection of browser games — pick one and play!</p>
        <a href="/stats/" className="stats-link">View Stats</a>
      </header>

      <main className="games-grid">
        {games.map((game) => (
          <GameCard key={game.title} game={game} />
        ))}
      </main>

      <footer className="footer">
        Built with fun in mind
      </footer>
    </div>
  )
}

export default App
