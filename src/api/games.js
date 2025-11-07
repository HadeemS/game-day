const RAW_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://game-day-api.onrender.com'
const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '')

function buildUrl(path = '') {
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  return `${API_BASE_URL}${path}`
}

async function request(path, options = {}) {
  const response = await fetch(buildUrl(path), {
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const body = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const message = typeof body === 'string' ? body : body?.message
    throw new Error(message || `Request failed with status ${response.status}`)
  }

  return body
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

export { API_BASE_URL }
