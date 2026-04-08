export type AppName = 'OpenDroneMap'
// Intentionally extensible — add new app names here

export interface Mission {
  id: string
  name: string
  createdAt: string
  areaHectares: number
  quality: number
  app: AppName
  rtkEnabled: boolean
  highestPointMeters: number
}

export type Screen =
  | 'home'
  | 'mission-list'
  | 'wizard-step1'
  | 'wizard-step2'
  | 'wizard-step3'
  | 'wizard-step4'
  | 'wizard-ready'

export interface WizardState {
  editingMission: Mission | null
  name: string
  quality: number
  app: AppName
  rtkEnabled: boolean
  highestPointMeters: number
}
