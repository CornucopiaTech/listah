
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Suspense } from 'react';


import ItemsPage from '@/components/items/read/ItemsPage';
import NotFound from '@/components/common/NotFound';
import Loading from '@/components/common/Loading';



export const Route = createFileRoute('/items/')({
  component: () => <Suspense fallback={Loading}><ItemsPage /></Suspense>,
  notFoundComponent: NotFound,
  // loader: async () => await getCount(),
})
