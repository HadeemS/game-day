import { useState } from 'react'
import { assetPath } from '../utils/assetPath'

const SCHEDULES = {
  'atlanta-falcons': {
    name: 'Atlanta Falcons',
    compLabel: 'Week',
    rows: [
      { date:'Oct 05', opponent:'Atlanta Hawks', venue:'Home', comp:'Week 6',  time:'1:00 PM', tv:'Network A' },
      { date:'Oct 12', opponent:'Manchester United', venue:'Away', comp:'Week 7', time:'4:25 PM', tv:'Network B' },
      { date:'Oct 19', opponent:'Kings', venue:'Home', comp:'Week 8', time:'1:00 PM', tv:'Network C' },
      { date:'Oct 26', opponent:'United', venue:'Home', comp:'Week 9', time:'8:15 PM', tv:'Network D' },
      { date:'Nov 02', opponent:'Hawks', venue:'Away', comp:'Week 10', time:'1:00 PM', tv:'Network A' },
      { date:'Nov 09', opponent:'Riverdale', venue:'Home', comp:'Week 11', time:'4:05 PM', tv:'Network B' }
    ]
  },
  'manchester-united': {
    name: 'Manchester United',
    compLabel: 'Competition',
    rows: [
      { date:'Oct 06', opponent:'Kings', venue:'Home', comp:'League',    time:'7:30 PM', tv:'—' },
      { date:'Oct 13', opponent:'Atlanta Falcons', venue:'Away', comp:'Friendly', time:'3:00 PM', tv:'—' },
      { date:'Oct 20', opponent:'Riverdale', venue:'Home', comp:'League', time:'11:30 AM', tv:'—' },
      { date:'Oct 27', opponent:'Hawks', venue:'Away', comp:'Cup R4',     time:'2:45 PM', tv:'—' },
      { date:'Nov 03', opponent:'Falcons', venue:'Home', comp:'Friendly', time:'1:00 PM', tv:'—' },
      { date:'Nov 10', opponent:'United XI', venue:'Away', comp:'League', time:'9:00 AM', tv:'—' }
    ]
  },
  'atlanta-hawks': {
    name: 'Atlanta Hawks',
    compLabel: 'Game',
    rows: [
      { date:'Oct 04', opponent:'Riverdale', venue:'Home', comp:'#3', time:'7:00 PM', tv:'BSS' },
      { date:'Oct 11', opponent:'Atlanta Falcons', venue:'Away', comp:'#4', time:'7:30 PM', tv:'ESPN' },
      { date:'Oct 18', opponent:'Manchester United', venue:'Home', comp:'#5', time:'7:00 PM', tv:'NBA TV' },
      { date:'Oct 25', opponent:'Kings', venue:'Away', comp:'#6', time:'8:00 PM', tv:'TNT' },
      { date:'Nov 01', opponent:'Falcons', venue:'Home', comp:'#7', time:'7:30 PM', tv:'BSS' },
      { date:'Nov 08', opponent:'United', venue:'Away', comp:'#8', time:'7:00 PM', tv:'ESPN2' }
    ]
  }
}

const TEAMS = Object.values(SCHEDULES).map(t => t.name)
const SLUG_MAP = Object.fromEntries(Object.keys(SCHEDULES).map(slug => [SCHEDULES[slug].name.toLowerCase(), slug]))

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function Schedule(){
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    const query = searchQuery.toLowerCase()
    const slug = SLUG_MAP[query] || Object.keys(SCHEDULES).find(key => 
      SCHEDULES[key].name.toLowerCase().includes(query)
    )
    if (slug) {
      setSelectedTeam(slug)
    } else {
      setSelectedTeam('not-found')
    }
  }

  const handleChipClick = (teamName) => {
    const query = teamName.toLowerCase()
    const slug = SLUG_MAP[query] || Object.keys(SCHEDULES).find(key => 
      SCHEDULES[key].name.toLowerCase().includes(query)
    )
    if (slug) {
      setSelectedTeam(slug)
      setSearchQuery(teamName)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const renderSchedule = (slug) => {
    if (slug === 'not-found') {
      return <p className="msg">Try: {TEAMS.join(' • ')}</p>
    }

    const team = SCHEDULES[slug]
    if (!team) return null

    return (
      <table className="table" aria-label={`${team.name} schedule`}>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Opponent</th>
            <th scope="col">Venue</th>
            <th scope="col">{team.compLabel}</th>
            <th scope="col">Time</th>
            <th scope="col">Broadcast</th>
          </tr>
        </thead>
        <tbody>
          {team.rows.map((row, idx) => (
            <tr key={idx}>
              <td>{row.date}</td>
              <td>{row.opponent}</td>
              <td>{row.venue}</td>
              <td>{row.comp}</td>
              <td>{row.time}</td>
              <td>{row.tv || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <main id="main" className="container">
      <section className="hero" aria-label="Team schedule search">
        <div className="copy">
          <h1>Team Schedules</h1>
          <p className="page-sub">Type a team name or pick a chip to view its upcoming fixtures. Works on mobile & desktop.</p>

          <form onSubmit={handleSubmit} className="controls" role="search">
            <label className="sr-only" htmlFor="teamQuery">Team name</label>
            <input 
              id="teamQuery" 
              name="team" 
              type="search" 
              placeholder="Search teams (e.g., Atlanta Falcons)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              list="teamsDatalist"
              autoComplete="off"
            />
            <datalist id="teamsDatalist">
              {TEAMS.map(team => <option key={team} value={team} />)}
            </datalist>

            <button className="btn" type="submit">Show schedule</button>
            <button className="btn ghost" type="button" onClick={handlePrint} title="Print this schedule">
              Print
            </button>
          </form>

          <div className="chips" aria-label="Quick picks">
            {TEAMS.map(team => (
              <button 
                key={team} 
                className="chip" 
                onClick={() => handleChipClick(team)}
                type="button"
              >
                {team}
              </button>
            ))}
          </div>
        </div>

        <div className="media frame">
          <img 
            src={assetPath('images/tipoff.jpg')} 
            alt="Scoreboard with schedules" 
            loading="lazy"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><rect width="1200" height="600" fill="%23f5f6f7"/><text x="600" y="305" text-anchor="middle" font-family="sans-serif" font-size="40" fill="%23666">Team Schedules</text></svg>';
            }}
          />
        </div>
      </section>

      <section className="card" aria-live="polite">
        <h2 className="section-title">
          {selectedTeam && selectedTeam !== 'not-found' 
            ? `${SCHEDULES[selectedTeam].name} — Schedule`
            : 'Pick a team to view its schedule'}
        </h2>
        <div id="scheduleResults">
          {selectedTeam && renderSchedule(selectedTeam)}
        </div>
      </section>
    </main>
  )
}
