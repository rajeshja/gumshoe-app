"use client"

import { useState } from "react"
import PlayerSetup from "@/components/PlayerSetup"
import CharacterCreator from "@/components/CharacterCreator"
import CharacterSheets from "@/components/CharacterSheets"
import type { Character } from "@/types/character"

export default function Home() {
  const [currentStep, setCurrentStep] = useState<"setup" | "creation" | "sheets">("setup")
  const [numPlayers, setNumPlayers] = useState<number>(0)
  const [characters, setCharacters] = useState<Character[]>([])
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState<number>(0)

  const handlePlayerSetup = (players: number) => {
    setNumPlayers(players)
    setCharacters(
      Array(players)
        .fill(null)
        .map((_, index) => ({
          id: index + 1,
          name: "",
          motivation: "",
          background: "",
          investigativeAbilities: {},
          generalAbilities: {},
          investigativePointsSpent: 0,
          generalPointsSpent: 0,
        })),
    )
    setCurrentStep("creation")
  }

  const handleCharacterComplete = (character: Character) => {
    const updatedCharacters = [...characters]
    updatedCharacters[currentCharacterIndex] = character
    setCharacters(updatedCharacters)

    if (currentCharacterIndex < numPlayers - 1) {
      setCurrentCharacterIndex(currentCharacterIndex + 1)
    } else {
      setCurrentStep("sheets")
    }
  }

  const handleBackToCreation = () => {
    setCurrentStep("creation")
    setCurrentCharacterIndex(0)
  }

  const handleStartOver = () => {
    setCurrentStep("setup")
    setNumPlayers(0)
    setCharacters([])
    setCurrentCharacterIndex(0)
  }

  // Calculate investigative build points based on number of players
  const getInvestigativeBuildPoints = (numPlayers: number): number => {
    switch (numPlayers) {
      case 1:
        return 32
      case 2:
        return 28
      case 3:
        return 24
      case 4:
        return 20
      case 5:
        return 18
      case 6:
        return 16
      default:
        return 20
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Gumshoe Character Creator</h1>
          <p className="text-gray-600">Create characters for the Gumshoe TTRPG system</p>
        </header>

        {currentStep === "setup" && <PlayerSetup onSetup={handlePlayerSetup} />}

        {currentStep === "creation" && (
          <CharacterCreator
            character={characters[currentCharacterIndex]}
            characterNumber={currentCharacterIndex + 1}
            totalCharacters={numPlayers}
            investigativeBuildPoints={getInvestigativeBuildPoints(numPlayers)}
            generalBuildPoints={60}
            allCharacters={characters}
            currentCharacterIndex={currentCharacterIndex}
            onComplete={handleCharacterComplete}
            onBack={currentCharacterIndex > 0 ? () => setCurrentCharacterIndex(currentCharacterIndex - 1) : undefined}
          />
        )}

        {currentStep === "sheets" && (
          <CharacterSheets characters={characters} onBack={handleBackToCreation} onStartOver={handleStartOver} />
        )}
      </div>
    </div>
  )
}
