import React from 'react'
import {
  Box,
  Heading,
  HStack,
  Icon,
  Spinner,
  Text,
  VStack
} from '@gluestack-ui/themed'

export const Page = ({ children, ...props }) => (
  <Box
    p="$4"
    bg="$backgroundContentLight"
    sx={{ _dark: { bg: '$backgroundContentDark' } }}
    style={{ minHeight: '100vh' }}
    {...props}
  >
    <VStack space="md" w="$full" maxWidth={1024} mx="auto">
      {children}
    </VStack>
  </Box>
)

export const ListHeader = ({ title, description, children, ...props }) => (
  <HStack
    justifyContent="space-between"
    alignItems="center"
    flexWrap="wrap"
    gap="$2"
    {...props}
  >
    <VStack space="xs" flex={1} minWidth={200}>
      <Heading size="md">{title}</Heading>
      {description ? (
        <Text size="sm" color="$muted500">
          {description}
        </Text>
      ) : null}
    </VStack>
    {children}
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
  <VStack space="md" alignItems="center" py="$8">
    {icon ? <Icon as={icon} color="$muted400" size={32} /> : null}
    {title ? (
      <Text bold color="$muted600" sx={{ _dark: { color: '$muted400' } }}>
        {title}
      </Text>
    ) : null}
    {description ? (
      <Text size="sm" color="$muted500" textAlign="center">
        {description}
      </Text>
    ) : null}
    {children}
  </VStack>
)

export const Loading = ({ text = 'Loading...' }) => (
  <HStack space="sm" alignItems="center" justifyContent="center" py="$8">
    <Spinner size="small" />
    <Text size="sm" color="$muted500">
      {text}
    </Text>
  </HStack>
)
