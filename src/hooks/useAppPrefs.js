import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

export function useAppPrefs() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppPrefs must be used inside AppProvider')
  return ctx
}
