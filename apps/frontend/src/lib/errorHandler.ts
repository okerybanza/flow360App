// Types d'erreurs
export interface ApiError {
  statusCode: number
  message: string | string[]
  error: string
}

export interface ErrorNotification {
  title: string
  message: string
  type: 'error' | 'warning' | 'info'
}

// Messages d'erreur par type
const ERROR_MESSAGES = {
  // Erreurs de validation (400)
  VALIDATION_ERROR: {
    title: 'Données invalides',
    message: 'Veuillez vérifier les informations saisies et réessayer.',
    type: 'warning' as const
  },

  // Erreurs d'authentification (401)
  UNAUTHORIZED: {
    title: 'Non autorisé',
    message: 'Votre session a expiré. Veuillez vous reconnecter.',
    type: 'error' as const
  },

  // Erreurs de conflit (409) - Email existe déjà
  CONFLICT: {
    title: 'Conflit détecté',
    message: 'Cette ressource existe déjà ou est en conflit avec une autre.',
    type: 'warning' as const
  },

  // Erreurs serveur (500+)
  SERVER_ERROR: {
    title: 'Erreur serveur',
    message: 'Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.',
    type: 'error' as const
  },

  // Erreurs réseau
  NETWORK_ERROR: {
    title: 'Erreur de connexion',
    message: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
    type: 'error' as const
  },

  // Erreurs spécifiques
  CLIENT: {
    EMAIL_EXISTS: {
      title: 'Email déjà utilisé',
      message: 'Un client avec cet email existe déjà. Veuillez utiliser un autre email.',
      type: 'warning' as const
    }
  },

  USER: {
    EMAIL_EXISTS: {
      title: 'Email déjà utilisé',
      message: 'Un utilisateur avec cet email existe déjà.',
      type: 'warning' as const
    },
    INVALID_CREDENTIALS: {
      title: 'Identifiants invalides',
      message: 'Email ou mot de passe incorrect. Veuillez réessayer.',
      type: 'error' as const
    }
  }
}

// Fonction principale pour gérer les erreurs
export function handleApiError(error: any): ErrorNotification {
  console.error('API Error:', error)

  // Erreur réseau
  if (!error.response) {
    return ERROR_MESSAGES.NETWORK_ERROR
  }

  const { status, data } = error.response
  const apiError = data as ApiError

  // Gestion par code de statut
  switch (status) {
    case 400:
      return handleValidationError(apiError)
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED
    case 409:
      return handleConflictError(apiError)
    case 500:
      return ERROR_MESSAGES.SERVER_ERROR
    default:
      return ERROR_MESSAGES.SERVER_ERROR
  }
}

// Gestion des erreurs de validation
function handleValidationError(apiError: ApiError): ErrorNotification {
  const message = Array.isArray(apiError.message) 
    ? apiError.message.join(', ')
    : apiError.message

  // Détection d'erreurs spécifiques
  if (message.toLowerCase().includes('email')) {
    if (message.toLowerCase().includes('already exists') || message.toLowerCase().includes('unique')) {
      return ERROR_MESSAGES.CLIENT.EMAIL_EXISTS
    }
  }

  if (message.toLowerCase().includes('password')) {
    return ERROR_MESSAGES.USER.INVALID_CREDENTIALS
  }

  return {
    title: ERROR_MESSAGES.VALIDATION_ERROR.title,
    message: message || ERROR_MESSAGES.VALIDATION_ERROR.message,
    type: ERROR_MESSAGES.VALIDATION_ERROR.type
  }
}

// Gestion des erreurs de conflit
function handleConflictError(apiError: ApiError): ErrorNotification {
  const message = Array.isArray(apiError.message) 
    ? apiError.message.join(', ')
    : apiError.message

  if (message.toLowerCase().includes('email')) {
    return ERROR_MESSAGES.CLIENT.EMAIL_EXISTS
  }

  return ERROR_MESSAGES.CONFLICT
}

// Fonction pour les succès
export function getSuccessMessage(action: string, entity: string): { title: string; message: string } {
  const messages = {
    CREATE: `Le ${entity} a été créé avec succès.`,
    UPDATE: `Le ${entity} a été mis à jour avec succès.`,
    DELETE: `Le ${entity} a été supprimé avec succès.`,
    LOGIN: 'Connexion réussie !',
    LOGOUT: 'Déconnexion réussie.'
  }

  return {
    title: 'Succès !',
    message: messages[action as keyof typeof messages] || `Action ${action} réussie.`
  }
}
