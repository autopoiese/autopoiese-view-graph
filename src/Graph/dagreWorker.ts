import { Observable, Subject } from 'threads/observable'
import { expose } from 'threads/worker'
import * as dagre from 'dagre'

const graph = new dagre.graphlib.Graph()

graph.setGraph({
  // align: 'DL',
  acyclicer: 'greedy',
  ranker: 'network-simplex', //'tight-tree',
  rankdir: 'LR',
  edgesep: 50,
  ranksep: 150
})

const g = graph

g.setDefaultEdgeLabel(function () {
  return {}
})

g.setNode('kspacey', { label: 'Kevin Spacey', width: 144, height: 100 })
g.setNode('swilliams', { label: 'Saul Williams', width: 160, height: 100 })
g.setNode('bpitt', { label: 'Brad Pitt', width: 108, height: 100 })
g.setNode('hford', { label: 'Harrison Ford', width: 168, height: 100 })
g.setNode('lwilson', { label: 'Luke Wilson', width: 144, height: 100 })
g.setNode('kbacon', { label: 'Kevin Bacon', width: 121, height: 100 })

g.setEdge('kspacey', 'swilliams')
g.setEdge('swilliams', 'kbacon')
g.setEdge('bpitt', 'kbacon')
g.setEdge('hford', 'lwilson')
g.setEdge('lwilson', 'kbacon')

let subject = new Subject()

dagre.layout(g)

subject.next(g.nodes())

const getNodes = () => graph.nodes().map((node) => graph.node(node))
const getEdges = () => graph.edges().map((edge) => graph.edge(edge))

const updateSubject = () =>
  subject.next({ nodes: getNodes(), edges: getEdges() })

expose({
  setNodes() {},
  setNode(name: string = 'test', label = { label: 'Test' }) {
    g.setNode(name, label)
    updateSubject()
  },
  getNodes,
  getEdges,
  nodes() {
    return Observable.from(subject)
  }
})
