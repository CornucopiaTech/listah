
import {
  Fragment,
  type ReactNode,
  useContext,
} from 'react';
import {
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import * as z from "zod";
import { Virtuoso } from 'react-virtuoso';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';




import { useBoundStore } from '@/lib/store/boundStore';
import type { IItem, IItemsSearch } from '@/lib/model/Items';
import { ZItems, } from '@/lib/model/Items';
import { ItemSearchQueryContext } from '@/lib/context/itemSearchQueryContext';
import Loading from '@/components/common/Loading';
import { itemGroupOptions } from '@/lib/helper/querying';
import { Error } from '@/components/common/Error';
import {
  MAX_TAG_CHIPS_DISPLAY,
  MAX_ITEM_SUMMARY_LENGTH,
} from '@/lib/helper/defaults';
import Detail from "@/components/category/Detail";
import Header from "@/components/category/Header";
import TableFooter from "@/components/category/Footer";



export default function Content(): ReactNode {
  const theme: {} = useTheme();
  const store = useBoundStore((state) => state);
  const query: IItemsSearch = useContext(ItemSearchQueryContext);
  const {
      isPending, isError, data, error
  }: UseQueryResult<string[]> = useQuery(itemGroupOptions(query));

  if (isPending) { return <Loading />; }
  if (isError) { return <Error message={error.message} /> ;}

  try{
    ZItems.parse(data);
  } catch(error){
    if(error instanceof z.ZodError){
      console.info("Zod issue - ", error.issues);
      return <Error message="An error occurred. Please try again" />;
    } else {
      console.info("Other issue - ", error);
      return <Error message="An error occurred. Please try again" />;
    }
  }


  const items: IItem[] = data.items ? data.items : [];

  if (!items || items.length == 0) {
    return (
      <Paper >
        <Box sx={{ height: '70vh', width: '100%', display: 'block', overflow: 'auto', }}>
        </Box>
      </Paper>
    );
  }

  function handleItemclick(itemId: string) {
    store.setDisplayId(itemId);
    store.setCategoryModal(true);
  }

  function eachItem(item: IItem): ReactNode {
    let dis: string = item.summary? item.summary : "";
    dis = dis.length > MAX_ITEM_SUMMARY_LENGTH ? dis.slice(0, MAX_ITEM_SUMMARY_LENGTH) + "..." : dis;
    return (
      <Fragment>
        <Grid container key={item.id}
              size={{ md: 10, xs: 12 }}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.nav.main, // Color on hover
                },
                p: 1,
              }}
              onClick={() => { handleItemclick (item.id); }}>
          <Grid size={7} >
            <Typography variant="body" sx={{
              alignContent: 'center',
              display: 'flex', width: '100%', flexWrap: 'wrap',
            }}>
              {dis}
            </Typography>
          </Grid>
          <Grid size={5} >
            <Chip
              key={item.category} label={item.category}
              sx={{
                textTransform: 'capitalize',
                bgcolor: theme.palette.categoryChip.main,
                color: theme.palette.categoryChip.contrastText,
                mx: 1,
              }}
            />
            {
              item.tag && item.tag.slice(0, MAX_TAG_CHIPS_DISPLAY).map((tag, i) => (
                <Chip
                  key={tag + i} label={tag}
                  sx={{
                    textTransform: 'capitalize',
                    bgcolor: theme.palette.tagChip.main,
                    color: theme.palette.tagChip.contrastText,
                    mx: 1,
                  }}
                />
              ))
            }
          </Grid>
        </Grid>
        <Divider />
      </Fragment>
    );
  }

  // return <div> Hello World</div>

  return (
    <Fragment>
      <Box key='head-content' sx={{ mt: 0, }}>
        < Header handleAddItem={handleItemclick}/>
      </Box>
      {/* <Icon icon="material-symbols:arrow-downward" width="24" height="24" /> */}
      {store.categoryModal && <Detail />}
      <Virtuoso key="data-content"
        style={{
          height: `82vh`, width: '100%', display: 'block', overflow: 'auto',
        }}
        data={items}
        itemContent={(_, item) => eachItem(item)}
      />
      <Box key='foot-content' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center" }}>
        <TableFooter />
      </Box>
    </Fragment>
  );
}
