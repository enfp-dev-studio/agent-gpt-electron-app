import Dexie, { Table } from 'dexie'

export interface Agent {
  id?: number
  name: string
  goal: string
  deleteDate?: Date
  createDate: Date
  tasks?: AgentTask[]
}

export interface AgentTask {
  id?: number
  agentId: number
  type: string
  value: string
  info?: string
  sort: number
  deleteDate?: Date
  createDate: Date
}

export class AgentGPTDatabase extends Dexie {
  agents!: Table<Agent, number>
  agentTasks!: Table<AgentTask, number>

  constructor() {
    super('AgentGPTDatabase')
    this.version(1).stores({
      agents: '++id, name, goal, deleteDate, createDate',
      agentTasks: '++id, agentId, type, value, info, sort, deleteDate, createDate'
    })

    this.agents = this.table('agents')
    this.agentTasks = this.table('agentTasks')
  }
}

export const db = new AgentGPTDatabase()
