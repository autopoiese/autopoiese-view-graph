import * as THREE from 'three'
import { Vector } from '../types'

export const toArray = (v: Vector) =>
  [
    ...(Array.isArray(v) ? v : [v.x, v.y, (v as THREE.Vector3).z || 0]),
    0,
    0
  ].slice(0, 3)
