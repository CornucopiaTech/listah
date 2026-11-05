import type {
  ChangeEvent,
  MouseEvent,
} from 'react';




import {
  type IPagination,
} from "./pagination";



export type IPagingContext = {
  pagination: IPagination,
  pageChange: (event: MouseEvent<HTMLButtonElement> | null, value: number) => void,
  pageSizeChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
}
