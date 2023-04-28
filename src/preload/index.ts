import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { agent } from './agent'
import { getUserKey, saveUserKey } from './keytar'

export type MessageType = {
  type: 'goal' | 'thinking' | 'task' | 'action' | 'system'
  info?: string
  value: string
}

// Custom APIs for renderer
const api = {
  saveAgent: async (name, goal, tasks) => {
    return agent.create({ name, goal, tasks })
  },
  getAllAgents: async () => {
    return agent.getAll()
  },
  saveUserKey: async (key: string) => {
    return saveUserKey(key)
  },
  getUserKey: async () => {
    return getUserKey()
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
