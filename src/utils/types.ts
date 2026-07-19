export type CharacterKey = 'original' | 'mario' | 'red' | 'luigi' | 'pink_princess' | 'teal_princess'

export interface Blooper {
  x: number
  y: number
  velocity: number
  width: number
  height: number
}

export interface Pipe {
  x: number
  top: number
  bottom: number
  passed: boolean
}

export interface GameState {
  blooper: Blooper
  pipes: Pipe[]
  frameCount: number
  spawnTimer: number
  score: number
  gameRunning: boolean
  currentPipeSpeed: number
  currentSpawnRate: number
  pendingFlap: boolean
}

export interface GameSettings {
  gravity: number
  jumpStrength: number
  basePipeSpeed: number
  baseSpawnRate: number
  pipeGap: number
}

export const DEFAULT_SETTINGS: GameSettings = {
  gravity: 0.15,
  jumpStrength: -4.5,
  basePipeSpeed: 1.8,
  baseSpawnRate: 160,
  pipeGap: 260,
}
