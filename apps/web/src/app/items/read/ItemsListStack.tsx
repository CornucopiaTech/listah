"use client"

import {
  ReactNode,
} from 'react';
// import Link from 'next/link';
import {
  // Box,
  // Typography,
  // Stack,
  // Chip,
  // Button,
  Link,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  // useSearchParams, usePathname,
  useRouter
} from 'next/navigation';

import { ItemProto } from '@/lib/model/ItemsModel';
import { useUpdatedItemStore } from '@/lib/store/updatedItem/UpdatedItemStoreProvider';
import { useItemsStore, } from '@/lib/store/items/ItemsStoreProvider';
// import { ItemsDrawer } from "@/app/items/read/ItemsDrawer";
// import ItemsDatePicker from "@/app/items/read/ItemsDatePicker";
// import ItemsSearch from '@/app/items/read/ItemsSearch';
// import { AppBarHeight } from '@/components/AppNavBar';
// import Loading from '@/components/Loading';
// import { ErrorAlerts } from '@/components/ErrorAlert';
// import MenuSelect from '@/components/MenuSelect';
// import ItemsPagination from './ItemsPagination';
// import ItemNoContent from './ItemsNoContent';


export default function ItemsListStack({ item }: { item: ItemProto}): ReactNode {
  const router = useRouter();
  const {
    setState
  } = useUpdatedItemStore((state) => state);


  function handleClick(item: ItemProto) {
    setState(item);
    router.push(`/item/${item.id}`);
  }

  return (
    <ListItemButton key={item.id} onClick={() => handleClick(item)}>
      <ListItemText primary={item.summary} />
      {/* <Link href={`/item/${item.id}`} >View More</Link> */}
    </ListItemButton>
  );
}
