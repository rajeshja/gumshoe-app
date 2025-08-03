"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AbilitySelector from "./AbilitySelector"
import RemainingPoints from "./RemainingPoints"
import type { Character } from "@/types/character"
import { useAbilities } from "@/contexts/AbilitiesContext"
import type { Ability } from "@/contexts/AbilitiesContext"

interface CharacterCreatorProps {
  character: Character
  characterNumber: number
  totalCharacters: number
  investigativeBuildPoints: number
  generalBuildPoints: number
  allCharacters: Character[]
  currentCharacterIndex: number
  onComplete: (character: Character) => void
  onBack?: () => void
}

export default function CharacterCreator({
  character,
  characterNumber,
  totalCharacters,
  investigativeBuildPoints,
  generalBuildPoints,
  allCharacters,
  currentCharacterIndex,
  onComplete,
  onBack,
}: CharacterCreatorProps) {
  const { abilitiesData } = useAbilities()
  const [currentCharacter, setCurrentCharacter] = useState<Character>(character)
  const [activeTab, setActiveTab] = useState<string>("basic")
  
  // Filter abilities by category
  const investigativeAbilitiesList = abilitiesData.filter(
    (ability) => ability.ability_category === "investigative"
  )
  const generalAbilitiesList = abilitiesData.filter(
    (ability) => ability.ability_category === "general"
  )

  useEffect(() => {
    setCurrentCharacter(character)
  }, [character])

  const handleBasicInfoChange = (field: keyof Character, value: string) => {
    setCurrentCharacter((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAbilityChange = (abilityName: string, rating: number, type: "investigative" | "general") => {
    setCurrentCharacter((prev) => {
      const abilities = type === "investigative" ? prev.investigativeAbilities : prev.generalAbilities
      const newAbilities = { ...abilities }

      if (rating === 0) {
        delete newAbilities[abilityName]
      } else {
        newAbilities[abilityName] = rating
      }

      const pointsSpent = Object.values(newAbilities).reduce((sum, rating) => sum + rating, 0)

      return {
        ...prev,
        [type === "investigative" ? "investigativeAbilities" : "generalAbilities"]: newAbilities,
        [type === "investigative" ? "investigativePointsSpent" : "generalPointsSpent"]: pointsSpent,
      }
    })
  }

  const handleComplete = () => {
    onComplete(currentCharacter)
  }

  const canComplete =
    currentCharacter.name.trim() !== "" &&
    currentCharacter.investigativePointsSpent <= investigativeBuildPoints &&
    currentCharacter.generalPointsSpent <= generalBuildPoints

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Character {characterNumber} of {totalCharacters}
        </h2>
        <p className="text-gray-600">Create your Gumshoe investigator</p>
      </div>

      {/* Sticky Navigation Buttons */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 py-4 mb-6">
        <div className="flex justify-between items-center">
          {onBack ? (
            <Button variant="outline" onClick={onBack}>
              Previous Character
            </Button>
          ) : (
            <div></div>
          )}
          <div className="text-center">
            <span className="text-sm font-medium text-gray-600">
              Character {characterNumber} of {totalCharacters}
            </span>
          </div>
          <Button onClick={handleComplete} disabled={!canComplete}>
            {characterNumber === totalCharacters ? "Generate Character Sheets" : "Next Character"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Character Creation</CardTitle>
          <CardDescription>Fill in your character's details and select abilities</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="investigative">Investigative Abilities</TabsTrigger>
              <TabsTrigger value="general">General Abilities</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              {/* Basic info content remains the same */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Character Name *</Label>
                  <Input
                    id="name"
                    value={currentCharacter.name}
                    onChange={(e) => handleBasicInfoChange("name", e.target.value)}
                    placeholder="Enter character name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="motivation">Motivation</Label>
                  <Input
                    id="motivation"
                    value={currentCharacter.motivation}
                    onChange={(e) => handleBasicInfoChange("motivation", e.target.value)}
                    placeholder="What drives your character?"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="background">Background</Label>
                <Textarea
                  id="background"
                  value={currentCharacter.background}
                  onChange={(e) => handleBasicInfoChange("background", e.target.value)}
                  placeholder="Describe your character's background and history"
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="investigative" className="space-y-4">
              {/* Sticky Build Points for Investigative */}
              <div className="sticky top-24 z-10 bg-white pb-4">
                <RemainingPoints
                  spent={currentCharacter.investigativePointsSpent}
                  total={investigativeBuildPoints}
                  type="Investigative"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investigativeAbilitiesList.map((ability) => (
                  <AbilitySelector
                    key={ability.ability_name}
                    ability={{
                      name: ability.ability_name,
                      category: ability.ability_type,
                      description: ability.description
                    }}
                    currentRating={currentCharacter.investigativeAbilities[ability.ability_name] || 0}
                    onChange={(rating) => handleAbilityChange(ability.ability_name, rating, "investigative")}
                    remainingPoints={investigativeBuildPoints - currentCharacter.investigativePointsSpent}
                    allCharacters={allCharacters}
                    currentCharacterIndex={currentCharacterIndex}
                    abilityType="investigative"
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="general" className="space-y-4">
              {/* Sticky Build Points for General */}
              <div className="sticky top-24 z-10 bg-white pb-4">
                <RemainingPoints
                  spent={currentCharacter.generalPointsSpent}
                  total={generalBuildPoints}
                  type="General"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generalAbilitiesList.map((ability) => (
                  <AbilitySelector
                    key={ability.ability_name}
                    ability={{
                      name: ability.ability_name,
                      category: ability.ability_type,
                      description: ability.description
                    }}
                    currentRating={currentCharacter.generalAbilities[ability.ability_name] || 0}
                    onChange={(rating) => handleAbilityChange(ability.ability_name, rating, "general")}
                    remainingPoints={generalBuildPoints - currentCharacter.generalPointsSpent}
                    allCharacters={allCharacters}
                    currentCharacterIndex={currentCharacterIndex}
                    abilityType="general"
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
