
import {
  useContext,
  // Fragment,
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
import type { IItemResponse, IItemsSearch } from '@/lib/model/item';
import Loading from '@/components/common/Loading';
import { ErrorAlerts } from '@/components/common/ErrorAlert';
import { ITEMS_URL } from '@/lib/helper/defaults';
import { itemGroupOptions } from '@/lib/helper/querying';
import { ItemSearchQueryContext } from '@/lib/context/queryContext';


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
    navigate({ to: ITEMS_URL, search: { s: encoded } });
  };

  function handlePageSizeChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    console.log("In handlePageChange - e ", e);
    const q = { ...query, pageSize: parseInt(e.target.value, 10), pageNumber: 0 };
    const encoded = encodeState(q);
    console.info("In handlePageChange - q ", q);
    console.info("In handlePageChange - Encoded ", encoded);
    navigate({ to: ITEMS_URL, search: { s: encoded } });
  };



  const {
    isPending,
    isError,
    data,
    error
  }: UseQueryResult<IItemResponse> = useQuery(itemGroupOptions(query));


  if (isPending) { return <Loading />; }
  if (isError) { return <ErrorAlerts>Error: {error.message}</ErrorAlerts>; }


  const totalRecords: number = data.pageSize ? data.pageSize : 1;

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
