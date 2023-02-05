const __resolved__virtual_storySource_storiesJoystickStoryVue = `<script setup lang="ts">
import { logEvent } from 'histoire/client'
import Joystick from '../src'
<\/script>

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
`;
export {
  __resolved__virtual_storySource_storiesJoystickStoryVue as default
};
