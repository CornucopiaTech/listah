
import {
  v4 as uuidv4,
} from 'uuid';




import type {
  ITag,
  IItem,
  IFilter,
  IFilterForm,
  IItemForm,
  IFilterFormCheckedTag,
  IItemFormProps,
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

export function prepFilterUpdate({ value, userId }: { value: IFilterForm, userId: string }): IFilter {
  let checkedCategories: string[] = value.tags.filter(
    (i: IFilterFormCheckedTag) => i.checked
  ).map(
    (i: IFilterFormCheckedTag) => i.id
  );

  const prevId = value["id"] as string;
  const submitValue = {
    id: prevId !== "" ? prevId : uuidv4(),
    userId,
    name: value.name as string,
    tags: checkedCategories,
    filters: [],
    count: 0,
    softDelete: value?.softDelete,
  };
  return submitValue;
}


export function prepItemUpdate({ value, userId }: { value: IItemForm, userId: string }): IItem {
  const itemId = value.id && value.id != "" ? value.id : uuidv4();
  const subProps: Record<string, string> = {};
  value.props.forEach((i: IItemFormProps) => {
    subProps[i.key] = i.value;
  })
  const tgs = value.tags?.filter(t => t.name != "").map(t => t.id);

  const submitValue = {
    id: itemId,
    userId,
    name: value.name,
    note: value.note,
    tags: tgs,
    props: subProps,
    tagObjs: undefined,
    propObjList: undefined,
    softDelete: value.softDelete,
  }

  return submitValue;
}
