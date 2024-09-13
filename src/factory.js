// {
//   "code": 200,
//   "result": {
//     "Desc_OreIron_C#Mine": "10",
//     "special__power#Byproduct": "1.333333333333",
//     "Recipe_IngotIron_C@100#Desc_SmelterMk1_C": "0.3333333333333",
//     "Desc_IronIngot_C#Product": "10"
//   }
// }

import { collector } from './data/collector.js'
import { ConnectionType, Edge, FactoryGraph, Node, NodeType } from './factory_graph.js'

/**
 * The type of factory
 * @enum {number}
 * @readonly
 */
const FactoryModel = {
  /**
   * Takes at most multiple inputs and return a single input.
   */
  SINGLE_PRODUCTION: 0
}

class Factory {
  id = -1
  /**
   * The output
   * @type {Array<{ id: string, rate: number }>}
   */
  outputs = []
  /**
   * The model used for this factory
   * @type {FactoryModel|number}
   */
  model = FactoryModel.SINGLE_PRODUCTION

  machine_number = 0
  /**
   * @type {string|null}
   */
  machine = null
  /**
   * @type {Array<{item: string, amount: number, primary: boolean}>}
   */
  inputs = []

  /**
   * @param {FactoryModel} model
   */
  constructor(model) {
    this.model = model
  }

  /**
   * Define what will be produced
   * @param {Array<{ id: string, rate: number }>} outputs The outputs
   */
  produces(outputs) {
    this.outputs = outputs
  }

  /**
   * Defines what inputs the factory needs
   *
   * @param {Array<{item: string, amount: number, primary: boolean}>} inputs
   */
  needs(inputs) {
    this.inputs = inputs
  }

  /**
   * Prepare the factory by creating all nodes and connections
   *
   * Can be instruction expensive
   */
  prepare_factory(api_result) {
    // Define how many factories will be needed
    let { rate, id } = this.outputs[0]
    let recipe = collector.getRecipe(id)

    this.machine = (Object.entries(api_result)
      .find(([k, _]) => k.includes(recipe.className))[0] || '')
      .split(/#/)[1]

    let numberOfMachinesRequired = Math.floor(rate)
    if (numberOfMachinesRequired < rate) numberOfMachinesRequired++

    this.machine_number = numberOfMachinesRequired
    console.log(`${this.machine} x${numberOfMachinesRequired}`)

    this.create_graph()
  }

  create_graph() {
    console.log('Creating Graph')
    if (this.machine == null)
      throw new Error('Machine not found.')

    this.graph = new FactoryGraph()

    let input_node = new Node(NodeType.Input)
    input_node.setFlux(this.inputs.map(i => i.id), [])
    this.graph.addNode(input_node)

    let output_node = new Node(NodeType.Output)
    output_node.setFlux([], this.outputs.map(o => o.id))
    this.graph.addNode(output_node)

    let nodes = []
    for (let i = 0; i < this.machine_number; i++) {
      nodes.push(
        this.graph.addNode((new Node(NodeType.Machine)).setMachine(this.machine))
      )
    }

    console.log(nodes)

    if (nodes.length > 1) {
      // add merges and splitters
      let splitters = []
      for (let i = 0; i < nodes.length - 1; i++) {
        let n = new Node(NodeType.BeltDivider)
        splitters.push(this.graph.addNode(n))

        if (i === 0) {
          this.graph.addEdge(new Edge(ConnectionType.Belt, input_node.id, n.id))
        } else {
          this.graph.addEdge(
            new Edge(
              ConnectionType.Belt,
              splitters[splitters.length - 2],
              splitters[splitters - 1]
            )
          )
        }

        // connect this splitter to the machine at the same ID
        this.graph.addEdge(new Edge(ConnectionType.Belt, n.id, nodes[i]))

        if (i === nodes.length - 2) {
          // Last splitter, he also connects to the last machine
          this.graph.addEdge(new Edge(ConnectionType.Belt, n.id, nodes[i + 1]))
        }
      }


      let mergers = []
      for (let i = nodes.length - 1; i > 0; i--) {
        let n = new Node(NodeType.BeltMerge)
        mergers.push(this.graph.addNode(n))

        console.log('merger ' + i)

        this.graph.addEdge(new Edge(ConnectionType.Belt, nodes[i], n.id))

        if (i === 1) {
          // end of the line, we need to connect the first machine to it
          this.graph.addEdge(new Edge(ConnectionType.Belt, nodes[0], n.id))
        }
      }

      // connect splitters between one another and to the output
      mergers.forEach((m, i) => {
        if (i !== 0) {
          this.graph.addEdge(new Edge(ConnectionType.Belt, mergers[i - 1], m))
        }

        if (i === mergers.length - 1) {
          // connect to output
          this.graph.addEdge(new Edge(ConnectionType.Belt, m, output_node.id))
        }
      })

      console.log(splitters)

    } else if (nodes.length === 1) {
      console.log('one machine')

      let n = this.graph.getNode(nodes[0])

      let in_m = new Edge(ConnectionType.Belt, input_node.id, nodes[0])
      this.graph.addEdge(in_m)
      let out_m = new Edge(ConnectionType.Belt, nodes[0], output_node.id)
      this.graph.addEdge(out_m)
    }

    console.log('Graph created')
    console.log(this.graph)
  }
}

function factory(api_result) {
  let result = Object.entries(api_result.result)

  console.log(result)

  let products = result
    .map((e, i) => [e, i])
    .filter(([[k, _v], _i]) => k.match(/^Recipe_[\w@]+(:?#.+)?$/))
    .map(([[k, v], i]) => parse_product(k, v, i))

  console.log(products)

  let factories = products.map(function(p) {
    let fact = new Factory(FactoryModel.SINGLE_PRODUCTION)

    fact.id = `factory_${p.id}`.toUpperCase()

    fact.produces([p])

    fact.needs(find_needs_for_recipe(collector.getRecipe(p.id)))
    console.log(`Needs for factory ${fact.id}:`, fact.inputs)
    fact.prepare_factory(api_result.result)

    return fact
  })

  console.log('Factories:')
  console.log(factories)

  return factories
}

/**
 * Find all needs and returns an array
 *
 * @param recipe The recipe object
 * @return {Array<{ item: string, amount: number, primary: boolean }>} A list of ALL needed resources
 */
function find_needs_for_recipe(recipe) {
  let ingredients = recipe.ingredients

  if (ingredients > 0)
    // FIXME ne fonctionne pas correctement?
    return ingredients
      .map(i => find_needs_for_recipe(i))
      .reduce((a, b) => a = [...a, ...b], [])
  else
    return ingredients.map((r) => ({ item: r.item, amount: r.amount, primary: true }))
}

function parse_product(k, v, index) {
  return {
    index,
    rate: typeof v == 'string' ? parseFloat(v) : v,
    id: k.split(/#/)[0].split(/@/)[0]
  }
}

export { factory, Factory, FactoryModel }