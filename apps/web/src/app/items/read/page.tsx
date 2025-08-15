"use client"

import {
  Fragment,
  ReactNode,
} from 'react';
import {
  useQuery,
  queryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  Box,
  Divider,
  Pagination,
} from '@mui/material';


// import { useUpdatedItemStore } from '@/lib/store/updatedItem/UpdatedItemStoreProvider';
import { useItemsStore, } from '@/lib/store/items/ItemsStoreProvider';
import { ItemsDrawer } from "@/app/items/read/ItemsDrawer";
// import ItemsDatePicker from "@/app/items/read/ItemsDatePicker";
// import ItemsSearch from '@/app/items/read/ItemsSearch';
import { AppBarHeight } from '@/lib/model/appNavBarModel';
import Loading from '@/components/Loading';
import { ItemProto, ItemsProto, ItemsState } from '@/lib/model/ItemsModel';
import { ErrorAlerts } from '@/components/ErrorAlert';
// import MenuSelect from '@/components/MenuSelect';
import ItemsListStack from './ItemsListStack';
import { ItemsTopPagination, ItemsBottomPagination } from './ItemsPagination';
import ItemNoContent from './ItemsNoContent';
import MenuSelect from '@/components/MenuSelect';
import { getItems } from '@/lib/utils/itemHelper';


const menuItemsOptions = [
  { label: 10, value: 10 }, { label: 20, value: 20 },
  { label: 50, value: 50 }, { label: 100, value: 100 }
]

export function getItemsGroupOptions(userId: string, category: string [], tag: string[], pageNumber: number, recordsPerPage: number) {
  return queryOptions({
     queryKey: ["getItems", userId, category, tag, pageNumber, recordsPerPage],
     queryFn: () => getItems(userId, category, tag, pageNumber, recordsPerPage),
     staleTime: 24 * 60 * 60 * 1000,
   })
}

export default function ItemsRead(): ReactNode {
  const {
    itemsPerPage,
    currentPage,
    categoryFilter,
    tagFilter,
    drawerOpen,
    updateItemsPageRecordCount,
    updateItemsCurrentPage,
    toggleDrawer,
  } = useItemsStore((state) => state);


  const userId: string = "d537e7d1-4693-4663-9be6-8734b0bf0a36";
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

  const items: ItemProto[] = data.items ? data.items : [];
  const itemTags: string[] = data.tag ? data.tag : [];
  const itemCategories: string[] = data.categories ? data.categories : [];
  const totalRecords: number = data.totalRecordCount ? data.totalRecordCount : 1;
  const maxPages = Math.ceil(totalRecords / recordsPerPage);

  if (items === undefined || items.length == 0){return<ItemNoContent />;}


  return (
    <Fragment>
      <Box
          sx={{ height: `calc(100% - ${AppBarHeight})`,
                mt: AppBarHeight, p: 1 }}>

        <Box  key='head-content' sx={{ mt: 0, }}>

          <ItemsTopPagination
              page={page} maxPages={maxPages} recordsPerPage={recordsPerPage} tag={itemTags} categories={itemCategories}
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
