import { Link } from 'react-router-dom'
import '../styles/cards.css'

export default function NewsCard({ news }) {
  return (
    <article className="card news-card">
      <div className="frame">
        <img src={news.image} alt={news.alt} />
      </div>
      <div className="actions">
        <Link className="btn" to={news.previewLink}>Open preview</Link>
        <Link className="btn ghost" to={news.newsLink}>Team news</Link>
      </div>
      <h3>{news.title}</h3>
      <p>{news.description}</p>
    </article>
  )
}
