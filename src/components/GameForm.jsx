import { useState } from 'react'
import { createGame } from '../api/games'
import '../styles/games.css'

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/
const IMG_REGEX = /^(https?:\/\/|\/)/i

const initialFormState = {
  title: '',
  league: '',
  date: '',
  time: '',
  venue: '',
  city: '',
  price: '',
  img: '',
  summary: '',
}

const validateGame = (values) => {
  const errors = {}

  const trimmedTitle = values.title.trim()
  if (!trimmedTitle) {
    errors.title = 'Matchup title is required.'
  } else if (trimmedTitle.length < 3) {
    errors.title = 'Title should be at least 3 characters.'
  } else if (trimmedTitle.length > 100) {
    errors.title = 'Title must be 100 characters or less.'
  }

  const trimmedLeague = values.league.trim()
  if (!trimmedLeague) {
    errors.league = 'League is required.'
  } else if (trimmedLeague.length < 2) {
    errors.league = 'League must be at least 2 characters.'
  } else if (trimmedLeague.length > 60) {
    errors.league = 'League must be 60 characters or less.'
  }

  if (!values.date) {
    errors.date = 'Date is required.'
  } else if (!DATE_REGEX.test(values.date)) {
    errors.date = 'Use YYYY-MM-DD format.'
  }

  if (!values.time) {
    errors.time = 'Kick/tip time is required.'
  } else if (!TIME_REGEX.test(values.time)) {
    errors.time = 'Use 24-hour HH:mm format.'
  }

  const trimmedVenue = values.venue.trim()
  if (!trimmedVenue) {
    errors.venue = 'Venue is required.'
  } else if (trimmedVenue.length < 3) {
    errors.venue = 'Venue must be at least 3 characters.'
  } else if (trimmedVenue.length > 120) {
    errors.venue = 'Venue must be 120 characters or less.'
  }

  const trimmedCity = values.city.trim()
  if (!trimmedCity) {
    errors.city = 'City is required.'
  } else if (trimmedCity.length < 3) {
    errors.city = 'City must be at least 3 characters.'
  } else if (trimmedCity.length > 120) {
    errors.city = 'City must be 120 characters or less.'
  }

  if (values.price === '') {
    errors.price = 'Price estimate is required.'
  } else if (Number.isNaN(Number(values.price))) {
    errors.price = 'Price must be a number.'
  } else {
    const priceNum = Number(values.price)
    if (!Number.isInteger(priceNum)) {
      errors.price = 'Price must be a whole number.'
    } else if (priceNum < 0) {
      errors.price = 'Price cannot be negative.'
    } else if (priceNum > 5000) {
      errors.price = 'Price must be $5000 or less.'
    }
  }

  const trimmedImg = values.img.trim()
  if (!trimmedImg) {
    errors.img = 'Image path or URL is required.'
  } else if (!IMG_REGEX.test(trimmedImg)) {
    errors.img = 'Image should start with http(s):// or /'
  }

  const trimmedSummary = values.summary.trim()
  if (!trimmedSummary) {
    errors.summary = 'Summary is required.'
  } else if (trimmedSummary.length < 10) {
    errors.summary = 'Summary should be at least 10 characters.'
  } else if (trimmedSummary.length > 280) {
    errors.summary = 'Keep the summary under 280 characters.'
  }

  return errors
}

const formFields = [
  { name: 'title', label: 'Matchup Title', placeholder: 'Lakers vs Celtics', type: 'text' },
  { name: 'league', label: 'League', placeholder: 'NBA, NFL, NCAA Football...', type: 'text' },
  { name: 'date', label: 'Date', type: 'date' },
  { name: 'time', label: 'Time', type: 'time' },
  { name: 'venue', label: 'Venue', placeholder: 'Crypto.com Arena', type: 'text' },
  { name: 'city', label: 'City', placeholder: 'Los Angeles, CA', type: 'text' },
  { name: 'price', label: 'Starting Price (USD)', placeholder: '120', type: 'number' },
  { name: 'img', label: 'Image URL or Path', placeholder: '/images/lakers-vs-celtics.png', type: 'url', span: 'full' },
  { name: 'summary', label: 'Summary', placeholder: 'What makes this matchup must-see TV?', type: 'textarea', span: 'full' },
]

export default function GameForm({ onSuccess, onError }) {
  const [formData, setFormData] = useState(initialFormState)
  const [formErrors, setFormErrors] = useState({})
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setFormErrors((current) => ({ ...current, [name]: undefined }))
    setStatus({ type: 'idle', message: '' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const errors = validateGame(formData)

    if (Object.keys(errors).length) {
      setFormErrors(errors)
      setStatus({ type: 'error', message: 'Please fix the highlighted fields.' })
      return
    }

    setSubmitting(true)

    try {
      const payload = { ...formData, price: Number(formData.price) }
      const responseData = await createGame(payload)

      setFormData(initialFormState)
      setFormErrors({})
      setStatus({ type: 'success', message: 'Game posted successfully!' })
      
      if (onSuccess) {
        onSuccess(responseData.game || responseData)
      }
    } catch (error) {
      const errorMessage = error.message || 'Unable to save game.'
      setStatus({
        type: 'error',
        message: errorMessage,
      })
      if (onError) {
        onError(error)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="card game-form-section">
      <div className="copy">
        <h2 className="section-title">Post a marquee matchup</h2>
        <p className="page-sub">
          Client-side validation mirrors the Joi rules on the server, so you know every entry will
          land perfectly on the schedule.
        </p>
      </div>

      <form className="game-form" onSubmit={handleSubmit} noValidate>
        <div className="game-form__grid">
          {formFields.map((field) => {
            const isTextarea = field.type === 'textarea'
            const error = formErrors[field.name]
            const inputProps = {
              name: field.name,
              id: field.name,
              value: formData[field.name],
              onChange: handleChange,
              placeholder: field.placeholder,
              'aria-invalid': Boolean(error),
              'aria-describedby': error ? `${field.name}-error` : undefined,
              className: error ? 'error' : '',
            }

            return (
              <label
                key={field.name}
                className={`game-form__field ${field.span === 'full' ? 'game-form__field--full' : ''} ${error ? 'game-form__field--error' : ''}`}
              >
                <span className="game-form__label">{field.label}</span>
                {isTextarea ? (
                  <textarea rows="3" {...inputProps}></textarea>
                ) : (
                  <input type={field.type} {...inputProps} />
                )}
                {error && (
                  <span className="game-form__error" id={`${field.name}-error`}>
                    {error}
                  </span>
                )}
              </label>
            )
          })}
        </div>

        <div className="game-form__footer">
          {status.message && (
            <p
              className={`game-form__status ${status.type === 'error' ? 'game-form__status--error' : 'game-form__status--success'}`}
              role="status"
            >
              {status.message}
            </p>
          )}
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Posting...' : 'Share this game'}
          </button>
        </div>
      </form>
    </section>
  )
}

