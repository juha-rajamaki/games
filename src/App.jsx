import './App.css'

const games = [
  {
    title: 'Platform Hopper',
    description: 'Jump across 50 platforms with precision timing. Charge your jump, land perfectly, and earn bonus lives. Progressive difficulty with bobbing platforms!',
    url: 'https://juha-rajamaki.github.io/jumpgame/',
    icon: '🦘',
    accent: '#0ea5e9',
    tags: ['Platformer', 'Skill', 'Mobile Friendly'],
  },
  {
    title: 'Space Survival Shooter',
    description: 'Battle through 10 levels of space combat. Manage ammo, missiles, and shields as you face increasingly dangerous enemies and a final boss encounter.',
    url: 'https://juha-rajamaki.github.io/SpaceSurvivalShooter/',
    icon: '🚀',
    accent: '#a855f7',
    tags: ['Shooter', 'Space', '10 Levels'],
  },
  {
    title: 'Space Invaders',
    description: 'The classic arcade experience reborn in the browser. Defend Earth from waves of descending alien invaders using arrow keys and spacebar.',
    url: 'https://juha-rajamaki.github.io/spaceinvaders/',
    icon: '👾',
    accent: '#10b981',
    tags: ['Arcade', 'Classic', 'Retro'],
  },
  {
    title: 'Naqu Fight',
    description: 'A pixel-art fighting game with 3D elements. Battle opponents in this retro-styled combat game rendered with both Canvas 2D and Three.js.',
    url: 'https://juha-rajamaki.github.io/naqufight/',
    icon: '⚔️',
    accent: '#f97316',
    tags: ['Fighting', 'Pixel Art', '3D'],
  },
]

function GameCard({ game }) {
  return (
    <a
      href={game.url}
      target="_blank"
      rel="noopener noreferrer"
      className="game-card"
      style={{ '--card-accent': game.accent }}
    >
      <div className="game-thumbnail-wrapper">
        <div className="game-thumbnail">
          <span className="game-icon">{game.icon}</span>
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
  return (
    <div className="app">
      <header className="header">
        <h1>NAQUGAMES</h1>
        <p>A collection of browser games — pick one and play!</p>
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
