export namespace JoystickComponent {
  export enum Shape {
    Circle = 'circle',
    Square = 'square',
  }

  export enum InteractionEvents {
    PointerDown = 'pointerdown',
    PointerMove = 'pointermove',
    PointerUp = 'pointerup',
    FollowStop = 'FOLLOW_STOP',
  }

  export type Direction = 'FORWARD' | 'RIGHT' | 'LEFT' | 'BACKWARD'

  export interface UpdateEvent {
    type: 'move' | 'stop' | 'start'
    x?: number
    y?: number
    direction?: Direction
    distance?: number
  }

  export interface Coordinates {
    relativeX: number
    relativeY: number
    axisX: number
    axisY: number
    direction: Direction
    distance: number
  }

  export interface State {
    dragging: boolean
    coordinates?: Coordinates
  }

  /**
   * Radians identifying the direction of the joystick
   */
  export enum RadianQuadrantBinding {
    TopRight = 2.356_194_49,
    TopLeft = -2.356_194_49,
    BottomRight = 0.785_398_163,
    BottomLeft = -0.785_398_163,
  }
}
