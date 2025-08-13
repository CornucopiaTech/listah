import { ItemProto, ItemsState } from '@/lib/model/ItemsModel';


export function getValidItem(passed: ItemProto, item: ItemState): ItemProto{
  const validItem: ItemProto= {
    id: passed.id,
    userId: passed.userId,
    summary: item.summary ? item.summary : passed.summary,
    category: item.category ? item.category : passed.category,
    description: item.description ? item.description : passed.description,
    note: item.note ? item.note : passed.note,
    tags: item.tags ? item.tags : passed.tags,
    softDelete: item.softDelete ? item.softDelete : passed.softDelete,
    properties: item.properties ? item.properties : passed.properties,
    reactivateAt: item.reactivateAt ? item.reactivateAt : passed.reactivateAt,
  };
  return validItem;
}
