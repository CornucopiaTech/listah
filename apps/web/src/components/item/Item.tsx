

import {
  useQuery,
  useQueryClient,
  useMutation,
  queryOptions,
  type UseQueryResult
} from '@tanstack/react-query';
import {
    useParams,
    useSearch,
} from '@tanstack/react-router';
import {
    useContext,
    useRef,
    Fragment,
    useState
 } from 'react';
 import {
  trace, context, type Span, type Context
} from '@opentelemetry/api';
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

import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';


import type { IProtoItems, IProtoItem } from '@/models/ItemsModel';
import { ErrorAlerts } from '@/components/common/ErrorAlert';
import Loading from '@/components/common/Loading';


const tracer = trace.getTracer(
  'tanstack-router',
  '1.0.0',
);
const parentSpan: Span = tracer.startSpan('GET /item');
console.info("ITEM ROOT - span");
console.info(parentSpan.spanContext());

export function itemGroupOptions(userId: string, category: string, tags: string[], id: string) {
return queryOptions({
  queryKey: ['ItemDetails', userId, category, tags, id],
  queryFn: () => getItem(userId, category, tags, id),
})
}



async function getItem(userId: string, category: string | string [], tags: string[], id: string): Promise<IProtoItems|void> {
  const ctx: Context = trace.setSpan(context.active(), parentSpan,);
  const span: Span = tracer.startSpan(`POST /api/getItem`, undefined, ctx);
  const spanContext = span.spanContext();

  console.info("getItem - Active span.spanContext()");
  console.info(spanContext);

  const req = new Request("http://localhost:8080/listah.v1.ItemService/Read", {
    method: "POST",
    body: JSON.stringify({userId, category, tags,id}),
    headers: {
      "Content-Type": "application/json",
      "Accept": "*/*",
      traceparent: `00-${spanContext.traceId}-${spanContext.spanId}-${String(spanContext.traceFlags).padStart(2, '0')}`
    },
  });
  const res = await fetch(req);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await res.json();
  span.end();
  return data;
}

async function postItem(url: string, item: IProtoItem) {
  const ctx: Context = trace.setSpan(context.active(), parentSpan,);
  const span: Span = tracer.startSpan(`POST /api/getItem`, undefined, ctx);
  const spanContext = span.spanContext();

  console.info("getItem - Active span.spanContext()");
  console.info(spanContext);

  const req = new Request(url, {
    method: "POST",
    body: JSON.stringify({items: [item]}),
    headers: {"Content-Type": "application/json", "Accept": "*/*", traceparent: `00-${spanContext.traceId}-${spanContext.spanId}-${String(spanContext.traceFlags).padStart(2, '0')}`
    },
  });
  const res = await fetch(req);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await res.json();
  span.end();
  return data;
}

export default function ItemDetails(): React.ReactNode {
  const [status, setStatus] = useState("viewing");
  const [tagCollapsed, setTagCollapsed] = useState(true);
  const itemsKey = "itemsDetails";
  // const userId = "4d56128c-5042-4081-a0ef-c2d064700191";
  // const category = "";
  // const tags: string[] = [];

  const queryClient = useQueryClient();

  function handleSave (newItem: IProtoItem){
    const mutation = useMutation({
      mutationFn: () => postItem(traceparent, newItem),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [itemsKey] })
      },
    })
  }

  const search = useSearch({ from: '/item/' });
  const { userId, category, tags, id } = search;

  const { isPending, isError, data, error }: UseQueryResult<IProtoItems> = useQuery(itemGroupOptions(userId, category, tags, id));

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
  const isEditing = status == "editing";
  const isViewing = status == "viewing";
  const viewingDisplay = isViewing ? 'block' : 'none';
  const editingDisplay = isEditing ? 'block' : 'none';

  return (
    <Fragment>
      <Grid size={{ xs:12, sm:12,  md: 12, lg:5, xl: 5 }}>
        <Box  sx={{bgcolor: 'pink', width: '100%', flexGrow: 1,
              height: '100%', justifyContent: 'center', alignItems: 'center',}}>
          <Stack  spacing={ 2 } direction="row" key={ item.title + '-Buttons' }
                  sx={{ width: '100%', justifyContent: 'space-around',
                    bgcolor: 'purple', dislay: 'inline-flex', p: 1,
                  }}>
            <Button key='edit' size="small" sx={{ display: viewingDisplay }}
                    onClick={ () => {} }>
              Edit
            </Button>
            <Button key='save' size="small" sx={{ display: editingDisplay}}
                    onClick={ () => {}}>
              Save
            </Button>
            <Button key='delete' size="small" onClick={ () => {} }>
                Delete
            </Button>
          </Stack>
          <Box  component="form" key={ item.title + '-Box' }
                sx={{
                    '& .MuiTextField-root': {
                      m: 1, width: '100%', maxWidth: 640,
                    }, width: '100%', border: 1, p: 2, overflow: 'auto',
                    borderColor: 'rgba(50,50,50,0.3)',
                    bgcolor: 'background.paper',
                    maxHeight: { xs: 360, sm: 480, md: 600, lg: 720, xl: 840 },

                  }}
                  noValidate autoComplete="off">

            {
              // Add item note for editing mode
              isEditing &&
              <Box component="div">
                  <TextField required multiline key='TextField-summary-formField'
                    label='Summary' value={ item.summary }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {} } size='small'
                  />
                  <TextField
                    required multiline key='TextField-note-formField'
                    label="Note" value={ item.note }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {} } size='small'
                  />
                  <TextField
                      required multiline key='TextField-description-formField'
                      label="Description" value={ item.description }
                      onChange={ (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {} } size='small'
                  />
              </Box>
            }
            {
              // Add item note for non-editing mode
              !isEditing &&
              <Fragment>
                  <TextField disabled required multiline
                    key='TextField-title-formField'
                    label="Summary" value={ item.summary } size='small'
                  />
                  <TextField disabled required multiline
                    key={ 'TextField-note-formField' }
                    label="Note" value={ item.note } size='small'
                  />
                  <TextField disabled required multiline
                    key='TextField-description-formField'
                    label="Description" value={ item.description } size='small'
                  />
              </Fragment>
            }
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
              {
                isEditing &&
                <TextField required multiline key='TextField-newTag-formField'
                    label='New Tag' value={ itemViewState.newTag }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {} } size='small'
                />
              }
              <Collapse in={tagCollapsed} timeout="auto" >
                <List component="div" disablePadding>
                  {
                    item.tags.map((tagItem: string) => (
                      <ListItemButton key={ 'tag-' + tagItem + 'formField' }>
                        <ListItemIcon>
                          {
                            isEditing &&
                            // ToDO: Fix delete button function.
                            <Delete onClick={ (e: React.MouseEvent<HTMLButtonElement>) => { }} />
                          }
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
    </Fragment>
  );
}
