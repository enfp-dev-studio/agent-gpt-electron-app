import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      saveUserKey: (key: string) => Promise<void>
      getUserKey: () => Promise<string>
    }
  }
}
