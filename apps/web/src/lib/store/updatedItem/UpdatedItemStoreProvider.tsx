// src/providers/counter-store-provider.tsx
'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type UpdateItemStore, createUpdatedItemStore } from './updatedItemStore';

export type UpdatedItemStoreApi = ReturnType<typeof createUpdatedItemStore>

export const UpdatedItemStoreContext = createContext<UpdatedItemStoreApi | undefined>(
  undefined,
)

export interface UpdatedItemStoreProviderProps {
  children: ReactNode
}

export const UpdatedItemStoreProvider = ({
  children,
}: UpdatedItemStoreProviderProps) => {
  const storeRef = useRef<UpdatedItemStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createUpdatedItemStore();
  }

  return (
    <UpdatedItemStoreContext.Provider value={storeRef.current}>
      {children}
    </UpdatedItemStoreContext.Provider>
  )
}

export const useUpdatedItemStore = <T,>(
  selector: (store: UpdateItemStore) => T,
): T => {
  const updatedItemStoreContext = useContext(UpdatedItemStoreContext)

  if (!updatedItemStoreContext) {
    throw new Error(`useUpdatedItemStore must be used within UpdatedItemStoreProvider`)
  }

  return useStore(updatedItemStoreContext, selector)
}
