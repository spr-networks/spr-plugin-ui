import React from 'react'
import {
  Badge,
  BadgeText,
  Box,
  HStack,
  Heading,
  Pressable,
  Text,
  VStack
} from '@gluestack-ui/themed'

const cardTones = {
  default: {
    bg: '$backgroundCardLight',
    border: '$borderColorCardLight',
    darkBg: '$backgroundCardDark',
    darkBorder: '$borderColorCardDark'
  },
  warning: {
    bg: '#fffbeb',
    border: '#fde68a',
    darkBg: '#271d0a',
    darkBorder: '#78350f'
  }
}

export const Card = ({ children, p = '$5', tone = 'default', sx, ...props }) => {
  const palette = cardTones[tone] || cardTones.default
  const { '@base': baseStyles, _dark: darkStyles, ...otherStyles } = sx || {}
  return (
    <Box
      bg={palette.bg}
      borderColor={palette.border}
      borderWidth={1}
      borderRadius="$2xl"
      p={p}
      sx={{
        '@base': {
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.045)',
          shadowColor: '$black',
          shadowOpacity: 0.04,
          shadowRadius: 16,
          ...baseStyles
        },
        _dark: {
          bg: palette.darkBg,
          borderColor: palette.darkBorder,
          ...darkStyles
        },
        ...otherStyles
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

export const StatusDot = ({ online, warn = false, size = 10 }) => {
  const core = online ? '$green500' : warn ? '$amber500' : '$muted400'
  const ring = online
    ? 'rgba(34,197,94,0.20)'
    : warn
    ? 'rgba(245,158,11,0.20)'
    : 'rgba(163,163,163,0.20)'
  return (
    <Box
      w={size + 8}
      h={size + 8}
      borderRadius="$full"
      alignItems="center"
      justifyContent="center"
      sx={{ '@base': { backgroundColor: ring } }}
    >
      <Box w={size} h={size} borderRadius="$full" bg={core} />
    </Box>
  )
}

export const StatTile = ({ label, value, mono = false }) => (
  <VStack
    space="xs"
    py="$3"
    px="$4"
    borderRadius="$xl"
    borderWidth={1}
    borderColor="$muted100"
    minWidth={148}
    minHeight={74}
    flexGrow={1}
    flexBasis={148}
    justifyContent="center"
    bg="$backgroundContentLight"
    sx={{
      _dark: {
        bg: '$backgroundContentDark',
        borderColor: '$borderColorCardDark'
      }
    }}
  >
    <Text
      size="2xs"
      color="$muted500"
      fontWeight="$medium"
      sx={{ '@base': { letterSpacing: 0.6, textTransform: 'uppercase' } }}
    >
      {label}
    </Text>
    <Text
      size="md"
      fontWeight="$semibold"
      color="$textLight900"
      sx={{
        _dark: { color: '$textDark50' },
        '@base': mono ? { fontFamily: 'monospace' } : {}
      }}
    >
      {value ?? '—'}
    </Text>
  </VStack>
)

export const SectionHeader = ({ title, count, right }) => (
  <HStack alignItems="center" justifyContent="space-between" mb="$4">
    <HStack alignItems="center" space="sm">
      <Heading
        size="md"
        color="$textLight900"
        sx={{ _dark: { color: '$textDark50' } }}
      >
        {title}
      </Heading>
      {count != null && (
        <Badge action="muted" variant="solid" borderRadius="$full">
          <BadgeText>{count}</BadgeText>
        </Badge>
      )}
    </HStack>
    {right}
  </HStack>
)

export const Toggle = ({ value, onPress, disabled = false, label }) => (
  <Pressable
    onPress={disabled ? undefined : onPress}
    opacity={disabled ? 0.5 : 1}
    accessibilityRole="switch"
    accessibilityLabel={label}
    accessibilityState={{ checked: !!value, disabled }}
    aria-label={label}
    aria-checked={!!value}
    aria-disabled={disabled}
  >
    <Box
      w={48}
      h={28}
      borderRadius="$full"
      p={4}
      justifyContent="center"
      bg={value ? '$primary600' : '$muted300'}
      sx={{
        '@base': { transition: 'background-color 160ms ease' },
        _dark: { bg: value ? '$primary500' : '$muted700' }
      }}
    >
      <Box
        w={20}
        h={20}
        borderRadius="$full"
        bg="$white"
        ml={value ? 20 : 0}
        sx={{
          '@base': {
            transition: 'margin-left 160ms ease',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.25)'
          }
        }}
      />
    </Box>
  </Pressable>
)

export const KeyVal = ({ label, value, mono = false }) => (
  <HStack space="md" alignItems="flex-start" flexWrap="wrap" py="$0.5">
    <Text size="sm" color="$muted500" minWidth={132}>
      {label}
    </Text>
    <Text
      size="sm"
      color="$textLight900"
      flexShrink={1}
      sx={{
        _dark: { color: '$textDark100' },
        '@base': mono ? { fontFamily: 'monospace' } : {}
      }}
    >
      {value ?? '—'}
    </Text>
  </HStack>
)
