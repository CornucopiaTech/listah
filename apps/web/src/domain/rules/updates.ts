
import {
  v4 as uuidv4,
} from 'uuid';




import type {
  IItemReadRequest,
  IItemReadResponse,
  ITag,
  IFilter,
  IPagination,
} from '@/domain/entities';



export function prepTagUpdate({ value, userId }: { value: ITag, userId: string }): ITag {
  const itemId = value.id && value.id != "" ? value.id : uuidv4();
  const submitValue = {
    userId,
    id: itemId,
    name: value.name,
    props: value.props?.filter((t) => t != ""),
    softDelete: value?.softDelete,
    count: undefined,
  }
  return submitValue;
}


export function setPaginationInfo(data: IPagination, prev: IPagination) {
  const pageSize = parseInt(data.pageSize as unknown as string, 10);
  const totalRecords = data.totalRecords ? parseInt(data.totalRecords as unknown as string, 10) : 1;
  const pageNumber = data.pageNumber ? parseInt(data.pageNumber as unknown as string, 10) : prev.pageNumber
  const sort = "name";
  return { sort, pageSize, totalRecords, pageNumber };
}
