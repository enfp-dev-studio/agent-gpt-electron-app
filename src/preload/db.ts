import { is } from '@electron-toolkit/utils'
import { PrismaClient } from '@prisma/client'
import { MessageType } from '.'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: is.dev ? ['query', 'error', 'warn'] : ['error']
  })

if (!is.dev) globalForPrisma.prisma = prisma

export const createAgent = async (input: { name: string; goal: string; tasks: MessageType[] }) => {
  const agent = await prisma.agent.create({
    data: {
      name: input.name,
      goal: input.goal
    }
  })

  const all = input.tasks.map((e, i) => {
    return prisma.agentTask.create({
      data: {
        agentId: agent.id,
        type: e.type,
        info: e.info,
        value: e.value,
        sort: i
      }
    })
  })

  await Promise.all(all)
  return agent
}

export const getAllAgents = async () => {
  return prisma.agent.findMany({
    where: {
      deleteDate: null
    },
    orderBy: { createDate: 'desc' },
    take: 20
  })
}

export const findAgentById = async (id: string) => {
  const agent = await prisma.agent.findFirstOrThrow({
    where: { id, deleteDate: null },
    include: {
      tasks: {
        orderBy: {
          sort: 'asc'
        }
      }
    }
  })

  return {
    ...agent
  }
}

export const deleteAgentById = async (id: string) => {
  await prisma.agent.updateMany({
    where: { id },
    data: {
      deleteDate: new Date()
    }
  })
}