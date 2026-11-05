

import type {
  ReactNode,
} from 'react';
import { Virtuoso } from 'react-virtuoso';




import type {
  IListContext,
} from '@/app-types';
import { useLists } from "@/hooks/context/lists";



export function ListLayout(): ReactNode {
  const {
    data,
    // scrollIndex,
    renderRow,
  } = useLists() as unknown as IListContext;

  return (
    <Virtuoso
      // useWindowScroll // style={ListBoxSize}
      key="data-content"
      // initialTopMostItemIndex={scrollIndex ?? 0}
      data={data}
      itemContent={(i) => renderRow(i)}
    />
  )
}
