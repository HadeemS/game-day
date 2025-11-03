/**
 * Slideshow Component
 * 
 * Professional JavaScript feature: Interactive image slideshow with:
 * - Auto-advancing slides every 5 seconds
 * - Manual navigation buttons (previous/next)
 * - Clickable indicators to jump to any slide
 * - Smooth transitions and animations
 * - Keyboard accessible and ARIA compliant
 * 
 * This component demonstrates advanced React patterns including:
 * - useState for slide state management
 * - useEffect for auto-advance timer with cleanup
 * - Event handlers for user interactions
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/slideshow.css'

export default function Slideshow({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
  }

  return (
    <section className="slideshow" aria-label="Highlights slideshow">
      <div className="slideshow__container">
        <button 
          className="slideshow__button slideshow__button--prev" 
          onClick={goToPrevious}
          aria-label="Previous slide"
        >
          ‹
        </button>
        
        <div className="slideshow__slide-wrapper">
          {slides.map((slide, index) => (
            <article
              key={index}
              className={`slideshow__slide ${index === currentIndex ? 'slideshow__slide--active' : ''}`}
              aria-hidden={index !== currentIndex}
            >
              <div className="frame">
                <img src={slide.image} alt={slide.alt} />
              </div>
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
              {slide.link && (
                <div>
                  {slide.link.url.startsWith('http') ? (
                    <a 
                      className="btn" 
                      href={slide.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {slide.link.text}
                    </a>
                  ) : (
                    <Link className="btn" to={slide.link.url}>
                      {slide.link.text}
                    </Link>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>

        <button 
          className="slideshow__button slideshow__button--next" 
          onClick={goToNext}
          aria-label="Next slide"
        >
          ›
        </button>
      </div>

      <div className="slideshow__indicators" aria-label="Slide indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`slideshow__indicator ${index === currentIndex ? 'slideshow__indicator--active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex}
          />
        ))}
      </div>
    </section>
  )
}
