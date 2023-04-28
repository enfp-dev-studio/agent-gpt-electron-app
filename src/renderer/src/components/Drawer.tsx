import React, { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { FaBars, FaCog, FaGithub, FaQuestionCircle, FaRobot } from 'react-icons/fa'
import clsx from 'clsx'

const Drawer = ({ showHelp, showSettings }: { showHelp: () => void; showSettings: () => void }) => {
  const [agents, setAgents] = useState<any[]>([])
  const [showDrawer, setShowDrawer] = useState(false)
  const [, navigate] = useLocation()

  const toggleDrawer = () => {
    setShowDrawer((prevState) => !prevState)
  }

  useEffect(() => {
    const getAgents = async () => {
      console.log(window.electron)
      const agents = await window.api.getAllAgents()
      setAgents(agents)
    }
    getAgents()
  }, [])

  return (
    <>
      <button
        hidden={showDrawer}
        className="fixed left-2 top-2 z-40 rounded-md border-2 border-white/20 bg-zinc-900 p-2 text-white hover:bg-zinc-700 md:hidden"
        onClick={toggleDrawer}
      >
        <FaBars />
      </button>
      <div
        id="drawer"
        className={clsx(
          showDrawer ? 'translate-x-0' : '-translate-x-full',
          'z-30 m-0 h-screen w-72 flex-col justify-between bg-zinc-900 p-3 font-mono text-white shadow-3xl transition-all',
          'fixed top-0 md:sticky',
          'flex md:translate-x-0'
        )}
      >
        <div className="flex flex-col gap-1 overflow-hidden">
          <div className="mb-2 flex justify-center gap-2">
            My Agent(s)
            <button
              className="z-40 rounded-md border-2 border-white/20 bg-zinc-900 p-2 text-white hover:bg-zinc-700 md:hidden"
              onClick={toggleDrawer}
            >
              <FaBars />
            </button>
          </div>
          <ul className="flex flex-col gap-2 overflow-auto">
            {agents.map((agent, index) => (
              <DrawerItem
                key={index}
                icon={<FaRobot />}
                text={agent.name}
                className="w-full"
                onClick={() => void navigate(`/agent?id=${agent.id}`)}
              />
            ))}

            {status === 'unauthenticated' && (
              <div>Sign in to be able to save agents and manage your account!</div>
            )}
            {status === 'authenticated' && agents.length === 0 && (
              <div>You need to create and save your first agent before anything shows up here!</div>
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-1">
          <hr className="my-2 border-gray-600/10" />
          <DrawerItem icon={<FaQuestionCircle />} text="Help" onClick={showHelp} />
          <DrawerItem icon={<FaCog />} text="Settings" onClick={showSettings} />
          <DrawerItem
            icon={<FaGithub />}
            text="GitHub"
            href="https://github.com/reworkd/AgentGPT"
            target="_blank"
          />
        </div>
      </div>
    </>
  )
}

interface DrawerItemProps
  extends Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target'> {
  icon: React.ReactNode
  text: string
  border?: boolean
  onClick?: () => any
  className?: string
  small?: boolean
}

const DrawerItem = (props: DrawerItemProps) => {
  const { icon, text, border, href, target, onClick, className } = props

  if (href) {
    return (
      <a
        className={clsx(
          'flex cursor-pointer flex-row items-center rounded-md rounded-md p-2 hover:bg-white/5',
          border && 'border-[1px] border-white/20',
          `${className || ''}`
        )}
        href={href}
        target={target ?? '_blank'}
      >
        {icon}
        {!props.small && <span className="text-md ml-4">{text}</span>}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={clsx(
        'flex cursor-pointer flex-row items-center rounded-md rounded-md p-2 hover:bg-white/5',
        border && 'border-[1px] border-white/20',
        `${className || ''}`
      )}
      onClick={onClick}
    >
      {icon}
      <span className="text-md ml-4">{text}</span>
    </button>
  )
}

export default Drawer
