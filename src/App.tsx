import { useState, useCallback } from 'react'
import type { CharacterKey } from './utils/types'
import { Game } from './components/Game'
import { CharacterPicker } from './components/CharacterPicker'
import './App.css'

type Screen = 'menu' | 'playing' | 'gameover'

function App() {
  const [screen, setScreen] = useState<Screen>('menu')
  const [character, setCharacter] = useState<CharacterKey>('original')
  const [finalScore, setFinalScore] = useState(0)

  const handleStart = useCallback(() => {
    setScreen('playing')
  }, [])

  const handleGameOver = useCallback((score: number) => {
    setFinalScore(score)
    setScreen('gameover')
  }, [])

  const handleBackToMenu = useCallback(() => {
    setScreen('menu')
  }, [])

  return (
    <div className="app">
      {screen === 'playing' && (
        <Game character={character} onGameOver={handleGameOver} gameRunning={true} />
      )}

      <div className="ui">
        {screen === 'menu' && (
          <div className="menu-box">
            <h1>Surfing Blooper</h1>
            <p>Choose your Surfer!</p>
            <CharacterPicker selected={character} onSelect={setCharacter} />
            <button className="start-btn" onClick={handleStart}>
              PLAY!
            </button>
          </div>
        )}

        {screen === 'gameover' && (
          <div className="menu-box">
            <h1>Wipe Out!</h1>
            <p>You got {finalScore} points!</p>
            <button className="start-btn" onClick={handleBackToMenu}>
              BACK TO MENU
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
