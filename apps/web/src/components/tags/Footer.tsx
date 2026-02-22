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
import type { IItemsSearch } from '@/lib/model/item';
import Loading from '@/components/common/Loading';
import { Error } from '@/components/common/Alerts';
import { tagGroupOptions } from '@/lib/helper/querying';
import { ItemSearchQueryContext } from '@/lib/context/queryContext';
import type { ITagResponse } from "@/lib/model/tags";


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
    navigate({ to: "/tags", search: { s: encoded } });
  };

  function handlePageSizeChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    console.log("In handlePageChange - e ", e);
    const q = { ...query, pageSize: parseInt(e.target.value, 10), pageNumber: 0 };
    const encoded = encodeState(q);
    console.info("In handlePageChange - q ", q);
    console.info("In handlePageChange - Encoded ", encoded);
    navigate({ to: "/tags", search: { s: encoded } });
  };

  const uId = query && query.userId ? query.userId : "";

  const {
    isPending, isError, data, error
  }: UseQueryResult<ITagResponse> = useQuery(tagGroupOptions(uId));

  // ToDo: Explore using middleware to set the userId

  if (isPending) { return <Loading />; }
  if (isError) { return <Error message={error.message} />; }

  const tag = data.tag ? data.tag : [];

  const totalRecords: number = tag.length > 0 ? tag.length : 1;


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
