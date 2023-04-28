import type { Message } from '../types/agentTypes'

export interface SaveProps {
  name: string
  goal: string
  tasks: Message[]
}

export function useAgent() {
  const saveAgent = (data: SaveProps) => {
    window.api.saveAgent(data)
  }

  return {
    saveAgent
  }
}
