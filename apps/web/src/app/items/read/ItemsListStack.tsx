"use client"

import {
  ReactNode,
} from 'react';
// import Link from 'next/link';
import {
  Link,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  useRouter
} from 'next/navigation';

import { ItemProto } from '@/lib/model/ItemsModel';




export default function ItemsListStack({ item }: { item: ItemProto}): ReactNode {
  const router = useRouter();

  function handleClick(item: ItemProto) {
    router.push(`/item/${item.id}`);
  }

  return (
    <ListItemButton key={item.id} onClick={() => handleClick(item)}>
      <ListItemText primary={item.summary} />
      <Link href={`/item/${item.id}`} >View More</Link>
    </ListItemButton>
  );
}
