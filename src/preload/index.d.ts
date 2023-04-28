import { ElectronAPI } from '@electron-toolkit/preload'
import { Agent } from '@prisma/client'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      saveAgent: (data: { name: string; goal: string; tasks: MessageType[] }) => Promise<void>
      getAllAgents: () => Promise<Agent[]>
      saveUserKey: (key: string) => Promise<void>
      getUserKey: () => Promise<string>
    }
  }
}
