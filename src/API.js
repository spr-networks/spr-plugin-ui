const win = typeof window !== 'undefined' ? window : {}

export const PLUGIN_UI_AUTH_PROTOCOL_VERSION = 1

let authRefresh = null

const parseParentMessage = (event) => {
  if (!win.parent || event.source !== win.parent) {
    return null
  }
  let data = event.data
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (err) {
      return null
    }
  }
  return data && typeof data === 'object' ? data : null
}

const handleParentAuth = (event) => {
  const data = parseParentMessage(event)
  if (
    !data ||
    data.type !== 'spr:auth' ||
    data.protocolVersion !== PLUGIN_UI_AUTH_PROTOCOL_VERSION ||
    typeof data.token !== 'string' ||
    !data.token
  ) {
    return
  }

  win.SPR_API_TOKEN = data.token
  win.SPR_API_TOKEN_EXPIRES_AT = data.expiresAt
  if (authRefresh && data.requestId === authRefresh.requestId) {
    authRefresh.resolve(true)
  }
}

if (typeof win.addEventListener === 'function') {
  win.addEventListener('message', handleParentAuth, false)
}

const rekeyRequestID = () => {
  if (typeof win.crypto?.randomUUID === 'function') {
    return win.crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const requestPluginUIRekey = () => {
  if (
    win.SPR_PLUGIN_UI_AUTH_VERSION !== PLUGIN_UI_AUTH_PROTOCOL_VERSION ||
    !win.parent ||
    win.parent === win ||
    typeof win.parent.postMessage !== 'function'
  ) {
    return Promise.resolve(false)
  }
  if (authRefresh) {
    return authRefresh.promise
  }

  const requestId = rekeyRequestID()
  let resolveRefresh
  const promise = new Promise((resolve) => {
    resolveRefresh = resolve
  })
  const timeout = setTimeout(() => resolveRefresh(false), 10000)
  authRefresh = {
    requestId,
    promise,
    resolve: (refreshed) => {
      clearTimeout(timeout)
      resolveRefresh(refreshed)
    }
  }
  promise.finally(() => {
    authRefresh = null
  })

  try {
    win.parent.postMessage(
      JSON.stringify({
        type: 'spr:auth-required',
        protocolVersion: PLUGIN_UI_AUTH_PROTOCOL_VERSION,
        requestId
      }),
      '*'
    )
  } catch (err) {
    authRefresh.resolve(false)
  }
  return promise
}

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

  async fetch(method = 'GET', url, body, allowRekey = true) {
    if (url === undefined) {
      url = method
      method = 'GET'
    }

    this.authHeaders = this.getAuthHeaders()

    const headers = {
      'X-Requested-With': 'react',
      'Content-Type': 'application/json'
    }

    if (this.authHeaders) {
      headers.Authorization = this.authHeaders
    }

    const opts = { method, headers }
    if (body) {
      opts.body = JSON.stringify(body)
    }

    let baseURL = this.getApiURL() + (this.baseURL || '')
    if (url[0] === '/' && baseURL.length && baseURL[baseURL.length - 1] === '/') {
      url = url.substr(1)
    }

    const response = await fetch(`${baseURL}${url}`, opts)
    if (
      allowRekey &&
      response.status === 401 &&
      response.headers.get('X-SPR-Auth-Error') === 'invalid_token' &&
      (await requestPluginUIRekey())
    ) {
      this.authHeaders = ''
      return this.fetch(method, url, body, false)
    }
    return response
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
