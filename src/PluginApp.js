import React, { useEffect, useMemo, useRef, useState } from 'react'
import { GluestackUIProvider } from '@gluestack-ui/themed'

import { config } from './config'
import { readInitialTheme, subscribeTheme } from './theme'
import { AlertProvider } from './alerts'

export function PluginApp({ children, onMessage }) {
  const [state, setState] = useState(() => ({ ...readInitialTheme(), rev: 0 }))
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage

  useEffect(() => {
    if (typeof document === 'undefined') return

    const mode = state.colorMode === 'dark' ? 'dark' : 'light'
    const root = document.documentElement
    const body = document.body

    root.classList.add('gs')
    root.classList.remove('gs-light', 'gs-dark')
    root.classList.add(`gs-${mode}`)
    root.style.colorScheme = mode
    root.dataset.colorMode = mode
    if (body) body.dataset.themeId = mode
  }, [state.colorMode])

  useEffect(() => {
    return subscribeTheme((next) => {
      setState((prev) => {
        const changed =
          JSON.stringify(prev.colors || {}) !== JSON.stringify(next.colors || {})
        return { ...next, rev: changed ? prev.rev + 1 : prev.rev }
      })
    })
  }, [])

  useEffect(() => {
    if (!onMessageRef.current) {
      return
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
      if (data && data.type === 'spr:theme') {
        return
      }
      onMessageRef.current(data, event)
    }
    window.addEventListener('message', handler, false)
    return () => window.removeEventListener('message', handler, false)
  }, [])

  const themedConfig = useMemo(() => {
    const colors = state.colors || {}
    if (!Object.keys(colors).length) {
      return config
    }
    return {
      ...config,
      tokens: {
        ...config.tokens,
        colors: { ...config.tokens.colors, ...colors }
      }
    }
  }, [state.colors])

  return (
    <GluestackUIProvider
      key={state.rev}
      config={themedConfig}
      colorMode={state.colorMode || 'light'}
    >
      <AlertProvider>{children}</AlertProvider>
    </GluestackUIProvider>
  )
}

export default PluginApp
