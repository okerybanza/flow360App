import { useState } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useNotifications } from '@/hooks/useNotifications'
import { projectsAPI, companySettingsAPI } from '@/lib/api'
import { handleApiError, getSuccessMessage } from '@/lib/errorHandler'
import { ArrowLeft, CheckCircle, User, Building2 } from 'lucide-react'
import ClientFormInline from './ClientFormInline'
import ProjectCreationPrompt from './ProjectCreationPrompt'

interface ClientProjectFlowProps {
  onComplete?: () => void
}

export default function ClientProjectFlow({ onComplete }: ClientProjectFlowProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState<'client' | 'project-choice' | 'project' | 'success'>('client')
  const [clientData, setClientData] = useState<{
    id?: string
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    type: 'INDIVIDUAL' | 'COMPANY'
    companyName: string
    website: string
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    type: 'INDIVIDUAL',
    companyName: '',
    website: ''
  })
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    budget: 0,
    startDate: '',
    endDate: ''
  })
  const [createdClientId, setCreatedClientId] = useState<string>('')


  const queryClient = useQueryClient()
  const { showNotification } = useNotifications()

  // Get company settings for currency
  const { data: companySettings } = useQuery({
    queryKey: ['company-settings'],
    queryFn: () => companySettingsAPI.get(),
  })



  const createProjectMutation = useMutation({
    mutationFn: (data: any) => projectsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      const success = getSuccessMessage('CREATE', 'projet')
      showNotification({
        type: 'success',
        title: success.title,
        message: success.message
      })
      setStep('success')
    },
    onError: (error: any) => {
      const errorNotification = handleApiError(error)
      showNotification({
        type: errorNotification.type,
        title: errorNotification.title,
        message: errorNotification.message
      })
    }
  })



  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const projectDataWithDates = {
      ...projectData,
      clientId: createdClientId,
      startDate: projectData.startDate || new Date().toISOString(),
      endDate: projectData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
    createProjectMutation.mutate(projectDataWithDates)
  }



  const handleBack = () => {
    if (step === 'project-choice') {
      setStep('client')
    } else if (step === 'project') {
      setStep('project-choice')
    }
  }

  const handleComplete = () => {
    onComplete?.()
  }

  const handleCreateProject = () => {
    setStep('project')
  }

  const handleViewClient = () => {
    // Navigate to the client's detail page and close the flow
    navigate(`/clients?selected=${createdClientId}`)
    onComplete?.()
  }

  return (
    <div className="min-h-screen bg-[#f7f9fa] py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#202124] mb-2">
            Nouveau Client & Projet
          </h1>
          <p className="text-[#5f6368] mb-4">
            Créez un nouveau client et choisissez de créer son premier projet maintenant ou plus tard
          </p>
          
          {/* Step Title */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[#202124]">
              {step === 'client' && 'Étape 1 : Informations du Client'}
              {step === 'project-choice' && 'Étape 2 : Choix du Projet'}
              {step === 'project' && 'Étape 3 : Création du Projet'}
              {step === 'success' && 'Terminé !'}
            </h2>
            <p className="text-[#5f6368] mt-1">
              {step === 'client' && 'Remplissez les informations du nouveau client'}
              {step === 'project-choice' && 'Choisissez de créer un projet maintenant ou plus tard'}
              {step === 'project' && 'Créez le premier projet pour ce client'}
              {step === 'success' && 'Le client et le projet ont été créés avec succès'}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {/* Step 1: Client */}
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step === 'client' ? 'bg-[#0061fe] text-white border-[#0061fe]' : 
                step === 'project-choice' || step === 'project' || step === 'success' ? 'bg-[#137333] text-white border-[#137333]' : 'bg-white text-[#5f6368] border-[#dadce0]'
              }`}>
                {step === 'success' ? <CheckCircle className="w-6 h-6" /> : '1'}
              </div>
              <span className={`text-sm font-medium mt-2 ${
                step === 'client' ? 'text-[#0061fe]' : 
                step === 'project-choice' || step === 'project' || step === 'success' ? 'text-[#137333]' : 'text-[#5f6368]'
              }`}>
                Client
              </span>
            </div>

            {/* Connector */}
            <div className={`w-20 h-1 ${
              step === 'project-choice' || step === 'project' || step === 'success' ? 'bg-[#137333]' : 'bg-[#dadce0]'
            }`}></div>

            {/* Step 2: Choix */}
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step === 'project-choice' ? 'bg-[#0061fe] text-white border-[#0061fe]' : 
                step === 'project' || step === 'success' ? 'bg-[#137333] text-white border-[#137333]' : 'bg-white text-[#5f6368] border-[#dadce0]'
              }`}>
                {step === 'success' ? <CheckCircle className="w-6 h-6" /> : '2'}
              </div>
              <span className={`text-sm font-medium mt-2 ${
                step === 'project-choice' ? 'text-[#0061fe]' : 
                step === 'project' || step === 'success' ? 'text-[#137333]' : 'text-[#5f6368]'
              }`}>
                Choix
              </span>
            </div>

            {/* Connector */}
            <div className={`w-20 h-1 ${
              step === 'project' || step === 'success' ? 'bg-[#137333]' : 'bg-[#dadce0]'
            }`}></div>

            {/* Step 3: Projet */}
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step === 'project' ? 'bg-[#0061fe] text-white border-[#0061fe]' : 
                step === 'success' ? 'bg-[#137333] text-white border-[#137333]' : 'bg-white text-[#5f6368] border-[#dadce0]'
              }`}>
                {step === 'success' ? <CheckCircle className="w-6 h-6" /> : '3'}
              </div>
              <span className={`text-sm font-medium mt-2 ${
                step === 'project' ? 'text-[#0061fe]' : 
                step === 'success' ? 'text-[#137333]' : 'text-[#5f6368]'
              }`}>
                Projet
              </span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {step === 'client' && (
          <Card className="card-dropbox">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-[#0061fe]" />
                Informations du Client
              </CardTitle>
              <CardDescription>
                Remplissez les informations du nouveau client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientFormInline 
                onSuccess={(formData) => {
                  console.log('✅ Client créé avec succès:', formData)
                  // S'assurer que clientData a un id
                  const clientWithId = { 
                    ...formData, 
                    id: formData.id,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    companyName: formData.companyName || ''
                  }
                  console.log('📊 clientWithId:', clientWithId)
                  setClientData(clientWithId)
                  setCreatedClientId(formData.id!)
                  console.log('🔄 Passage à l\'étape project-choice')
                  setStep('project-choice')
                }}
              />
            </CardContent>
          </Card>
        )}

        {step === 'project-choice' && clientData.id && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleBack} className="btn-dropbox-outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux informations client
              </Button>
            </div>
            <ProjectCreationPrompt
              client={clientData as { id: string; firstName: string; lastName: string; companyName?: string }}
              onCreateProject={handleCreateProject}
              onViewClient={handleViewClient}
            />
          </div>
        )}

        {step === 'project' && (
          <Card className="card-dropbox">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5 text-[#0061fe]" />
                  Premier Projet
                </CardTitle>
                <Button variant="outline" onClick={handleBack} className="btn-dropbox-outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
              </div>
              <CardDescription>
                Créez le premier projet pour ce client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du projet *</Label>
                  <Input
                    id="title"
                    value={projectData.title}
                    onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                    placeholder="Titre du projet"
                    className="input-dropbox"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={projectData.description}
                    onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                    placeholder="Description du projet"
                    className="input-dropbox"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">
                      Budget ({companySettings?.currency === 'USD' ? '$' : companySettings?.currency === 'EUR' ? '€' : companySettings?.currency === 'GBP' ? '£' : companySettings?.currency || '€'})
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      value={projectData.budget}
                      onChange={(e) => setProjectData({ ...projectData, budget: Number(e.target.value) })}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="input-dropbox"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Date de début</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={projectData.startDate}
                      onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
                      className="input-dropbox"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Date de fin</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={projectData.endDate}
                      onChange={(e) => setProjectData({ ...projectData, endDate: e.target.value })}
                      className="input-dropbox"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full btn-dropbox-primary"
                  disabled={createProjectMutation.isPending}
                >
                  {createProjectMutation.isPending ? 'Création...' : 'Créer le projet'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'success' && (
          <Card className="card-dropbox">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="mx-auto h-16 w-16 text-[#137333] mb-4" />
                <h2 className="text-2xl font-bold text-[#202124] mb-2">
                  Félicitations !
                </h2>
                <p className="text-[#5f6368] mb-6">
                  Le client et le projet ont été créés avec succès.
                </p>
                <div className="bg-[#e8f2ff] p-4 rounded-lg mb-6">
                  <p className="text-[#0061fe] font-medium">
                    <strong>Client :</strong> {clientData.type === 'COMPANY' && clientData.companyName 
                      ? clientData.companyName 
                      : `${clientData.firstName} ${clientData.lastName}`
                    }
                  </p>
                  <p className="text-[#5f6368] text-sm">
                    Email : {clientData.email}
                  </p>
                  {projectData.title && (
                    <p className="text-[#0061fe] font-medium mt-2">
                      <strong>Projet :</strong> {projectData.title}
                    </p>
                  )}
                </div>

                <Button onClick={handleComplete} className="btn-dropbox-primary">
                  Terminer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
