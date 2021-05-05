import * as React from 'react'
import { Canvas, Props } from '@react-three/fiber'

const Provider = React.forwardRef<HTMLCanvasElement, Props>((props, ref) => {
  const canvasRef = React.useRef<HTMLCanvasElement>()
  React.useImperativeHandle(ref, () => canvasRef.current, [canvasRef])
  return (
    <Canvas
      {...{
        ...props,
        style: {
          width: '100vw',
          height: '100vh',
          ...props?.style
        },
        onCreated: (canvasContext) => {
          canvasRef.current = canvasContext.gl.domElement
          props.onCreated?.(canvasContext)
        }
      }}
    >
      {props.children}
    </Canvas>
  )
})

export { Provider, Provider as default }
