
import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { createAppNavBarStore } from '@/lib/store/appNavBar/appNavBarStore';

export type AppNavBarStoreApi = ReturnType<typeof createAppNavBarStore>


export const AppNavBarStoreContext = createContext<AppNavBarStoreApi | undefined>(
  undefined,
)

export interface AppNavBarStoreProviderProps {
  children: ReactNode
}

export const AppNavBarStoreProvider = ({
  children,
}: AppNavBarStoreProviderProps) => {
  const storeRef = useRef<AppNavBarStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createAppNavBarStore();
  }

  return (
    <AppNavBarStoreContext.Provider value={storeRef.current}>
      {children}
    </AppNavBarStoreContext.Provider>
  )
}

export const useAppNavBarStore = <T,>(
  selector: (store: AppNavBarStore) => T,
): T => {
  const appNavBarStoreContext = useContext(AppNavBarStoreContext)

  if (!appNavBarStoreContext) {
    throw new Error(`useAppNavBarStore must be used within AppNavBarStoreProvider`)
  }

  return useStore(appNavBarStoreContext, selector)
}
