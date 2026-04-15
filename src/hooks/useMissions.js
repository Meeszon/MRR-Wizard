import { useContext } from 'react'
import { MissionsContext } from '../context/MissionsContext'

export function useMissions() {
  const ctx = useContext(MissionsContext)
  if (!ctx) throw new Error('useMissions must be used inside MissionsProvider')
  return ctx
}
