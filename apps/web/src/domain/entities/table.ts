import type {
  ReactNode,
} from 'react';




import {
  type ITag,
} from "./tag";
import {
  type IFilter,
} from "./filter";
import {
  type IItem,
} from "./item";
import type { TableComponents } from 'react-virtuoso';


export interface ITableColumnData {
  dataKey: string;
  label: string;
  numeric?: boolean;
  width?: number;
}


export type ITableContext = {
  data: [],
  isPending: boolean,
  isError: boolean,
  isFetching: boolean,
  error: Error | null,
  scrollIndex: number,
  headerContent: () => ReactNode,
  renderCell: (idx: number) => ReactNode,
  clickRow: (idx: number) => void,
  components: TableComponents<IFilter | ITag | IItem>,
}
