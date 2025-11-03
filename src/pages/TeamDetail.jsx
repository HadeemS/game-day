import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import teamsData from '../data/teams.json'
import { assetPath } from '../utils/assetPath'
import '../styles/pages.css'

function formatTeamName(slug) {
  return slug
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function TeamDetail() {
  const { slug } = useParams()

  const team = useMemo(() => {
    if (!slug) return null
    const normalized = slug.replace(/-/g, ' ').toLowerCase()
    return teamsData.items.find(
      (item) => item.name.toLowerCase() === normalized
    )
  }, [slug])

  if (!team) {
    return (
      <main id="main" className="container">
        <section className="card">
          <h1 className="section-title">Team Not Found</h1>
          <p className="page-sub">
            We couldn&apos;t find a team that matches &ldquo;{formatTeamName(slug || '')}&rdquo;.
          </p>
          <Link className="btn" to="/teams">Back to teams</Link>
        </section>
      </main>
    )
  }

  return (
    <main id="main" className="container">
      <section className="card">
        <div className="frame" style={{ maxWidth: 320, margin: '0 auto 2rem' }}>
          <img
            src={assetPath(team.img_name)}
            alt={`${team.name} crest`}
            style={{ maxHeight: 200, objectFit: 'contain' }}
          />
        </div>
        <h1 className="section-title">{team.name}</h1>
        <p className="page-sub">{team.city} • {team.league}</p>
        <ul className="stack-sm">
          <li><strong>Record:</strong> {team.record}</li>
          <li><strong>Current streak:</strong> {team.streak}</li>
          <li><strong>Sport:</strong> {team.sport}</li>
        </ul>
        <div className="actions" style={{ marginTop: '2rem' }}>
          <Link className="btn" to="/schedule">View schedule</Link>
          <Link className="btn ghost" to={`/team/${slug}/news`}>Latest news</Link>
        </div>
      </section>
    </main>
  )
}

