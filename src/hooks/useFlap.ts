import { useCallback, useRef } from 'react'

export function useFlap(
  _canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onFlap: () => void,
) {
  const onFlapRef = useRef(onFlap)
  onFlapRef.current = onFlap

  const jump = useCallback(() => {
    onFlapRef.current()
  }, [])

  const setup = useCallback(() => {
    const handleTouch = (e: TouchEvent) => {
      if ((e.target as HTMLElement).tagName !== 'BUTTON') {
        e.preventDefault()
        jump()
      }
    }
    const handleMouse = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName !== 'BUTTON') jump()
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        jump()
      }
    }

    window.addEventListener('touchstart', handleTouch, { passive: false })
    window.addEventListener('mousedown', handleMouse)
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('touchstart', handleTouch)
      window.removeEventListener('mousedown', handleMouse)
      window.removeEventListener('keydown', handleKey)
    }
  }, [jump])

  return { setup }
}
