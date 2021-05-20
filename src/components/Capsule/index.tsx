import * as React from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

type CapsuleProps = {
  radius?: number
}

const Capsule = React.forwardRef<THREE.Group, CapsuleProps>(
  ({ children, radius = 2, ...props }, ref) => {
    const [geometry, plane] = React.useMemo(() => {
      const geometry = new THREE.SphereBufferGeometry(radius, 64, 64)
      const plane = new THREE.Plane()
      plane.constant = 1
      return [geometry, plane]
    }, [])
    useFrame(({ camera }) => {
      const normal = new THREE.Vector3().applyMatrix4(camera.matrix)
      normal.normalize().negate().multiplyScalar(1.5)
      plane.normal.set(normal.x, normal.y, normal.z)
    })
    return (
      <group {...{ ref }}>
        {[
          { side: THREE.DoubleSide, color: 'green' },
          { side: THREE.BackSide, color: 'red', scale: 0.95 }
        ].map(({ side, scale = 1, color }, key) => (
          <mesh {...{ key, geometry, scale: [scale, scale, scale] }}>
            <meshPhongMaterial
              {...{
                side,
                attach: 'material',
                color,
                clippingPlanes: [plane],
                transparent: false
                // opacity: 0.5
              }}
            />
          </mesh>
        ))}
        {children}
      </group>
    )
  }
)

export { Capsule }
