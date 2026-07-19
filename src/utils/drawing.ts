import type { CharacterKey, Pipe } from './types'

export function renderChar(
  targetCtx: CanvasRenderingContext2D,
  charKey: CharacterKey,
  xOffset = 0,
  yOffset = 0,
) {
  targetCtx.save()
  targetCtx.translate(xOffset, yOffset)

  // Surfboard
  targetCtx.fillStyle = '#ffeb3b'
  targetCtx.strokeStyle = '#fbc02d'
  targetCtx.lineWidth = 3
  targetCtx.beginPath()
  targetCtx.ellipse(0, 15, 35, 12, 0, 0, Math.PI * 2)
  targetCtx.fill()
  targetCtx.stroke()

  if (charKey.includes('princess')) {
    const dressColor = charKey === 'pink_princess' ? '#ff69b4' : '#40e0d0'
    targetCtx.fillStyle = dressColor
    targetCtx.beginPath()
    targetCtx.moveTo(-15, 10)
    targetCtx.lineTo(15, 10)
    targetCtx.lineTo(20, -10)
    targetCtx.lineTo(-20, -10)
    targetCtx.closePath()
    targetCtx.fill()
    targetCtx.fillStyle = '#ffe4c4'
    targetCtx.beginPath()
    targetCtx.arc(0, -15, 12, 0, Math.PI * 2)
    targetCtx.fill()
    targetCtx.fillStyle = '#ffd700'
    targetCtx.beginPath()
    targetCtx.arc(0, -18, 14, Math.PI, 0)
    targetCtx.fill()
    targetCtx.fillRect(-14, -18, 5, 20)
    targetCtx.fillRect(9, -18, 5, 20)
  } else {
    let bodyColor = 'white'
    if (charKey === 'red') bodyColor = '#ff4444'
    if (charKey === 'luigi') bodyColor = '#4caf50'
    targetCtx.fillStyle = bodyColor
    targetCtx.strokeStyle = '#ddd'
    targetCtx.beginPath()
    targetCtx.ellipse(0, -5, 20, 25, 0, 0, Math.PI * 2)
    targetCtx.fill()
    targetCtx.stroke()
    targetCtx.beginPath()
    for (let i = -15; i <= 15; i += 10) {
      targetCtx.moveTo(i, 10)
      targetCtx.quadraticCurveTo(i + 5, 20, i + 10, 10)
    }
    targetCtx.stroke()
    targetCtx.fillStyle = '#333'
    targetCtx.beginPath()
    targetCtx.ellipse(-8, -10, 10, 6, 0.2, 0, Math.PI * 2)
    targetCtx.ellipse(8, -10, 10, 6, -0.2, 0, Math.PI * 2)
    targetCtx.fill()
    targetCtx.fillStyle = 'white'
    targetCtx.beginPath()
    targetCtx.arc(-8, -10, 5, 0, Math.PI * 2)
    targetCtx.arc(8, -10, 5, 0, Math.PI * 2)
    targetCtx.fill()
    targetCtx.fillStyle = 'black'
    targetCtx.beginPath()
    targetCtx.arc(-8, -10, 3, 0, Math.PI * 2)
    targetCtx.arc(8, -10, 3, 0, Math.PI * 2)
    targetCtx.fill()
    if (charKey === 'mario') {
      targetCtx.fillStyle = 'red'
      targetCtx.beginPath()
      targetCtx.arc(0, -25, 12, Math.PI, 0)
      targetCtx.fill()
      targetCtx.fillStyle = 'white'
      targetCtx.beginPath()
      targetCtx.arc(0, -28, 5, 0, Math.PI * 2)
      targetCtx.fill()
      targetCtx.fillStyle = 'red'
      targetCtx.font = 'bold 8px Arial'
      targetCtx.textAlign = 'center'
      targetCtx.fillText('M', 0, -27)
    }
    if (charKey === 'luigi') {
      targetCtx.fillStyle = '#4caf50'
      targetCtx.beginPath()
      targetCtx.arc(0, -25, 12, Math.PI, 0)
      targetCtx.fill()
      targetCtx.fillStyle = 'white'
      targetCtx.beginPath()
      targetCtx.arc(0, -28, 5, 0, Math.PI * 2)
      targetCtx.fill()
      targetCtx.fillStyle = '#4caf50'
      targetCtx.font = 'bold 8px Arial'
      targetCtx.textAlign = 'center'
      targetCtx.fillText('L', 0, -27)
    }
  }
  targetCtx.restore()
}

export function generateCharacterPreview(
  charKey: CharacterKey,
  size = 100,
): string {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  ctx.clearRect(0, 0, size, size)
  renderChar(ctx, charKey, size / 2, size / 2)
  return canvas.toDataURL()
}

export function renderBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frameCount: number,
) {
  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height)
  skyGrad.addColorStop(0, '#81d4fa')
  skyGrad.addColorStop(0.5, '#4fc3f7')
  ctx.fillStyle = skyGrad
  ctx.fillRect(0, 0, width, height)

  // Sand
  ctx.fillStyle = '#ffe082'
  ctx.fillRect(0, height - 100, width, 100)

  // Waves
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    const offset = i * 50
    const speed = (i + 1) * 0.02
    ctx.moveTo(0, height - 80 - offset)
    for (let x = 0; x <= width; x += 10) {
      const y = Math.sin(x * 0.01 + frameCount * speed) * 15
      ctx.lineTo(x, height - 80 - offset + y)
    }
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.fill()
  }
}

export function renderPipe(
  ctx: CanvasRenderingContext2D,
  pipe: Pipe,
  canvasHeight: number,
) {
  // Top pipe
  ctx.fillStyle = '#8d6e63'
  ctx.strokeStyle = '#5d4037'
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.roundRect(pipe.x + 15, 0, 30, pipe.top, [0, 0, 10, 10])
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#4caf50'
  ctx.beginPath()
  ctx.arc(pipe.x + 30, pipe.top, 40, 0, Math.PI * 2)
  ctx.fill()

  // Bottom pipe
  ctx.fillStyle = '#8d6e63'
  ctx.beginPath()
  ctx.roundRect(pipe.x + 15, canvasHeight - pipe.bottom, 30, pipe.bottom, [10, 10, 0, 0])
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#4caf50'
  ctx.beginPath()
  ctx.arc(pipe.x + 30, canvasHeight - pipe.bottom, 40, 0, Math.PI * 2)
  ctx.fill()
}
