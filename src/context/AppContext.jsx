import React, { createContext, useState, useMemo } from 'react'

export const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [hintsVisible, setHintsVisible] = useState(true)

  function toggleHints() {
    setHintsVisible((v) => !v)
  }

  const value = useMemo(() => ({ hintsVisible, toggleHints }), [hintsVisible])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
