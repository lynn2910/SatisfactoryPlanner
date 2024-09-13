class Node {
  /**
   *
   * @param {NodeType} type
   */
  constructor(type) {
    this.type = type
  }

  /**
   * @param {number} id
   */
  setID(id) {
    this.id = id
  }

  /**
   * Define the machine in the case that the type is `NodeType.Machine`
   *
   * @param {string} machine The machine ID
   * @return {Node}
   */
  setMachine(machine) {
    this.machine = machine
    return this
  }

  /**
   * @param {string[]} inputs The IDs of what will be received in entry
   * @param {string[]} outputs The IDs of what will be produced at the end
   * @return {Node}
   */
  setFlux(inputs, outputs) {
    this.inputs = inputs
    this.outputs = outputs
    return this
  }
}

/**
 * @enum {number} What type of building is used
 */
const NodeType = {
  BeltDivider: 0,
  BeltMerge: 1,
  Machine: 2,
  Input: 3,
  Output: 4
}

class Edge {
  source = -1
  target = -1

  /**
   * @param {ConnectionType} type
   * @param {number} source From where the connection begin
   * @param {number} target Where the connection is heading
   */
  constructor(type, source, target) {
    this.type = type
    this.source = source
    this.target = target
  }

  /**
   * @param {number} id
   */
  setID(id) {
    this.id = id
  }
}

/**
 * What type of connection is used
 * @enum {number}
 */
const ConnectionType = {
  Belt: 0,
  Pipe: 1
}

class FactoryGraph {
  NODE_ID_INDEX = 0
  EDGE_ID_INDEX = 0
  /**
   * @type {Node[]}
   */
  nodes = []
  /**
   * @type {Edge[]}
   */
  edges = []

  constructor() {
  }

  /**
   * Insert a new Node in the graph
   *
   * @param {Node} node The node that will be added
   * @returns {number} The ID of the node
   */
  addNode(node) {
    let id = this.NODE_ID_INDEX++
    node.setID(id)
    this.nodes.push(node)
    return id
  }

  /**
   * Try to find the node
   *
   * @param {number} nodeID
   * @returns {Node | null} The node if any was found
   */
  getNode(nodeID) {
    return this.nodes.find(node => nodeID === nodeID) || null
  }

  /**
   * Insert a new Edge in the graph
   *
   * @param {Edge} edge The edge that will be added
   * @returns {number} The ID given to the edge
   */
  addEdge(edge) {
    let id = this.EDGE_ID_INDEX++
    edge.setID(id)

    this.edges.push(edge)
    return id
  }
}

export { Node, NodeType, Edge, ConnectionType, FactoryGraph }