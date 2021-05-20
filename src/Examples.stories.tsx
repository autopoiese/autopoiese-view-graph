import * as React from 'react'
import * as THREE from 'three'
import { Meta } from '@storybook/react'
import { initGraph } from './dagre'
import { Nodes } from './Nodes'
import { Edge } from './Edges'
import { Setup } from '@autopoiese/stories'
import { Center, useHelper } from '@react-three/drei'
import { createBezier } from './utils/createBezier'

export default {
  title: 'View/Graph/examples',
  component: () => <div></div>,
  decorators: [
    (Story) => (
      <Setup
        {...{
          orthographic: true,
          controls: true,
          camera: { near: -1000, far: 10000 }
        }}
      >
        {Story()}
      </Setup>
    )
  ]
} as Meta

// const tags = ['os', 'graph', 'markdown', 'native', 'browser', 'api', "ai"]

const apps = [
  { name: 'Roam', url: 'https://roamresearch.com/', tags: ['graph'] },
  {
    name: 'logseq',
    url: 'https://logseq.com/',
    tags: ['browser', 'graph', 'os']
  },
  {
    name: 'Anytype',
    url: 'https://www.anytype.io/',
    tags: ['markdown', 'native', 'ipfs', 'encrypted']
  },
  {
    name: 'Notion',
    url: 'https://notion.so',
    tags: ['markdown', 'native', 'browser', 'api']
  },
  { name: 'Memex', url: 'https://getmemex.com/', tags: ['browser', 'os'] },
  {
    name: 'PeerPad',
    url: 'https://github.com/peer-base/peer-pad',
    tags: ['browser']
  },
  { name: 'RelaNote', url: 'https://relanote.com/', tags: ['encrypted'] },
  { name: 'Totallib', url: 'https://totallib.com/', tags: ['ai', 'native'] },
  { name: 'WithCortex', url: 'https://withcortex.com/' },
  { name: 'Polar', url: 'https://getpolarized.io/', tags: ['os'] },
  { name: 'Yarc', url: 'https://github.com/xeust/yarc/', tags: ['os'] },
  { name: 'Nodes', url: 'https://nodes.io', tags: ['graph', 'browser'] },
  {
    name: 'Obsidian',
    url: 'https://obsidian.md/',
    tags: ['native', 'markdown', 'graph']
  },
  { name: 'MyMind', url: 'https://mymind.com/', tags: ['native'] },
  { name: 'Rows', url: 'https://rows.com/', tags: ['browser'] },
  { name: 'ActiveWorkflow', url: 'https://www.automaticmode.com/' },
  {
    name: 'node-red',
    url: 'https://nodered.org/',
    tags: ['graph', 'flow', 'os']
  },
  { name: 'open-decisions', url: 'https://open-decision.org/' },
  { name: 'Hook', url: 'https://hookproductivity.com/', tags: ['native'] }
]

const tags = Object.keys(
  apps.reduce(
    (p, { tags }) => ({
      ...p,
      ...tags.reduce((p, c) => ({ ...p, [c]: null }), {})
    }),
    {}
  )
)

type EdgeTuple = [string, string]

const edgeData: EdgeTuple[] = [
  ...tags.map((t) => ['tag', t]),
  ...apps.reduce(
    (p, app) =>
      [
        ...p,
        [app.name, 'app'],
        ...app.tags.map((t) => [app.name, t] as const)
      ] as EdgeTuple[],
    []
  )
]

type NodeTuple = [string, { label: string }]

const nodeData: NodeTuple[] = [
  ...tags,
  ...apps.map(({ name }) => name)
].map((name) => [name, { label: name }])

const graph = initGraph()

graph.setNodes(
  ...nodeData
  // ['kspacey', { label: 'Kevin Spacey', width: 10, height: 10 }],
  // ['swilliams', { label: 'Saul Williams', width: 10, height: 10 }],
  // ['bpitt', { label: 'Brad Pitt', width: 10, height: 10 }],
  // ['hford', { label: 'Harrison Ford', width: 10, height: 10 }],
  // ['lwilson', { label: 'Luke Wilson', width: 10, height: 10 }],
  // ['kbacon', { label: 'Kevin Bacon', width: 10, height: 10 }]
)
graph.setEdges(
  ['kspacey', 'swilliams'],
  ['swilliams', 'kbacon'],
  ['bpitt', 'kbacon'],
  ['hford', 'lwilson'],
  ['lwilson', 'kbacon']
)
const nodes = graph.getNodes().filter((node) => !!node)
const edges = graph.getEdges()

graph.updateLayout()

const Component = (props) => {
  console.log(edges, nodes, graph.graph)
  const ref = React.useRef()
  useHelper(ref, THREE.BoxHelper)
  return (
    <Center>
      <group {...{ ref }}>
        <Nodes {...{ nodes }} />
        {edges.map((edge, key) => {
          const points = createBezier({
            s1: edge.points[0],
            t1: edge.points[2]
          })
          return <Edge {...{ points, lineWidth: 2, key }} />
        })}
      </group>
    </Center>
  )
}

const Template = (args) => <Component {...args} />

export const DefaultStory = Template.bind({})
DefaultStory.story = { name: 'Default' }
