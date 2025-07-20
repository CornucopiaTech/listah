"use client"
import { redirect, RedirectType } from 'next/navigation';
import {
  Fragment,
  useState,
  ReactNode
} from 'react';
import Link from 'next/link'
import {
  useQuery,
  queryOptions,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Checkbox
} from '@mui/material';
import {
  Delete,
  Close,
  Create,
  ArrowForwardIosOutlined,
  ArrowBackIosNewOutlined,
} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';


import type { IProtoItems, IProtoItem } from '@/app/items/ItemsModel';
import { ErrorAlerts } from '@/components/ErrorAlert';
import Loading from '@/components/Loading';


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

export function getItemsGroupOptions(userId: string, category: string, tags: string[], pageNumber: number, recordsPerPage: number) {
  return queryOptions({
     queryKey: ["getItems", userId, category, tags, pageNumber, recordsPerPage],
     queryFn: () => getItems(userId, category, tags, pageNumber, recordsPerPage)
   })
}

function ForwardArrow(props): ReactNode {
  if (props.enabled) {
    return (
      <Tooltip title="Next page" arrow>
        <IconButton sx={{ ml: 5, }}>
          <ArrowForwardIosOutlined onClick={() => {props.handleClick(Math.min(props.maxPages, props.page + 1))}}/>
        </IconButton>
      </Tooltip>
    );
  }
  return(
    <Tooltip title={props.toolTipTitle} arrow>
      <IconButton disabled sx={{ ml: 5, }}>
        <ArrowForwardIosOutlined onClick={() => {props.handleClick(Math.min(props.maxPages, props.page + 1))}}/>
      </IconButton>
    </Tooltip>
  );
}

function BackwardArrow(props): ReactNode {
  if (props.enabled) {
    return (
      <Tooltip title="Previous page" arrow>
        <IconButton sx={{ mr: 5, }}>
          <ArrowBackIosNewOutlined onClick={() => {props.handleClick(Math.max(1, props.page - 1))}}/>
        </IconButton>
      </Tooltip>
    );
  }
  return(
    <Tooltip title={props.toolTipTitle} arrow>
      <IconButton disabled sx={{ mr: 5, }}>
        <ArrowBackIosNewOutlined onClick={() => {props.handleClick(Math.max(1, props.page - 1))}}/>
      </IconButton>
    </Tooltip>
  );
}

export default function ItemsRead(): React.ReactNode {
  const queryClient = useQueryClient();
  const recordsPerPage = 10;
  const initialCheck = Array.from({ length: recordsPerPage }, () => false);
  const [page, setPage] = useState(1);
  const [check, setCheck] = useState(initialCheck);
  const status = "viewing";

  const userId = "4d56128c-5042-4081-a0ef-c2d064700191";
  const category = "";
  const tags: string[] = [];

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


  const initPagination = (
    <Box  key='initPagination'
              sx={{ display: 'flex', justifyContent: 'space-between'}}>
      <BackwardArrow maxPages={maxPages} page={page} enabled={false}
        handleClick={setPage}/>
      <ForwardArrow maxPages={maxPages} page={page} enabled={true}
        handleClick={setPage}/>
    </Box>
  );
  const regPagination = (
    <Box  key='regPagination'
          sx={{ display: 'flex', justifyContent: 'space-between', }}>
      <BackwardArrow maxPages={maxPages} page={page} enabled={true}
        handleClick={setPage}/>
      <ForwardArrow maxPages={maxPages} page={page} enabled={true}
        handleClick={setPage}/>
    </Box>
  );
  const lastPagination = (
    <Box  key='lastPagination'
          sx={{ display: 'flex', justifyContent: 'space-between', }}>
      <BackwardArrow maxPages={maxPages} page={page} enabled={true}
        handleClick={setPage}/>
      <ForwardArrow maxPages={maxPages} page={page} enabled={false}
        handleClick={setPage}/>
    </Box>
  );
  const paginationInfo = (
    <Box  key='navigation' sx={{ display: 'flex', justifyContent: 'space-between', }}>
      <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-start', }}>
        <IconButton aria-label="Edit" size="large" key='lastPagination'
            sx={{ display: 'flex', justifyContent: 'center', }}
            onClick={() => redirect('/items/update', RedirectType.push)}>
          <Create />
        </IconButton>
      </Box>
      <Box  key='navigation' sx={{ width: 'grow'}}>
        {page == 1 && initPagination}
        {1 < page && page < maxPages && regPagination}
        {page == maxPages && lastPagination}
      </Box>
    </Box>
  );


  return (
    <Fragment>
      <Box sx={{ height: '100%', bgcolor: 'paper', }}>
        <Box  key='head-content'> { paginationInfo } </Box>

        <Box key="data-content" sx={{width: '100%', display: 'block', mt: 2}} >
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
