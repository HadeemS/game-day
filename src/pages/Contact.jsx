/**
 * Contact Page with Working Contact Form
 * 
 * Features a functional contact form that:
 * - Sends emails via Web3Forms API (async, no redirect)
 * - Validates form fields before submission
 * - Shows inline success/error messages
 * - Includes a responsive map iframe
 * - Integrates seamlessly into the page (no external redirect)
 */
import { useState, useRef } from 'react'
import '../styles/contact.css'

const ENDPOINT = "https://api.web3forms.com/submit"
const ACCESS_KEY = "4b370dcc-6fd1-4c70-ad6c-98ba1e9a9835"

export default function Contact(){
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: '', message: '' })

    if (!formRef.current?.checkValidity()) {
      formRef.current?.reportValidity()
      setStatus({ type: 'error', message: 'Please fill out all required fields correctly.' })
      return
    }

    const formData = new FormData(formRef.current)
    formData.append("access_key", ACCESS_KEY)
    formData.append("from_name", "GameDay Contact Form")
    const name = formData.get("name") || "Visitor"
    formData.append("subject", `New message from ${name}`)

    try {
      setIsSubmitting(true)
      
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: formData
      })

      const result = await response.json().catch(() => ({}))

      if (response.ok && result.success) {
        setStatus({ type: 'success', message: '✅ Thanks! Your message has been sent successfully.' })
        formRef.current?.reset()
      } else {
        const msg = result?.message || result?.detail || `Error ${response.status}`
        setStatus({ type: 'error', message: `❌ Message failed to send: ${msg}` })
      }
    } catch (error) {
      console.error(error)
      setStatus({ type: 'error', message: '⚠️ Network error. Please try again in a moment.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setStatus({ type: '', message: '' })
  }

  return (
    <main id="main" className="container">
      <section className="hero" aria-label="Contact GameDay">
        <div className="copy">
          <h1>Contact GameDay</h1>
          <p className="page-sub">Questions, bug reports, or feature ideas? Send me a note.</p>
        </div>
        <div className="media frame">
          <img 
            src="/images/GetinTouch.jpg" 
            alt="Get in Touch"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><rect width="1200" height="600" fill="%23f5f6f7"/><text x="600" y="305" text-anchor="middle" font-family="sans-serif" font-size="40" fill="%23666">Contact</text></svg>';
            }}
          />
        </div>
      </section>

      <section className="contact-grid" aria-label="Contact and Map">
        <form ref={formRef} onSubmit={handleSubmit} className="card contact-card" noValidate>
          <h2 className="section-title">Send a Message</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" type="text" placeholder="Jane Doe" required />
              <small className="hint">Required</small>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="jane@example.com" required />
              <small className="hint">Must be a valid email</small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input id="subject" name="subject" type="text" placeholder="What's this about?" required />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="6" placeholder="Type your message…" required></textarea>
          </div>

          <div className="actions">
            <button className="btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send'}
            </button>
            <button className="btn ghost" type="reset" onClick={handleReset}>Reset</button>
            {status.message && (
              <div className={`status ${status.type}`} aria-live="polite">
                {status.message}
              </div>
            )}
          </div>

          <p className="credit" style={{marginTop: '10px'}}>
            <strong>Submission note:</strong> This Contact page uses async JS to send an email via Web3Forms (no redirect).
          </p>
        </form>

        <aside className="card contact-card">
          <h2 className="section-title">Find Us</h2>
          <div className="iframe-wrap">
            <iframe
              title="University of South Carolina — Map"
              src="https://www.google.com/maps?q=University%20of%20South%20Carolina&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen>
            </iframe>
          </div>
          <p className="desc">Map is responsive and stacks on small screens, sits side-by-side with the form on larger screens.</p>
        </aside>
      </section>
    </main>
  )
}