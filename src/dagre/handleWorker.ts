/// <reference types="react/experimental" />
import * as React from 'react'
import { Worker, Thread, ModuleThread } from 'threads'
import { spawn } from '@autopoiese/worker'
import { GraphWorker } from './worker'
import create from 'zustand'
import { graphlib } from 'dagre'

type DagreWorker = ModuleThread<GraphWorker>

let dagreWorker: DagreWorker = spawn<GraphWorker>(
  new Worker('./dagreWorker', { type: 'module' })
)

export const getWorker = async () => {
  if (!dagreWorker) {
    dagreWorker = await spawn<GraphWorker>(new Worker('./dagreWorker'))
  }
  return dagreWorker
}



// export const useDagre = () => {
//   // memoise a worker so it can be reused; create one worker up front
//   // and then reuse it subsequently; no creating new workers each time
//   const worker = React.useMemo(() => getWorker(), [])
//   const cleanup = () =>
//     worker.then((w) => {
//       Thread.terminate(w)
//     })
//   React.useLayoutEffect(() => {
//     getWorker().then()
//     // cleanup our worker when we're done with it
//     return () => {
//       cleanup()
//     }
//   }, [worker])

//   return { worker, cleanup }
// }

// type DagreChild = React.FC<{ edges; nodes }>

// const Dagre = React.forwardRef<DagreWorker, { children: DagreChild }>(
//   ({ children }, ref) => {
//     console.log('START', dagreWorker)
//     // const [startTransition, isPending] = React.unstable_useTransition({
//     //   timeoutMs: 1000
//     // })
//     // React.unstable_useTransition()
//     const graphData = React.useRef<{ edges; nodes }>()
//     const values = dagreWorker.values?.()
//     React.useEffect(() => {
//       const subscription = values?.subscribe((value) => {
//         console.log('SU')
//         graphData.current = value
//       })
//       return subscription?.unsubscribe
//     }, [])
//     return (
//       <>
//         {values}
//         {children}
//       </>
//     )
//   }
// )

// type DagreProviderProps = {
//   children: DagreChild
//   fallback?: React.SuspenseProps['fallback']
// }

// export const DagreProvider = React.forwardRef<DagreWorker, DagreProviderProps>(
//   ({ children, fallback = null }, ref) => {
//     return (
//       <React.Suspense {...{ fallback }}>
//         <Dagre {...{ ref }}>{children}</Dagre>
//       </React.Suspense>
//     )
//   }
// )
