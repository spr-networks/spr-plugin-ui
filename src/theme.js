export const READY_MESSAGE = { type: 'spr:ready' }

const normalize = (t) => ({
  colorMode: t && (t.colorMode === 'dark' ? 'dark' : 'light'),
  theme: (t && t.theme) || 'default',
  colors: (t && t.colors) || {}
})

export function readInitialTheme() {
  if (typeof window === 'undefined') {
    return { colorMode: 'light', theme: 'default', colors: {} }
  }

  if (window.SPR_THEME) {
    return normalize(window.SPR_THEME)
  }

  let colorMode = 'light'
  try {
    const q = new URLSearchParams(window.location.search).get('colorMode')
    if (q === 'light' || q === 'dark') {
      colorMode = q
    }
  } catch (err) {}

  return { colorMode, theme: 'default', colors: {} }
}

export function subscribeTheme(onTheme) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const handler = (event) => {
    if (event.source && event.source !== window.parent) {
      return
    }

    let data = event.data
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data)
      } catch (err) {
        return
      }
    }
    if (!data || typeof data !== 'object') {
      return
    }

    if (data.type === 'spr:theme' || data.colorMode || data.colors) {
      onTheme(normalize(data))
    }
  }

  window.addEventListener('message', handler, false)

  try {
    window.parent?.postMessage(JSON.stringify(READY_MESSAGE), '*')
  } catch (err) {}

  return () => window.removeEventListener('message', handler, false)
}
