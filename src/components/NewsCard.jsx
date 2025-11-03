import '../styles/cards.css'

export default function NewsCard({ news }) {
  return (
    <article className="card news-card">
      <div className="frame">
        <img src={news.image} alt={news.alt} />
      </div>
      <div className="actions">
        <a className="btn" href={news.previewLink}>Open preview</a>
        <a className="btn ghost" href={news.newsLink}>Team news</a>
      </div>
      <h3>{news.title}</h3>
      <p>{news.description}</p>
    </article>
  )
}
