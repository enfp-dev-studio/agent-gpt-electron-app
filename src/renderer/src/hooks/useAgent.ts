import { db } from '@renderer/db/db'
import type { Message } from '../types/agentTypes'
import { liveQuery } from 'dexie'
interface MessageType {
  type: string
  info?: string
  value: string
}

const saveAgent = async (input: { name: string; goal: string; tasks: MessageType[] }) => {
  const agentId = await db.agents.add({
    name: input.name,
    goal: input.goal,
    createDate: new Date()
  })

  const all = input.tasks.map((e, i) => {
    return db.agentTasks.add({
      agentId,
      type: e.type,
      info: e.info,
      value: e.value,
      sort: i,
      createDate: new Date()
    })
  })

  await Promise.all(all)
  return agentId
}

const allAgentsObservable = liveQuery(
  async () => await db.agents.filter((e) => !e.deleteDate).toArray()
)

const findAgentById = async (id: number) => {
  const agent = await db.agents.get({ id })
  if (!agent || agent.deleteDate) {
    throw new Error('Agent not found')
  }

  const tasks = await db.agentTasks.where('agentId').equals(id).sortBy('sort')

  return { ...agent, tasks }
}

const deleteAgentById = async (id: number) => {
  await db.agents.update(id, { deleteDate: new Date() })
}

export interface SaveProps {
  name: string
  goal: string
  tasks: Message[]
}

export function useAgent() {
  return {
    saveAgent,
    allAgentsObservable,
    findAgentById,
    deleteAgentById
  }
}
