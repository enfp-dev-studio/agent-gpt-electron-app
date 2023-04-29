import { Provider, useAtom } from 'jotai'
import Home from './pages/Home'
import Agent from './pages/Agent'
import { routeAtom } from './utils/routes'

const Router = () => {
  const [routeState] = useAtom(routeAtom)

  switch (routeState.route) {
    case 'home':
      return <Home />
    case 'agent':
      return <Agent id={routeState.params?.id} />
    default:
      return <div>Not Found</div>
  }
}

const App = () => {
  return (
    <Provider>
      <Router />
    </Provider>
  )
}

export default App
