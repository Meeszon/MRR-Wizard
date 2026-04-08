import type { Mission } from './types'

export const mockMissions: Mission[] = [
  {
    id: '1',
    name: 'Bouwplaats Noord',
    createdAt: '2025-03-28',
    areaHectares: 2.4,
    quality: 65,
    app: 'OpenDroneMap',
    rtkEnabled: true,
    highestPointMeters: 45,
  },
  {
    id: '2',
    name: 'Fundering Blok B',
    createdAt: '2025-04-01',
    areaHectares: 0.8,
    quality: 35,
    app: 'OpenDroneMap',
    rtkEnabled: false,
    highestPointMeters: 30,
  },
  {
    id: '3',
    name: 'Wegcorridor Fase 2',
    createdAt: '2025-04-05',
    areaHectares: 5.1,
    quality: 80,
    app: 'OpenDroneMap',
    rtkEnabled: true,
    highestPointMeters: 12,
  },
]
