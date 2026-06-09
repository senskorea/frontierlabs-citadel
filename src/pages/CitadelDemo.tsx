import { useState, useCallback } from 'react'
import { CitadelCanvas } from '../components/citadel/CitadelCanvas'
import { AgentStatusPanel } from '../components/citadel/AgentStatusPanel'
import type { AgentId, AgentState } from '../components/citadel/citadel.types'

const INITIAL_AGENTS: AgentState[] = [
  { id: 'scout',       name: 'The Scout',        color: '#3B82F6', currentZone: 'THE LIBRARY',    statusMessage: '' },
  { id: 'strategist',  name: 'The Strategist',   color: '#10B981', currentZone: 'WAR ROOM',       statusMessage: '' },
  { id: 'writer',      name: 'The Writer',       color: '#F59E0B', currentZone: 'WRITING DESK',   statusMessage: '' },
  { id: 'architect',   name: 'The Architect',    color: '#8B5CF6', currentZone: 'WAR ROOM',       statusMessage: '' },
  { id: 'teamBuilder', name: 'The Team Builder', color: '#EF4444', currentZone: 'BUREAU COMMONS', statusMessage: '' },
]

const AGENT_ORDER: AgentId[] = ['scout', 'strategist', 'writer', 'architect', 'teamBuilder']

export function CitadelDemo() {
  const [agents, setAgents] = useState<AgentState[]>(INITIAL_AGENTS)

  const handleStateChange = useCallback((incoming: AgentState[]) => {
    setAgents(prev => {
      const map = new Map(incoming.map(a => [a.id, a]))
      return prev.map(a => map.has(a.id) ? { ...a, currentZone: map.get(a.id)!.currentZone } : a)
    })
  }, [])

  const ordered = AGENT_ORDER.map(id => agents.find(a => a.id === id)!)

  return (
    <div className="flex h-screen bg-stone-50 text-stone-900 overflow-hidden">
      <div className="w-[70%] flex items-center justify-center bg-stone-50 p-4">
        <CitadelCanvas onAgentStateChange={handleStateChange} />
      </div>
      <div className="w-[30%] border-l border-stone-300">
        <AgentStatusPanel agents={ordered} />
      </div>
    </div>
  )
}
