"use client"

import {
  Fragment,
  ReactNode,
} from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
// import Link from 'next/link';
import {
  useQuery,
  queryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  Box,
  Divider,
} from '@mui/material';
// import {
//   Create,
//   Send,
//   Delete,
//   Add,
//   ExpandLess,
//   ArrowBackIosNewOutlined,
//   ArrowForwardIosOutlined,
// } from '@mui/icons-material';


import { useUpdatedItemStore } from '@/lib/store/updatedItem/UpdatedItemStoreProvider';
import { useItemsStore } from '@/lib/store/items/ItemsStoreProvider';
import { ItemsDrawer } from "@/app/items/read/ItemsDrawer";
import ItemsDatePicker from "@/app/items/read/ItemsDatePicker";
import ItemsSearch from '@/app/items/read/ItemsSearch';
import { AppBarHeight } from '@/components/AppNavBar';
import Loading from '@/components/Loading';
import type { IProtoItems, IProtoItem } from '@/app/items/ItemsModel';
import { ErrorAlerts } from '@/components/ErrorAlert';
import MenuSelect from '@/components/MenuSelect';
import {ItemModalEnabled, ItemModalDisabled} from './ItemModal';
import ItemsListStack from './ItemsListStack';
import ItemsPagination from './ItemsPagination';
import ItemNoContent from './ItemsNoContent';

async function getItems(userId: string, category: string | string [], tags: string[], pageNumber: number, recordsPerPage: number): Promise<IProtoItems|void> {
  const req = new Request('/api/getItems', {
    method: "POST",
    body: JSON.stringify({userId, category, tags, pageNumber, recordsPerPage})
  });
  const res = await fetch(req);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
}

export function getItemsGroupOptions(userId: string, category: string | string [], tags: string[], pageNumber: number, recordsPerPage: number) {
  return queryOptions({
     queryKey: ["getItems", userId, category, tags, pageNumber, recordsPerPage],
     queryFn: () => getItems(userId, category, tags, pageNumber, recordsPerPage),
     staleTime: 24 * 60 * 60 * 1000,
   })
}

export default function ItemsRead(): ReactNode {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    pageRecordCount,
    currentPage,
    categoryFilter,
    tagFilter,
    modalOpen,
    inEditMode,
    updateItemsPageRecordCount,
    updateItemsCurrentPage,
    updateItemsCategoryFilter,
    updateItemsTagFilter,
    updateModal,
    updateEditMode,
  } = useItemsStore((state) => state);
  const {
    setState
  } = useUpdatedItemStore((state) => state);


  const userId: string = "4d56128c-5042-4081-a0ef-c2d064700191";
  const recordsPerPage: number = pageRecordCount;
  const page: number = currentPage;
  const category: string[] | string = categoryFilter;
  const tags: string[] = tagFilter;


  function handlePageChange(event: React.ChangeEvent<unknown>, value: number) {
    updateItemsCurrentPage(value);
  };

  function handlePageCountChange(event: React.ChangeEvent<unknown>) {
    updateItemsPageRecordCount(event.target.value);
  };

  function toggleModal(){
    updateModal(!modalOpen);
  }

  function handleEditClick(item: IProtoItem){
    updateEditMode(true);
    setState(item);
    // const q = new URLSearchParams(JSON.stringify(item)).toString();
    const q = window.btoa(JSON.stringify(item))
    // console.info("Query arg: ")
    // console.info(q);
    router.push(`/item/update?q=${q}`);
  }

  function handleDeleteClick(item: IProtoItem){
    updateEditMode(false);
    router.push(`/item/${item.id}/delete`)
  }

  const { isPending, isError, data, error }: UseQueryResult<IProtoItems> = useQuery(getItemsGroupOptions(userId, category, tags, page, recordsPerPage));

  if (isPending) { return <Loading />; }
  // ToDo: Fix this error message
  if (isError) {return <ErrorAlerts>Error: {error.message}</ErrorAlerts>;}

  const items: IProtoItem[] = data.items ? data.items : [];
  const totalRecords: number = data.totalRecordCount ? data.totalRecordCount : 1;
  const maxPages = Math.ceil(totalRecords / recordsPerPage);

  if (items === undefined || items.length == 0){return<ItemNoContent />;}

  // const textEncoder = new TextEncoder();
  // console.info();
  // console.info(JSON.stringify(items[0]));

  return (
    <Fragment>
      <Box
          sx={{ height: `calc(100% - ${AppBarHeight})`,
                mt: AppBarHeight, p: 1 }}>
        <Box  key='head-content' sx={{ mt: 1, }}>
          <ItemsPagination
              page={page} maxPages={maxPages} recordsPerPage={recordsPerPage}
              handlePageChange={handlePageChange}
              handlePageCountChange={handlePageCountChange} />
        </Box>

        <Box key="data-content" sx={{width: '100%', display: 'block',}} >
          {items.map((val: IProtoItem, id: number) => (
            <Fragment key={val.id + '-' + id}>
              <ItemsListStack item={val} handleOpen={toggleModal}/>
              <Divider/>
              <ItemModalDisabled item={val} open={modalOpen}
                  handleOpen={toggleModal}
                  handleClose={toggleModal}
                  handleEdit={handleEditClick}
                  handleDelete={handleDeleteClick}
                />
            </Fragment>
          ))}
        </Box>

        <Box  key='foot-content'>
          <ItemsPagination
              page={page} maxPages={maxPages} recordsPerPage={recordsPerPage}
              handlePageChange={handlePageChange}
              handlePageCountChange={handlePageCountChange} />
        </Box>
      </Box>
    </Fragment>
  );
}
