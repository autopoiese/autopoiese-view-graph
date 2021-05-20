import * as React from 'react'
import * as THREE from 'three'
import { Detailed, Sphere, Line } from '@react-three/drei'
import { pack as d3pack, hierarchy } from 'd3-hierarchy'

const pack = d3pack<any>()

type Node = { id: string }

type SharedProps = {
  size: number
}

const materialProps = {
  attach: 'material',
  color: 'red'
}

type CollectionChild = React.ReactElement<{ value: number }>

export type CollectionProps = Partial<SharedProps> &
  Node & {
    children: CollectionChild[]
  }

export const Collection = React.forwardRef<THREE.Group, CollectionProps>(
  ({ children, size = 1, id }, ref) => {
    const [, ...packedChildren] = React.useMemo(() => {
      const childrenArray = React.Children.toArray(
        children
      ) as CollectionChild[]
      pack.size([size, size])
      pack.padding(size / 10)
      const data = hierarchy<{
        name: string
        children: CollectionChild[]
        props?: { value: number }
      }>({
        name: id,
        children: childrenArray
      }).sum((d) => d?.props?.value)
      // .sort((a, b) => b?.props?.value - a?.props?.value)
      const packedData = pack(data)
      return packedData.descendants()
    }, [children, size, id])
    const childrenGroup = React.useRef<THREE.Group>()
    return (
      <React.Fragment>
        <Detailed
          {...({ distances: [1, 100, 1000].map((n) => size / n) } as any)}
        >
          <React.Fragment />
          <Sphere {...({ args: [size] } as any)}>
            <meshBasicMaterial {...materialProps} />
          </Sphere>
          <Circle {...({ args: [size, 32] } as any)}>
            <meshBasicMaterial {...materialProps} />
          </Circle>
        </Detailed>

        <group {...{ ref: childrenGroup, position: [-size / 2, -size / 2, 0] }}>
          {packedChildren?.map(
            (child, key) =>
              child?.r > 0 && (
                <group
                  {...{
                    key: child?.props?.name || key,
                    position: [child.x, child.y, 0]
                  }}
                >
                  <child.data.type
                    {...{ ...child.data.props, size: child.r }}
                  />
                </group>
              )
          )}
        </group>
      </React.Fragment>
    )
  }
)

type CircleProps = {
  args: [number, number, number]
}

const Circle = React.forwardRef<typeof Line, CircleProps>(
  ({ args: [radius, segments] = [1, 32] }, ref) => {
    const points = React.useMemo(() => {
      const shape = new THREE.Shape()
        .moveTo(-radius, -radius)
        .absellipse(-radius, -radius, radius, radius, 0, Math.PI * 2, false, 0)

      return shape.getPoints(segments).map(({ x, y }) => [x, y, 0])
    }, [])

    return <Line {...{ points, color: 'red', position: [radius, radius, 0] }} />
  }
)
