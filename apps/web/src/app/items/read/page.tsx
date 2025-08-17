"use client"

import {
  Fragment,
  ReactNode,
  useContext,
} from 'react';
import {
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  Box,
  Divider,
} from '@mui/material';
import * as z from "zod";



import { useItemsStore, } from '@/lib/store/items/ItemsStoreProvider';
import { AppBarHeight } from '@/lib/model/appNavBarModel';
import { ItemProto, ItemsProto , ZItemsProto } from '@/lib/model/ItemsModel';
import Loading from '@/components/Loading';
import { ErrorAlerts } from '@/components/ErrorAlert';
import ItemsListStack from './ItemsListStack';
import { ItemsTopPagination, ItemsBottomPagination } from './ItemsPagination';
import ItemNoContent from './ItemsNoContent';
import { getItemsGroupOptions } from '@/lib/utils/itemHelper';
import { WebAppContext } from "@/lib/context/webappContext";

const menuItemsOptions = [
  { label: 10, value: 10 }, { label: 20, value: 20 },
  { label: 50, value: 50 }, { label: 100, value: 100 }
]



export default function ItemsRead(): ReactNode {
  const {
    itemsPerPage,
    currentPage,
    categoryFilter,
    tagFilter,
    updateItemsPageRecordCount,
    updateItemsCurrentPage,
  } = useItemsStore((state) => state);

  const webState = useContext(WebAppContext);
  const userId: string = webState.userId;
  const recordsPerPage: number = itemsPerPage;
  const page: number = currentPage;
  const category: string[] = categoryFilter;
  const tag: string[] = tagFilter;

  function handlePageChange(event: React.ChangeEvent<unknown>, value: number) {
    updateItemsCurrentPage(value);
  };

  function handlePageCountChange(event: React.ChangeEvent<unknown>) {
    updateItemsPageRecordCount(event.target.value);
  };


  const { isPending, isError, data, error }: UseQueryResult<ItemsProto> = useQuery(getItemsGroupOptions(userId, category, tag, page, recordsPerPage));

  if (isPending) { return <Loading />; }
  // ToDo: Fix this error message
  if (isError) {return <ErrorAlerts>Error: {error.message}</ErrorAlerts>;}

  let apiItems: ItemsProto;
  try{
    apiItems = ZItemsProto.parse(data);
  } catch(error){
    if(error instanceof z.ZodError){
      console.info(error.issues);
      return <ErrorAlerts>An error occurred. Please try again</ErrorAlerts>;

    }
  }


  const items: ItemProto[] = data.items ? data.items : [];
  const totalRecords: number = data.totalRecordCount ? data.totalRecordCount : 1;
  const maxPages = Math.ceil(totalRecords / recordsPerPage);

  if (!items || items.length == 0){return<ItemNoContent />;}


  return (
    <Fragment>
      <Box
          sx={{ height: `calc(100% - ${AppBarHeight})`,
                mt: AppBarHeight, p: 1 }}>

        <Box  key='head-content' sx={{ mt: 0, }}>

          <ItemsTopPagination
              page={page} maxPages={maxPages} recordsPerPage={recordsPerPage}
              handlePageChange={handlePageChange}
              handlePageCountChange={handlePageCountChange} />
        </Box>

        <Box key="data-content" sx={{width: '100%', display: 'block',}} >
          {items.map((val: ItemProto, id: number) => (
            <Fragment key={val.id + '-' + id}>
              <ItemsListStack item={val} />
              <Divider/>
            </Fragment>
          ))}
        </Box>

        <Box  key='foot-content'>
          <ItemsBottomPagination
              page={page} maxPages={maxPages} recordsPerPage={recordsPerPage}
              handlePageChange={handlePageChange}
              handlePageCountChange={handlePageCountChange} />
        </Box>
      </Box>
    </Fragment>
  );
}
