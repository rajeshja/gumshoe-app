import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Character } from "@/types/character"
import { useAbilities } from "@/contexts/AbilitiesContext"
import type { Ability } from "@/contexts/AbilitiesContext"

interface CharacterSheetProps {
  character: Character
}

export default function CharacterSheet({ character }: CharacterSheetProps) {
  const { abilitiesData } = useAbilities()

  const getAbilityDescription = (abilityName: string, type: "investigative" | "general"): string => {
    const abilities = abilitiesData.filter(a => a.ability_category === type)
    const ability = abilities.find((a) => a.ability_name === abilityName)
    return ability?.description || "No description available"
  }

  const getAbilityCategory = (abilityName: string): string => {
    const ability = abilitiesData.find((a) => 
      a.ability_name === abilityName && a.ability_category === 'investigative'
    )
    return ability?.ability_type || ""
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white print:p-4 print:max-w-none">
      {/* Header */}
      <div className="text-center mb-8 print:mb-6">
        <h1 className="text-3xl font-bold text-gray-800 print:text-2xl">{character.name || "Unnamed Character"}</h1>
        <p className="text-lg text-gray-600 print:text-base">Gumshoe Investigator</p>
      </div>

      {/* Basic Information */}
      <Card className="mb-6 print:mb-4">
        <CardHeader>
          <CardTitle>Character Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700">Motivation</h3>
            <p className="text-gray-600">{character.motivation || "Not specified"}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold text-gray-700">Background</h3>
            <p className="text-gray-600">{character.background || "Not specified"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Investigative Abilities */}
      <Card className="mb-6 print:mb-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Investigative Abilities
            <Badge variant="secondary">{character.investigativePointsSpent} points spent</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(character.investigativeAbilities).length === 0 ? (
            <p className="text-gray-500 italic">No investigative abilities selected</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Ability</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(character.investigativeAbilities).map(([name, rating]) => (
                    <tr key={name}>
                      <td className="border border-gray-300 px-4 py-2 font-medium">{name}</td>
                      <td className="border border-gray-300 px-4 py-2">{getAbilityCategory(name)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center font-bold">{rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* General Abilities */}
      <Card className="mb-6 print:mb-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            General Abilities
            <Badge variant="secondary">{character.generalPointsSpent} points spent</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(character.generalAbilities).length === 0 ? (
            <p className="text-gray-500 italic">No general abilities selected</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Ability</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(character.generalAbilities).map(([name, rating]) => (
                    <tr key={name}>
                      <td className="border border-gray-300 px-4 py-2 font-medium">{name}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center font-bold">{rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ability Descriptions */}
      <Card className="print:mb-4">
        <CardHeader>
          <CardTitle>Ability Descriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.keys(character.investigativeAbilities).length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Investigative Abilities</h3>
                <div className="space-y-2">
                  {Object.keys(character.investigativeAbilities).map((abilityName) => (
                    <div key={abilityName} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-800">{abilityName}</h4>
                      <p className="text-sm text-gray-600">{getAbilityDescription(abilityName, "investigative")}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(character.generalAbilities).length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">General Abilities</h3>
                <div className="space-y-2">
                  {Object.keys(character.generalAbilities).map((abilityName) => (
                    <div key={abilityName} className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium text-gray-800">{abilityName}</h4>
                      <p className="text-sm text-gray-600">{getAbilityDescription(abilityName, "general")}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
