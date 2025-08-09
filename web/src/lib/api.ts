import { 
  Configuration, 
  AuthenticationApi, 
  IdeasApi, 
  TeamsApi, 
  WorksApi, 
  ApplicationsApi, 
  NotificationsApi, 
  AdminApi,
  SystemApi
} from '../generated'

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'https://raidhack-api.ukawamochi5.workers.dev'

function createConfiguration(): Configuration {
  const token = localStorage.getItem('jwt_token')
  return new Configuration({
    basePath: API_BASE_URL,
    accessToken: token || undefined,
  })
}

// Create API client instances
let authApi: AuthenticationApi
let ideasApi: IdeasApi
let teamsApi: TeamsApi
let worksApi: WorksApi
let applicationsApi: ApplicationsApi
let notificationsApi: NotificationsApi
let adminApi: AdminApi
let systemApi: SystemApi

// Initialize API clients
function initializeApiClients() {
  const config = createConfiguration()
  authApi = new AuthenticationApi(config)
  ideasApi = new IdeasApi(config)
  teamsApi = new TeamsApi(config)
  worksApi = new WorksApi(config)
  applicationsApi = new ApplicationsApi(config)
  notificationsApi = new NotificationsApi(config)
  adminApi = new AdminApi(config)
  systemApi = new SystemApi(config)
}

// Initialize on module load
initializeApiClients()

// Function to update all API instances with new token
export function updateApiConfiguration() {
  initializeApiClients()
}

// Export API clients
export { 
  authApi, 
  ideasApi, 
  teamsApi, 
  worksApi, 
  applicationsApi, 
  notificationsApi, 
  adminApi,
  systemApi
}