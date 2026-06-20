
import type {
  ReactNode,
} from 'react';
import {
  useRef,
} from 'react';
import {
  type UseSuspenseQueryResult,
} from '@tanstack/react-query';
import { useUser } from '@clerk/react';

// Internal imports

import {
  useAppStore,
  type TAppStore
} from '@/hooks/store/boundStore';
import type {
  IItem,
  ITag,
  ITagReadResponse,
  IFilter,
} from "@/domain/entities";
import {
  DefaultReadRequest,
  DefaultReadQuery,
  DefaultPagination,
} from '@/domain/entities';
import {
  useListTag
} from '@/hooks/queries';
import {
  FormDataContext
} from './useForm';



export function ItemFormDataProvider({ children, displayTag, displayFilter }: { children: ReactNode, displayTag?: ITag, displayFilter?: IFilter }) {
  const { user } = useUser();
  const store: TAppStore = useAppStore((state) => state);
  const item: IItem = store.displayItem;
  const tagQuery = {
    ...DefaultReadRequest,
    query: { ...DefaultReadQuery, userId: user?.id || "" },
    pagination: { ...DefaultPagination, pageSize: -1, }
  }
  const {
    isPending, isError, data, error
  }: UseSuspenseQueryResult<ITagReadResponse> = useListTag(tagQuery);



  const serverTags: ITag[] = data?.tags ?? [];
  const knownServerTagNames = useRef<Set<string>>(new Set(serverTags.map(p => p.name)));


  const serverTagPropMap = new Map<string, { value: string[] }>(Object.entries(data?.tagidPropMap ?? {}));

  // Use the list of all possible tags for the display object using the tags in the item iteself and the tags from the passed tag or passed filter.
  let allItemTags = item && item.tags ? [...item.tags] : [];
  let tgs = item && item.tags ? [...item.tags] : [];
  if (displayTag) {
    tgs = [...tgs, displayTag.id]
    allItemTags = [...allItemTags, displayTag.id]
  }
  if (displayFilter) {
    tgs = [...tgs, ...displayFilter.tags]
    allItemTags = [...allItemTags, ...displayFilter.tags]
  }
  allItemTags = [...new Set(allItemTags)]
  tgs = [...new Set(tgs)]

  // Use this comprehensive list of tags to get all possible properties for the display item using serverTags.
  let displayItemProps: string[] = []
  allItemTags.forEach(
    (it) => {
      const iVal = serverTagPropMap.get(it);
      if (iVal) {
        displayItemProps = [...displayItemProps, ...iVal.value]
      }
    }
  );
  displayItemProps = [...new Set(displayItemProps)]


  // Get the key-values object for the identified properties.
  const displayItemPropsObj = displayItemProps.map((tg) => {
    const ap = item?.propObjs?.filter(ip => ip.key == tg) ?? []
    if (ap.length == 0) {
      return { key: tg, value: "" }
    }
    return ap[0]
  })

  let tagObj: ITag[] = []
  allItemTags.forEach((tg: string) => {
    const ap = serverTags?.filter(ip => ip.id == tg) ?? [];
    if (ap.length > 0) {
      tagObj = [...tagObj, ap[0]]
    }
  });


  const formData = {
    data: {
      id: item.id, userId: item.userId, name: item.name,
      note: item.note, props: displayItemPropsObj, tags: tagObj,
      softDelete: item.softDelete
    },
    knownTags: knownServerTagNames
  };


  return <FormDataContext.Provider value={{ isPending, isError, data, formData, error }}>
    {children}
  </FormDataContext.Provider>
}
