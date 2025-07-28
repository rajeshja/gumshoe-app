"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Ability, Character } from "@/types/character"
import { Minus, Plus, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AbilitySelectorProps {
  ability: Ability
  currentRating: number
  onChange: (rating: number) => void
  remainingPoints: number
  allCharacters: Character[]
  currentCharacterIndex: number
  abilityType: "investigative" | "general"
}

export default function AbilitySelector({
  ability,
  currentRating,
  onChange,
  remainingPoints,
  allCharacters,
  currentCharacterIndex,
  abilityType,
}: AbilitySelectorProps) {
  const [showDescription, setShowDescription] = useState(false)

  const handleIncrease = () => {
    if (remainingPoints > 0 || currentRating > 0) {
      onChange(currentRating + 1)
    }
  }

  const handleDecrease = () => {
    if (currentRating > 0) {
      onChange(currentRating - 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    if (value >= 0) {
      onChange(value)
    }
  }

  const canIncrease = remainingPoints > 0 || currentRating > 0

  const getOtherCharactersUsage = () => {
    const usage: Array<{ characterName: string; rating: number; characterNumber: number }> = []

    allCharacters.forEach((char, index) => {
      if (index !== currentCharacterIndex && char.name) {
        const abilities = abilityType === "investigative" ? char.investigativeAbilities : char.generalAbilities
        const rating = abilities[ability.name]
        if (rating && rating > 0) {
          usage.push({
            characterName: char.name,
            rating: rating,
            characterNumber: index + 1,
          })
        }
      }
    })

    return usage
  }

  const otherUsage = getOtherCharactersUsage()

  return (
    <Card className={`${currentRating > 0 ? "ring-2 ring-blue-500" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm">{ability.name}</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setShowDescription(!showDescription)}
                  >
                    <Info className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{ability.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {ability.category && (
            <Badge variant="secondary" className="text-xs">
              {ability.category}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecrease}
              disabled={currentRating === 0}
              className="h-8 w-8 p-0 bg-transparent"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              min="0"
              value={currentRating}
              onChange={handleInputChange}
              className="w-16 text-center"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleIncrease}
              disabled={!canIncrease}
              className="h-8 w-8 p-0 bg-transparent"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          {currentRating > 0 && (
            <Badge variant="default">
              {currentRating} point{currentRating !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        {/* Other characters usage */}
        {otherUsage.length > 0 && (
          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
            <p className="text-xs font-medium text-amber-800 mb-1">Also chosen by:</p>
            <div className="flex flex-wrap gap-1">
              {otherUsage.map((usage) => (
                <Badge
                  key={usage.characterNumber}
                  variant="outline"
                  className="text-xs bg-amber-100 text-amber-800 border-amber-300"
                >
                  {usage.characterName} ({usage.rating}pt{usage.rating !== 1 ? "s" : ""})
                </Badge>
              ))}
            </div>
          </div>
        )}

        {showDescription && <CardDescription className="mt-2 text-xs">{ability.description}</CardDescription>}
      </CardContent>
    </Card>
  )
}
