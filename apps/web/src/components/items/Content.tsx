
import {
  Fragment,
  type ReactNode,
  useContext,
} from 'react';
import {
  useQuery,
  useSuspenseQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  Box,
  Divider,
  Link,
  ListItemText,
  ListItemButton,
  Paper,
} from '@mui/material';
import * as z from "zod";
import { Virtuoso } from 'react-virtuoso';



import type { ItemProto, IItemsSearch } from '@/lib/model/ItemsModel';
import { ItemsProtoSchema, } from '@/lib/model/ItemsModel';
import { ItemSearchQueryContext } from '@/lib/context/itemSearchQueryContext';
import Loading from '@/components/common/Loading';
import { ErrorAlerts } from '@/components/common/ErrorAlert';
import { itemGroupOptions } from '@/lib/utils/querying';



export default function Content(): ReactNode {
  const query: IItemsSearch = useContext(ItemSearchQueryContext);
  console.info("In Content", query);


  // const {
  //     isPending, isError, data, error
  // }: UseQueryResult<string[]> = useSuspenseQuery(itemGroupOptions(query));


  const {
      isPending, isError, data, error
  }: UseQueryResult<string[]> = useQuery(itemGroupOptions(query));

  if (isPending) { return <Loading />; }
  if (isError) {return <ErrorAlerts>Error: {error.message}</ErrorAlerts>;}

  try{
    ItemsProtoSchema.parse(data);
  } catch(error){
    if(error instanceof z.ZodError){
      console.info("Zod issue - ", error.issues);
      return <ErrorAlerts>An error occurred. Please try again</ErrorAlerts>;
    } else {
      console.info("Other issue - ", error);
      return <ErrorAlerts>An error occurred. Please try again</ErrorAlerts>;
    }
  }


  const items: ItemProto[] = data.items ? data.items : [];

  if (!items || items.length == 0) {
    return (
      <Paper >
        <Box sx={{ height: '70vh', width: '100%', display: 'block', overflow: 'auto', }}>
        </Box>
      </Paper>
    );
  }


  return (
    <Fragment>
        <Virtuoso key="data-content"
          style={{ height: '70vh', width: '100%', display: 'block', overflow: 'auto', }}
          data={items}
          itemContent={(_, item) =>
            <Fragment key={item.id}>
              <Link href={`/items/${item.id}`} underline="hover">
                <ListItemButton key={item.id}>
                <ListItemText primary={item.summary} />
                </ListItemButton>
              </Link>
              <Divider />
            </Fragment>
          }
        />
    </Fragment>
  );
}
