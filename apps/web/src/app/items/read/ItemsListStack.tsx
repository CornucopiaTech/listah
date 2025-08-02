"use client"

import {
  ReactNode,
} from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  Stack,
  Chip,
  Button,
  ListItemText,
  ListItemButton,
} from '@mui/material';
// import {

// } from '@mui/icons-material';

import type {  IProtoItem } from '@/app/items/ItemsModel';


export default function ItemsListStack({
  item, handleOpen
}: {
  item: IProtoItem,
  handleOpen: () => void,
}): ReactNode {
  return (
    <ListItemButton key={item.id} onClick={handleOpen}>
      <ListItemText primary={item.summary} />
    </ListItemButton>
  );
}

export function ItemsListStackDetails({
  item, handleOpen
}: {
  item: IProtoItem,
  handleOpen: () => void,
}): ReactNode {
  return (
    <Stack
        key={item.id} direction="row"
        sx={{ width: '100%', justifyContent: 'flex-start',
              dislay: 'inline-flex',}}>
      <Box key={item.id} sx={{ maxHeight: 200, p: 1}}>
        <Typography
            key='summary-link' variant="body1" component="div"
            sx={{ p: 0.1, textOverflow: 'ellipsis'}}>
          <Link color="text.primary" href={`/item/${item.id}/read`}>
            {item.summary}
          </Link>
        </Typography>
        {/* <Typography
            key='description' component="div" variant="caption"
            color="text.secondary"
            sx={{ p: 0.2, textOverflow: 'ellipsis'}}>
          {item.description}
        </Typography> */}
        {/* <Stack
            direction="row"
            sx={{ width: '100%', justifyContent: 'space-between', dislay: 'inline-flex'}}
          >
          <Box>
            <Chip
              key='category'
              label={item.category}
              size="small"
              color="primary"
              sx={{ p: 0.5, m: 0.3, textTransform: 'capitalize'}}
            />
            {
              item.tags.length > 0 ? (
                item.tags.map((tag: string, index: number) => (
                  <Chip
                    key={tag + '-' + index}
                    label={tag}
                    size="small"
                    color="secondary"
                    sx={{ p: 0.5, m: 0.3, }}
                  />
                ))
              ) : ""
            }
          </Box>
          <Button onClick={handleOpen}>See More</Button>
        </Stack> */}
      </Box>
    </Stack>
  );
}
