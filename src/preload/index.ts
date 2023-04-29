import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { getUserKey, saveUserKey } from './keytar'

export type MessageType = {
  type: 'goal' | 'thinking' | 'task' | 'action' | 'system'
  info?: string
  value: string
}

// Custom APIs for renderer
const api = {
  saveUserKey: async (key: string) => {
    return saveUserKey(key)
  },
  getUserKey: async () => {
    return getUserKey()
  }
}

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
