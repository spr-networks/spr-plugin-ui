import React, { createContext, useContext, useMemo } from 'react'
import {
  Toast,
  ToastTitle,
  ToastDescription,
  VStack,
  useToast
} from '@gluestack-ui/themed'

const noop = () => {}
const AlertContext = createContext({
  alert: noop,
  info: noop,
  success: noop,
  warning: noop,
  error: noop
})

export const useAlert = () => useContext(AlertContext)

const asText = (v) => {
  if (v == null) return ''
  if (typeof v === 'string') return v
  if (v.message) return String(v.message)
  try {
    return JSON.stringify(v)
  } catch (err) {
    return String(v)
  }
}

export function AlertProvider({ children }) {
  const toast = useToast()

  const value = useMemo(() => {
    const show = (action) => (title, message) => {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action={action} variant="accent">
            <VStack space="xs">
              <ToastTitle>{asText(title)}</ToastTitle>
              {message != null ? (
                <ToastDescription>{asText(message)}</ToastDescription>
              ) : null}
            </VStack>
          </Toast>
        )
      })
    }
    const api = {
      info: show('info'),
      success: show('success'),
      warning: show('warning'),
      error: show('error')
    }
    api.alert = api.info
    return api
  }, [toast])

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
}
