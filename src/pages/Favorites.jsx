import { Link } from 'react-router-dom'
import { assetPath } from '../utils/assetPath'

export default function Favorites(){
  return (
    <main id="main" className="container">
      <h1 className="section-title">Favorites</h1>
      <p className="page-sub">Soon you'll be able to save teams and players here.</p>

      <div className="grid">
        <article className="card">
          <div className="frame">
            <img src={assetPath('images/falconslogo.png')} alt="Atlanta Falcons crest" />
          </div>
          <div className="actions">
            <Link className="btn" to="/team/atlanta-falcons">Open preview</Link>
            <Link className="btn ghost" to="/team/atlanta-falcons/news">Team news</Link>
          </div>
          <h3>Atlanta Falcons</h3>
          <p>Pinned</p>
        </article>

        <article className="card">
          <div className="frame">
            <img src={assetPath('images/united.png')} alt="Manchester United crest" />
          </div>
          <div className="actions">
            <Link className="btn" to="/team/manchester-united">Open preview</Link>
            <Link className="btn ghost" to="/team/manchester-united/news">Team news</Link>
          </div>
          <h3>Manchester United</h3>
          <p>Pinned</p>
        </article>
      </div>
    </main>
  )
}
