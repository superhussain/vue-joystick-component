<script setup lang="ts">
import { ref, reactive, computed, onBeforeUnmount, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { JoystickComponent } from './types'

export interface JoystickComponentProps {
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

const props = withDefaults(defineProps<JoystickComponentProps>(), {
  size: 100,
  stickSize: undefined,
  baseColor: 'rgb(0 0 0 / 50%)',
  stickColor: 'mediumpurple',
  throttle: 100,
  disabled: false,
  sticky: false,
  baseImage: undefined,
  stickImage: undefined,
  followCursor: false,
  baseShape: JoystickComponent.Shape.Circle,
  stickShape: JoystickComponent.Shape.Circle,
  controlPlaneShape: JoystickComponent.Shape.Circle,
  minDistance: 0,
})

const emit = defineEmits<{
  (action: 'move', event: JoystickComponent.UpdateEvent): void
  (action: 'start', event: JoystickComponent.UpdateEvent): void
  (action: 'stop', event: JoystickComponent.UpdateEvent): void
}>()

const state = reactive<JoystickComponent.State>({ dragging: false })

const baseRef = ref<HTMLElement>()
const stickRef = ref<HTMLElement>()

const _parentRect = ref<DOMRect>()
const _pointerId = ref<number>()

const _stickSize = computed(() => props.stickSize || props.size / 1.5)
const _radius = computed(() => props.size / 2)

const shapeFactory = (shape: JoystickComponent.Shape, size: number) => {
  return { borderRadius: `${shape === JoystickComponent.Shape.Square ? Math.sqrt(size) : size}px` }
}

const shapeBoundsFactory = (
  shape: JoystickComponent.Shape,
  absoluteX: number,
  absoluteY: number,
  relativeX: number,
  relativeY: number,
  dist: number,
  radius: number,
  baseSize: number,
  parentRect: DOMRect,
) => {
  if (shape === JoystickComponent.Shape.Square) {
    relativeX = getWithinBounds(absoluteX - parentRect.left - baseSize / 2, baseSize)
    relativeY = getWithinBounds(absoluteY - parentRect.top - baseSize / 2, baseSize)
    return { relativeX, relativeY }
  }
  if (dist > radius) {
    relativeX *= radius / dist
    relativeY *= radius / dist
  }
  return { relativeX, relativeY }
}

const getWithinBounds = (value: number, baseSize: number): number => {
  const halfBaseSize = baseSize / 2
  if (value > halfBaseSize) return halfBaseSize
  if (value < -halfBaseSize) return halfBaseSize * -1
  return value
}

const _throttleMoveCallback = (() => {
  let lastCall = 0
  return (event: JoystickComponent.UpdateEvent) => {
    const now = Date.now()
    const throttleAmount = props.throttle
    if (now - lastCall < throttleAmount) return
    lastCall = now
    return emit('move', event)
  }
})()

const getBaseShapeStyle = () => shapeFactory(props.baseShape, props.size)
const getStickShapeStyle = () => shapeFactory(props.stickShape, props.size)

const baseStyle = computed(() => {
  const baseColor = props.baseColor
  const baseSizeString = `${props.size}px`
  const padStyle = {
    ...getBaseShapeStyle(),
    height: baseSizeString,
    width: baseSizeString,
    background: baseColor,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } as CSSProperties

  if (props.baseImage) {
    padStyle.background = `url(${props.baseImage})`
    padStyle.backgroundSize = '100%'
  }

  return padStyle
})

const stickStyle = computed(() => {
  const stickColor = props.stickColor
  const stickSize = `${_stickSize.value}px`

  let stickStyle = {
    ...getStickShapeStyle(),
    background: stickColor,
    cursor: 'move',
    height: stickSize,
    width: stickSize,
    border: 'none',
    flexShrink: 0,
    touchAction: 'none',
  } as CSSProperties

  if (props.stickImage) {
    stickStyle.background = `url(${props.stickImage})`
    stickStyle.backgroundSize = '100%'
  }

  if (state.coordinates !== undefined) {
    stickStyle = {
      ...stickStyle,
      position: 'absolute',
      transform: `translate3d(${state.coordinates.relativeX}px, ${state.coordinates.relativeY}px, 0)`,
    }
  }

  return stickStyle
})

/**
 * Update position of joystick - set state and trigger DOM manipulation
 * @param coordinates
 */
const _updatePos = (coordinates: JoystickComponent.Coordinates) => {
  window.requestAnimationFrame(() => (state.coordinates = coordinates))
  if (typeof props.minDistance === 'number' && coordinates.distance < props.minDistance) return
  _throttleMoveCallback({
    type: 'move',
    x: (coordinates.relativeX * 2) / props.size,
    y: -((coordinates.relativeY * 2) / props.size),
    direction: coordinates.direction,
    distance: coordinates.distance,
  })
}

/**
 * Handle pointerdown event
 * @param e PointerEvent
 */
const _pointerDown = (e: PointerEvent) => {
  if (props.disabled || props.followCursor || !baseRef.value || !stickRef.value) return
  _parentRect.value = baseRef.value.getBoundingClientRect()
  state.dragging = true

  window.addEventListener(JoystickComponent.InteractionEvents.PointerUp, (event) =>
    _pointerUp(event),
  )
  window.addEventListener(JoystickComponent.InteractionEvents.PointerMove, (event) =>
    _pointerMove(event),
  )
  _pointerId.value = e.pointerId
  if (typeof stickRef.value.setPointerCapture === 'function') {
    stickRef.value.setPointerCapture(e.pointerId)
  }
  emit('start', { type: 'start' })
}

/**
 * Use ArcTan2 (4 Quadrant inverse tangent) to identify the direction the joystick is pointing
 * https://docs.oracle.com/cd/B12037_01/olap.101/b10339/x_arcsin003.htm
 * @param atan2: number
 */
const _getDirection = (atan2: number): JoystickComponent.Direction => {
  if (
    atan2 > JoystickComponent.RadianQuadrantBinding.TopRight ||
    atan2 < JoystickComponent.RadianQuadrantBinding.TopLeft
  ) {
    return 'FORWARD'
  }
  if (
    atan2 < JoystickComponent.RadianQuadrantBinding.TopRight &&
    atan2 > JoystickComponent.RadianQuadrantBinding.BottomRight
  ) {
    return 'RIGHT'
  }
  if (atan2 < JoystickComponent.RadianQuadrantBinding.BottomLeft) {
    return 'LEFT'
  }
  return 'BACKWARD'
}

/**
 * Hypotenuse distance calculation
 * @param x: number
 * @param y: number
 */
const _distance = (x: number, y: number): number => {
  return Math.hypot(x, y)
}

const _distanceToPercentile = (distance: number): number => {
  const percentageBaseSize = (distance / (props.size / 2)) * 100
  if (percentageBaseSize > 100) return 100
  return percentageBaseSize
}

/**
 * Calculate X/Y and ArcTan within the bounds of the joystick
 * @param event
 */
const _pointerMove = (event: PointerEvent) => {
  event.preventDefault()
  if (state.dragging) {
    if (!_parentRect.value) return
    if (!props.followCursor && event.pointerId !== _pointerId.value) return
    const absoluteX = event.clientX
    const absoluteY = event.clientY
    let relativeX = absoluteX - _parentRect.value.left - _radius.value
    let relativeY = absoluteY - _parentRect.value.top - _radius.value
    const dist = _distance(relativeX, relativeY)
    const bounded = shapeBoundsFactory(
      props.controlPlaneShape || props.baseShape,
      absoluteX,
      absoluteY,
      relativeX,
      relativeY,
      dist,
      _radius.value,
      props.size,
      _parentRect.value,
    )
    relativeX = bounded.relativeX
    relativeY = bounded.relativeY
    const atan2 = Math.atan2(relativeX, relativeY)

    _updatePos({
      relativeX,
      relativeY,
      distance: _distanceToPercentile(dist),
      direction: _getDirection(atan2),
      axisX: absoluteX - _parentRect.value.left,
      axisY: absoluteY - _parentRect.value.top,
    })
  }
}

/**
 * Handle pointer up and de-register listen events
 */
const _pointerUp = (event: PointerEvent) => {
  if (
    event.pointerId !== _pointerId.value &&
    event.type !== JoystickComponent.InteractionEvents.FollowStop
  ) {
    return
  }
  window.requestAnimationFrame(() => {
    state.dragging = false
    if (!props.sticky) state.coordinates = undefined
  })
  window.removeEventListener(JoystickComponent.InteractionEvents.PointerUp, _pointerUp)
  window.removeEventListener(JoystickComponent.InteractionEvents.PointerMove, _pointerMove)
  _pointerId.value = undefined

  let evt: JoystickComponent.UpdateEvent = { type: 'stop' }
  if (props.sticky && state.coordinates) {
    evt = {
      ...evt,
      x: (state.coordinates.relativeX * 2) / props.size,
      y: (state.coordinates.relativeY * 2) / props.size,
      direction: state.coordinates.direction,
      distance: state.coordinates.distance,
    }
  }
  emit('stop', evt)
}

/**
 * Start following
 */
const _followStart = () => {
  if (baseRef.value) _parentRect.value = baseRef.value.getBoundingClientRect()
  state.dragging = true
  window.addEventListener(JoystickComponent.InteractionEvents.PointerMove, _pointerMove)
  emit('start', { type: 'start' })
}

const _followStop = () => {
  window.removeEventListener(JoystickComponent.InteractionEvents.PointerMove, _pointerMove)
  _pointerUp(new PointerEvent(JoystickComponent.InteractionEvents.FollowStop))
}

watch(
  () => props.followCursor,
  () => (props.followCursor ? _followStart() : _followStop()),
  { immediate: true },
)

onBeforeUnmount(() => _followStop())
</script>

<template>
  <div
    ref="baseRef"
    class="joystick"
    :class="{ 'joystick--disabled': props.disabled }"
    :style="baseStyle"
  >
    <button
      ref="stickRef"
      :disabled="props.disabled"
      class="joystick__stick"
      :class="{ 'joystick__stick--disabled': props.disabled }"
      :style="stickStyle"
      @pointerdown="_pointerDown"
    />
  </div>
</template>
