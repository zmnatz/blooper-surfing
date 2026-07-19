import { describe, it, expect } from 'vitest'
import { renderChar } from './drawing'
import { generateCharacterPreview } from './drawing'

describe('drawing utilities', () => {
  it('renderChar draws without errors', () => {
    const canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    const ctx = canvas.getContext('2d')!
    expect(() => renderChar(ctx, 'original', 50, 50)).not.toThrow()
    expect(() => renderChar(ctx, 'mario', 50, 50)).not.toThrow()
    expect(() => renderChar(ctx, 'red', 50, 50)).not.toThrow()
    expect(() => renderChar(ctx, 'luigi', 50, 50)).not.toThrow()
    expect(() => renderChar(ctx, 'pink_princess', 50, 50)).not.toThrow()
    expect(() => renderChar(ctx, 'teal_princess', 50, 50)).not.toThrow()
  })

  it('generateCharacterPreview returns a data URL', () => {
    const dataUrl = generateCharacterPreview('original')
    expect(dataUrl).toMatch(/^data:image\/png;base64,/)
  })
})
