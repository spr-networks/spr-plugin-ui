const win = typeof window !== 'undefined' ? window : {}

export class API {
  baseURL = ''
  authHeaders = ''

  constructor(baseURL = '') {
    this.baseURL = baseURL
  }

  getAuthHeaders() {
    const token = process.env.REACT_APP_TOKEN || win.SPR_API_TOKEN
    if (token) {
      this.authHeaders = `Bearer ${token}`
      return this.authHeaders
    }

    try {
      const login = win.localStorage && win.localStorage.user
      const user = login ? JSON.parse(login) : null
      this.authHeaders = user?.authdata ? 'Basic ' + user.authdata : null
    } catch (err) {
      this.authHeaders = null
    }
    return this.authHeaders
  }

  getApiURL() {
    return process.env.REACT_APP_API || win.SPR_API_URL || ''
  }

  pluginURI() {
    return (win.SPR_PLUGIN && win.SPR_PLUGIN.URI) || null
  }

  async fetch(method = 'GET', url, body) {
    if (url === undefined) {
      url = method
      method = 'GET'
    }

    if (!this.authHeaders) {
      this.authHeaders = this.getAuthHeaders()
    }

    const headers = {
      Authorization: this.authHeaders,
      'X-Requested-With': 'react',
      'Content-Type': 'application/json'
    }

    const opts = { method, headers }
    if (body) {
      opts.body = JSON.stringify(body)
    }

    let baseURL = this.getApiURL() + (this.baseURL || '')
    if (url[0] === '/' && baseURL.length && baseURL[baseURL.length - 1] === '/') {
      url = url.substr(1)
    }

    return fetch(`${baseURL}${url}`, opts)
  }

  async request(method, url, body) {
    const skipReturnValue = method === 'DELETE'

    return this.fetch(method, url, body).then((response) => {
      if (response.redirected) {
        win.location = '/auth/validate'
      }

      if (!response.ok) {
        return Promise.reject({
          message: response.status,
          status: response.status,
          response
        })
      }

      const contentType = response.headers.get('Content-Type')
      if (!contentType || skipReturnValue) {
        return Promise.resolve(true)
      }

      if (contentType.includes('json') || contentType.includes('text/html')) {
        return response.json()
      }
      if (contentType.includes('text/plain')) {
        return response.text()
      }

      return Promise.reject({ message: 'unknown Content-Type' })
    })
  }

  get(url) {
    return this.request('GET', url)
  }

  put(url, data) {
    return this.request('PUT', url, data)
  }

  post(url, data) {
    return this.request('POST', url, data)
  }

  delete(url, data) {
    return this.request('DELETE', url, data)
  }
}

export default API
export const api = new API()
