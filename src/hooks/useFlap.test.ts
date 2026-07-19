import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFlap } from './useFlap'
import { createRef } from 'react'

function fireKey(code: string) {
  window.dispatchEvent(new KeyboardEvent('keydown', { code }))
}

describe('useFlap', () => {
  it('calls onFlap on Space keydown', () => {
    const onFlap = vi.fn()
    const canvasRef = createRef<HTMLCanvasElement>()
    const { result } = renderHook(() => useFlap(canvasRef, onFlap))

    let cleanup: () => void
    act(() => { cleanup = result.current.setup() })

    act(() => { fireKey('Space') })
    expect(onFlap).toHaveBeenCalledTimes(1)

    cleanup!()
  })

  it('calls onFlap on ArrowUp keydown', () => {
    const onFlap = vi.fn()
    const canvasRef = createRef<HTMLCanvasElement>()
    const { result } = renderHook(() => useFlap(canvasRef, onFlap))

    let cleanup: () => void
    act(() => { cleanup = result.current.setup() })

    act(() => { fireKey('ArrowUp') })
    expect(onFlap).toHaveBeenCalledTimes(1)

    cleanup!()
  })

  it('does not call onFlap on other keys', () => {
    const onFlap = vi.fn()
    const canvasRef = createRef<HTMLCanvasElement>()
    const { result } = renderHook(() => useFlap(canvasRef, onFlap))

    let cleanup: () => void
    act(() => { cleanup = result.current.setup() })

    act(() => { fireKey('KeyA') })
    expect(onFlap).not.toHaveBeenCalled()

    cleanup!()
  })

  it('calls onFlap on mousedown', () => {
    const onFlap = vi.fn()
    const canvasRef = createRef<HTMLCanvasElement>()
    const { result } = renderHook(() => useFlap(canvasRef, onFlap))

    let cleanup: () => void
    act(() => { cleanup = result.current.setup() })

    act(() => { window.dispatchEvent(new MouseEvent('mousedown')) })
    expect(onFlap).toHaveBeenCalledTimes(1)

    cleanup!()
  })

  it('does not call onFlap when target is a button', () => {
    const onFlap = vi.fn()
    const canvasRef = createRef<HTMLCanvasElement>()
    const { result } = renderHook(() => useFlap(canvasRef, onFlap))

    let cleanup: () => void
    act(() => { cleanup = result.current.setup() })

    const button = document.createElement('button')
    act(() => {
      button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    })
    expect(onFlap).not.toHaveBeenCalled()

    cleanup!()
  })

  it('removes listeners on cleanup', () => {
    const onFlap = vi.fn()
    const canvasRef = createRef<HTMLCanvasElement>()
    const { result } = renderHook(() => useFlap(canvasRef, onFlap))

    let cleanup: () => void
    act(() => { cleanup = result.current.setup() })

    cleanup!()

    act(() => { fireKey('Space') })
    expect(onFlap).not.toHaveBeenCalled()
  })
})
