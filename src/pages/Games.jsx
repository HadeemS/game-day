import { useEffect, useMemo, useState, useCallback } from 'react'
import { getGames, getGame, deleteGame, API_BASE_URL } from '../api/games'
import { assetPath } from '../utils/assetPath'
import GameForm from '../components/GameForm'
import '../styles/games.css'

const FALLBACK_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="%23f5f7fb"/><text x="50%" y="52%" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="%235b6472">Game photo unavailable</text></svg>'

function resolveImageUrl(path) {
  if (!path) return FALLBACK_IMAGE
  if (/^https?:\/\//i.test(path)) {
    return path
  }
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.games)) return payload.games
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

function normalizeGame(payload) {
  if (!payload) return null
  const game = payload.game || payload.data || payload
  // Support both imageUrl (new) and img/image (legacy) for backward compatibility
  const imageSource = game.imageUrl || game.img || game.image
  return {
    ...game,
    img: resolveImageUrl(imageSource),
    imageUrl: imageSource, // Keep both for compatibility
    title: game.title || game.matchup || 'Matchup',
    league: game.league || game.competition || 'League',
    date: game.date || game.gameday || 'TBD',
    time: game.time || game.start || '',
    city: game.city || game.location || 'Venue',
    venue: game.venue || game.stadium || 'Venue',
    summary: game.summary || game.description || '',
  }
}

