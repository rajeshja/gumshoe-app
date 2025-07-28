"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PlayerSetupProps {
  onSetup: (numPlayers: number) => void
}

export default function PlayerSetup({ onSetup }: PlayerSetupProps) {
  const [numPlayers, setNumPlayers] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const players = Number.parseInt(numPlayers)
    if (players >= 1 && players <= 6) {
      onSetup(players)
    }
  }

  const getInvestigativePoints = (players: number): number => {
    switch (players) {
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
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Setup Your Game</CardTitle>
          <CardDescription>How many players will be creating characters?</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              />
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
