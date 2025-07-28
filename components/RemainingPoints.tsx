import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RemainingPointsProps {
  spent: number
  total: number
  type: string
}

export default function RemainingPoints({ spent, total, type }: RemainingPointsProps) {
  const remaining = total - spent
  const isOverspent = remaining < 0

  return (
    <Card className={`${isOverspent ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"} shadow-md`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">{type} Build Points</h3>
            <p className="text-sm text-gray-600">
              {spent} of {total} points spent
            </p>
          </div>
          <Badge
            variant={isOverspent ? "destructive" : remaining === 0 ? "default" : "secondary"}
            className="text-lg px-3 py-1"
          >
            {remaining} remaining
          </Badge>
        </div>
        {isOverspent && <p className="text-red-600 text-sm mt-2">⚠️ You have exceeded your build point limit!</p>}
      </CardContent>
    </Card>
  )
}
