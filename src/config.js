import { config as defaultConfig } from '@gluestack-ui/config'

const colors = defaultConfig.tokens.colors

export const config = {
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    colors: {
      ...defaultConfig.tokens.colors,

      primary0: '#ffffff',
      primary50: colors.blueGray50,
      primary100: colors.blueGray100,
      primary200: colors.blueGray200,
      primary300: colors.blueGray300,
      primary400: colors.blueGray400,
      primary500: colors.blueGray500,
      primary600: colors.blueGray600,
      primary700: colors.blueGray700,
      primary800: colors.blueGray800,
      primary900: colors.blueGray900,

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

      backgroundCardLight: colors.warmGray50,
      backgroundCardDark: colors.coolGray900,
      borderColorCardLight: colors.warmGray100,
      borderColorCardDark: colors.blueGray800,

      backgroundContentLight: colors.coolGray100,
      backgroundContentDark: colors.black
    }
  }
}

export default config
