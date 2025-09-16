import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Plus, ArrowRight } from 'lucide-react'

interface ProjectCreationPromptProps {
  client: {
    id: string
    firstName: string
    lastName: string
    companyName?: string
  }
  onCreateProject: () => void
  onViewClient: () => void
}

export default function ProjectCreationPrompt({ 
  client, 
  onCreateProject, 
  onViewClient 
}: ProjectCreationPromptProps) {
  const clientName = client.companyName || `${client.firstName} ${client.lastName}`

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-xl text-green-800">
          Client créé avec succès !
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            Le client <strong>{clientName}</strong> a été créé avec succès.
          </p>
          <p className="text-sm text-gray-500">
            Que souhaitez-vous faire maintenant ?
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onCreateProject}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer le premier projet
          </Button>
          
          <Button
            onClick={onViewClient}
            variant="outline"
            className="w-full"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Voir la fiche client
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
