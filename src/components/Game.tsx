import { useRef, useEffect, useCallback } from 'react'
import type { CharacterKey, GameState } from '../utils/types'
import { DEFAULT_SETTINGS } from '../utils/types'
import { createInitialState, tick } from '../utils/gameState'
import { renderBackground, renderPipe, renderChar } from '../utils/drawing'
import { useAudio } from '../hooks/useAudio'
import { useFlap } from '../hooks/useFlap'

interface GameProps {
  character: CharacterKey
  onGameOver: (score: number) => void
  gameRunning: boolean
}

export function Game({ character, onGameOver, gameRunning }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameStateRef = useRef<GameState>(createInitialState())
  const animFrameRef = useRef<number>(0)
  const { initAudio, playMusic, stopMusic, resetNoteIndex } = useAudio()
  const onGameOverRef = useRef(onGameOver)
  const gameRunningRef = useRef(gameRunning)
  const levelRef = useRef(0)

  onGameOverRef.current = onGameOver
  gameRunningRef.current = gameRunning

  const resize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    gameStateRef.current.blooper.x = canvas.width * 0.2
    if (!gameStateRef.current.gameRunning) {
      gameStateRef.current.blooper.y = canvas.height / 2
    }
  }, [])

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [resize])

  const flap = useCallback(() => {
    if (gameStateRef.current.gameRunning) {
      gameStateRef.current.pendingFlap = true
    }
  }, [])

  const { setup: setupInput } = useFlap(canvasRef, flap)

  useEffect(() => {
    const cleanup = setupInput()
    return cleanup
  }, [setupInput])

  useEffect(() => {
    if (!gameRunning) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = gameStateRef.current
    state.blooper.y = canvas.height / 2
    state.blooper.velocity = 0
    state.pipes = []
    state.score = 0
    state.currentPipeSpeed = DEFAULT_SETTINGS.basePipeSpeed
    state.currentSpawnRate = DEFAULT_SETTINGS.baseSpawnRate
    state.frameCount = 0
    state.spawnTimer = 0
    state.gameRunning = true
    levelRef.current = 0

    initAudio()
    resetNoteIndex()
    playMusic(0, () => gameRunningRef.current)

    const gameLoop = () => {
      if (!state.gameRunning) return

      const { events } = tick(
        state,
        { flap: false, canvasWidth: canvas.width, canvasHeight: canvas.height },
      )

      for (const event of events) {
        if (event.type === 'gameOver') {
          stopMusic()
          onGameOverRef.current(event.score)
          return
        }
        if (event.type === 'scored') {
          const newLevel = Math.floor(event.score / 5)
          if (newLevel !== levelRef.current) {
            levelRef.current = newLevel
            stopMusic()
            playMusic(newLevel, () => gameRunningRef.current)
          }
        }
      }

      // Render
      renderBackground(ctx, canvas.width, canvas.height, state.frameCount)
      for (const pipe of state.pipes) {
        renderPipe(ctx, pipe, canvas.height)
      }

      ctx.save()
      ctx.translate(
        state.blooper.x + state.blooper.width / 2,
        state.blooper.y + state.blooper.height / 2,
      )
      const rotation = Math.min(
        Math.PI / 6,
        Math.max(-Math.PI / 6, state.blooper.velocity * 0.1),
      )
      ctx.rotate(rotation)
      renderChar(ctx, character, 0, 0)
      ctx.restore()

      animFrameRef.current = requestAnimationFrame(gameLoop)
    }

    animFrameRef.current = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      stopMusic()
    }
  }, [gameRunning, character, initAudio, playMusic, stopMusic, resetNoteIndex])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        touchAction: 'none',
      }}
    />
  )
}
