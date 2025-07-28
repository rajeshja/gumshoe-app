export interface Ability {
  name: string
  category?: string
  description: string
}

export interface Character {
  id: number
  name: string
  motivation: string
  background: string
  investigativeAbilities: Record<string, number>
  generalAbilities: Record<string, number>
  investigativePointsSpent: number
  generalPointsSpent: number
}
