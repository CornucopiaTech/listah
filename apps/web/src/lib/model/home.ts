import type { ITagCategoryReadRequest } from '@/lib/model/tag';
import type { ISavedFilterCategoryReadRequest } from '@/lib/model/savedFilter';


export type THomeQueryParams = {
  tag: ITagCategoryReadRequest;
  savedFilter: ISavedFilterCategoryReadRequest;
}
