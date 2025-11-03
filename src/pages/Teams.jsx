import TeamCard from '../components/TeamCard'
import teamsData from '../data/teams.json'
import '../styles/pages.css'

export default function Teams(){
  const teams = teamsData.items.slice(0, 3) // Show first 3 teams as per original

  return (
    <main id="main" className="container">
      <h1 className="section-title">Teams</h1>
      <p className="page-sub">Browse squads and open a sample preview page.</p>

      <section className="grid" aria-label="Team list">
        {teams.map(team => (
          <TeamCard key={team._id} team={team} />
        ))}
      </section>
    </main>
  )
}
