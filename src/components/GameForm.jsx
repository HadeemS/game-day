import { useState, useEffect } from 'react'
import { createGame, updateGame } from '../api/games'
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
  imageUrl: '',
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

  const trimmedImageUrl = values.imageUrl.trim()
  if (!trimmedImageUrl) {
    errors.imageUrl = 'Image URL is required.'
  } else if (!IMG_REGEX.test(trimmedImageUrl)) {
    errors.imageUrl = 'Image URL should start with http(s):// or /'
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
  { name: 'imageUrl', label: 'Image URL', placeholder: 'https://example.com/image.jpg or /images/game.jpg', type: 'url', span: 'full' },
  { name: 'summary', label: 'Summary', placeholder: 'What makes this matchup must-see TV?', type: 'textarea', span: 'full' },
]

export default function GameForm({ game = null, onSuccess, onError, onCancel }) {
  const isEditMode = Boolean(game)
  const [formData, setFormData] = useState(initialFormState)
  const [formErrors, setFormErrors] = useState({})
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [submitting, setSubmitting] = useState(false)

  // Helper function to normalize date to YYYY-MM-DD format
  const normalizeDate = (dateStr) => {
    if (!dateStr) return ''
    // If already in YYYY-MM-DD format, return as is
    if (DATE_REGEX.test(dateStr)) return dateStr
    // Try to parse other date formats
    const date = new Date(dateStr)
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    return ''
  }

  // Helper function to normalize time to HH:mm (24-hour) format
  const normalizeTime = (timeStr) => {
    if (!timeStr) return ''
    // If already in HH:mm format (24-hour), return as is
    if (TIME_REGEX.test(timeStr)) return timeStr
    // Try to parse 12-hour format (e.g., "12:00 PM")
    const pmMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(PM|pm)/i)
    const amMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|am)/i)
    
    if (pmMatch) {
      let hours = parseInt(pmMatch[1], 10)
      if (hours !== 12) hours += 12
      const minutes = pmMatch[2]
      return `${String(hours).padStart(2, '0')}:${minutes}`
    }
    if (amMatch) {
      let hours = parseInt(amMatch[1], 10)
      if (hours === 12) hours = 0
      const minutes = amMatch[2]
      return `${String(hours).padStart(2, '0')}:${minutes}`
    }
    return ''
  }

  // Populate form when editing
  useEffect(() => {
    if (game) {
      // Normalize date and time formats for HTML inputs
      const normalizedDate = normalizeDate(game.date || '')
      const normalizedTime = normalizeTime(game.time || '')
      
      // Log in development to help debug
      if (process.env.NODE_ENV === 'development') {
        console.log('Loading game for edit:', {
          original: { date: game.date, time: game.time },
          normalized: { date: normalizedDate, time: normalizedTime }
        })
      }
      
      setFormData({
        title: (game.title || '').trim(),
        league: (game.league || '').trim(),
        date: normalizedDate,
        time: normalizedTime,
        venue: (game.venue || '').trim(),
        city: (game.city || '').trim(),
        price: game.price !== undefined && game.price !== null ? String(game.price) : '',
        imageUrl: (game.imageUrl || game.img || game.image || '').trim(),
        summary: (game.summary || '').trim(),
      })
      setFormErrors({})
      setStatus({ type: 'idle', message: '' })
    } else {
      setFormData(initialFormState)
      setFormErrors({})
      setStatus({ type: 'idle', message: '' })
    }
  }, [game])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setFormErrors((current) => ({ ...current, [name]: undefined }))
    setStatus({ type: 'idle', message: '' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    // Normalize date and time before creating payload
    const normalizedDate = normalizeDate(formData.date)
    const normalizedTime = normalizeTime(formData.time)
    
    // Prepare payload with proper data types and trimming
    const payload = {
      title: formData.title.trim(),
      league: formData.league.trim(),
      date: normalizedDate, // Normalized to YYYY-MM-DD
      time: normalizedTime, // Normalized to HH:mm (24-hour)
      venue: formData.venue.trim(),
      city: formData.city.trim(),
      price: Number(formData.price), // Convert to number
      imageUrl: formData.imageUrl.trim(),
      summary: formData.summary.trim(),
    }

    // Validate the payload
    const errors = validateGame(payload)
    
    // Additional validation: ensure date and time are not empty after normalization
    if (!payload.date) {
      errors.date = 'Date is required and must be in YYYY-MM-DD format.'
    }
    if (!payload.time) {
      errors.time = 'Time is required and must be in HH:mm format (24-hour).'
    }

    if (Object.keys(errors).length) {
      setFormErrors(errors)
      setStatus({ type: 'error', message: 'Please fix the highlighted fields.' })
      return
    }

    setSubmitting(true)

    try {
      // Log payload for debugging (always log to help diagnose)
      console.log('📤 Submitting payload:', JSON.stringify(payload, null, 2))
      console.log('📤 Payload types:', {
        title: typeof payload.title,
        league: typeof payload.league,
        date: typeof payload.date + ' = ' + payload.date,
        time: typeof payload.time + ' = ' + payload.time,
        venue: typeof payload.venue,
        city: typeof payload.city,
        price: typeof payload.price + ' = ' + payload.price,
        imageUrl: typeof payload.imageUrl,
        summary: typeof payload.summary,
      })

      const responseData = isEditMode
        ? await updateGame(game._id || game.id, payload)
        : await createGame(payload)
      
      console.log('✅ Success! Response:', responseData)

      if (!isEditMode) {
        setFormData(initialFormState)
        setFormErrors({})
      }
      setStatus({ 
        type: 'success', 
        message: isEditMode ? 'Game updated successfully!' : 'Game posted successfully!' 
      })
      
      if (onSuccess) {
        onSuccess(responseData.game || responseData)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      console.error('Error body:', error.body)
      console.error('Error response:', error.response)
      
      // Try to extract server-side validation errors
      let serverErrors = {}
      let errorMessage = error.message || (isEditMode ? 'Unable to update game.' : 'Unable to save game.')
      
      // Check multiple possible error response formats
      let validationErrors = []
      
      if (error.body) {
        // Check if body has errors array
        if (Array.isArray(error.body.errors)) {
          validationErrors = error.body.errors
        } else if (error.body.error && Array.isArray(error.body.error)) {
          validationErrors = error.body.error
        }
      }
      
      if (error.response?.data) {
        if (Array.isArray(error.response.data.errors)) {
          validationErrors = error.response.data.errors
        } else if (error.response.data.error && Array.isArray(error.response.data.error)) {
          validationErrors = error.response.data.error
        }
      }
      
      // Map server errors to form fields
      if (validationErrors.length > 0) {
        validationErrors.forEach((err) => {
          const fieldName = err.field || err.path || err.key
          const fieldMessage = err.message || err.msg
          if (fieldName && fieldMessage) {
            serverErrors[fieldName] = fieldMessage
          }
        })
        
        if (Object.keys(serverErrors).length > 0) {
          setFormErrors(serverErrors)
          errorMessage = 'Please fix the validation errors highlighted below.'
        }
      }
      
      // If we have validation errors, show them; otherwise show generic message
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

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <section className="card game-form-section">
      <div className="copy">
        <h2 className="section-title">{isEditMode ? 'Edit matchup' : 'Post a marquee matchup'}</h2>
        <p className="page-sub">
          {isEditMode 
            ? 'Update the game details below. Client-side validation mirrors the Joi rules on the server.'
            : 'Client-side validation mirrors the Joi rules on the server, so you know every entry will land perfectly on the schedule.'}
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
          <div className="game-form__actions">
            {isEditMode && (
              <button className="btn ghost" type="button" onClick={handleCancel} disabled={submitting}>
                Cancel
              </button>
            )}
            <button className="btn" type="submit" disabled={submitting}>
              {submitting 
                ? (isEditMode ? 'Updating...' : 'Posting...') 
                : (isEditMode ? 'Update game' : 'Share this game')}
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}

