import * as z from "zod";


const DefaultPageSize = 128;
const DefaultPage = 1;
const DefaultSort = 'name asc';
const DefaultVolume = 0;
export const PaginationMenu = [
  { label: `${DefaultPageSize}`, value: DefaultPageSize, },
  { label: "256", value: 256, },
  { label: "All", value: -1, },
]

export const ZPagination = z.object({
  size: z.number().catch(DefaultPageSize),
  page: z.number().catch(DefaultPage),
  sort: z.string().catch(DefaultSort),
  volume: z.number().catch(DefaultVolume),
});
export type IPagination = z.infer<typeof ZPagination>;

export const DefaultPagination: IPagination = {
  size: DefaultPageSize,
  page: DefaultPage,
  sort: DefaultSort,
  volume: DefaultVolume,
}

export class Pagination {
  public paging: IPagination;

  constructor(p: IPagination) {
    this.paging = {
      ...p,
      page: this.parseStringInt(p?.page) ?? DefaultPage,
      size: this.parseStringInt(p?.size) ?? DefaultPageSize,
      volume: this.parseStringInt(p?.volume) ?? DefaultVolume,
    }
  }

  resetPaging() {
    this.paging = { ...DefaultPagination };
  }

  parseStringInt(s: unknown) {
    return parseInt(s as unknown as string, 10)
  }

  updatePaging(d: IPagination, q: IPagination) {
    this.paging = {
      ...this.paging,
      size: this.parseStringInt(d?.size) ?? DefaultPageSize,
      volume: this.parseStringInt(d?.volume) ?? DefaultVolume,
      page: this.parseStringInt(d?.page) ?? this.parseStringInt(q?.page ?? DefaultPage),
    };
  }

  changePage(v: number) {
    this.paging = { ...this.paging, page: this.parseStringInt(v), };
  }

  changeSize(v: string) {
    this.paging = {
      ...this.paging, size: this.parseStringInt(v), page: DefaultPage,
    };
  }

  changeSort(v: string) {
    this.paging = { ...this.paging, sort: v, page: DefaultPage, };
  }
}
