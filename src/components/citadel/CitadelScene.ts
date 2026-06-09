import Phaser from 'phaser'
import type { AgentId, AgentState, Zone } from './citadel.types'

const ZONES: Zone[] = [
  { id: 'warRoom',       label: 'WAR ROOM',      x: 0,   y: 0,   width: 280, height: 220, color: 0xD97706 },
  { id: 'library',       label: 'THE LIBRARY',   x: 290, y: 0,   width: 270, height: 220, color: 0x3B82F6 },
  { id: 'bureauCommons', label: 'BUREAU COMMONS', x: 0,   y: 230, width: 170, height: 220, color: 0x8B5CF6 },
  { id: 'writingDesk',   label: 'WRITING DESK',  x: 180, y: 230, width: 200, height: 220, color: 0x6B7280 },
  { id: 'theVault',      label: 'THE VAULT',     x: 390, y: 230, width: 170, height: 220, color: 0x10B981 },
]

interface AgentDef {
  id: AgentId
  name: string
  color: number
  cssColor: string
  homeZone: string
  visitZones: string[]
}

const AGENT_DEFS: AgentDef[] = [
  { id: 'scout',       name: 'The Scout',       color: 0x3B82F6, cssColor: '#3B82F6', homeZone: 'library',       visitZones: ['warRoom'] },
  { id: 'strategist',  name: 'The Strategist',  color: 0x10B981, cssColor: '#10B981', homeZone: 'warRoom',       visitZones: ['writingDesk'] },
  { id: 'writer',      name: 'The Writer',      color: 0xF59E0B, cssColor: '#F59E0B', homeZone: 'writingDesk',   visitZones: ['library'] },
  { id: 'architect',   name: 'The Architect',   color: 0x8B5CF6, cssColor: '#8B5CF6', homeZone: 'warRoom',       visitZones: ['theVault'] },
  { id: 'teamBuilder', name: 'The Team Builder', color: 0xEF4444, cssColor: '#EF4444', homeZone: 'bureauCommons', visitZones: ['warRoom'] },
]

interface AgentObj {
  def: AgentDef
  circle: Phaser.GameObjects.Arc
  label: Phaser.GameObjects.Text
  currentZone: string
  tween: Phaser.Tweens.Tween | null
  timer: Phaser.Time.TimerEvent | null
}

export class CitadelScene extends Phaser.Scene {
  private agents: AgentObj[] = []
  private zoneRects: Map<string, Phaser.GameObjects.Rectangle> = new Map()
  private onStateChange?: (states: AgentState[]) => void

  constructor() {
    super({ key: 'CitadelScene' })
  }

  setStateChangeCallback(cb: (states: AgentState[]) => void) {
    this.onStateChange = cb
  }

  create() {
    this.cameras.main.setBackgroundColor('#F5F0E8')

    // Draw zones
    for (const zone of ZONES) {
      const rect = this.add.rectangle(
        zone.x + zone.width / 2,
        zone.y + zone.height / 2,
        zone.width,
        zone.height,
        zone.color,
        0.2
      )
      rect.setStrokeStyle(2, zone.color, 0.8)
      this.zoneRects.set(zone.id, rect)

      this.add.text(zone.x + 8, zone.y + 8, zone.label, {
        fontSize: '12px',
        color: '#3D2B1F',
        fontFamily: 'serif',
      })
    }

    // Spawn agents
    for (const def of AGENT_DEFS) {
      const zone = ZONES.find(z => z.id === def.homeZone)!
      const cx = zone.x + zone.width / 2
      const cy = zone.y + zone.height / 2

      const circle = this.add.circle(cx, cy, 10, def.color)
      circle.setStrokeStyle(2, 0xffffff)
      const label = this.add.text(cx, cy - 16, def.name, {
        fontSize: '9px',
        color: '#1F2937',
      }).setOrigin(0.5, 1)

      const agent: AgentObj = {
        def,
        circle,
        label,
        currentZone: def.homeZone,
        tween: null,
        timer: null,
      }
      this.agents.push(agent)
      this.scheduleMove(agent)
    }

    this.emitState()
  }

  private scheduleMove(agent: AgentObj) {
    const delay = Phaser.Math.Between(4000, 9000)
    agent.timer = this.time.delayedCall(delay, () => this.moveAgent(agent))
  }

  private moveAgent(agent: AgentObj) {
    const allZones = [agent.def.homeZone, ...agent.def.visitZones]
    const others = allZones.filter(z => z !== agent.currentZone)
    const targetId = Phaser.Utils.Array.GetRandom(others) as string
    const zone = ZONES.find(z => z.id === targetId)!

    const tx = zone.x + Phaser.Math.Between(20, zone.width - 20)
    const ty = zone.y + Phaser.Math.Between(20, zone.height - 20)

    const dist = Phaser.Math.Distance.Between(agent.circle.x, agent.circle.y, tx, ty)
    const duration = (dist / 80) * 1000

    agent.tween = this.tweens.add({
      targets: [agent.circle, agent.label],
      x: tx,
      y: ty,
      duration,
      ease: 'Linear',
      onUpdate: () => {
        agent.label.x = agent.circle.x
        agent.label.y = agent.circle.y - 16
      },
      onComplete: () => {
        agent.currentZone = targetId
        this.pulseZone(targetId)
        this.emitState()
        this.scheduleMove(agent)
      },
    })
  }

  private pulseZone(zoneId: string) {
    const rect = this.zoneRects.get(zoneId)
    if (!rect) return
    this.tweens.add({
      targets: rect,
      strokeColor: 0xF59E0B,
      duration: 800,
      yoyo: true,
      ease: 'Sine.easeInOut',
    })
  }

  private emitState() {
    if (!this.onStateChange) return
    const states: AgentState[] = this.agents.map(a => ({
      id: a.def.id,
      name: a.def.name,
      color: a.def.cssColor,
      currentZone: ZONES.find(z => z.id === a.currentZone)?.label ?? a.currentZone,
      statusMessage: '',
    }))
    this.onStateChange(states)
  }
}
