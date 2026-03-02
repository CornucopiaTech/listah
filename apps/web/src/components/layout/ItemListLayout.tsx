import type {
  ReactNode,
  ChangeEvent,
  MouseEvent,
} from 'react';
import { Fragment } from "react";
import {
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
import * as z from "zod";
import {
  useNavigate,
  useParams
} from '@tanstack/react-router';
// import { useParams } from '@tanstack/react-router'
import Box from '@mui/material/Box';




import { ItemList } from "@/components/core/ItemList";
import type {
  IItem,
  IItemReadRequest,
  IItemReadResponse,
} from "@/lib/model/item";
import {
  ZItemReadResponse,
} from "@/lib/model/item";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { AppItemModal } from "@/components/core/AppItemModal";
import { useItemSearchQuery } from '@/lib/context/queryContext';
import { itemGroupOptions } from '@/lib/helper/querying';
import Loading from '@/components/common/Loading';
import { ErrorAlert} from "@/components/core/Alerts";
import { encodeState } from '@/lib/helper/encoders';


export function ItemListLayout(): ReactNode {
  const navigate = useNavigate();
  const title = useParams({
    // from: "/items/$title",
    // select: (params) => params.title,
     strict: false

  });
  // const { title } = params;
  console.info("In ItemListLayout - title ", title);
  const store: TBoundStore = useBoundStore((state) => state);
  const query: IItemReadRequest = useItemSearchQuery();
  const {
    isPending, isError, data, error
  }: UseQueryResult<IItemReadResponse> = useQuery(itemGroupOptions(query));

  if (isPending) {
    return (
      <Box key="data-content"
        style={{
          height: `60vh`,
          width: '100%', display: 'block', overflow: 'auto',
        }}>
        <Loading />
      </Box>
    );
  }
  if (isError) { return <ErrorAlert message={error.message} />; }

  try{
    ZItemReadResponse.parse(data);
  } catch(error){
    if(error instanceof z.ZodError){
      console.info("Zod issue - ", error.issues);
      return <ErrorAlert message="An error occurred. Please try again" />;
    } else {
      console.info("Other issue - ", error);
      return <ErrorAlert message="An error occurred. Please try again" />;
    }
  }

  const items: IItem[] = data && data.items ? data.items : [];
  const totalRecords: number = data.pageSize ? data.pageSize : 1;


  function handlePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    value: number
  ) {
    event && event.stopPropagation();
    const q = { ...query, pageNumber: value };
    const encoded = encodeState(q);
    navigate({ to: "/items", search: { s: encoded } });
  };

  function handlePageSizeChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    console.log("In handlePageChange - e ", e);
    const q = { ...query, pageSize: parseInt(e.target.value, 10), pageNumber: 0 };
    const encoded = encodeState(q);
    console.info("In handlePageChange - q ", q);
    console.info("In handlePageChange - Encoded ", encoded);
    navigate({ to: "/items", search: { s: encoded } });
  };

  // const titleName = query.searchQuery != "" ? `Items like '${query.searchQuery}'` : `Items in #${query.filter[0]}`
  const titleName = title.title ? `Items in #${title.title}` : "All Items";

  return (
    <Fragment>
      {store.itemModal && <AppItemModal />}
      <ItemList
        // title={title}
        title={titleName}
        data={items}
        count={totalRecords} page={query.pageNumber}
        onPageChange={handlePageChange}
        rowsPerPage={query.pageSize}
        onRowsPerPageChange={handlePageSizeChange}
      />
    </Fragment>
  );
}
