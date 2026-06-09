import { useEffect, useState } from 'react'
import type { AgentId, AgentState } from './citadel.types'

const AGENT_MESSAGES: Record<AgentId, string[]> = {
  scout: [
    'Scanning EU funding database...',
    'Scoring 12 calls for fit...',
    'Match found: HE-2025-CL4',
    'Filtering by TRL threshold...',
  ],
  strategist: [
    'Analysing TRL gap...',
    'Building narrative arc...',
    'Framing innovation angle...',
    'Locking primary objective...',
  ],
  writer: [
    'Drafting Section 1.1 Excellence...',
    'Checking evidence feed...',
    'Revising impact statement...',
    'Removing unsourced claims...',
  ],
  architect: [
    'Calculating budget envelope...',
    'Mapping work packages...',
    'Enforcing overhead cap (25%)...',
    'Aligning WP2 to TRL 7 target...',
  ],
  teamBuilder: [
    'Verifying LMIC eligibility...',
    'Inviting partner: RWTH Aachen...',
    'Validating geopolitical rules...',
    'Consortium lock confirmed ✓',
  ],
}

interface Props {
  agents: AgentState[]
}

export function AgentStatusPanel({ agents }: Props) {
  const [msgIndexes, setMsgIndexes] = useState<Record<AgentId, number>>({
    scout: 0, strategist: 0, writer: 0, architect: 0, teamBuilder: 0,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndexes(prev => {
        const next = { ...prev }
        for (const id of Object.keys(AGENT_MESSAGES) as AgentId[]) {
          next[id] = (prev[id] + 1) % AGENT_MESSAGES[id].length
        }
        return next
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col gap-3 p-4 h-full overflow-y-auto bg-stone-100">
      <h2 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Agent Activity</h2>
      {agents.map(agent => (
        <div key={agent.id} className="rounded-lg border border-stone-200 bg-stone-50 p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: agent.color }} />
            <span className="text-sm font-bold text-stone-900">{agent.name}</span>
          </div>
          <div className="text-xs text-stone-500 mb-1">{agent.currentZone}</div>
          <div className="text-xs text-stone-700 italic">{AGENT_MESSAGES[agent.id][msgIndexes[agent.id]]}</div>
        </div>
      ))}
    </div>
  )
}
