import * as React from 'react'
import * as THREE from 'three'
import { Meta } from '@storybook/react'
import { initGraph } from './dagre'
import { Nodes } from './Nodes'
import { Edge } from './Edges'
import { Setup } from '@autopoiese/stories'
import { Center, useHelper, Text } from '@react-three/drei'
import { createBezier } from './utils/createBezier'
import {
  CameraControls,
  fitCamera,
  useFitCamera,
  toVector3
} from '@autopoiese/cad-viewer'

export default {
  title: 'View/Graph/examples',
  component: () => <div></div>,
  decorators: [
    (Story) => (
      <Setup
        {...{
          orthographic: true,
          controls: false, //'experimental',
          camera: { near: -1000, far: 10000, position: [0, 0, 100] }
        }}
      >
        {Story()}
        <CameraControls
          {...{
            dollyToCursor: true,
            mouseButtons: {
              left: CameraControls.ACTION.OFFSET,
              wheel: CameraControls.ACTION.ZOOM,
              right: CameraControls.ACTION.ROTATE
            }
          }}
        />
      </Setup>
    )
  ]
} as Meta

// // const tags = ['os', 'graph', 'markdown', 'native', 'browser', 'api', "ai"]

const apps = [
  { name: 'Roam', url: 'https://roamresearch.com/', tags: ['graph'] },
  {
    name: 'logseq',
    url: 'https://logseq.com/',
    tags: ['browser', 'graph', 'os']
  },
  {
    name: 'Workflowy',
    url: 'https://workflowy.com'
  },
  {
    name: 'Org Mode',
    url: 'https://orgmode.org/'
  },
  {
    name: 'TiddlyWiki',
    url: 'https://tiddlywiki.com/'
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
      ...tags?.reduce((p, c) => ({ ...p, [c]: null }), {})
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
        ...(app.tags?.map((t) => [app.name, t] as const) ?? [])
      ] as EdgeTuple[],
    []
  )
]

type NodeTuple = [string, { label: string }]

const nodeData: NodeTuple[] = [
  'tag',
  'app',
  ...tags,
  ...apps.map(({ name }) => name)
].map((name) => [name, { label: name, width: 20, height: 10 }])

const graph = initGraph({
  acyclicer: 'greedy',
  ranker: 'longest-path', //'network-simplex', //'tight-tree',
  rankdir: 'RL',
  align: 'DR',
  edgesep: 10,
  nodesep: 10,
  ranksep: 100
})

graph.setNodes(...nodeData)
graph.setEdges(...edgeData)
const nodes = graph.getNodes().filter((node) => !!node)
const edges = graph.getEdges()

graph.updateLayout()

const geom = new THREE.BufferGeometry().setFromPoints(
  nodes.map(({ x, y }) => new THREE.Vector2(x, y))
)
geom.computeBoundingBox()
const size = new THREE.Vector3()

geom.boundingBox.getSize(size)

const { x, y, z } = size

const Component = (props) => {
  const box3 = React.useMemo(() => {
    const { width, height } = graph.graph.graph()

    const box3 = new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(),
      new THREE.Vector3(width, height, 0)
    )

    return box3
  }, [])

  useFitCamera({ object: box3 })
  return (
    <group
      {...{
        position: [x / 2, y / -2, z / 2]
        // onUpdate: (node: THREE.Group) => {
        //   if (node) {
        //     const size = new THREE.Vector3()
        //     new THREE.Box3().setFromObject(node).getSize(size)
        //     // node.position.set(min.x, min.y, min.z)
        //     console.log('NODE', size)
        //   }
        // }
      }}
    >
      <Nodes {...{ nodes }} />
      {nodes.map(({ label, x, y }) => (
        <Text
          {...{
            position: [x, y, 0],
            color: 'red',
            fontSize: 10,
            key: label,
            textAlign: 'left',
            anchorX: 'left'
          }}
        >
          {label}
        </Text>
      ))}
      {edges.map((edge, key) => {
        const points = createBezier({
          s1: edge.points[0],
          t1: edge.points[2]
        })
        // const points = edge.points.map(toVector3)
        // console.log(edge.points, points)
        return <Edge {...{ points, lineWidth: 0.2, key }} />
      })}
      <axesHelper {...{ args: [1000] }} />
    </group>
  )
}

const Template = (args) => <Component {...args} />

export const DefaultStory = Template.bind({})
DefaultStory.story = { name: 'Default' }
