
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Suspense } from 'react';



import ItemsPage from '@/components/items/read/ItemsPage';
import NotFound from '@/components/common/NotFound';
import Loading from '@/components/common/Loading';
import { ItemsProtoSchema } from '@/lib/model/ItemsModel';
// export const Route = createFileRoute('/shop/products')({
//   validateSearch: (search) => productSearchSchema.parse(search),
// })


export const Route = createFileRoute('/items/')({
  validateSearch: (search) => ItemsProtoSchema.parse(search),
  component: () => <Suspense fallback={Loading}><ItemsPage /></Suspense>,
  notFoundComponent: NotFound,
  // loader: async () => await getCount(),
})
