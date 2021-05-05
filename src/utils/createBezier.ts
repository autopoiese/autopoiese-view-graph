import * as THREE from 'three'
import { Vector3, Vector2 } from '../types'

const HORIZONTAL = 'horizontal'
const VERTICAL = 'vertical'

export const createBezier = ({
  s1,
  t1,
  divisions = 64,
  orientation = HORIZONTAL
}): Vector3[] => {
  const offset =
    (orientation === HORIZONTAL ? t1[0] - s1[0] : t1[1] - s1[1]) / 2
  const [s2, t2]: Vector2[] = ([
    [s1, 1],
    [t1, -1]
  ] as [Vector3, number][]).map(([v, f]: [Vector3, number]) =>
    orientation === HORIZONTAL
      ? [v[0] + f * offset, v[1]]
      : [v[0], v[1] + f * offset]
  )
  const points = ([s1, s2, t2, t1] as const).map(
    ([x, y]) => new THREE.Vector2(x, y)
  ) as ConstructorParameters<typeof THREE.CubicBezierCurve>
  const curve = new THREE.CubicBezierCurve(...points)
  return curve.getPoints(divisions).map(({ x, y }) => [x, y, 0] as Vector3)
}
