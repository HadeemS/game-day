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
            <a className="btn" href="/team/atlanta-falcons">Open preview</a>
            <a className="btn ghost" href="/team/atlanta-falcons/news">Team news</a>
          </div>
          <h3>Atlanta Falcons</h3>
          <p>Pinned</p>
        </article>

        <article className="card">
          <div className="frame">
            <img src={assetPath('images/united.png')} alt="Manchester United crest" />
          </div>
          <div className="actions">
            <a className="btn" href="/team/manchester-united">Open preview</a>
            <a className="btn ghost" href="/team/manchester-united/news">Team news</a>
          </div>
          <h3>Manchester United</h3>
          <p>Pinned</p>
        </article>
      </div>
    </main>
  )
}
