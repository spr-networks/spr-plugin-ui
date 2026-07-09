import React, { useEffect, useState } from 'react'
import {
  api,
  useAlert,
  Page,
  ListHeader,
  Card,
  SectionHeader,
  StatTile,
  KeyVal,
  StatusDot,
  Toggle,
  TextField,
  ModalConfirm,
  Loading,
  EmptyState,
  Button,
  ButtonText,
  HStack,
  VStack
} from '@spr-networks/plugin-ui'

const PLUGIN_BASE = `/plugins/${api.pluginURI() || 'my-plugin'}`

export default function Plugin() {
  const alert = useAlert()
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [apiKey, setApiKey] = useState('')
  const [showReset, setShowReset] = useState(false)

  const refresh = () => {
    api
      .get(`${PLUGIN_BASE}/config`)
      .then((c) => {
        setConfig(c)
        setApiKey(c?.APIKey || '')
      })
      .catch((err) => alert.error('Failed to load config', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refresh()
  }, [])

  const save = () => {
    api
      .put(`${PLUGIN_BASE}/config`, { ...config, APIKey: apiKey })
      .then(() => alert.success('Saved'))
      .catch((err) => alert.error('Failed to save', err))
  }

  if (loading) {
    return (
      <Page>
        <Loading />
      </Page>
    )
  }

  if (!config) {
    return (
      <Page>
        <EmptyState
          title="Not configured"
          description="This plugin has no configuration yet."
        >
          <Button size="sm" onPress={refresh}>
            <ButtonText>Retry</ButtonText>
          </Button>
        </EmptyState>
      </Page>
    )
  }

  return (
    <Page>
      <ListHeader title="My Plugin" description="Example SPR plugin UI">
        <Button size="sm" onPress={save}>
          <ButtonText>Save</ButtonText>
        </Button>
      </ListHeader>

      <Card>
        <SectionHeader
          title="Status"
          right={<StatusDot online={config.Running} />}
        />
        <HStack flexWrap="wrap" gap="$2">
          <StatTile label="State" value={config.Running ? 'Running' : 'Stopped'} />
          <StatTile label="Version" value={config.Version} mono />
        </HStack>
      </Card>

      <Card>
        <SectionHeader title="Settings" />
        <VStack space="md">
          <TextField
            label="API Key"
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="key..."
            helper="Stored in the plugin config"
            secureTextEntry
          />
          <KeyVal label="Enabled" value={config.Enabled ? 'yes' : 'no'} />
          <HStack justifyContent="space-between" alignItems="center">
            <Toggle
              value={!!config.Enabled}
              onPress={() => setConfig({ ...config, Enabled: !config.Enabled })}
            />
            <Button
              size="xs"
              variant="outline"
              action="negative"
              onPress={() => setShowReset(true)}
            >
              <ButtonText>Reset</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </Card>

      <ModalConfirm
        isOpen={showReset}
        onClose={() => setShowReset(false)}
        onConfirm={() =>
          api
            .delete(`${PLUGIN_BASE}/config`)
            .then(refresh)
            .catch((err) => alert.error('Failed to reset', err))
        }
        title="Reset configuration?"
        message="This clears all plugin settings."
        confirmText="Reset"
        destructive
      />
    </Page>
  )
}
