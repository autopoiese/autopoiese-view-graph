import { ReactThreeFiber } from '@react-three/fiber'
import * as THREE from 'three'

export type Vector3 = Exclude<ReactThreeFiber.Vector3, number>
export type Vector2 = Exclude<ReactThreeFiber.Vector2, number>
export type Vector = Vector3 | Vector2
