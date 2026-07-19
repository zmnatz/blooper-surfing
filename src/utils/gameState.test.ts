import { describe, it, expect } from 'vitest'
import { createInitialState, tick } from './gameState'
import type { GameSettings } from './types'

const testSettings: GameSettings = {
  gravity: 0.15,
  jumpStrength: -4.5,
  basePipeSpeed: 1.8,
  baseSpawnRate: 160,
  pipeGap: 260,
}

const canvas = { canvasWidth: 800, canvasHeight: 600 }

describe('createInitialState', () => {
  it('returns correct defaults', () => {
    const state = createInitialState()
    expect(state.blooper).toEqual({ x: 0, y: 0, velocity: 0, width: 60, height: 60 })
    expect(state.pipes).toEqual([])
    expect(state.score).toBe(0)
    expect(state.gameRunning).toBe(false)
    expect(state.currentPipeSpeed).toBe(testSettings.basePipeSpeed)
    expect(state.currentSpawnRate).toBe(testSettings.baseSpawnRate)
    expect(state.pendingFlap).toBe(false)
  })
})

describe('tick', () => {
  it('does nothing when game is not running', () => {
    const state = createInitialState()
    const { state: next, events } = tick(state, { flap: false, ...canvas })
    expect(next).toBe(state)
    expect(events).toEqual([])
  })

  it('applies gravity and updates position', () => {
    const state = createInitialState()
    state.gameRunning = true
    state.blooper.y = 300

    const { state: next } = tick(state, { flap: false, ...canvas })
    expect(next.blooper.velocity).toBe(testSettings.gravity)
    expect(next.blooper.y).toBe(300 + testSettings.gravity)
  })

  it('velocity accumulates over frames', () => {
    const state = createInitialState()
    state.gameRunning = true
    state.blooper.y = 300

    tick(state, { flap: false, ...canvas })
    tick(state, { flap: false, ...canvas })
    const { state: next } = tick(state, { flap: false, ...canvas })

    expect(next.blooper.velocity).toBeCloseTo(testSettings.gravity * 3)
  })

  it('flap sets velocity to jumpStrength', () => {
    const state = createInitialState()
    state.gameRunning = true
    state.blooper.y = 300

    const { state: next } = tick(state, { flap: true, ...canvas })
    expect(next.blooper.velocity).toBe(testSettings.jumpStrength + testSettings.gravity)
  })

  it('pendingFlap sets velocity to jumpStrength', () => {
    const state = createInitialState()
    state.gameRunning = true
    state.blooper.y = 300
    state.pendingFlap = true

    const { state: next } = tick(state, { flap: false, ...canvas })
    expect(next.blooper.velocity).toBe(testSettings.jumpStrength + testSettings.gravity)
    expect(next.pendingFlap).toBe(false)
  })

  it('emits gameOver when blooper hits floor', () => {
    const state = createInitialState()
    state.gameRunning = true
    state.blooper.y = 550

    const { state: next, events } = tick(state, { flap: false, ...canvas })
    expect(next.gameRunning).toBe(false)
    expect(events).toEqual([{ type: 'gameOver', score: 0 }])
  })

  it('emits gameOver when blooper hits ceiling', () => {
    const state = createInitialState()
    state.gameRunning = true
    state.blooper.y = -5

    const { state: next, events } = tick(state, { flap: false, ...canvas })
    expect(next.gameRunning).toBe(false)
    expect(events).toEqual([{ type: 'gameOver', score: 0 }])
  })

  it('spawns a pipe when spawnTimer reaches spawnRate', () => {
    const state = createInitialState()
    state.gameRunning = true
    state.blooper.y = 300
    state.spawnTimer = testSettings.baseSpawnRate - 1

    const { state: next } = tick(state, { flap: false, ...canvas })
    expect(next.pipes.length).toBe(1)
    expect(next.pipes[0].x).toBe(canvas.canvasWidth - testSettings.basePipeSpeed)
    expect(next.spawnTimer).toBe(0)
  })

  it('does not spawn pipe before spawnRate is reached', () => {
    const state = createInitialState()
    state.gameRunning = true
    state.blooper.y = 300
    state.spawnTimer = 0

    const { state: next } = tick(state, { flap: false, ...canvas })
    expect(next.pipes.length).toBe(0)
    expect(next.spawnTimer).toBe(1)
  })

  it('moves pipes left by currentPipeSpeed', () => {
    const state = createInitialState()
    state.gameRunning = true
    state.blooper.y = 300
    state.pipes.push({ x: 500, top: 100, bottom: 200, passed: false })

    const { state: next } = tick(state, { flap: false, ...canvas })
    expect(next.pipes[0].x).toBe(500 - testSettings.basePipeSpeed)
  })

  it('removes off-screen pipes', () => {
    const state = createInitialState()
    state.gameRunning = true
    state.blooper.y = 300
    state.pipes.push({ x: -101, top: 100, bottom: 200, passed: false })

    const { state: next } = tick(state, { flap: false, ...canvas })
    expect(next.pipes.length).toBe(0)
  })

  it('emits scored event when pipe passes blooper', () => {
    const state = createInitialState()
    state.gameRunning = true
    state.blooper.x = 200
    state.blooper.y = 300
    state.pipes.push({ x: 130, top: 100, bottom: 200, passed: false })

    const { events } = tick(state, { flap: false, ...canvas })
    expect(events).toEqual([{ type: 'scored', score: 1 }])
  })

  it('does not score same pipe twice', () => {
    const state = createInitialState()
    state.gameRunning = true
    state.blooper.x = 200
    state.blooper.y = 300
    state.pipes.push({ x: 130, top: 100, bottom: 200, passed: false })

    tick(state, { flap: false, ...canvas })
    const { events } = tick(state, { flap: false, ...canvas })
    expect(events.filter((e) => e.type === 'scored')).toHaveLength(0)
  })

  it('emits gameOver on collision', () => {
    const state = createInitialState()
    state.gameRunning = true
    state.blooper.x = 200
    state.blooper.y = 50
    state.pipes.push({ x: 190, top: 100, bottom: 200, passed: false })

    const { events } = tick(state, { flap: false, ...canvas })
    expect(events).toEqual([{ type: 'gameOver', score: 0 }])
  })

  it('ramps difficulty every 5 points', () => {
    const state = createInitialState()
    state.gameRunning = true
    state.blooper.x = 200
    state.blooper.y = 300
    state.score = 4
    state.pipes.push({ x: 130, top: 100, bottom: 200, passed: false })

    const { state: next } = tick(state, { flap: false, ...canvas })
    expect(next.score).toBe(5)
    expect(next.currentPipeSpeed).toBe(testSettings.basePipeSpeed + 0.2)
    expect(next.currentSpawnRate).toBe(testSettings.baseSpawnRate - 15)
  })

  it('does not ramp difficulty below 5 points', () => {
    const state = createInitialState()
    state.gameRunning = true
    state.blooper.x = 200
    state.blooper.y = 300
    state.score = 3
    state.pipes.push({ x: 130, top: 100, bottom: 200, passed: false })

    const { state: next } = tick(state, { flap: false, ...canvas })
    expect(next.currentPipeSpeed).toBe(testSettings.basePipeSpeed)
    expect(next.currentSpawnRate).toBe(testSettings.baseSpawnRate)
  })

  it('clamps spawn rate at 80', () => {
    const state = createInitialState()
    state.gameRunning = true
    state.blooper.x = 200
    state.blooper.y = 300
    state.score = 49
    state.currentSpawnRate = 85
    state.pipes.push({ x: 130, top: 100, bottom: 200, passed: false })

    const { state: next } = tick(state, { flap: false, ...canvas })
    expect(next.currentSpawnRate).toBe(80)
  })
})
