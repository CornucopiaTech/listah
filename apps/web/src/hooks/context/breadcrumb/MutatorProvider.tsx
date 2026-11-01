
import {
  useMemo,
} from 'react';

import type {
  ReactNode,
} from 'react';
import {
  useNavigate,
} from '@tanstack/react-router';



// Internal imports
import type {
  IMutatorContext,
  IUrlSearch,
} from "@/domain/entities";
import {
  MutatorContext
} from './useMutators';
import {
  encodeState,
} from '@/helpers/encoders';
import {
  DefaultItem,
  DefaultFilter,
  DefaultTag,
} from '@/domain/entities';



export function MutatorProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();


  const addNewItemClick = () => {
    navigate({
      to: ".",
      // @ts-ignore
      search: (prev: IUrlSearch) => {
        return {
          ...prev, e: encodeState({ obj: DefaultItem, flag: true, modal: "item" })
        }
      }
    });
  }

  const addNewFilterClick = () => {
    navigate({
      to: ".",
      // @ts-ignore
      search: (prev: IUrlSearch) => {
        return {
          ...prev, e: encodeState({ obj: DefaultFilter, flag: true, modal: "filter" })
        }
      }
    });
  }

  const addNewTagClick = () => {
    navigate({
      to: ".",
      // @ts-ignore
      search: (prev: IUrlSearch) => {
        return {
          ...prev, e: encodeState({ obj: DefaultTag, flag: true, modal: "tag" })
        }
      }
    });
  }

  const contextValue = useMemo(() => ({
    addNewItemClick,
    addNewFilterClick,
    addNewTagClick,
  } as unknown as IMutatorContext), []);


  return <MutatorContext.Provider value={contextValue}> {children} </MutatorContext.Provider>
}
