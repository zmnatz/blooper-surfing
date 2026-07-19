import type { CharacterKey } from '../utils/types'
import { generateCharacterPreview } from '../utils/drawing'

const CHARACTERS: { key: CharacterKey; label: string }[] = [
  { key: 'original', label: 'Original' },
  { key: 'mario', label: 'Mario' },
  { key: 'red', label: 'Red' },
  { key: 'luigi', label: 'Luigi' },
  { key: 'pink_princess', label: 'Pink Princess' },
  { key: 'teal_princess', label: 'Teal Princess' },
]

const PREVIEWS: Record<CharacterKey, string> = Object.fromEntries(
  CHARACTERS.map((c) => [c.key, generateCharacterPreview(c.key)]),
) as Record<CharacterKey, string>

interface CharacterPickerProps {
  selected: CharacterKey
  onSelect: (char: CharacterKey) => void
}

export function CharacterPicker({ selected, onSelect }: CharacterPickerProps) {
  return (
    <div className="char-grid">
      {CHARACTERS.map((c) => (
        <button
          key={c.key}
          className={`char-btn ${selected === c.key ? 'selected' : ''}`}
          onClick={() => onSelect(c.key)}
          aria-label={c.label}
        >
          {PREVIEWS[c.key] && <img src={PREVIEWS[c.key]} alt={c.label} width={60} height={60} />}
        </button>
      ))}
    </div>
  )
}
