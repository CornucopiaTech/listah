import type { ITagReadRequest } from '@/lib/model/tag';
import type { IFilterReadRequest } from '@/lib/model/filter';


export type THomeQueryParams = {
  tag: ITagReadRequest;
  savedFilter: IFilterReadRequest;
}
