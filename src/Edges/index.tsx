import * as React from 'react'
import * as THREE from 'three'
import { LineGeometry } from 'three-stdlib/lines/LineGeometry'
import { LineMaterial } from 'three-stdlib/lines/LineMaterial'
import { Line2 } from 'three-stdlib/lines/Line2'
import { animated, useSpring } from '@react-spring/three'
import { convertPosition } from './convertPosition'
import { Vector } from '../types'

const toSpringObject = (array) =>
  array.reduce(
    (prev, point, index) => ({
      ...prev,
      [`array-${index}`]: point
    }),
    {}
  )

const toArray = (v: Vector) =>
  [...(Array.isArray(v) ? v : [v.x, v.y, v.z || 0]), 0, 0, 0].slice(0, 3)

type EdgeProps = {
  color?: string
  points: (
    | { x: number; y: number; z?: number }
    | [number, number]
    | [number, number, number]
  )[]
  vertexColors?: number[] | Float32Array
  dashed?: boolean
  lineWidth?: number
}

export const Edge = React.forwardRef<any, EdgeProps>(
  (
    {
      color = 'red',
      vertexColors,
      points = [
        [0, 0, 0],
        [1, 1, 1],
        [2, 2, 2]
      ],
      dashed,
      lineWidth = 1,
      ...rest
    },
    ref
  ) => {
    const [line2] = React.useState(() => new Line2())
    const [lineGeometry] = React.useState(() => new LineGeometry())
    const [lineMaterial] = React.useState(() => new LineMaterial())
    const [resolution] = React.useState(() => new THREE.Vector2(512, 512))
    const buffer = React.useRef<THREE.InstancedInterleavedBuffer>()
    React.useEffect(() => {
      lineMaterial.linewidth = lineWidth
      lineMaterial.side = THREE.DoubleSide
      lineMaterial.needsUpdate = true
    }, [lineWidth])
    const { object, array } = React.useMemo(() => {
      const array = convertPosition(points)
      const InstancedInterleavedBuffer = new THREE.InstancedInterleavedBuffer(
        array,
        6,
        1
      )
      return { object: InstancedInterleavedBuffer, array }
    }, [])
    const spring = useSpring({
      from: toSpringObject(array),
      to: toSpringObject(convertPosition(points)),
      onChange: () => {
        if (!!buffer.current) {
          buffer.current.needsUpdate = true
        }
      }
    })
    React.useEffect(() => {
      const positions: number[] = points.map(toArray).flat()
      lineGeometry.setPositions(positions)
      if (vertexColors) lineGeometry.setColors(vertexColors?.flat?.())
      if (buffer.current) {
        ;(lineGeometry.attributes
          .instanceStart as THREE.InterleavedBufferAttribute).data =
          buffer.current
        ;(lineGeometry.attributes
          .instanceEnd as THREE.InterleavedBufferAttribute).data =
          buffer.current
      }
      line2.computeLineDistances()
    }, [vertexColors, line2, lineGeometry])
    React.useLayoutEffect(() => {
      if (dashed) {
        lineMaterial.defines.USE_DASH = ''
      } else {
        // Setting lineMaterial.defines.USE_DASH to undefined is apparently not sufficient.
        delete lineMaterial.defines.USE_DASH
      }
      lineMaterial.needsUpdate = true
    }, [dashed, lineMaterial])
    return (
      <primitive {...{ ref, object: line2 }}>
        <primitive {...{ object: lineGeometry, attach: 'geometry' }}>
          <animated.primitive {...{ ref: buffer, object, ...spring }} />
        </primitive>
        <primitive
          dispose={undefined}
          object={lineMaterial}
          attach="material"
          color={color}
          vertexColors={Boolean(vertexColors)}
          resolution={resolution}
          dashed={dashed}
          {...rest}
        />
      </primitive>
    )
  }
)

// export const Link: React.FC<LinkProps> = observer(({ link, ...props }) => {
//   //: { source, target, color = source?.type === 'Question' ? peach : green, lineWidth, ...link }, ...props }) => {

//   const ref = React.useRef<Line2>()
//   const s1x = link.points[0].x //link.source.node.x
//   const s1y = link.points[0].y //link.source.node.y
//   const t1x = link.points[2].x //link.target.node.x
//   const t1y = link.points[2].y // link.target.node.y
//   const toAnswer = link.type === 'QuestionToAnswer'

//   React.useEffect(() => {
//     if (ref.current) {
//       const points = createBezier({ s1: [s1x, s1y, 0], t1: [t1x, t1y, 0] }).flat()
//       ref.current.geometry.drawRange.count = Infinity

//       ref.current.geometry.setPositions(points)
//       ref.current.computeLineDistances()
//     }
//   }, [s1x, s1y, t1x, t1y, link])
//   return (
//     <AnimatedLine
//       {...{
//         ref,
//         points: initBezier,

//         // polygonOffset: true,
//         // polygonOffsetFactor: 1,
//         lineWidth: toAnswer ? 0.4 : 0.2, //lineWidth: link.lineWidth ?? 0.25, //sourceIsQuestion ? 0.25 : 0.5,
//         color: toAnswer ? '#03c0dc' : '#fd9b93',
//         ...props
//       }}
//     />
//   )
// })