export default function Games() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [modalState, setModalState] = useState('idle')
  const [activeGame, setActiveGame] = useState(null)
  const [modalError, setModalError] = useState('')
  const [editingGame, setEditingGame] = useState(null)
  const [deletingGameId, setDeletingGameId] = useState(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError('')

    getGames()
      .then((payload) => {
        if (!isMounted) return
        const normalized = normalizeList(payload).map(normalizeGame).filter(Boolean)
        setGames(normalized)
      })
      .catch((err) => {
        if (!isMounted) return
        setError(err?.message || 'Unable to load games. Please try again shortly.')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [reloadKey])

  const heroImage = useMemo(() => assetPath('images/tipoff.jpg'), [])

  const isModalOpen = modalState !== 'idle'

  const closeModal = useCallback(() => {
    setModalState('idle')
    setModalError('')
    setActiveGame(null)
  }, [])

  useEffect(() => {
    if (modalState === 'idle') return
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        closeModal()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [modalState, closeModal])

  const openGame = async (gameId) => {
    if (!gameId) return
    setModalState('loading')
    setModalError('')
    setActiveGame(null)
    try {
      const payload = await getGame(gameId)
      const detail = normalizeGame(payload)
      setActiveGame(detail)
      setModalState('ready')
    } catch (err) {
      setModalError(err?.message || 'Unable to load game details right now.')
      setModalState('error')
    }
  }

  const handleEdit = (game) => {
    setEditingGame(game)
    // Scroll to form
    setTimeout(() => {
      const formSection = document.querySelector('.game-form-section')
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const handleEditCancel = () => {
    setEditingGame(null)
  }

  const handleEditSuccess = () => {
    setEditingGame(null)
    setReloadKey((key) => key + 1)
  }

  const handleDelete = async (gameId, gameTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${gameTitle}"? This action cannot be undone.`)) {
      return
    }

    setDeletingGameId(gameId)
    try {
      await deleteGame(gameId)
      // Remove from local state immediately for better UX
      setGames((current) => current.filter((g) => (g._id || g.id) !== gameId))
      setReloadKey((key) => key + 1)
    } catch (err) {
      alert(`Failed to delete game: ${err.message || 'Unknown error'}`)
      setReloadKey((key) => key + 1) // Refresh to get accurate state
    } finally {
      setDeletingGameId(null)
    }
  }

  return (
    <main id="main" className="container games-page">
      <section className="hero" aria-label="API-powered games feed">
        <div className="copy">
          <p className="kicker">Live API demo</p>
          <h1>Games feed from Render</h1>
          <p className="page-sub">
            This page pulls its data from my Express server hosted on Render. Click any matchup to open the
            detailed modal powered by the same API response.
          </p>
          <div className="games-links" aria-label="Project links">
            <a
              className="btn"
              href="https://github.com/HadeemS/game-day-api/"
              target="_blank"
              rel="noopener noreferrer"
            >
              API code on GitHub
            </a>
            <a
              className="btn ghost"
              href="https://game-day-api.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              View live API
            </a>
          </div>
        </div>
        <div className="media frame">
          <img
            src={heroImage}
            alt="Fans cheering at a night game"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = FALLBACK_IMAGE
            }}
          />
        </div>
      </section>

      <GameForm
        game={editingGame}
        onSuccess={handleEditSuccess}
        onError={(err) => {
          console.error('Form error:', err)
        }}
        onCancel={handleEditCancel}
      />

      <section className="games-list">
        <div className={`games-status ${error ? 'error' : ''}`} aria-live="polite">
          {loading && <span>Loading games from the server…</span>}
          {!loading && error && (
            <>
              <span>{error}</span>
              <button className="btn ghost" type="button" onClick={() => setReloadKey((key) => key + 1)}>
                Retry
              </button>
            </>
          )}
          {!loading && !error && <span>Loaded {games.length} matchups from the API</span>}
        </div>

        {!loading && !error && games.length === 0 && (
          <p className="page-sub">No games returned yet — the API might be warming up, try again in a few seconds.</p>
        )}

        <div className="games-grid" aria-live="polite">
          {games.map((game) => {
            const gameId = game._id || game.id
            const isDeleting = deletingGameId === gameId
            return (
              <div key={gameId || game.title} className="game-card-wrapper">
                <button
                  type="button"
                  className="game-card"
                  onClick={() => openGame(gameId)}
                  disabled={isDeleting}
                >
                  <div className="game-card__media">
                    <img
                      src={game.img || FALLBACK_IMAGE}
                      alt={game.title}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = FALLBACK_IMAGE
                      }}
                    />
                  </div>
                  <div className="game-card__body">
                    <span className="game-card__league">
                      {game.league} • {game.city}
                    </span>
                    <h3>{game.title}</h3>
                    <p>
                      {game.date} {game.time && `@ ${game.time}`}
                    </p>
                    <p>{game.venue}</p>
                  </div>
                </button>
                <div className="game-card__actions">
                  <button
                    className="btn ghost btn-sm"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(game)
                    }}
                    disabled={isDeleting}
                    aria-label={`Edit ${game.title}`}
                  >
                    Edit
                  </button>
                  <button
                    className="btn ghost btn-sm btn-danger"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(gameId, game.title)
                    }}
                    disabled={isDeleting}
                    aria-label={`Delete ${game.title}`}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {isModalOpen && (
        <div
          className="game-modal__backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Game details"
          onClick={closeModal}
        >
          <div className="game-modal__panel" onClick={(event) => event.stopPropagation()}>
            {modalState === 'loading' && (
              <div className="game-modal__body">
                <p className="page-sub">Loading matchup details…</p>
              </div>
            )}

            {modalState === 'error' && (
              <div className="game-modal__body">
                <p className="page-sub">{modalError}</p>
                <div className="game-modal__actions">
                  <button className="btn" type="button" onClick={closeModal}>
                    Close
                  </button>
                  <button
                    className="btn ghost"
                    type="button"
                    onClick={() => {
                      closeModal()
                      setReloadKey((key) => key + 1)
                    }}
                  >
                    Refresh list
                  </button>
                </div>
              </div>
            )}

            {modalState === 'ready' && activeGame && (
              <>
                <div className="game-modal__media">
                  <img
                    src={activeGame.img || FALLBACK_IMAGE}
                    alt={activeGame.title}
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_IMAGE
                    }}
                  />
                </div>
                <div className="game-modal__body">
                  <p className="kicker">{activeGame.league}</p>
                  <h2 className="section-title" style={{ paddingLeft: 0 }}>
                    {activeGame.title}
                  </h2>
                  <p>
                    <strong>When:</strong> {activeGame.date} {activeGame.time && `@ ${activeGame.time}`}
                  </p>
                  <p>
                    <strong>Where:</strong> {activeGame.venue}, {activeGame.city}
                  </p>
                  {activeGame.summary && <p>{activeGame.summary}</p>}
                  <div className="game-modal__actions">
                    <button className="btn ghost game-modal__close" type="button" onClick={closeModal}>
                      Close
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
