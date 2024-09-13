import { Factory, FactoryModel } from './create_factory.js'
import { Processor } from './builder.js'

/**
 * Draw create_factory on the canvas
 * @param {Processor} proc
 * @param {Factory} factory
 */
export function draw_factory(proc, factory) {
  switch (factory.model) {
    case FactoryModel.SINGLE_PRODUCTION: {
      draw_single_factory(proc, factory)
      break
    }
    default: {
      console.error(`Unknown factory model for drawing: ${factory.model}`)
    }
  }
}

function draw_single_factory(proc, factory) {
  let local_offset = { x: 0, y: 0 }

  console.log(local_offset)
}