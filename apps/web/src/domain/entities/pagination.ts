import * as z from "zod";


const DefaultPageSize = 128;

export const ZPagination = z.object({
  size: z.number().catch(DefaultPageSize),
  page: z.number().catch(1),
  sort: z.string().catch('name'),
  volume: z.number().catch(0),
});
export type IPagination = z.infer<typeof ZPagination>;

export const DefaultPagination: IPagination = {
  size: DefaultPageSize,
  page: 1,
  sort: 'name',
  volume: 0,
}

export class Pagination {
  public paging: IPagination;

  constructor(p: IPagination) {
    this.paging = { ...p, size: p.size && p.size ? p.size : DefaultPagination.size, volume: 0, }
  }

  updatePaging(d: IPagination, q: IPagination) {
    this.paging = {
      ...this.paging,
      size: parseInt(d.size as unknown as string, 10),
      volume: d.volume ? parseInt(d.volume as unknown as string, 10) : 0,
      page: d.page ? parseInt(d.page as unknown as string, 10) : q.page,
    };
  }

  changePage(v: number) {
    this.paging = { ...this.paging, page: v, };
  }

  changeSize(v: string) {
    this.paging = { ...this.paging, size: parseInt(v, 10), page: 1, };
  }
}
