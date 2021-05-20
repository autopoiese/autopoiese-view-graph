import { Observable, Subject } from 'threads/observable'
import { expose } from 'threads/worker'
import { Node, GraphEdge } from 'dagre'
import { initGraph } from './index'

const graph = initGraph()

type GraphValues = { nodes: Node[]; edges: GraphEdge[] }
const subject = new Subject<GraphValues>()

type SetNodes = typeof graph['setNodes']
type SetNodesParams = Parameters<SetNodes>
type SetEdges = typeof graph['setEdges']
type SetEdgesParams = Parameters<SetEdges>

const updateSubject = () =>
  subject.next({ nodes: graph.getNodes(), edges: graph.getEdges() })

const setNodes: SetNodes = (...params) => {
  graph.setNodes(...params)
  graph.updateLayout()
  updateSubject()
}

const setEdges: SetEdges = (...params) => {
  graph.setEdges(...params)
  graph.updateLayout()
  updateSubject()
}

type SetValues = (params: {
  nodes?: SetNodesParams
  edges?: SetEdgesParams
}) => void

const setValues: SetValues = (params) => {
  const nodes: SetNodesParams | false = params.nodes?.length > 0 && params.nodes
  const edges: SetEdgesParams | false = params.edges?.length > 0 && params.edges
  nodes && graph.setNodes(...params.nodes)
  edges && graph.setEdges(...params.edges)
  if (edges) {
    graph.updateLayout()
    updateSubject()
  }
}

expose({
  setNodes,
  getNodes: graph.getNodes,
  setEdges,
  getEdges: graph.getEdges,
  setValues,
  getValues() {
    return Observable.from(subject)
  }
})

export type GraphWorker = {
  setNodes: SetNodes
  getNodes: typeof graph['getNodes']
  setEdges: SetEdges
  getEdges: typeof graph['getEdges']
  setValues: SetValues
  getValues(): Observable<GraphValues>
}
