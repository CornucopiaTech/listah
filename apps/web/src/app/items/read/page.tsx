"use client"

import { redirect, RedirectType } from 'next/navigation';
import {
  Fragment,
  ReactNode,
} from 'react';
import Link from 'next/link'
import {
  useQuery,
  queryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Pagination
} from '@mui/material';
import {
  Create,
} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';


import { useItemsStore } from '@/lib/store/items/ItemStoreProvider';
import { ItemsDrawer } from "@/app/items/read/ItemsDrawer";
import ItemsDatePicker from "@/app/items/read/ItemsDatePicker";
import ItemsSearch from '@/app/items/read/ItemsSearch';
import { AppBarHeight } from '@/components/AppNavBar';
import Loading from '@/components/Loading';
import type { IProtoItems, IProtoItem } from '@/app/items/ItemsModel';
import { ErrorAlerts } from '@/components/ErrorAlert';
import MenuSelect from '@/components/MenuSelect';


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
  const userId: string = "4d56128c-5042-4081-a0ef-c2d064700191";
  const {
    pageRecordCount,
    currentPage,
    categoryFilter,
    tagFilter,
    updateItemsPageRecordCount,
    updateItemsCurrentPage,
    updateItemsCategoryFilter,
    updateItemsTagFilter,
   } = useItemsStore((state) => state);
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

  const { isPending, isError, data, error }: UseQueryResult<IProtoItems> = useQuery(getItemsGroupOptions(userId, category, tags, page, recordsPerPage));

  if (isPending) { return <Loading />; }
  if (isError) {
    return <ErrorAlerts>Unable to retrieve data from API. Error: {error.message}</ErrorAlerts>;
  }

  const items: IProtoItems | unknown = data.items;
  const totalRecords: number | unknown = data.totalRecordCount;
  const maxPages = Math.ceil(totalRecords / recordsPerPage);

  if (items === undefined || items.length == 0){
    return(
      <Fragment>
        <Box sx={{ height: '100%', bgcolor: 'paper', }}>
          <Box sx={{
              width: '100%', display: 'grid', gap: 3,
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
            }} >
            <Paper >
              <Box sx={{ maxHeight: 360, p: 1.5, }}>
              </Box>
            </Paper>
          </Box>

        </Box>
      </Fragment>
    );
  }

  const paginationInfo = (
    <Box key='navigation' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center"}}>
      <Tooltip title="Edit page" arrow>
        <IconButton aria-label="Edit" size="large" key='lastPagination'
            sx={{ mx: 6, }}
            onClick={() => redirect('/items/update', RedirectType.push)}>
          <Create />
        </IconButton>
      </Tooltip>
      <Pagination count={maxPages} page={page} onChange={handlePageChange} />
      <MenuSelect defaultValue={recordsPerPage}
          handleChange={handlePageCountChange}
          formHelperText="Items per page" label="Page count"
          menuItems={[
            {label: 10, value: 10}, {label: 20, value: 20},
            {label: 50, value: 50}, {label: 100, value: 100}]}/>
    </Box>
  );

  return (
    <Fragment>
      <Box sx={{ bgcolor: 'pink', height: `calc(100% - ${AppBarHeight})`,
            mt: AppBarHeight, p: 1 }}>
        <Box  key='head-content' sx={{ bgcolor: 'teal', mt: 6, p: 2}}>
          { paginationInfo }
        </Box>

        <Box key="data-content" sx={{width: '100%', display: 'block', mt: 1}} >
          {items.map((val: IProtoItem, id: number) => (
            <Stack key={id + "-" + val.id} direction="row"
                  sx={{ width: '100%', justifyContent: 'flex-start',
                    dislay: 'inline-flex', p: 1}}>
              <Box key={val.id} sx={{ maxHeight: 200, }}>
                <Typography key='summary-link' variant="body1" component="div" sx={{ p: 0.1, textOverflow: 'ellipsis'}}>
                  <Link color="text.primary" href={`/item/${val.id}`}>
                    {val.summary}
                  </Link>
                </Typography>
                <Typography key='description' component="div" variant="caption"
                  color="text.secondary" sx={{ p: 0.2, textOverflow: 'ellipsis'}}>
                  {val.description}
                </Typography>


                <Stack direction="row"
                  sx={{ width: '100%', justifyContent: 'flex-start',
                    bgcolor: 'green', dislay: 'inline-flex', p: 1}}>
                <Chip
                  key='category'
                  label={val.category}
                  size="small"
                  color="primary"
                  sx={{ p: 0.5, m: 0.3, textTransform: 'capitalize'}}
                />
                {
                  val.tags.length > 0 ? (
                    val.tags.map((tag: string, index: number) => (
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
                </Stack>


              </Box>
            </Stack>
          ))}
        </Box>

        <Box  key='foot-content'> { paginationInfo } </Box>
      </Box>
    </Fragment>
  );
}
