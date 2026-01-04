
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
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import * as z from "zod";
import { Virtuoso } from 'react-virtuoso';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';




import type { IItem, IItemsSearch } from '@/lib/model/Items';
import { ZItems, } from '@/lib/model/Items';
import { ItemSearchQueryContext } from '@/lib/context/itemSearchQueryContext';
import Loading from '@/components/common/Loading';
import { itemGroupOptions } from '@/lib/helper/querying';
import {
  MAX_TAG_CHIPS_DISPLAY,
  MAX_ITEM_SUMMARY_LENGTH,
  ITEM_LIST_HEIGHT,
  MAX_ITEM_CATEGORY_LIST_HEIGHT,
  ITEM_CATEGORY_LIST_HEIGHT_BUFFER,
} from '@/lib/helper/defaults';
import { Error } from '@/components/common/Error';
import { categoryGroupOptions } from '@/lib/helper/querying';



export default function GridContent(): ReactNode {
  const theme: {} = useTheme();
  const query: IItemsSearch = useContext(ItemSearchQueryContext);
  const {
      isPending: itemsIsPending,
      isError: itemsIsError,
      data: itemsData,
      error: itemsError
  }: UseQueryResult<string[]> = useQuery(itemGroupOptions(query));

  const {
    isPending: categoryIsPending,
    isError: categoryIsError,
    data: categoryData,
    error: categoryError,
  }: UseQueryResult<string[]> = useQuery(categoryGroupOptions(query.userId));


  if (itemsIsPending) { return <Loading />; }
  if (itemsIsError) { return <Error message={itemsError.message} /> ;}

  // Items
  try{
    const parsedItemsData = ZItems.parse(itemsData);
  } catch(error){
    if(error instanceof z.ZodError){
      console.info("Zod issue - ", error.issues);
      return <Error message="An error occurred. Please try again" />;
    } else {
      console.info("Other issue - ", error);
      return <Error message="An error occurred. Please try again" />;
    }
  }

  const items: IItem[] = itemsData.items ? itemsData.items : [];
  if (!items || items.length == 0) {
    return (
      <Paper >
        <Box sx={{ height: '70vh', width: '100%', display: 'block', overflow: 'auto', }}>
        </Box>
      </Paper>
    );
  }


  if (categoryIsPending) { return <Loading />; }
  if (categoryIsError) { return <Error message={categoryError.message} />; }
  const category = categoryData.category ? categoryData.category : [];


  function eachItem(item: IItem): ReactNode {
    const dis = item.summary.length > MAX_ITEM_SUMMARY_LENGTH ? item.summary.slice(0, MAX_ITEM_SUMMARY_LENGTH) + "..." : item.summary;
    return (
      <Fragment>
        <Grid container key={item.id + "-data-content"}
            sx={{
              m: 1, '&:hover': {
                backgroundColor: theme.palette.nav.main, // Color on hover
                // cursor: 'pointer',
              },
            }} >
          <Grid size={10} >
            <Typography variant="body">{dis}</Typography>
          </Grid>
          <Grid size={2} >
            {
              item.tag && item.tag.slice(MAX_TAG_CHIPS_DISPLAY).map((tag) => (
                <Chip
                  key={tag} label={tag}
                  sx={{
                    textTransform: 'capitalize',
                    bgcolor: theme.palette.tagChip.main,
                    color: theme.palette.tagChip.contrastText
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

  function eachCategory(cat: string): ReactNode {
    const catItems: IItem[] = items.filter(
      (it) => it.category?.toLowerCase() === cat.toLowerCase()
    );

    if (cat.toLowerCase() === 'label'){
      console.info('Cat: ', cat);
      console.info('Cat Items: ', catItems);
      console.info('Items: ', items);

    }
    const catHeight = catItems.length * (ITEM_LIST_HEIGHT) + ITEM_CATEGORY_LIST_HEIGHT_BUFFER;
    return (
      <Grid size={{ md: 6, xs: 12 }} key={cat + "-data-content"}>
        <Card sx={{  }}>
          <CardContent>
            <Typography
                gutterBottom variant="h5" component="div"
                sx={{ textTransform: 'capitalize' }}>
              {cat}
            </Typography>
            <Virtuoso
              style={{
                height: `${catHeight}px`, maxHeight: `${MAX_ITEM_CATEGORY_LIST_HEIGHT}px`, width: '100%', display: 'block', overflow: 'auto', }}
              data={catItems}
              itemContent={(_, item) => eachItem(item)}
            />
          </CardContent>
          <CardActions>
            <Button size="small">Share</Button>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      </Grid>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={4}>
        {category.map((cat: str) => eachCategory(cat))}
      </Grid>
    </Box>
  );

}
