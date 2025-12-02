// API Base URL - points to the Render-hosted API
const RAW_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://game-day-api-1.onrender.com'
const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '')

// Log the API URL in development for debugging
if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', API_BASE_URL)
}

function buildUrl(path = '') {
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  return `${API_BASE_URL}${path}`
}

async function request(path, options = {}) {
  try {
    const url = buildUrl(path)
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const contentType = response.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    
    let body
    try {
      body = isJson ? await response.json() : await response.text()
    } catch (parseError) {
      console.error('Failed to parse response:', parseError)
      throw new Error(`Invalid response from server: ${response.status} ${response.statusText}`)
    }

    if (!response.ok) {
      // Log the error response for debugging
      console.error('API Error Response:', {
        status: response.status,
        body: body,
        url: url
      })
      
      const message = typeof body === 'string' 
        ? body 
        : body?.message || body?.error || `Request failed with status ${response.status}`
      
      const error = new Error(message)
      error.status = response.status
      error.body = body // Attach full response body
      error.response = { data: body, status: response.status } // For compatibility
      
      // Extract validation errors if present
      if (typeof body === 'object' && body !== null) {
        error.details = body.errors || body.error || null
      }
      
      throw error
    }

    return body
  } catch (error) {
    // Network errors or fetch failures
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to reach the API server. Please check your connection.')
    }
    throw error
  }
}

export function getGames() {
  return request('/api/games')
}

export function getGame(id) {
  if (!id) {
    return Promise.reject(new Error('Game id is required'))
  }
  return request(`/api/games/${id}`)
}

export function createGame(gameData) {
  return request('/api/games', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData),
  })
}

export function updateGame(id, gameData) {
  if (!id) {
    return Promise.reject(new Error('Game id is required'))
  }
  return request(`/api/games/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData),
  })
}

export function deleteGame(id) {
  if (!id) {
    return Promise.reject(new Error('Game id is required'))
  }
  return request(`/api/games/${id}`, {
    method: 'DELETE',
  })
}

export { API_BASE_URL }
