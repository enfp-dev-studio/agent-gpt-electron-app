import { atom } from 'jotai'

export type Route = 'home' | 'agent'

export interface RouteState {
  route: Route
  params: Record<string, string>
}

export const routeAtom = atom<RouteState>({
  route: 'home',
  params: {},
})
