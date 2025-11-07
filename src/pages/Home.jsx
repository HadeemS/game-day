import { Link } from 'react-router-dom'
import Slideshow from '../components/Slideshow'
import '../styles/home.css'
import heroImage from '../images/sports.jpg';
import { assetPath } from '../utils/assetPath'

export default function Home(){
  const slides = [
    {
      image: assetPath('images/falcons.jpg'),
      alt: 'Falcons players celebrating a score',
      title: 'Falcons ride late surge',
      description: 'The Falcons closes strong in the fourth for their third straight win.',
      link: { url: '#/news', text: 'Read recap' }
    },
    {
      image: assetPath('images/united.jpg'),
      alt: 'United forward sprinting down the sideline',
      title: 'United edges Chelsea',
      description: 'Defense seals it in the final minute to take the series lead.',
      link: { url: '#/news', text: 'Read recap' }
    },
    {
      image: assetPath('images/hawks.jpg'),
      alt: 'Hawks huddle before kickoff',
      title: 'Hawks regroup on the road',
      description: 'New look lineup aims to reset momentum in a tough venue.',
      link: { url: '#/news', text: 'Read preview' }
    }
  ]

  return (
    <main id="main" className="container">
      <section className="hero" aria-label="Welcome">
        <div className="copy">
          <h1>All Your Game Day Info — In One Place</h1>
          <p className="page-sub">
            Track teams, schedules, and storylines with a clean, mobile-first design.
            Built with React and modern web technologies.
          </p>
        </div>
        <div className="media frame">
          <img
            src={heroImage}
            alt="Players running onto the field at sunset"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><rect width="1200" height="600" fill="%23f5f6f7"/><text x="600" y="310" text-anchor="middle" font-family="sans-serif" font-size="38" fill="%23666">Hero image placeholder</text></svg>';
            }}
          />
        </div>
      </section>

      <section className="project-links" aria-label="Project links">
        <h2 className="section-title">Project Information</h2>
        <div className="project-links__container">
          <a 
            href="https://hadeems.github.io/game-day/"
            className="btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Code
          </a>
          <a 
            href="https://hadeems.github.io/game-day/"
            className="btn ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            Live Site
          </a>
        </div>
      </section>

      <section className="highlights-section">
        <h2 className="section-title">Highlights</h2>
        <Slideshow slides={slides} />
      </section>
    </main>
  )
}
