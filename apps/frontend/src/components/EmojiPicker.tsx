import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Heart, 
  ThumbsUp, 
  Star, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb, 
  Target, 
  Trophy,
  Zap,
  Sparkles,
  Coffee,
  Pizza,
  Beer,
  Wine,
  Cake,
  IceCream
} from 'lucide-react'

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
}

const emojis = [
  { icon: Heart, label: 'Love', emoji: '❤️' },
  { icon: ThumbsUp, label: 'Like', emoji: '👍' },
  { icon: Star, label: 'Star', emoji: '⭐' },
  { icon: CheckCircle, label: 'Check', emoji: '✅' },
  { icon: AlertCircle, label: 'Alert', emoji: '⚠️' },
  { icon: Lightbulb, label: 'Idea', emoji: '💡' },
  { icon: Target, label: 'Target', emoji: '🎯' },
  { icon: Trophy, label: 'Trophy', emoji: '🏆' },
  { icon: Zap, label: 'Zap', emoji: '⚡' },
  { icon: Sparkles, label: 'Sparkles', emoji: '✨' },
  { icon: Coffee, label: 'Coffee', emoji: '☕' },
  { icon: Pizza, label: 'Pizza', emoji: '🍕' },
  { icon: Beer, label: 'Beer', emoji: '🍺' },
  { icon: Wine, label: 'Wine', emoji: '🍷' },
  { icon: Cake, label: 'Cake', emoji: '🎂' },
  { icon: IceCream, label: 'Ice Cream', emoji: '🍦' }
]

export default function EmojiPicker({ onSelect }: EmojiPickerProps) {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="text-lg">Choisir une réaction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {emojis.map((item) => (
            <Button
              key={item.emoji}
              variant="ghost"
              size="sm"
              className="h-12 w-12 p-0 hover:bg-gray-100"
              onClick={() => onSelect(item.emoji)}
              title={item.label}
            >
              <span className="text-xl">{item.emoji}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
