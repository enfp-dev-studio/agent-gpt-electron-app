import {
  createModel,
  startGoalPrompt,
  executeTaskPrompt,
  createTasksPrompt
} from '../utils/prompts'
import type { ModelSettings } from '../utils/types'
import { LLMChain } from 'langchain/chains'
import { extractTasks } from '../utils/helpers'

async function startGoalAgent(modelSettings: ModelSettings, goal: string) {
  const apiKey = await window.api.getUserKey()
  const completion = await new LLMChain({
    llm: createModel(modelSettings, apiKey),
    prompt: startGoalPrompt
  }).call({
    goal
  })
  console.log('Completion:' + (completion.text as string))
  return extractTasks(completion.text as string, [])
}

async function executeTaskAgent(modelSettings: ModelSettings, goal: string, task: string) {
  const apiKey = await window.api.getUserKey()
  const completion = await new LLMChain({
    llm: createModel(modelSettings, apiKey),
    prompt: executeTaskPrompt
  }).call({
    goal,
    task
  })

  return completion.text as string
}

async function createTasksAgent(
  modelSettings: ModelSettings,
  goal: string,
  tasks: string[],
  lastTask: string,
  result: string,
  completedTasks: string[] | undefined
) {
  const apiKey = await window.api.getUserKey()
  const completion = await new LLMChain({
    llm: createModel(modelSettings, apiKey),
    prompt: createTasksPrompt
  }).call({
    goal,
    tasks,
    lastTask,
    result
  })

  return extractTasks(completion.text as string, completedTasks || [])
}

export interface AgentService {
  startGoalAgent: (modelSettings: ModelSettings, goal: string) => Promise<string[]>
  executeTaskAgent: (modelSettings: ModelSettings, goal: string, task: string) => Promise<string>
  createTasksAgent: (
    modelSettings: ModelSettings,
    goal: string,
    tasks: string[],
    lastTask: string,
    result: string,
    completedTasks: string[] | undefined
  ) => Promise<string[]>
}

const OpenAIAgentService: AgentService = {
  startGoalAgent: startGoalAgent,
  executeTaskAgent: executeTaskAgent,
  createTasksAgent: createTasksAgent
}

const MockAgentService: AgentService = {
  startGoalAgent: async (modelSettings, goal) => {
    return await new Promise((resolve) => resolve(['Task 1']))
  },

  createTasksAgent: async (
    modelSettings: ModelSettings,
    goal: string,
    tasks: string[],
    lastTask: string,
    result: string,
    completedTasks: string[] | undefined
  ) => {
    return await new Promise((resolve) => resolve(['Task 4']))
  },

  executeTaskAgent: async (modelSettings: ModelSettings, goal: string, task: string) => {
    return await new Promise((resolve) => resolve('Result: ' + task))
  }
}

export default import.meta.env.VITE_FF_MOCK_MODE_ENABLED ? MockAgentService : OpenAIAgentService
