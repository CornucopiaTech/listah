import type {
  ITag,
  IItem,
  IFilter,
  IReadRequest,
  IPagination,
  IReadQuery,
} from "@/app-types"

type DbTag = {
  id?: string,
  user_id?: string,
  name?: string,
  props?: Array<string>,
  count?: number,
  soft_delete?: boolean,
  updated_at?: Date,
}

type DbFilter = {
  id: string,
  user_id: string,
  name: string,
  tags: Array<string>,
  count: number,
  soft_delete: boolean,
  updated_at: Date,
}

type DbItem = {
  id: string,
  user_id: string,
  name: string,
  note: string,
  tags: Array<string>,
  props: Record<string, string>,
  tag_objs: Array<DbTag>,
  prop_objs: { key: string, value: string },
  soft_delete: boolean,
  suspension: number,
  updated_at: Date,
}

type DbReadQuery = {
  id: string,
  user_id: string,
  tags: Array<string>,
  text: string,
}

type DbReadRequest = {
  query: DbReadQuery,
  pagination: IPagination,
}


export function adaptTags(tags: ITag[]): DbTag[] {
  // @ts-ignore
  return tags.map((val: ITag) => ({
    id: val.id,
    user_id: val.userId,
    name: val.name,
    props: val.props,
    count: val.count,
    soft_delete: val.softDelete,
    updated_at: val.updatedAt,
  }));
}

export function adaptItems(tags: IItem[]): DbItem[] {
  // @ts-ignore
  return tags.map((val: IItem) => ({
    id: val.id,
    user_id: val.userId,
    name: val.name,
    note: val.note,
    tags: val.tags,
    props: val.props,
    tag_objs: val.tagObjs,
    prop_objs: val.propObjs,
    soft_delete: val.softDelete,
    suspension: val.suspension,
    updated_at: val.updatedAt,
  }));
}

export function adaptFilters(tags: IFilter[]): DbFilter[] {
  // @ts-ignore
  return tags.map((val: IFilter) => ({
    id: val.id,
    user_id: val.userId,
    name: val.name,
    tags: val.tags,
    count: val.count,
    soft_delete: val.softDelete,
    updated_at: val.updatedAt,
  }));
}


export function adaptQuery(val: IReadQuery): DbReadQuery {
  return {
    id: val.id,
    user_id: val.userId,
    tags: val.tags,
    text: val.text,
  };
}


export function adaptReadRequest(val: IReadRequest): DbReadRequest {
  return {
    query: adaptQuery(val.query),
    pagination: val.pagination,
  };
}
