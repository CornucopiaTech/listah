
import { TableVirtuoso, } from 'react-virtuoso';


import { useTables } from "@/hooks/context";
import type {
  ITableContext,
} from '@/domain/entities';





export function TableLayout() {
  const {
    data,
    // scrollIndex,
    headerContent,
    renderCell,
    components,
  } = useTables() as unknown as ITableContext;

  return (
    <TableVirtuoso
      data={data}
      components={components}
      fixedHeaderContent={headerContent}
      itemContent={renderCell}
    />
  );
}
