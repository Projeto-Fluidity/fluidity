import { moods } from "../lib/moods"
import MoodButton from "./MoodButton"
import { useState } from "react"
import { saveMood } from "../services/moodService"
import type { MoodType } from "../types/mood"
import { hasMoodToday } from "../services/moodService"

export default function MoodSelector() {

    const [selectedMood, setSelectedMood] = useState<MoodType | null>(() => {
        const savedMood = localStorage.getItem("mood-value")
        return savedMood ? (savedMood as MoodType) : null
    })

    const [message, setMessage] = useState<string | null>(null)

    async function handleSelectMood(mood: MoodType) {

      if (await hasMoodToday()) {
          setMessage("Você já registrou seu humor hoje")
          return
      }
      setSelectedMood(mood)

      saveMood(mood)
      setMessage("Humor registrado com sucesso")
    }

  return (
    <div>
      <h2>Como você está hoje?</h2>

      <div>

        {moods.map((mood) => (
          <MoodButton
            key={mood.value}
            emoji={mood.emoji}
            selected={selectedMood === mood.value}
            onSelect={() => handleSelectMood(mood.value)}
          />
        ))}
      </div>

      {message && (
        <p>{message}</p>
      )}

    </div>
  )
}
