import { expect, it, describe } from 'vitest'
import { mount } from '@vue/test-utils'
import Joystick, { JoystickComponent } from '../src'
import { JoystickComponentProps } from '../src/Joystick.vue'

const sleep = async (ms = 100) => new Promise((r) => setTimeout(r, ms))

describe('vue-joystick-component', () => {
  it('mounts', () => {
    const wrapper = mount(Joystick)
    expect(wrapper.find('.joystick')).toBeTruthy()
  })

  it('inits props', () => {
    const size = 100
    const wrapper = mount(Joystick)
    expect(wrapper.vm.size).toEqual(size)
    expect(wrapper.vm.baseColor).toEqual('rgb(0 0 0 / 50%)')
    expect(wrapper.vm.stickColor).toEqual('mediumpurple')
    expect(wrapper.vm.throttle).toEqual(100)
    expect(wrapper.vm.disabled).toEqual(false)
    expect(wrapper.vm.sticky).toEqual(false)
    expect(wrapper.vm.followCursor).toEqual(false)
    expect(wrapper.vm.baseShape).toEqual(JoystickComponent.Shape.Circle)
    // @ts-ignore
    expect(wrapper.vm._stickSize).toEqual(size / 1.5)
    // @ts-ignore
    expect(wrapper.vm._radius).toEqual(size / 2)
  })

  it('sets props', () => {
    const props: JoystickComponentProps = {
      size: 50,
      baseColor: 'pink',
      stickColor: 'purple',
      throttle: 200,
    }
    const wrapper = mount(Joystick, { props })
    expect(wrapper.vm.size).toEqual(props.size)
    expect(wrapper.vm.baseColor).toEqual(props.baseColor)
    expect(wrapper.vm.stickColor).toEqual(props.stickColor)
    expect(wrapper.vm.throttle).toEqual(props.throttle)
    // @ts-ignore
    expect(wrapper.vm._stickSize).toEqual(props.size / 1.5)
    // @ts-ignore
    expect(wrapper.vm._radius).toEqual(props.size / 2)
  })

  it('sets joystick as a square', () => {
    const props: JoystickComponentProps = {
      baseShape: JoystickComponent.Shape.Square,
      stickShape: JoystickComponent.Shape.Square,
      controlPlaneShape: JoystickComponent.Shape.Square,
    }
    const wrapper = mount(Joystick, { props })
    expect(wrapper.vm.baseShape).toEqual(JoystickComponent.Shape.Square)
    expect(wrapper.vm.stickShape).toEqual(JoystickComponent.Shape.Square)
    expect(wrapper.vm.controlPlaneShape).toEqual(JoystickComponent.Shape.Square)
  })

  it('applies joystick styles', () => {
    const props = { size: 50, baseColor: 'pink', stickColor: 'purple' }
    const wrapper = mount(Joystick, { props })
    const stick = wrapper.find('.joystick__stick')

    expect(wrapper.attributes().style).toContain(`width: ${props.size}px`)
    expect(wrapper.attributes().style).toContain(`height: ${props.size}px`)
    expect(wrapper.attributes().style).toContain(`border-radius: ${props.size}px`)
    expect(wrapper.attributes().style).toContain(`background: ${props.baseColor}`)

    expect(stick.attributes().style).toContain(`width: ${props.size / 1.5}px`)
    expect(stick.attributes().style).toContain(`height: ${props.size / 1.5}px`)
    expect(stick.attributes().style).toContain(`border-radius: ${props.size}px`)
    expect(stick.attributes().style).toContain(`background: ${props.stickColor}`)
  })

  it('triggers start', () => {
    const wrapper = mount(Joystick)
    wrapper.find('button').trigger(JoystickComponent.InteractionEvents.PointerDown)
    // @ts-ignore
    const event = wrapper.emitted().start[0][0] as JoystickComponent.UpdateEvent
    expect(event?.type).toEqual('start')
    // @ts-ignore
    expect(wrapper.vm.state.dragging).toEqual(true)
  })

  it('triggers start and stop', async () => {
    const wrapper = mount(Joystick)
    const button = wrapper.find('button')

    // pointer down
    button.trigger(JoystickComponent.InteractionEvents.PointerDown)
    // @ts-ignore
    const startEvent = wrapper.emitted().start[0][0] as JoystickComponent.UpdateEvent
    expect(startEvent?.type).toEqual('start')
    // @ts-ignore
    expect(wrapper.vm.state.dragging).toEqual(true)

    // wait 10ms to add event listeners
    await sleep(10)

    // pointer up
    button.trigger(JoystickComponent.InteractionEvents.PointerUp)
    // @ts-ignore
    const stopEvent = wrapper.emitted().stop[0][0] as JoystickComponent.UpdateEvent
    expect(stopEvent?.type).toEqual('stop')
    // @ts-ignore
    expect(wrapper.vm.state.dragging).toEqual(false)
  })

  it('triggers start, move, and stop', async () => {
    const wrapper = mount(Joystick)
    const button = wrapper.find('button')

    // pointer down
    button.trigger(JoystickComponent.InteractionEvents.PointerDown)
    // @ts-ignore
    const startEvent = wrapper.emitted().start[0][0] as JoystickComponent.UpdateEvent
    expect(startEvent?.type).toEqual('start')
    // @ts-ignore
    expect(wrapper.vm.state.dragging).toEqual(true)

    // wait 10ms to add event listeners
    await sleep(10)

    // pointer move
    button.trigger(JoystickComponent.InteractionEvents.PointerMove)
    // @ts-ignore
    expect(wrapper.vm.state).toHaveProperty('coordinates')

    // wait 10ms between pointer move and pointer up
    await sleep(10)

    // pointer up
    button.trigger(JoystickComponent.InteractionEvents.PointerUp)
    // @ts-ignore
    const stopEvent = wrapper.emitted().stop[0][0] as JoystickComponent.UpdateEvent
    expect(stopEvent?.type).toEqual('stop')
    // @ts-ignore
    expect(wrapper.vm.state.dragging).toEqual(false)
  })
})
