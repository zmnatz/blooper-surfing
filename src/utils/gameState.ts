import type { GameState, Pipe, GameSettings } from './types'
import { DEFAULT_SETTINGS } from './types'

export type GameEvent =
  | { type: 'scored'; score: number }
  | { type: 'gameOver'; score: number }

export interface TickInput {
  flap: boolean
  canvasWidth: number
  canvasHeight: number
}

export function createInitialState(): GameState {
  return {
    blooper: { x: 0, y: 0, velocity: 0, width: 60, height: 60 },
    pipes: [],
    frameCount: 0,
    spawnTimer: 0,
    score: 0,
    gameRunning: false,
    currentPipeSpeed: DEFAULT_SETTINGS.basePipeSpeed,
    currentSpawnRate: DEFAULT_SETTINGS.baseSpawnRate,
    pendingFlap: false,
  }
}

export function tick(
  state: GameState,
  input: TickInput,
  settings: GameSettings = DEFAULT_SETTINGS,
): { state: GameState; events: GameEvent[] } {
  const events: GameEvent[] = []

  if (!state.gameRunning) return { state, events }

  state.frameCount++

  // Flap
  if (input.flap || state.pendingFlap) {
    state.blooper.velocity = settings.jumpStrength
    state.pendingFlap = false
  }

  // Physics
  state.blooper.velocity += settings.gravity
  state.blooper.y += state.blooper.velocity

  if (
    state.blooper.y + state.blooper.height > input.canvasHeight ||
    state.blooper.y < 0
  ) {
    state.gameRunning = false
    events.push({ type: 'gameOver', score: state.score })
    return { state, events }
  }

  // Spawn pipes
  state.spawnTimer++
  if (state.spawnTimer >= state.currentSpawnRate) {
    const minH = 80
    const maxH = input.canvasHeight - settings.pipeGap - minH
    const h = Math.floor(Math.random() * (maxH - minH + 1)) + minH
    state.pipes.push({
      x: input.canvasWidth,
      top: h,
      bottom: input.canvasHeight - h - settings.pipeGap,
      passed: false,
    })
    state.spawnTimer = 0
  }

  // Update pipes
  for (let i = state.pipes.length - 1; i >= 0; i--) {
    const p: Pipe = state.pipes[i]
    p.x -= state.currentPipeSpeed

    // Collision
    if (
      state.blooper.x + 15 < p.x + 45 &&
      state.blooper.x + state.blooper.width - 15 > p.x + 15 &&
      (state.blooper.y + 15 < p.top ||
        state.blooper.y + state.blooper.height - 15 > input.canvasHeight - p.bottom)
    ) {
      state.gameRunning = false
      events.push({ type: 'gameOver', score: state.score })
      return { state, events }
    }

    // Score
    if (!p.passed && p.x + 60 < state.blooper.x) {
      state.score++
      p.passed = true
      if (state.score % 5 === 0) {
        state.currentPipeSpeed += 0.2
        state.currentSpawnRate = Math.max(80, state.currentSpawnRate - 15)
      }
      events.push({ type: 'scored', score: state.score })
    }

    // Remove off-screen pipes
    if (p.x < -100) {
      state.pipes.splice(i, 1)
    }
  }

  return { state, events }
}
