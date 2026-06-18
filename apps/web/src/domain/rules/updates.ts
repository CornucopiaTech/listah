
import {
  v4 as uuidv4,
} from 'uuid';




import type {
  IReadRequest,
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
