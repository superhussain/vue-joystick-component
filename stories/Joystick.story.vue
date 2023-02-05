<script setup lang="ts">
import { logEvent } from 'histoire/client'
import Joystick from '../dist/index'
</script>

<template>
  <Story>
    <Joystick
      style="margin: 50px"
      @move="logEvent('move', $event)"
      @start="logEvent('start', $event)"
      @stop="logEvent('stop', $event)"
    />
  </Story>
</template>
