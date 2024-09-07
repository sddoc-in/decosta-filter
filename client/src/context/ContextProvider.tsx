import React from 'react'
import AppProvider from './Context'
import ExcelProvider from './ExcelContext'

export default function ContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
        <ExcelProvider>
        {children}
        </ExcelProvider>
    </AppProvider>
  )
}