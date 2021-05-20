import { Meta } from '@storybook/react'
import * as React from 'react'
import * as THREE from 'three'
import { Provider } from '../Provider'
import { Edge } from './index'
import { Nodes } from '../Nodes'
import { Sphere, Stats, Html } from '@react-three/drei'
import { createBezier } from '../utils/createBezier'
import { Setup } from '@autopoiese/stories'

export default {
  title: 'View/Graph/Edges',
  component: Edge,
  decorators: [
    (Story) => (
      <Setup
        {...{
          controls: true,
          orthographic: true,
          //         //colorManagement: true,
          //         //concurrent: true,
          camera: { near: -10000, far: 10000 }
          //         //style: { width: '100%', height: 600 }
        }}
      >
        {Story()}
      </Setup>
    )
  ]
} as Meta

const p = () => Math.floor(Math.random() * 100 * (Math.random() > 0.5 ? -1 : 1))

const generateBezier = () =>
  createBezier({ s1: [p(), p(), 0], t1: [p(), p(), 0] })

const Template = ({ node1 = { x: -5, y: 0 }, node2 = { x: 5, y: 0 } }) => {
  const [points, setPoints] = React.useState(generateBezier())
  const [geometry] = React.useState(() => new THREE.CircleBufferGeometry(5, 32))
  React.useEffect(() => {
    setTimeout(() => {
      console.log('timeout', points)
      setPoints(generateBezier())
    }, 1000)
  })

  return (
    <React.Fragment>
      <Stats />
      {/* <Sphere /> */}
      <Nodes {...{ nodes: [points[0], points[points.length - 1]], geometry }} />
      <Edge {...{ points }} />
    </React.Fragment>
  )
}
export const EdgeStory = Template.bind({})
EdgeStory.story = { name: 'Default' }

// ;<Canvas>
//   <Story name="Animated Edge">
//     <Setup
//       {...{
//         controls: true
//         //orthographic: true,
//         //colorManagement: true,
//         //concurrent: true,
//         //camera: { near: -10000, far: 10000 },
//         //style: { width: '100%', height: 600 }
//       }}
//     >
//       <EdgeStory />
//     </Setup>
//   </Story>
// </Canvas>
