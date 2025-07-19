import {
  Suspense,
  Fragment,
  useState
} from 'react';
import {
  trace, context, type Span, type Context
} from '@opentelemetry/api';
import {
  queryOptions,
  useQuery,
} from '@tanstack/react-query';
import type {  UseQueryResult } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Pagination,
  Stack,
  Link,
  Chip,
  Tooltip
} from '@mui/material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import IconButton from '@mui/material/IconButton';


import type { IProtoItems } from '@/models/ItemsModel';
import { ErrorAlerts } from '@/components/common/ErrorAlert';
import Loading from '@/components/common/Loading';


const tracer = trace.getTracer(
  'ITEMS tanstack-router',
  '1.0.0',
);
const parentSpan: Span = tracer.startSpan('GET /items');
console.info("ROOT - span");
console.info(parentSpan.spanContext());



async function getItems(userId: string, category: string | string[], tags:string[]) {
  const ctx: Context = trace.setSpan(context.active(), parentSpan,);
  const span: Span = tracer.startSpan(`POST /api/getItems`, undefined, ctx);
  const spanContext = span.spanContext();

  console.info("getItems - Active span.spanContext()");
  console.info(spanContext);

  const req = new Request("http://localhost:8080/listah.v1.ItemService/Read", {
    method: "POST",
    body: JSON.stringify({items: [{ userId, category, tags}]}),
    headers: {
      "Content-Type": "application/json", "Accept": "*/*",
      traceparent: `00-${spanContext.traceId}-${spanContext.spanId}-${String(spanContext.traceFlags).padStart(2, '0')}`
    },
  });
  const res = await fetch(req)
  if (!res.ok) {
    parentSpan.end();
    throw new Error('Network response was not ok');
  }
  const data = await res.json();
  span.end();
  return data;
}

export function itemsGroupOptions(userId: string, category: string, tags: string[]) {
return queryOptions({
  queryKey: ['ItemListing', userId, category, tags],
  queryFn: () => getItems(userId, category, tags),
})
}


export default function Items() {
  const recordsPerPage = 12;
  const [page, setPage] = useState(1);
  const userId = "4d56128c-5042-4081-a0ef-c2d064700191";
  const category = "";
  const tags: string[] = [];

  const { isPending, isError, data, error }: UseQueryResult<IProtoItems> = useQuery(itemsGroupOptions(userId, category, tags));

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

  const foreArrow = (
    <Tooltip title="Next Page" arrow>
      <IconButton>
        <ArrowForwardIosOutlinedIcon onClick={() => {setPage(Math.min(maxPages, page + 1))}}/>
      </IconButton>
    </Tooltip>
  );

  const backArrow = (
    <Tooltip title="Previous Page" arrow>
      <IconButton>
        <ArrowBackIosNewOutlinedIcon onClick={() => {setPage(Math.max(1, page - 1))}}/>
      </IconButton>
    </Tooltip>
  );

  const initPagination = (
    <Box  key='initPagination'
              sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
      {foreArrow}
    </Box>
  );

  const regPagination = (
    <Box  key='regPagination'
          sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
      {backArrow} {foreArrow}
    </Box>
  );

  const lastPagination = (
    <Box  key='lastPagination'
          sx={{ display: 'flex', justifyContent: 'flex-start', my: 2 }}>
      {backArrow}
    </Box>
  );

  return (
    <Fragment>
      <Box sx={{ height: '100%', bgcolor: 'paper', }}>
        <Box  key='top-pagination'>
          {page == 1 && initPagination}
          {1 < page && page < maxPages && regPagination}
          {page == maxPages && lastPagination}
        </Box>

        <Box key="data-content" sx={{
            width: '100%', display: 'grid', gap: 3,
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
          }} >
          {items.map((val, _) => (
            <Paper key={val.id + "-content"}>
              <Box key={val.id} sx={{ maxHeight: 360, p: 1.5, }}>
                <Typography key='link' variant="body1" component="div" sx={{ p: 0.6, }}>
                  <Link color="text.primary" href={`/item/${val.id}`}>
                    {val.summary.length > 80 ? val.summary.substring(0, 80) + '...' : val.summary}
                  </Link>
                </Typography>
                <Typography key='description' component="div" variant="caption"
                  color="text.secondary" sx={{ p: 0.6, }}>
                  {val.description.substring(0, Math.max(180 - val.summary.length, 80)) + '...'}
                </Typography>
                <Typography key='category' component="div" variant="body1" color="text.secondary"
                  sx={{ p: 1, textTransform: 'capitalize' }}>
                  {val.category}
                </Typography>
                {
                  val.tags.length > 0 ? (
                    val.tags.map((tag, index) => (
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
            </Paper>
          ))}
        </Box>

        <Box  key='bottom-pagination'>
          {page == 1 && initPagination}
          {1 < page && page < maxPages && regPagination}
          {page == maxPages && lastPagination}
        </Box>
      </Box>
    </Fragment>
  );

  const result = (
    <div className="text-center">
      <ul>
      {
        data.items.map((i: any, _: any) => <li key={i.id}> {i.summary}</li>)
      }
      </ul>
    </div>
  );
  // span.end();
  // parentSpan.end();
  return result;
}
