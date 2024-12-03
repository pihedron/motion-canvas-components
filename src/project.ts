import { makeProject } from '@motion-canvas/core'

import example from './scenes/example?scene'
import audio from '../audio/voice.wav'

export default makeProject({
  scenes: [example],
  audio
})
