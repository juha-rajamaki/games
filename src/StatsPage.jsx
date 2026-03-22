import { useState, useEffect } from 'react'
import { getPlayCounts } from './firebase'
import { games } from './App'

function StatsPage() {
  const [counts, setCounts] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPlayCounts()
      .then((data) => {
        setCounts(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load stats.')
        setLoading(false)
      })
  }, [])

  const ranked = games
    .map((g) => ({ ...g, plays: counts?.[g.slug] || 0 }))
    .sort((a, b) => b.plays - a.plays)

  const maxPlays = ranked[0]?.plays || 1

  return (
    <div className="app">
      <header className="header">
        <h1>NAQUGAMES</h1>
        <p>Game Stats</p>
        <a href="/" className="stats-link">← Back to Games</a>
      </header>

      <main className="stats-container">
        <h2 className="stats-title">Most Played Games</h2>
        {loading ? (
          <p className="stats-loading">Loading stats...</p>
        ) : error ? (
          <p className="stats-loading">{error}</p>
        ) : (
          ranked.map((game, i) => (
            <div key={game.slug} className="stats-row">
              <span className="stats-rank">#{i + 1}</span>
              <span className="stats-icon">{game.icon}</span>
              <div className="stats-info">
                <span className="stats-name">{game.title}</span>
                <div className="stats-bar-track">
                  <div
                    className="stats-bar"
                    style={{
                      width: `${maxPlays > 0 ? (game.plays / maxPlays) * 100 : 0}%`,
                      background: game.accent,
                    }}
                  />
                </div>
              </div>
              <span className="stats-count">{game.plays}</span>
            </div>
          ))
        )}
      </main>

      <footer className="footer">
        Built with fun in mind
      </footer>
    </div>
  )
}

export default StatsPage
