// src/providers/counter-store-provider.tsx
'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { ItemsStore, createItemsStore } from '@/lib/store/items/itemsStore';

export type ItemsStoreApi = ReturnType<typeof createItemsStore>

export const ItemsStoreContext = createContext<ItemsStoreApi | undefined>(
  undefined,
)

export interface ItemsStoreProviderProps {
  children: ReactNode
}

export const ItemsStoreProvider = ({
  children,
}: ItemsStoreProviderProps) => {
  const storeRef = useRef<ItemsStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createItemsStore();
  }

  return (
    <ItemsStoreContext.Provider value={storeRef.current}>
      {children}
    </ItemsStoreContext.Provider>
  )
}

export const useItemsStore = <T,>(
  selector: (store: ItemsStore) => T,
): T => {
  const itemsStoreContext = useContext(ItemsStoreContext)

  if (!itemsStoreContext) {
    throw new Error(`useItemsStore must be used within ItemsStoreProvider`)
  }

  return useStore(itemsStoreContext, selector)
}
