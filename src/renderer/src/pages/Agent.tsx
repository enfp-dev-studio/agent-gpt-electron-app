import DefaultLayout from '../layout/default'
import Button from '../components/Button'

import { useEffect, useState } from 'react'
import ChatWindow from '../components/ChatWindow'
import type { Message } from '../types/agentTypes'
import Toast from '../components/toast'
import { FaTrash, FaBackspace } from 'react-icons/fa'
import { useAgent } from '@renderer/hooks/useAgent'
import { Agent } from '@renderer/db/db'
import { routeAtom } from '@renderer/utils/routes'
import { useAtom } from 'jotai'

const AgentPage = (props: { id: string | undefined }) => {
  const agentId = props?.id ? parseInt(props.id) : 0
  const [, setRouteState] = useAtom(routeAtom)
  const [showCopied, setShowCopied] = useState(false)
  const [agentData, setAgentData] = useState<Agent>()
  const { deleteAgentById, findAgentById } = useAgent()

  useEffect(() => {
    if (!agentId) {
      setRouteState({
        route: 'home',
        params: {}
      })
    }
    const getAgent = async () => {
      const agent = await findAgentById(agentId)
      setAgentData(agent)
    }
    getAgent()
  }, [agentId])

  const messages = agentData ? (agentData.tasks as Message[]) : []

  const deleteAgent = async () => {
    await deleteAgentById(agentId)
    setRouteState({
      route: 'home',
      params: {}
    })
  }

  //   const shareLink = () => {
  //     return encodeURI(`${env.NEXT_PUBLIC_VERCEL_URL as string}${router.asPath}`)
  //   }

  return (
    <DefaultLayout
      className="flex w-full flex-col items-center justify-center gap-4 p-2 sm:p-4"
      centered
    >
      <ChatWindow
        messages={messages}
        title={agentData?.name}
        showDonation={false}
        className="min-h-[80vh] md:w-[80%]"
        fullscreen
      />
      <div className="flex flex-row gap-2">
        {/* <Button
          icon={<FaShare />}
          onClick={() => {
            void window.navigator.clipboard.writeText(shareLink()).then(() => setShowCopied(true))
          }}
          enabledClassName={'bg-green-600 hover:bg-green-400'}
        >
          Share
        </Button> */}
        <Button
          icon={<FaTrash />}
          onClick={deleteAgent}
          enabledClassName={'bg-red-600 hover:bg-red-400'}
        >
          Delete
        </Button>
        <Button
          icon={<FaBackspace />}
          onClick={() => {
            setRouteState({
              route: 'home',
              params: {}
            })
          }}
        >
          Back
        </Button>
      </div>
      <Toast
        model={[showCopied, setShowCopied]}
        title="Copied to clipboard! 🚀"
        className="bg-gray-950 text-sm"
      />
    </DefaultLayout>
  )
}

export default AgentPage
