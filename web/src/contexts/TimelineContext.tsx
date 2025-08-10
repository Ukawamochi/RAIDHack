import { createContext, useContext, useState, ReactNode } from 'react'

interface TimelineContextType {
  refreshTrigger: number
  triggerRefresh: () => void
}

const TimelineContext = createContext<TimelineContextType | null>(null)

interface TimelineProviderProps {
  children: ReactNode
}

export function TimelineProvider({ children }: TimelineProviderProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <TimelineContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </TimelineContext.Provider>
  )
}

export function useTimeline() {
  const context = useContext(TimelineContext)
  if (!context) {
    throw new Error('useTimeline must be used within a TimelineProvider')
  }
  return context
}