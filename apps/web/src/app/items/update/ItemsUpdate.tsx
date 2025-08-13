"use client"

import {
  Fragment,
  useState,
  ReactNode
} from 'react';
import Link from 'next/link'
import {
  useQuery,
  queryOptions,
  mutationOptions,
  useQueryClient,
  useMutation,
  type UseQueryResult,
  QueryClient
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


import type { ItemsProto, ItemProto} from '@/app/items/ItemsModel';
import { ErrorAlerts } from '@/components/ErrorAlert';
import Loading from '@/components/Loading';



async function deleteItems(userId: string, item: ItemProto| ItemsProto) {
  const req = new Request("/api/postItem", {
    method: "POST",
    body: JSON.stringify({userId, items: [item]}),
    headers: {"Content-Type": "application/json", "Accept": "*/*"},
  });
  const res = await fetch(req);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
}

// export function deleteItemGroupOptions(userId: string, item: ItemProto| string) {
//   return mutationOptions({
//     mutationFn: () => deleteItems(userId, item),
//     onSuccess: () => {
//       const queryClient = new QueryClient();
//       queryClient.invalidateQueries({ queryKey: ["getItems"] })
//     },
//   })
// }

export default function ItemsUpdate(): React.ReactNode {
  const queryClient = useQueryClient();
  const recordsPerPage = 10;
  const initialCheck = Array.from({ length: recordsPerPage }, () => false);
  const [page, setPage] = useState(1);
  const [check, setCheck] = useState(initialCheck);
  const [status, setStatus] = useState("viewing");

  const userId = "4d56128c-5042-4081-a0ef-c2d064700191";
  const category = "";
  const tags: string[] = [];

  const mutation = useMutation({
    mutationFn: (newItem: ItemProto| ItemsProto) => deleteItems(userId, newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getItems"] })
    },
  });

  function handleDelete (newItem: ItemProto| ItemsProto){

  }


  const { isPending, isError, data, error }: UseQueryResult<ItemsProto> = useQuery(getItemsGroupOptions(userId, category, tags, pageNumber, recordsPerPage));

  if (isPending) { return <Loading />; }
  if (isError) {
    return <ErrorAlerts>Unable to retrieve data from API. Error: {error.message}</ErrorAlerts>;
  }

  const items: ItemsProto | unknown = data.items;
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

  const isEditing = status == "editing";
  const isViewing = status == "viewing";
  const viewingDisplay = isViewing ? 'block' : 'none';
  const editingDisplay = isEditing ? 'block' : 'none';


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
            onClick={() => setStatus("editing")}>
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

  const deleteInfo = (
    <Box  key='initPagination'
          sx={{ width: '50%', display: 'flex', justifyContent: 'flex-start'}}>
      <IconButton aria-label="cancel" size="large" sx={{ mr: 6, }} onClick={() => setStatus("viewing")}>
        <Close />
      </IconButton>
      <IconButton aria-label="delete" size="large" sx={{ ml: 6, }} onClick={() => setStatus("viewing")}>
        <Delete />
      </IconButton>
    </Box>
  );

  const header = isViewing ? paginationInfo : deleteInfo;

  return (
    <Fragment>
      <Box sx={{ height: '100%', bgcolor: 'paper', }}>
        <Box  key='head-content'> { header } </Box>

        <Box key="data-content" sx={{width: '100%', display: 'block', mt: 2}} >
          {items.map((val: ItemProto id: number) => (
            <Stack key={val.id} direction="row"
                  sx={{ width: '100%', justifyContent: 'flex-start',
                    dislay: 'inline-flex', p: 1}}>
              {isEditing && <Checkbox checked />}
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



      <Box  key='foot-content'> { header } </Box>
      </Box>
    </Fragment>
  );
}
