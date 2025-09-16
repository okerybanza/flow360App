import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Settings, Type } from 'lucide-react'
import { useUserPreferences, FontSize } from '@/contexts/UserPreferencesContext'

export default function UserPreferences() {
  const { preferences, setFontSize } = useUserPreferences()

  const fontSizeOptions: { value: FontSize; label: string; description: string }[] = [
    { value: 'small', label: 'Petite', description: '14px - Compact' },
    { value: 'normal', label: 'Normale', description: '16px - Standard' },
    { value: 'large', label: 'Grande', description: '18px - Agrandie' }
  ]

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center">
          <Settings className="h-5 w-5 mr-2 text-blue-600" />
          Préférences utilisateur
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Personnalisez l'apparence de l'application selon vos préférences.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Font Size Settings */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Type className="h-4 w-4 text-gray-600" />
            <Label className="text-sm font-medium">Taille de police</Label>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {fontSizeOptions.map((option) => (
              <Button
                key={option.value}
                variant={preferences.fontSize === option.value ? 'default' : 'outline'}
                className={`h-auto p-3 flex flex-col items-center space-y-1 ${
                  preferences.fontSize === option.value 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'hover:bg-blue-50 hover:border-blue-200'
                }`}
                onClick={() => setFontSize(option.value)}
              >
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-xs opacity-80">{option.description}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Aperçu</Label>
          <div className="space-y-2">
            <h3 className="font-semibold">Titre d'exemple</h3>
            <p className="text-gray-600">
              Ceci est un exemple de texte avec la taille de police sélectionnée. 
              Vous pouvez voir comment le texte s'affichera dans l'application.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
