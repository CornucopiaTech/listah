
import {
  Suspense,
  Fragment,
  useContext,
  type ReactNode,
} from 'react';
import {
  useQuery,
  useSuspenseQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  useNavigate,
} from '@tanstack/react-router';
import {
  Pagination,
} from '@mui/material';



import { encodeState } from '@/lib/utils/encoders';
import type { ItemsProto, IItemsSearch } from '@/lib/model/ItemsModel';
import Loading from '@/components/common/Loading';
import { ErrorAlerts } from '@/components/common/ErrorAlert';
import { ITEMS_URL } from '@/lib/utils/defaults';
import { itemGroupOptions } from '@/lib/utils/querying';
import { ItemSearchQueryContext } from '@/lib/context/itemSearchQueryContext';



export default function Paged(): ReactNode {
  const query: IItemsSearch = useContext(ItemSearchQueryContext);

  const navigate = useNavigate();
  console.info("In Paged", query);


  function handlePageChange(event: React.ChangeEvent<unknown>, value: number) {
    event.stopPropagation();
    const q = { ...query, pageNumber: value };
    const encoded = encodeState(q);
    console.info("In handlePageChange - Encoded ", encoded);
    navigate({ to: ITEMS_URL, search: { s: encoded } });
  };

  // const {
  //   isPending, isError, data, error
  // }: UseQueryResult<ItemsProto> = useSuspenseQuery(itemGroupOptions(query));


  const {
    isPending, isError, data, error
  }: UseQueryResult<ItemsProto> = useQuery(itemGroupOptions(query));


  if (isPending) { return <Loading />; }
  if (isError) { return <ErrorAlerts>Error: {error.message}</ErrorAlerts>; }


  const totalRecords: number = data.pageSize ? data.pageSize : 1;
  const maxPages = Math.ceil(totalRecords / query.pageSize);

  return (
    <Suspense fallback={<Loading />}>
      <Fragment>
        <Pagination
          count={maxPages} page={query.pageNumber}
          onChange={handlePageChange}
        />
      </Fragment>
    </Suspense>
  );
}
