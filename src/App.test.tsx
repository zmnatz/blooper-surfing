import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import App from './App'

afterEach(() => cleanup())

vi.mock('./components/Game', () => ({
  Game: ({ onGameOver }: { onGameOver: (score: number) => void }) => (
    <div data-testid="game">
      <button onClick={() => onGameOver(42)}>Simulate Game Over</button>
    </div>
  ),
}))

describe('App', () => {
  it('starts on the menu screen', () => {
    render(<App />)
    expect(screen.getByText('Surfing Blooper')).toBeInTheDocument()
    expect(screen.getByText('Choose your Surfer!')).toBeInTheDocument()
    expect(screen.getByText('PLAY!')).toBeInTheDocument()
  })

  it('shows character picker on menu', () => {
    render(<App />)
    expect(screen.getByLabelText('Original')).toBeInTheDocument()
    expect(screen.getByLabelText('Mario')).toBeInTheDocument()
    expect(screen.getByLabelText('Luigi')).toBeInTheDocument()
  })

  it('transitions to playing screen on PLAY click', () => {
    render(<App />)
    fireEvent.click(screen.getByText('PLAY!'))
    expect(screen.getByTestId('game')).toBeInTheDocument()
    expect(screen.queryByText('PLAY!')).not.toBeInTheDocument()
  })

  it('transitions to game over screen with score', () => {
    render(<App />)
    fireEvent.click(screen.getByText('PLAY!'))
    fireEvent.click(screen.getByText('Simulate Game Over'))
    expect(screen.getByText('Wipe Out!')).toBeInTheDocument()
    expect(screen.getByText('You got 42 points!')).toBeInTheDocument()
  })

  it('returns to menu from game over', () => {
    render(<App />)
    fireEvent.click(screen.getByText('PLAY!'))
    fireEvent.click(screen.getByText('Simulate Game Over'))
    fireEvent.click(screen.getByText('BACK TO MENU'))
    expect(screen.getByText('Surfing Blooper')).toBeInTheDocument()
    expect(screen.queryByText('Wipe Out!')).not.toBeInTheDocument()
  })

  it('allows selecting a different character', () => {
    render(<App />)
    const mario = screen.getByLabelText('Mario')
    fireEvent.click(mario)
    expect(mario.className).toContain('selected')
    const original = screen.getByLabelText('Original')
    expect(original.className).not.toContain('selected')
  })

  it('can play multiple rounds', () => {
    render(<App />)
    fireEvent.click(screen.getByText('PLAY!'))
    fireEvent.click(screen.getByText('Simulate Game Over'))
    expect(screen.getByText('You got 42 points!')).toBeInTheDocument()
    fireEvent.click(screen.getByText('BACK TO MENU'))
    fireEvent.click(screen.getByText('PLAY!'))
    expect(screen.getByTestId('game')).toBeInTheDocument()
  })
})
