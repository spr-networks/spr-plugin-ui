import React from 'react'
import {
  Badge,
  BadgeText,
  Box,
  Heading,
  HStack,
  Icon,
  Spinner,
  Text,
  VStack
} from '@gluestack-ui/themed'

const monogramFor = (title = '') => {
  const words = title
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!words.length) return 'sp'
  if (words.length === 1) return words[0].slice(0, 2).toLowerCase()
  return `${words[0][0]}${words[1][0]}`.toLowerCase()
}

export const Page = ({ children, ...props }) => (
  <Box
    px="$4"
    py="$6"
    bg="$backgroundContentLight"
    sx={{ _dark: { bg: '$backgroundContentDark' } }}
    style={{ minHeight: '100vh', width: '100%', boxSizing: 'border-box' }}
    {...props}
  >
    <VStack
      space="lg"
      w="$full"
      style={{ width: '100%', maxWidth: 1120, marginLeft: 'auto', marginRight: 'auto' }}
    >
      {children}
    </VStack>
  </Box>
)

export const ListHeader = ({
  title,
  description,
  mark,
  status,
  statusAction = 'muted',
  children,
  ...props
}) => (
  <HStack
    justifyContent="space-between"
    alignItems="center"
    flexWrap="wrap"
    gap="$4"
    py="$1"
    {...props}
  >
    <HStack space="md" alignItems="center" flex={1} minWidth={240}>
      <Box
        w={46}
        h={46}
        flexShrink={0}
        borderRadius="$xl"
        alignItems="center"
        justifyContent="center"
        bg="$primary700"
        sx={{
          '@base': {
            boxShadow: '0 7px 18px rgba(40, 49, 61, 0.16)'
          },
          _dark: { bg: '$primary500' }
        }}
      >
        <Heading size="sm" color="$white" letterSpacing="$sm">
          {mark || monogramFor(title)}
        </Heading>
      </Box>
      <VStack space="xs" flexShrink={1}>
        <Heading
          size="lg"
          color="$textLight900"
          sx={{ _dark: { color: '$textDark50' } }}
        >
          {title}
        </Heading>
        {description ? (
          <Text size="sm" color="$muted500" lineHeight="$sm">
            {description}
          </Text>
        ) : null}
      </VStack>
    </HStack>
    {status || children ? (
      <HStack space="sm" alignItems="center" flexWrap="wrap">
        {status ? (
          <Badge action={statusAction} variant="outline" borderRadius="$full" size="md">
            <BadgeText>{status}</BadgeText>
          </Badge>
        ) : null}
        {children}
      </HStack>
    ) : null}
  </HStack>
)

export const ListItem = ({ children, ...props }) => (
  <HStack
    bg="$backgroundCardLight"
    borderColor="$borderColorCardLight"
    borderBottomWidth={1}
    p="$4"
    space="md"
    alignItems="center"
    justifyContent="space-between"
    sx={{
      _dark: {
        bg: '$backgroundCardDark',
        borderColor: '$borderColorCardDark'
      }
    }}
    {...props}
  >
    {children}
  </HStack>
)

export const EmptyState = ({ icon, title, description, children }) => (
  <VStack space="md" alignItems="center" justifyContent="center" py="$10" px="$5">
    {icon ? (
      <Box
        w={52}
        h={52}
        borderRadius="$full"
        bg="$backgroundContentLight"
        alignItems="center"
        justifyContent="center"
        sx={{ _dark: { bg: '$backgroundContentDark' } }}
      >
        <Icon as={icon} color="$muted400" size={26} />
      </Box>
    ) : null}
    {title ? (
      <Heading size="sm" color="$textLight900" sx={{ _dark: { color: '$textDark50' } }}>
        {title}
      </Heading>
    ) : null}
    {description ? (
      <Text size="sm" color="$muted500" textAlign="center" maxWidth={420} lineHeight="$sm">
        {description}
      </Text>
    ) : null}
    {children}
  </VStack>
)

export const Loading = ({ text = 'Loading...' }) => (
  <HStack space="sm" alignItems="center" justifyContent="center" py="$12">
    <Spinner size="small" />
    <Text size="sm" color="$muted500">
      {text}
    </Text>
  </HStack>
)
