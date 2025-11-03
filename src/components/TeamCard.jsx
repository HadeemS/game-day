import { Link } from 'react-router-dom'
import '../styles/cards.css'

export default function TeamCard({ team }) {
  return (
    <article className="card">
      <div className="frame">
        <img src={`/${team.img_name}`} alt={`${team.name} crest`} />
      </div>
      <h3>{team.name}</h3>
      <p>Record: {team.record} • Streak: {team.streak}</p>
      <div className="actions">
        <Link className="btn" to={`/team/${team.name.toLowerCase().replace(/\s+/g, '-')}`}>
          Open preview
        </Link>
      </div>
    </article>
  )
}