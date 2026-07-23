import React, { useEffect, useMemo, useState } from 'react'
import {
  Badge,
  BadgeText,
  Box,
  Button,
  ButtonText,
  CheckIcon,
  CloseIcon,
  FormControl,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  HStack,
  Icon,
  Input,
  InputField,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  VStack
} from '@gluestack-ui/themed'

import { api } from '../API'

const identityFor = (device, fallback = '') =>
  device?.MAC || device?.WGPubKey || fallback

const addressFor = (device) =>
  String(device?.RecentIP || '').trim().replace(/\/.*$/, '')

const normalizeDevices = (devices) => {
  if (Array.isArray(devices)) {
    return devices
      .map((device) => [identityFor(device), device])
      .filter(([identity]) => identity)
  }
  return Object.entries(devices || {})
    .map(([key, device]) => [identityFor(device, key), device])
    .filter(([identity]) => identity)
}

const deviceLabel = (device, identity) =>
  device?.Name || addressFor(device) || identity

export const ClientSelect = ({
  value = [],
  onChange,
  devices,
  exclude = [],
  label = 'Devices',
  helperText,
  placeholder = 'Select devices',
  isDisabled = false,
  emptyText = 'No active devices found'
}) => {
  const [loadedDevices, setLoadedDevices] = useState(devices || {})
  const [isLoading, setIsLoading] = useState(devices == null)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState([])

  useEffect(() => {
    if (devices != null) {
      setLoadedDevices(devices)
      setIsLoading(false)
      return
    }

    let active = true
    setIsLoading(true)
    api
      .get('/devices')
      .then((next) => {
        if (active) setLoadedDevices(next || {})
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [devices])

  const excluded = useMemo(
    () => new Set((exclude || []).filter(Boolean)),
    [exclude]
  )

  const entries = useMemo(
    () =>
      normalizeDevices(loadedDevices)
        .filter(
          ([identity, device]) =>
            !excluded.has(identity) && addressFor(device)
        )
        .sort((left, right) =>
          deviceLabel(left[1], left[0]).localeCompare(
            deviceLabel(right[1], right[0])
          )
        ),
    [loadedDevices, excluded]
  )

  const byIdentity = useMemo(
    () => new Map(normalizeDevices(loadedDevices)),
    [loadedDevices]
  )

  const filteredEntries = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return entries
    return entries.filter(([identity, device]) =>
      [deviceLabel(device, identity), addressFor(device), identity].some(
        (part) => String(part || '').toLowerCase().includes(needle)
      )
    )
  }, [entries, query])

  const selected = Array.isArray(value) ? value : []
  const open = () => {
    if (isDisabled) return
    setDraft(selected)
    setQuery('')
    setIsOpen(true)
  }
  const close = () => setIsOpen(false)
  const toggleDraft = (identity) => {
    setDraft((current) =>
      current.includes(identity)
        ? current.filter((item) => item !== identity)
        : [...current, identity]
    )
  }
  const remove = (identity) => {
    onChange?.(selected.filter((item) => item !== identity))
  }
  const apply = () => {
    onChange?.(draft)
    close()
  }

  return (
    <FormControl isDisabled={isDisabled}>
      {label ? (
        <FormControlLabel mb="$1.5">
          <FormControlLabelText
            fontWeight="$semibold"
            color="$textLight800"
            sx={{ _dark: { color: '$textDark100' } }}
          >
            {label}
          </FormControlLabelText>
        </FormControlLabel>
      ) : null}

      <Pressable
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={placeholder}
        aria-disabled={isDisabled}
        opacity={isDisabled ? 0.5 : 1}
      >
        <HStack
          minHeight={48}
          px="$3.5"
          py="$2.5"
          borderWidth={1}
          borderRadius="$xl"
          borderColor="$muted300"
          bg="$backgroundCardLight"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            _dark: {
              bg: '$backgroundCardDark',
              borderColor: '$muted700'
            },
            ':hover': { borderColor: '$primary500' }
          }}
        >
          <Text
            size="sm"
            color={selected.length ? '$textLight900' : '$muted500'}
            sx={{ _dark: selected.length ? { color: '$textDark50' } : {} }}
          >
            {isLoading
              ? 'Loading devices…'
              : selected.length
                ? `${selected.length} device${selected.length === 1 ? '' : 's'} selected`
                : placeholder}
          </Text>
          {isLoading ? (
            <Spinner size="small" />
          ) : (
            <Text size="xs" color="$primary600" fontWeight="$semibold">
              Choose
            </Text>
          )}
        </HStack>
      </Pressable>

      {selected.length ? (
        <HStack space="sm" flexWrap="wrap" mt="$2">
          {selected.map((identity) => {
            const device = byIdentity.get(identity)
            return (
              <Badge
                key={identity}
                action="muted"
                variant="outline"
                size="sm"
                borderRadius="$full"
              >
                <BadgeText>{deviceLabel(device, identity)}</BadgeText>
                <Pressable
                  ml="$1"
                  onPress={() => remove(identity)}
                  accessibilityLabel={`Remove ${deviceLabel(device, identity)}`}
                >
                  <Icon as={CloseIcon} size="xs" color="$muted500" />
                </Pressable>
              </Badge>
            )
          })}
        </HStack>
      ) : null}

      {helperText ? (
        <FormControlHelper mt="$1.5">
          <FormControlHelperText>{helperText}</FormControlHelperText>
        </FormControlHelper>
      ) : null}

      <Modal isOpen={isOpen} onClose={close} size="lg">
        <ModalBackdrop />
        <ModalContent
          borderRadius="$2xl"
          borderColor="$borderColorCardLight"
          sx={{ _dark: { borderColor: '$borderColorCardDark' } }}
        >
          <ModalHeader>
            <VStack space="xs">
              <Heading size="md">Select devices</Heading>
              <Text size="sm" color="$muted500">
                Choose one or more network devices.
              </Text>
            </VStack>
            <ModalCloseButton>
              <CloseIcon />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <Input
                borderRadius="$xl"
                borderColor="$muted300"
                bg="$backgroundCardLight"
                sx={{
                  _dark: {
                    bg: '$backgroundCardDark',
                    borderColor: '$muted700'
                  }
                }}
              >
                <InputField
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search devices"
                  autoCapitalize="none"
                />
              </Input>

              <ScrollView maxHeight={420}>
                <VStack space="xs">
                  {filteredEntries.length ? (
                    filteredEntries.map(([identity, device]) => {
                      const checked = draft.includes(identity)
                      const labelText = deviceLabel(device, identity)
                      const initial = labelText.slice(0, 1).toUpperCase()
                      return (
                        <Pressable
                          key={identity}
                          onPress={() => toggleDraft(identity)}
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked }}
                        >
                          <HStack
                            minHeight={58}
                            px="$3"
                            py="$2.5"
                            borderWidth={1}
                            borderRadius="$xl"
                            borderColor={checked ? '$primary400' : '$muted200'}
                            bg={checked ? '$primary50' : '$backgroundCardLight'}
                            alignItems="center"
                            space="md"
                            sx={{
                              _dark: {
                                bg: checked
                                  ? '$primary950'
                                  : '$backgroundCardDark',
                                borderColor: checked
                                  ? '$primary600'
                                  : '$muted700'
                              },
                              ':hover': { borderColor: '$primary400' }
                            }}
                          >
                            <Box
                              w={34}
                              h={34}
                              borderRadius="$full"
                              bg="$primary100"
                              alignItems="center"
                              justifyContent="center"
                              sx={{ _dark: { bg: '$primary900' } }}
                            >
                              <Text
                                size="sm"
                                color="$primary700"
                                fontWeight="$bold"
                                sx={{ _dark: { color: '$primary200' } }}
                              >
                                {initial}
                              </Text>
                            </Box>
                            <VStack flex={1} space="xs">
                              <Text
                                size="sm"
                                fontWeight="$semibold"
                                color="$textLight900"
                                sx={{ _dark: { color: '$textDark50' } }}
                              >
                                {labelText}
                              </Text>
                              <Text size="xs" color="$muted500">
                                {addressFor(device)}
                              </Text>
                            </VStack>
                            <Box
                              w={24}
                              h={24}
                              borderRadius="$md"
                              borderWidth={1}
                              borderColor={
                                checked ? '$primary600' : '$muted300'
                              }
                              bg={checked ? '$primary600' : 'transparent'}
                              alignItems="center"
                              justifyContent="center"
                            >
                              {checked ? (
                                <Icon as={CheckIcon} size="sm" color="$white" />
                              ) : null}
                            </Box>
                          </HStack>
                        </Pressable>
                      )
                    })
                  ) : (
                    <VStack alignItems="center" py="$8" space="xs">
                      <Text color="$muted500">{emptyText}</Text>
                    </VStack>
                  )}
                </VStack>
              </ScrollView>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack space="sm" justifyContent="space-between" w="$full">
              <Button
                variant="link"
                action="secondary"
                onPress={() => setDraft([])}
              >
                <ButtonText>Clear</ButtonText>
              </Button>
              <HStack space="sm">
                <Button variant="outline" action="secondary" onPress={close}>
                  <ButtonText>Cancel</ButtonText>
                </Button>
                <Button action="primary" onPress={apply}>
                  <ButtonText>
                    Use {draft.length || 'no'} device
                    {draft.length === 1 ? '' : 's'}
                  </ButtonText>
                </Button>
              </HStack>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormControl>
  )
}

export default ClientSelect
