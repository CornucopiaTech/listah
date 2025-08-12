"use client"

import Link from 'next/link'
import {
  useQuery,
  useQueryClient,
  useMutation,
  type UseQueryResult
} from '@tanstack/react-query';
import {
    useContext,
    useRef,
    Fragment,
    useState
 } from 'react';
import {
  Box,
  Button,
  Chip,
  Collapse,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Pagination,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,

 } from '@mui/material';

import {
    Send,
    Delete,
    Add,
    ExpandLess,
    ArrowBackIosNewOutlined,
    ArrowForwardIosOutlined,
 } from '@mui/icons-material';


import {

} from '@mui/material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

import { useParams } from 'next/navigation';
import { Suspense } from 'react';


import type {  ITraceBaggage } from '@/app/items/ItemsModel';
import Loading from '@/components/Loading';
import { AppBarHeight } from '@/components/AppNavBar';
// import  ItemDetails from "./ItemDetails";
import type { IProtoItems, IProtoItem } from '@/app/items/ItemsModel';
import { ErrorAlerts } from '@/components/ErrorAlert';


export default function ItemDetailsPage() {
  return <Suspense fallback={<Loading />} >
    < ItemDetailsPageChild />
  </Suspense>
}

async function getItem(userId: string, category: string | string [], tags: string[], id: string): Promise<IProtoItems|void> {
  const req = new Request('/api/getItems', {
    method: "POST",
    body: JSON.stringify({userId, category, tags,id}),
    headers: { "Content-Type": "application/json", "Accept": "*/*",},
  });
  const res = await fetch(req);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
}


export function ItemDetailsPageChild() {
  const params = useParams<{ id: string }>()
  const { id } = params;
  const [tagCollapsed, setTagCollapsed] = useState(true);
  const itemsKey = "itemsDetails";
  const userId = "4d56128c-5042-4081-a0ef-c2d064700191";
  const category = "";
  const tags: string[] = [];


  const { isPending, isError, data, error }: UseQueryResult<IProtoItems> = useQuery({
     queryKey: [itemsKey, userId, category, tags, id],
     queryFn: () => getItem(userId, category, tags, id)
   });

  if (isPending) { return <Loading />; }
  if (isError) {
    return <ErrorAlerts>Unable to retrieve data from API. Error: {error.message}</ErrorAlerts>;
  }

  if (data.items === undefined || data.items[0] === undefined){
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


  const item: IProtoItems | unknown = data.items[0];


  return (
    <Box sx={{ /*bgcolor: 'pink' ,*/ height: `calc(100% - ${AppBarHeight})`,
            mt: AppBarHeight, p: 1 }}>
      <Grid size={{ xs:12, sm:12,  md: 12, lg:5, xl: 5 }}>
        <Box  sx={{/*bgcolor: 'pink',*/ width: '100%', flexGrow: 1,
              height: '100%', justifyContent: 'center', alignItems: 'center',}}>
          <Stack  spacing={ 2 } direction="row" key={ item.title + '-Buttons' }
                  sx={{ width: '100%', justifyContent: 'space-around',
                    /*bgcolor: 'purple',*/ dislay: 'inline-flex', p: 1,
                  }}>
            <Button key='edit' size="small" sx={{ display: 'block' }}
                    onClick={ () => {} }>
              Edit
            </Button>
            <Button key='delete' size="small" onClick={ () => {} }>
                Delete
            </Button>
          </Stack>
          <Box  component="form" key={ item.title + '-Box' }
                sx={{ '& .MuiTextField-root': {
                      m: 1, width: '100%', maxWidth: 640,
                    }, width: '100%',  p: 2, overflow: 'auto',
                    /*border: 1, borderColor: 'rgba(50,50,50,0.3)',
                    bgcolor: 'background.paper',*/
                    maxHeight: { xs: 360, sm: 480, md: 600, lg: 720, xl: 840 },
                  }}
                  noValidate autoComplete="off">


            <TextField disabled required multiline variant="standard"
                key='TextField-title-formField'
                label="Summary" value={ item.summary } size='small'
            />
            <TextField disabled required multiline variant="standard"
              key={ 'TextField-note-formField' }
              label="Note" value={ item.note } size='small'
            />
            <TextField disabled required multiline variant="standard"
              key='TextField-description-formField'
              label="Description" value={ item.description } size='small'
            />
            <List
              // Add List for tags field.
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                // component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader"
                    sx={{ display: 'flex' }}>
                    <ListItemText primary="Tags" />
                    <Tooltip title="Add new tag">
                      <ListItemIcon onClick={ () => {} }>
                        <Add />
                      </ListItemIcon>
                    </Tooltip>
                  </ListSubheader>
                }>
              <Collapse in={tagCollapsed} timeout="auto" >
                <List component="div" disablePadding>
                  {
                    item.tags.map((tagItem: string) => (
                      <ListItemButton key={ 'tag-' + tagItem + 'formField' }>
                        <ListItemIcon>
                        </ListItemIcon>
                        <ListItemText primary={ tagItem } />
                      </ListItemButton>
                    ))
                  }
                </List>
              </Collapse>
            </List>
          </Box>
        </Box>
      </Grid>
    </Box>
  );

}
