import * as React from 'react'
import { Meta } from '@storybook/react'
import { Collection } from './index'
import { v4 as uuid } from 'uuid'
import { Setup } from '@autopoiese/stories'

export default {
  title: 'View/Graph/components/Collection',
  component: Collection,
  decorators: [
    (Story) => (
      <Setup
        {...{
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

const { floor, max, random } = Math

const randomChildren = (depth = 1) =>
  depth < 4
    ? Array.from({ length: max(3, floor(random() * 20)) }).map(() => {
        const id = uuid()
        return (
          <Collection
            {...{
              key: id,
              value: floor(random() * 10),
              id,
              children: randomChildren(depth + 1)
            }}
          />
        )
      })
    : []

const Template = (args) => {
  return (
    <Collection {...{ value: 2, id: uuid(), children: randomChildren() }} />
  )
}

export const DefaultStory = Template.bind({})
DefaultStory.story = { name: 'Pack' }
