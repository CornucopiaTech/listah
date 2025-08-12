'use client'

import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import {
  useQuery,
  queryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  Box
} from '@mui/material';

import { useItemsStore } from '@/lib/store/items/ItemsStoreProvider';
import Loading from '@/components/Loading';
import { AppBarHeight } from '@/components/AppNavBar';
import  ItemDetails from "./ItemDetails";


export default function ItemDetailsPage() {
  return <Suspense fallback={<Loading />} >
    < ItemDetailsPageChild />
  </Suspense>
}


export function ItemDetailsPageChild() {
  const params = useParams<{ id: string }>()
  const { id } = params;
  const {
    itemsPerPage,
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

  return (
    <Box  sx={{ bgcolor: 'pink', height: `calc(100% - ${AppBarHeight})`,
          mt: AppBarHeight, p: 1 }}>
      <Suspense fallback={<Loading />}>
        <ItemDetails itemId={id}/>
      </Suspense>
    </Box>
  );

}
