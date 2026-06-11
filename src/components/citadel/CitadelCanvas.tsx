import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { CitadelScene } from './CitadelScene'
import type { AgentState } from './citadel.types'

interface CitadelCanvasProps {
  onAgentStateChange: (states: AgentState[]) => void
}

export function CitadelCanvas({ onAgentStateChange }: CitadelCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return

    const scene = new CitadelScene()
    scene.setStateChangeCallback(onAgentStateChange)

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: 560,
      height: 450,
      backgroundColor: '#111827',
      scene,
      parent: containerRef.current,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    })

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [onAgentStateChange])

  return <div ref={containerRef} className="w-full h-full" />
}
