import { default as dagre, graphlib, Node, GraphEdge as Edge } from 'dagre'

export const initGraph = () => {
  const graph = new graphlib.Graph()

  graph.setGraph({
  //   // // align: 'DL',
  //   // acyclicer: 'greedy',
  //   // ranker: 'network-simplex', //'tight-tree',
    rankdir: 'LR',
    edgesep: 5,
  //   // ranksep: 150
  })


  graph.setDefaultEdgeLabel(function () {
    return {}
  })

  dagre.layout(graph)

  const getNodes = (...args: string[]): Node[] =>
    graph.nodes().map((node) => graph.node(node))

  type SetNodes = (
    ...nodes: Parameters<dagre.graphlib.Graph['setNode']>[]
  ) => void
  const setNodes: SetNodes = (...nodes) => {
    nodes.forEach((node) => graph.setNode(...node))
  }

  const getEdges = () =>
    graph.edges().map((edge) => {
      return graph.edge(edge)
    })

  const setEdges = (...edges) => {
    edges.forEach((edge) => graph.setEdge(edge))
  }

  const updateLayout = () => {
    dagre.layout(graph)
  }



  return {
    getNodes,
    setNodes,
    getEdges,
    setEdges,
    updateLayout,
    graph
  }
}
