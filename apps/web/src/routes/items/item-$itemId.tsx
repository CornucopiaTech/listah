
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Suspense } from 'react';
import {
  Box
} from '@mui/material';


import { AppBarHeight } from '@/lib/model/appNavBarModel';
import ItemDetails from '@/components/items/details/ItemDetails';
import NotFound from '@/components/common/NotFound';
import Loading from '@/components/common/Loading';



export const Route = createFileRoute('/items/$itemId')({
  component: () => (
    <Box sx={{
      height: `calc(100% - ${AppBarHeight})`,
      mt: AppBarHeight, p: 1
    }}>
      <Suspense fallback={<Loading />}>
        <ItemDetails />
      </Suspense>
    </Box>
  ),
  notFoundComponent: NotFound,
})
