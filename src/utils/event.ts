import { createEvent } from 'react-event-hook'

interface Message {
  type: string
  values: any
  dayIndex?: number
  hourIndex?: number
}

export const { usePositionListener, emitPosition } =
  createEvent('position')<Message>()

// import mitt, { Emitter } from 'mitt'
//
// type Events = {
//   [key: string]: any
//   value?: any
// }
//
// const emitter: Emitter<Events> = mitt<Events>()
//
// export default emitter

// import { EventEmitter } from 'fbemitter'

// const emitter = new EventEmitter()

// export default emitter
