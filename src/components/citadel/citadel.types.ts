export type AgentId = 'scout' | 'strategist' | 'writer' | 'architect' | 'teamBuilder'

export interface Zone {
  id: string
  label: string
  x: number
  y: number
  width: number
  height: number
  color: number
}

export interface AgentState {
  id: AgentId
  name: string
  color: string
  currentZone: string
  statusMessage: string
}
