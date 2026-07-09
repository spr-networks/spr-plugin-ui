# @spr-networks/plugin-ui

Shared frontend kit for [SPR](https://www.supernetworks.org) plugins. Gives a plugin's
web UI the SPR gluestack look, a matching API client, small UI primitives, and an
automatic theme bridge so the plugin follows the host's light/dark mode and custom themes.

SPR plugin UIs run in an `iframe` embedded by the SPR app. This package handles the
provider setup and the host↔iframe theme handshake for you.

## Install

Consumed via git URL (Yarn Berry pre-approves git deps in the SPR frontend):

```
yarn add @spr-networks/plugin-ui@git+https://github.com/spr-networks/spr-plugin-ui.git
```

Peer dependencies (the plugin already has these — the same versions SPR pins):
`react`, `react-dom`, `@gluestack-ui/themed`, `@gluestack-ui/config`, `@gluestack-style/react`.

This package ships source (JSX). A CRA/CRACO plugin must transpile it — the
`template/craco.config.js` already includes `@spr-networks/plugin-ui` in its
`transpileModules` list alongside the gluestack packages. Copy that config, or add the
same include to yours.

## Usage

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { PluginApp } from '@spr-networks/plugin-ui'
import Plugin from './Plugin'

ReactDOM.createRoot(document.getElementById('root')).render(
  <PluginApp>
    <Plugin />
  </PluginApp>
)
```

Inside your plugin, use the API client and primitives:

```jsx
import { api, API, Card, StatTile, SectionHeader, StatusDot, Toggle, KeyVal } from '@spr-networks/plugin-ui'

class MyAPI extends API {
  constructor() { super(`/plugins/${api.pluginURI()}/`) }
  config() { return this.get('config') }
}
```

## Theme bridge

`PluginApp` reads the host theme on first paint (`window.SPR_THEME` in production, or a
`?colorMode=` query param in dev) and subscribes to live updates. When SPR switches theme
or color mode it posts `{ type: 'spr:theme', colorMode, theme, colors }`; `colors` is a flat
map of gluestack color tokens to hex, so plugins reflect built-in and user-built themes.
On mount the plugin posts `{ type: 'spr:ready' }` to the host so the current theme is (re)sent.

Pass `onMessage` to `PluginApp` to observe non-theme host messages.

## Exports

- `PluginApp` — provider + theme bridge wrapper
- `config` — the SPR gluestack config
- `api`, `API` — API client (reads `window.SPR_API_URL`, rides the SPR session)
- `Card`, `StatusDot`, `StatTile`, `SectionHeader`, `Toggle`, `KeyVal` — UI primitives
- `readInitialTheme`, `subscribeTheme`, `READY_MESSAGE` — theme bridge internals

## template/

Drop-in build scaffolding for a plugin frontend: `craco.config.js` (inlines the bundle to a
single `index.html`, transpiles gluestack + this package), `bundle.sh`, `public/index.html`,
and an `index.js` entry.
