"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CharacterSheet from "./CharacterSheet"
import type { Character } from "@/types/character"
import { Printer, ArrowLeft, RotateCcw } from "lucide-react"

interface CharacterSheetsProps {
  characters: Character[]
  onBack: () => void
  onStartOver: () => void
}

export default function CharacterSheets({ characters, onBack, onStartOver }: CharacterSheetsProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null)

  const handlePrint = () => {
    window.print()
  }

  const handlePrintAll = () => {
    setSelectedCharacter(null)
    setTimeout(() => {
      window.print()
    }, 100)
  }

  if (selectedCharacter !== null) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6 print:hidden">
          <Button variant="outline" onClick={() => setSelectedCharacter(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Overview
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print Character Sheet
          </Button>
        </div>
        <CharacterSheet character={characters[selectedCharacter]} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Character Sheets</h2>
          <p className="text-gray-600">Your characters are ready!</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Edit Characters
          </Button>
          <Button variant="outline" onClick={onStartOver}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Start Over
          </Button>
          <Button onClick={handlePrintAll}>
            <Printer className="w-4 h-4 mr-2" />
            Print All Sheets
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:hidden">
        {characters.map((character, index) => (
          <Card key={character.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {character.name || `Character ${index + 1}`}
                <Button size="sm" onClick={() => setSelectedCharacter(index)}>
                  View Sheet
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Motivation:</strong> {character.motivation || "Not specified"}
                </p>
                <p>
                  <strong>Investigative Abilities:</strong> {Object.keys(character.investigativeAbilities).length}
                </p>
                <p>
                  <strong>General Abilities:</strong> {Object.keys(character.generalAbilities).length}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden print:block">
        {characters.map((character, index) => (
          <div key={character.id} className={index > 0 ? "page-break-before" : ""}>
            <CharacterSheet character={character} />
          </div>
        ))}
      </div>
    </div>
  )
}
