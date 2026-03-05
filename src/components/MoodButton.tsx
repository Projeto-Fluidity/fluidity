type MoodButtonProps = {
  emoji: string
  selected: boolean
  onSelect: () => void
}

export default function MoodButton({ emoji, selected, onSelect }: MoodButtonProps) {
  return (
    <button
      onClick={onSelect}
      style={{
        fontSize: "2rem",
        margin: "8px",
        padding: "10px",
        borderRadius: "10px",
        border: selected ? "2px solid blue" : "1px solid gray"
      }}
    >
      {emoji}
    </button>
  )
}
