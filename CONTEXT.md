# Domain Glossary — Blooper Surfing

## Core concepts

**GameState** — the complete mutable state of a single game run: blooper position/velocity, pipes, score, frame count, spawn timer, difficulty settings. Lives in a pure module; never touches the DOM.

**tick** — `tick(state, input, settings) → { state, events }`. The single entry point to the GameState module. Advances one frame of simulation. Pure function: same inputs always produce the same outputs.

**input** — what the adapter passes each frame: `{ flap: boolean, canvasWidth: number, canvasHeight: number }`. Flap is true when the player triggers a jump. Dimensions come from the canvas element.

**events** — an array of side-effect signals returned by `tick()`. The adapter reads them and acts (restart music on `scored`, end game on `gameOver`). The GameState module never performs side effects itself.

**settings** — `GameSettings` values (gravity, jumpStrength, pipeGap, basePipeSpeed, baseSpawnRate). Passed into `tick()` by the adapter. Allows testing with different difficulty curves.

**level** — `Math.floor(score / 5)`. The audio system's only input. Determines waveform complexity (square → sawtooth), harmony layers, and percussion intensity. Computed by the adapter, not the audio module.

## Modules

**GameState module** — pure functions implementing the game simulation. Interface: `tick()`. No DOM, no AudioContext, no React. Exports: `createInitialState()`, `tick()`.

**useAudio hook** — Web Audio API adapter. Interface: `initAudio()`, `playMusic(level, isRunning)`, `stopMusic()`, `resetNoteIndex()`. Accepts `level` (not score). No knowledge of game rules.

**drawing module** — canvas rendering utilities. Interface: `renderChar()`, `renderBackground()`, `renderPipe()`, `generateCharacterPreview()`. Stateless: draws what it's told, owns no game state.

**useFlap hook** — input adapter. Interface: `useFlap(canvasRef, onFlap)`. Owns touch/mouse/keydown listeners. Calls `onFlap` callback on any trigger. Swappable for gamepad/voice input.

**Game component** — the adapter. Owns the rAF loop, canvas element, and React lifecycle. Calls `tick()` each frame, reads events, triggers audio and game-over transitions. The only module that touches the DOM.
