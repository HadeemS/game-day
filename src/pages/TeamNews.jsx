import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTeamNews } from '../data/newsItems'
import teamsData from '../data/teams.json'
import '../styles/pages.css'

function formatTeamName(slug) {
  return slug
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function TeamNews() {
  const { slug } = useParams()

  const team = useMemo(() => {
    if (!slug) return null
    const normalized = slug.replace(/-/g, ' ').toLowerCase()
    return teamsData.items.find(
      (item) => item.name.toLowerCase() === normalized
    )
  }, [slug])

  const articles = useMemo(() => getTeamNews(slug ?? ''), [slug])

  if (!team) {
    return (
      <main id="main" className="container">
        <section className="card">
          <h1 className="section-title">Team News</h1>
          <p className="page-sub">
            We couldn&apos;t find any news for &ldquo;{formatTeamName(slug || '')}&rdquo; just yet.
          </p>
          <div className="actions">
            <Link className="btn" to="/teams">Back to teams</Link>
            <Link className="btn ghost" to="/news">All news</Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main id="main" className="container">
      <section className="card">
        <h1 className="section-title">{team.name} — News</h1>
        {articles.length === 0 ? (
          <>
            <p className="page-sub">No team-specific stories yet. Check back soon!</p>
            <Link className="btn ghost" to="/news">Return to all news</Link>
          </>
        ) : (
          <div className="stack-lg">
            <p className="page-sub">Latest headlines featuring the {team.name}.</p>
            <ul className="stack-lg">
              {articles.map(article => (
                <li key={article.id} className="card">
                  <h2 className="section-title" style={{ fontSize: '1.5rem' }}>{article.title}</h2>
                  <p>{article.description}</p>
                  <div className="actions">
                    <Link className="btn" to={article.previewLink}>Open preview</Link>
                    <Link className="btn ghost" to="/news">More news</Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  )
}

