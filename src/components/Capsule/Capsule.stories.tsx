import * as React from 'react'
import { Meta } from '@storybook/react'
import { Capsule } from './index'
import { v4 as uuid } from 'uuid'
import { Setup } from '@autopoiese/stories'
import { Octahedron } from '@react-three/drei'

export default {
  title: 'View/Graph/components/Capsule',
  component: Capsule,
  decorators: [
    (Story) => (
      <Setup
        {...{
          onCreated: (data) => {
            data.gl.localClippingEnabled = true
          },
          gl: { localClippingEnabled: true } as any,
          orthographic: false,
          controls: true,
          colorManagement: true,
          camera: { near: 0.01, far: 10000 },
          style: { width: '100%', minHeight: 600 }
        }}
      >
        <Story />
      </Setup>
    )
  ]
}

const Template = () => {
  return (
    <Capsule>
      <React.Fragment>
        {Array.from({ length: 10 }).map((_, key) => {
          const size = 0.15
          const position = Array.from({ length: 3 }).map(() => Math.random())
          return (
            <Octahedron
              {...({
                position,
                args: [size],
                castShadow: true,
                receiveShadow: true
              } as any)}
            >
              <meshPhongMaterial {...{ color: 'orange' }} />
            </Octahedron>
          )
        })}
        <ambientLight {...{}} />
      </React.Fragment>
    </Capsule>
  )
}

export const DefaultStory = Template.bind({})
DefaultStory.story = { name: 'Default' }
