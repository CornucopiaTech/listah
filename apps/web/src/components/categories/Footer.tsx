
import {
  useContext,
} from 'react';
import type {
  ReactNode,
  ChangeEvent,
  MouseEvent,
} from 'react';
import {
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  useNavigate,
} from '@tanstack/react-router';
import TablePagination from '@mui/material/TablePagination';



import { encodeState } from '@/lib/helper/encoders';
import type { IItemsSearch } from '@/lib/model/item';
import Loading from '@/components/common/Loading';
import { Error } from '@/components/common/Alerts';
import { categoryGroupOptions } from '@/lib/helper/querying';
import { ItemSearchQueryContext } from '@/lib/context/queryContext';
import type { ICategoryResponse } from "@/lib/model/categories";


export default function TableFooter(): ReactNode {
  const query: IItemsSearch = useContext(ItemSearchQueryContext);
  const navigate = useNavigate();

  function handlePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    value: number
  ) {
    event && event.stopPropagation();
    const q = { ...query, pageNumber: value };
    const encoded = encodeState(q);
    navigate({ to: "/categories", search: { s: encoded } });
  };

  function handlePageSizeChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    console.log("In handlePageChange - e ", e);
    const q = { ...query, pageSize: parseInt(e.target.value, 10), pageNumber: 0 };
    const encoded = encodeState(q);
    console.info("In handlePageChange - q ", q);
    console.info("In handlePageChange - Encoded ", encoded);
    navigate({ to: "/categories", search: { s: encoded } });
  };

  const uId = query && query.userId ? query.userId : "";

  const {
    isPending, isError, data, error
  }: UseQueryResult<ICategoryResponse> = useQuery(categoryGroupOptions(uId));

  // ToDo: Explore using middleware to set the userId

  if (isPending) { return <Loading />; }
  if (isError) { return <Error message={error.message} />; }

  const category = data.category ? data.category : [];

  const totalRecords: number = category.length > 0 ? category.length : 1;


  return (
    <TablePagination
      component="div"
      count={totalRecords} page={query.pageNumber}
      onPageChange={handlePageChange}
      rowsPerPage={query.pageSize}
      onRowsPerPageChange={handlePageSizeChange}
    />
  );
}
