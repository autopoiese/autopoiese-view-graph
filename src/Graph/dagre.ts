import { spawn, Worker } from 'threads'

let dagreWorker

export const getWorker = async () => {
  if (!dagreWorker) {
    dagreWorker = await spawn(new Worker('./dagreWorker'))
  }
  return dagreWorker
}
