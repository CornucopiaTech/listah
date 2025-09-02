
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Suspense } from 'react';


import ItemsPage from '@/components/items/read/ItemsPage';
import NotFound from '@/components/common/NotFound';
import RootLayout from '@/components/common/RootLayout';
import Loading from '@/components/common/Loading';



export const Route = createFileRoute('/items/')({
  component: () => <Suspense fallback={<Loading/>} ><RootLayout><ItemsPage /></RootLayout></Suspense>,
  notFoundComponent: NotFound,
  // loader: async () => await getCount(),
})
