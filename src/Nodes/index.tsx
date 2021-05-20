import * as React from 'react'
import * as THREE from 'three'
import { animated, useSpring } from '@react-spring/three'
import mergeRefs from 'react-merge-refs'

const matrix4 = new THREE.Matrix4()

type NodeInstancesProps = {
  nodes
}

const c1 = new THREE.CircleBufferGeometry(2, 32)

type NodesProperty = (
  | { [key in 'x' | 'y' | 'z']?: number }
  | ([number] | [number, number] | [number, number, number])
)[]

type NodesProps = {
  nodes: NodesProperty
  maxInstances?: number
  geometry?: THREE.BufferGeometry
}

export const Nodes: React.FC<NodesProps> = ({
  nodes,
  maxInstances = 1000,
  geometry = new THREE.CircleBufferGeometry(2, 32)
}) => {
  const instancedMesh = React.useRef<THREE.InstancedMesh>()
  const instanceMatrix = React.useRef<THREE.InstancedMesh['instanceMatrix']>()
  React.useLayoutEffect(() => {
    if (instancedMesh.current) {
      ;[instancedMesh].forEach((mesh) => {
        mesh.current.instanceMatrix = instanceMatrix.current
        mesh.current.count = nodes.length
        mesh.current?.updateMatrix()
      })
    }
  }, [nodes.length])
  const spring = useSpring({
    ...nodes
      .map((node) => {
        return matrix4
          .setPosition(
            node?.x || node?.[0] || 0,
            node?.y || node?.[1] || 0,
            node?.z || node?.[2] || 0
          )
          .toArray()
      })
      .flat()
      .reduce(
        (prev, value, index) => ({ ...prev, [`array-${index}`]: value }),
        {}
      ),
    onChange: () => {
      if (instanceMatrix.current) instanceMatrix.current.needsUpdate = true
    }
  })
  return (
    <>
      <animated.bufferAttribute
        {...{
          ref: instanceMatrix,
          array: new Float32Array(maxInstances * 16),
          count: maxInstances,
          itemSize: 16,
          usage: THREE.DynamicDrawUsage,
          ...spring
        }}
      />
      <instancedMesh
        {...{
          geometry,
          ref: instancedMesh,
          args: [null as any, null as any, maxInstances]
        }}
      >
        <meshBasicMaterial {...{ color: 'red', side: THREE.DoubleSide }} />
      </instancedMesh>
      {/* <instancedMesh
        {...{
          geometry,
          ref: instancedMesh2,
          args: [null as any, null as any, maxInstances]
        }}
      >
        <meshBasicMaterial
          {...{ color: 'yellow', opacity: 0.5, transparent: true }}
        />
      </instancedMesh> */}
    </>
  )
}

type PointNodesProps = {
  nodes: NodesProperty
}

const PointNodes = React.forwardRef<any, PointNodesProps>(({ nodes }, ref) => {
  const points = React.useRef<THREE.Mesh>()
  const positionAttribute = React.useRef<THREE.BufferAttribute>()
  const array = React.useMemo(
    () => new Float32Array(Math.max(nodes.length, 1000) * 3),
    [nodes.length]
  )
  React.useLayoutEffect(() => {
    if (positionAttribute.current) {
      positionAttribute.current.count = nodes.length
      points.current.updateMatrix()
    }
  }, [nodes.length])
  const spring = useSpring({
    ...nodes
      .map((node) => [
        node?.x || node?.[0] || 0,
        node?.y || node?.[1] || 0,
        node?.z || node?.[2] || 0
      ])
      .flat()
      .reduce(
        (prev, value, index) => ({ ...prev, [`array-${index}`]: value }),
        {}
      ),
    onChange: () => {
      if (positionAttribute.current)
        positionAttribute.current.needsUpdate = true
    }
  })
  return (
    <points {...{ ref: mergeRefs([ref, points]) }}>
      <bufferGeometry>
        <animated.bufferAttribute
          {...{
            array,
            ...spring,
            ref: positionAttribute,
            itemSize: 3,
            count: Math.max(nodes.length, 1000),
            attachObject: ['attributes', 'position']
          }}
        />
      </bufferGeometry>
      <animated.pointsMaterial {...{ color: 'red', size: 5 }} />
    </points>
  )
})

export { PointNodes }
