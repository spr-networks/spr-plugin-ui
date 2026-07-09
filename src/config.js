import { config as defaultConfig } from '@gluestack-ui/config'

const systemSans =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
const systemMono =
  "'JetBrains Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', monospace"

export const config = {
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    colors: {
      ...defaultConfig.tokens.colors,

      primary0: '#ffffff',
      primary50: '#f2f6fb',
      primary100: '#e4ebf3',
      primary200: '#cbd6e4',
      primary300: '#a9b9cc',
      primary400: '#8499b1',
      primary500: '#687f99',
      primary600: '#52677f',
      primary700: '#435367',
      primary800: '#394654',
      primary900: '#28313d',

      muted50: '#fafafa',
      muted100: '#f5f5f5',
      muted200: '#e5e5e5',
      muted300: '#d4d4d4',
      muted400: '#a3a3a3',
      muted500: '#737373',
      muted600: '#525252',
      muted700: '#404040',
      muted800: '#262626',
      muted900: '#171717',

      backgroundCardLight: '#ffffff',
      backgroundCardDark: '#111827',
      borderColorCardLight: '#e4e8ee',
      borderColorCardDark: '#263244',

      backgroundContentLight: '#f4f6f8',
      backgroundContentDark: '#0b1220'
    },
    fonts: {
      ...defaultConfig.tokens.fonts,
      heading: systemSans,
      body: systemSans,
      mono: systemMono
    }
  }
}

export default config
