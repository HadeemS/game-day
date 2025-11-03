const PUBLIC_URL = process.env.PUBLIC_URL || ''
const BASE_URL = PUBLIC_URL.endsWith('/') ? PUBLIC_URL.slice(0, -1) : PUBLIC_URL

/**
 * Returns a fully-qualified asset URL that respects the configured PUBLIC_URL
 * and works in both local development and GitHub Pages deployments.
 * @param {string} relativePath path relative to the public folder (e.g. 'images/logo.svg')
 */
export function assetPath(relativePath) {
  const cleanedPath = relativePath.replace(/^\/+/, '')
  return `${BASE_URL}/${cleanedPath}`
}

