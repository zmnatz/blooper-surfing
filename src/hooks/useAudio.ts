import { useCallback, useRef } from 'react'

const melody = [
  { note: 261.63, len: 0.2 },
  { note: 329.63, len: 0.2 },
  { note: 392.0, len: 0.2 },
  { note: 523.25, len: 0.4 },
  { note: 392.0, len: 0.2 },
  { note: 329.63, len: 0.2 },
  { note: 261.63, len: 0.4 },
  { note: 0, len: 0.2 },
  { note: 349.23, len: 0.2 },
  { note: 392.0, len: 0.2 },
  { note: 440.0, len: 0.2 },
  { note: 523.25, len: 0.4 },
  { note: 440.0, len: 0.2 },
  { note: 349.23, len: 0.2 },
  { note: 261.63, len: 0.6 },
]

export function useAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const noteIndexRef = useRef(0)
  const musicLoopRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
  }, [])

  const playNote = useCallback(
    (freq: number, duration: number, type: OscillatorType = 'square', volume = 0.1) => {
      if (freq === 0 || !audioCtxRef.current) return
      const osc = audioCtxRef.current.createOscillator()
      const gain = audioCtxRef.current.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime)
      gain.gain.setValueAtTime(volume, audioCtxRef.current.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + duration)
      osc.connect(gain)
      gain.connect(audioCtxRef.current.destination)
      osc.start()
      osc.stop(audioCtxRef.current.currentTime + duration)
    },
    [],
  )

  const playMusic = useCallback(
    (level: number, isRunning: () => boolean) => {
      if (!isRunning()) return
      const current = melody[noteIndexRef.current]
      const mainType: OscillatorType = level >= 2 ? 'sawtooth' : 'square'
      playNote(current.note, current.len, mainType, 0.07)
      playNote(130.81, 0.4, 'triangle', 0.1)
      if (level >= 1 && noteIndexRef.current % 2 === 0) playNote(150, 0.05, 'square', 0.05)
      if (level >= 2 && current.note !== 0) playNote(current.note * 1.5, current.len, 'square', 0.04)
      if (level >= 3 && noteIndexRef.current % 2 === 1) playNote(current.note * 2, 0.1, 'sawtooth', 0.03)
      if (level >= 4 && noteIndexRef.current % 4 === 0) playNote(65.41, 0.4, 'sawtooth', 0.08)
      noteIndexRef.current = (noteIndexRef.current + 1) % melody.length
      musicLoopRef.current = setTimeout(() => playMusic(level, isRunning), current.len * 1000)
    },
    [playNote],
  )

  const stopMusic = useCallback(() => {
    if (musicLoopRef.current) {
      clearTimeout(musicLoopRef.current)
      musicLoopRef.current = null
    }
  }, [])

  const resetNoteIndex = useCallback(() => {
    noteIndexRef.current = 0
  }, [])

  return { initAudio, playMusic, stopMusic, resetNoteIndex }
}
