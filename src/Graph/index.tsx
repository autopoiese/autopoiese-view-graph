import * as React from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { spawn, Thread, Worker } from 'threads'

const Graph = (props) => {
  const worker = React.useRef<any>()
  const [geometry, setGeometry] = React.useState(null)
  React.useEffect(() => {
    const loadWorker = async () => {
      worker.current = await spawn(new Worker('./dagreWorker.ts'))
      worker.current.nodes().subscribe((data) => console.log(data))
      const nodes = await worker.current.getNodes()
      const vertices = []
      const geometry = new THREE.BufferGeometry()
      nodes.forEach((node) => vertices.push(node.x, node.y, 0))
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3)
      )
      setGeometry(geometry)
      console.log(geometry)
    }
    loadWorker()
    return () => Thread.terminate(worker.current)
  }, [])
  return (
    <Canvas
      {...{
        style: { width: '100%', height: 600, background: 'grey' },
        orthographic: true,
        colorManagement: true,
        concurrent: true,
        camera: { near: -10000, far: 10000, position: [500, 500, 2000] }
      }}
    >
      {geometry ? (
        <points {...{ geometry, onClick: (e) => console.log(e) }}>
          <pointsMaterial {...{ color: 'red', size: 20 }} />
        </points>
      ) : null}
      <OrbitControls />
    </Canvas>
  )
}

export { Graph, Graph as default }
