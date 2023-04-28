import { contextBridge, ipcMain, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { getUserKey, saveUserKey } from './keytar'

export type MessageType = {
  type: 'goal' | 'thinking' | 'task' | 'action' | 'system'
  info?: string
  value: string
}

// Custom APIs for renderer
const api = {
  saveAgent: async (name: string, goal: string, tasks: MessageType[]) => {
    return ipcRenderer.invoke('save-agent', name, goal, tasks)
  },
  getAllAgents: async () => {
    return ipcRenderer.invoke('get-all-agents')
  },
  saveUserKey: async (key: string) => {
    return saveUserKey(key)
  },
  getUserKey: async () => {
    return getUserKey()
  }
}

console.log('preload')
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
