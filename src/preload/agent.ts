import { MessageType } from '.';
import { prisma } from './db'

const create = async (input: { name: string; goal: string; tasks: MessageType[] }) => {
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

const getAll = async () => {
  return prisma.agent.findMany({
    where: {
      deleteDate: null
    },
    orderBy: { createDate: 'desc' },
    take: 20
  })
}

const findById = async (id: string) => {
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

const deleteById = async (id: string) => {
  await prisma.agent.updateMany({
    where: { id },
    data: {
      deleteDate: new Date()
    }
  })
}

export const agent = {
  create,
  getAll,
  findById,
  deleteById
}
