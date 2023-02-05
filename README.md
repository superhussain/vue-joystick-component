# Vue Joystick

![npm](https://img.shields.io/npm/v/vue-joystick-component)

A Joystick Vue 3 Component.

_Inspired by [react-joystick-component](https://github.com/elmarti/react-joystick-component)_

[**Joystick Demo**](https://superhussain.github.io/vue-joystick-component/#/story/stories-joystick-story-vue?variantId=_default)

## Installation

```bash
npm install vue-joystick-component
```

## Usage

```vue
<script setup>
import Joystick from 'vue-joystick-component'

const start = () => console.log('start')
const stop = () => console.log('stop')
const move = ({ x, y, direction, distance }) => {
  console.log('move', { x, y, direction, distance })
}
</script>

<template
  <Joystick
    :size="100"
    base-color="pink"
    stick-color="purple"
    :throttle="100"
    @start="start"
    @stop="stop"
    @move="move"
  />
</template>
```

## Types

```ts
namespace JoystickComponent {
  enum Shape {
    Circle = 'circle',
    Square = 'square',
  }
}

interface JoystickComponentProps {
  /** The size of the joystick base (default: `100`) */
  size?: number
  /** The size of the joystick stick (defaults to ⅔ the size of the base) */
  stickSize?: number
  /** The color of the joystick base (default: `rgb(0 0 0 / 50%)`) */
  baseColor?: string
  /** The color of the joystick stick (default: `mediumpurple`) */
  stickColor?: string
  /** The duration to throttle the `move` event by in ms (default: `100`) */
  throttle?: number
  /** Disables the joystick from triggering actions (default: `false`) */
  disabled?: boolean
  /**
   * Determines whether the joystick sticks to the positions it is moved to.
   *
   * - `false` will bring the joystick back to its original position when released
   * - `true` will keep the joystick in its place when moved
   *
   * (default: `false`)
   **/
  sticky?: boolean
  /** The image to use for the joystick base background using CSS `background: url(...)` */
  baseImage?: string
  /** The image to use for the joystick stick background using CSS `background: url(...)` */
  stickImage?: string
  /** Determines whether the joystick follows your cursor (default: `false`) */
  followCursor?: boolean
  /** The shape of the joystick base (default: `circle`) */
  baseShape?: JoystickComponent.Shape
  /** The shape of the joystick stick (default: `circle`) */
  stickShape?: JoystickComponent.Shape
  /** The shape of the joystick control plane (default: `circle`) */
  controlPlaneShape?: JoystickComponent.Shape
  /** The minimum distance to travel before triggering the `move` event between 0 - 100 (default: `0`) */
  minDistance?: number
}
```

## Troubleshooting

### `Unknown file extension ".vue" for ...`

```
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".vue" for /path/to/vue-joystick-component/dist/Joystick.vue
```

If you're using Nuxt, you can tell Nuxt to transpile the package by adding the `build.transpile` option in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  build: {
    transpile: ['vue-joystick-component'],
  },
})
```
