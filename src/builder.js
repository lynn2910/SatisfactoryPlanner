import { create_factory } from './create_factory.js'
import { collector } from './data/collector.js'

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded -> starting the processor')

  collector.loadData().then(preprocessor)
})

// Create all useful assets and instances
export function preprocessor() {
  const canvas = document.getElementById('factory_drawer')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const ctx = canvas.getContext('2d')

  let proc = new Processor(canvas, ctx)
  console.log(ctx)

  proc.init_listeners()
  proc.draw_canvas()

  let api_result = {
    'code': 200,
    'result': {
      'Desc_OreIron_C#Mine': '50',
      'special__power#Byproduct': '6.666666666666',
      'Recipe_IngotIron_C@100#Desc_SmelterMk1_C': '1.666666666666',
      'Desc_IronIngot_C#Product': '50'
    }
  }

  // proc.create_factory = null
  proc.find_raw_inputs(api_result)
  proc.factories = create_factory(api_result)

}

export class Processor {
  /**
   * The create_factory
   * @type {Factory[]}
   */
  factories = []
  /**
   * The scale of the canvas, ALL positions and width/length must be multiplied by the according ratio
   * @type {number[]}
   */
  ratio = [1, 1]

  /**
   * All raw inputs from Mines.
   * Doesn't include the tools.
   *
   * @type {Array<{ id: string, amount: number }>}
   */
  inputs = []

  constructor(canvas, ctx) {
    this.canvas = canvas
    this.ctx = ctx
  }

  init_listeners() {
    let proc = this

    window.addEventListener('resize', function() {
      proc.canvas.height = window.innerHeight
      proc.canvas.width = window.innerWidth

      proc.draw_canvas()
    })

    // scroll
    proc.canvas.addEventListener('wheel', function(wheel_event) {
      let scroll_amount = -0.1
      if (wheel_event.deltaY < 0) scroll_amount *= -1
      console.log(scroll_amount)

      proc.ratio = [
        Math.max(0.2, Math.min(10, proc.ratio[0] + scroll_amount)),
        Math.max(0.2, Math.min(10, proc.ratio[1] + scroll_amount))
      ]
      proc.draw_canvas()
    })
  }

  find_raw_inputs(api_result) {
    this.inputs = Object.entries(api_result.result)
      .filter(([k, v]) => k.match(/#Mine/))
      .map(([k, v]) => ({ id: k.split(/#/)[0], amount: v }))

    console.log('Raw inputs for this setup: ', this.inputs)
  }


  /**
   * Request a new draw of the canvas
   */
  draw_canvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(
      10 * this.ratio[0],
      10 * this.ratio[1],
      100 * this.ratio[0],
      100 * this.ratio[1]
    )
  }
}