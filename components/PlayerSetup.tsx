"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AbilitiesFileSelector from "./AbilitiesFileSelector"
import { useAbilities } from "@/contexts/AbilitiesContext"

interface Ability {
  ability_category: string;
  ability_name: string;
  ability_type: string;
  description: string;
}

interface PlayerSetupProps {
  onSetup: (numPlayers: number, abilitiesFile: string) => void
}

export default function PlayerSetup({ onSetup }: PlayerSetupProps) {
  const [numPlayers, setNumPlayers] = useState<string>("")
  const { loadAbilities } = useAbilities()
  const [selectedAbilitiesFile, setSelectedAbilitiesFile] = useState<string>("")

  const handleFileSelect = (fileName: string) => {
    setSelectedAbilitiesFile(fileName)
    loadAbilities(fileName)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const players = Number.parseInt(numPlayers)
    if (players >= 1 && players <= 6 && selectedAbilitiesFile) {
      onSetup(players, selectedAbilitiesFile)
    }
  }

  const { abilitiesData } = useAbilities();

  const getInvestigativePoints = (players: number): number => {
    // Count the number of investigative abilities from the abilities data
    const abilities: Ability[] = abilitiesData || [];
    const totalInvestigativeAbilities = abilities.filter(
      (ability: Ability) => ability.ability_category === 'investigative'
    ).length;
    
    // Calculate build points based on number of players
    if (players === 2) {
      return Math.ceil(totalInvestigativeAbilities * 0.80); // 80% of x for 2 players
    } else if (players === 3) {
      return Math.ceil(totalInvestigativeAbilities * 0.60); // 60% of x for 3 players
    } else if (players === 4) {
      return Math.ceil(totalInvestigativeAbilities * 0.55); // 55% of x for 4 players
    } else if (players >= 5) {
      return Math.ceil(totalInvestigativeAbilities * 0.50); // 50% of x for 5+ players
    } else {
      // Default case (shouldn't happen with normal usage)
      return Math.ceil(totalInvestigativeAbilities * 0.50);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Setup Your Game</CardTitle>
          <CardDescription>Choose an abilities file to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <AbilitiesFileSelector onFileSelect={handleFileSelect} />
              
              {selectedAbilitiesFile && (
                <div>
                  <Label htmlFor="numPlayers">Number of Players (1-6)</Label>
                  <Input
                    id="numPlayers"
                    type="number"
                    min="1"
                    max="6"
                    value={numPlayers}
                    onChange={(e) => setNumPlayers(e.target.value)}
                    placeholder="Enter number of players"
                    required
                    className="mt-1"
                  />
                </div>
              )}
            </div>

            {numPlayers && Number.parseInt(numPlayers) >= 1 && Number.parseInt(numPlayers) <= 6 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Build Points per Character:</h3>
                <ul className="text-sm text-blue-700">
                  <li>• Investigative Abilities: {getInvestigativePoints(Number.parseInt(numPlayers))} points</li>
                  <li>• General Abilities: 60 points</li>
                </ul>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!numPlayers || Number.parseInt(numPlayers) < 1 || Number.parseInt(numPlayers) > 6}
            >
              Start Character Creation
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
