import NewsCard from '../components/NewsCard'
import '../styles/pages.css'
import { newsItems } from '../data/newsItems'

export default function News(){
  return (
    <main id="main" className="container">
      <h1 className="section-title">Latest News</h1>
      <p className="page-sub">Hand-picked stories from around the league.</p>

      <div className="grid news-grid">
        {newsItems.map(news => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
    </main>
  )
}
