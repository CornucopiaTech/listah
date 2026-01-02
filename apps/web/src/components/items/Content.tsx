
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
import Link from '@mui/material/Link';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import * as z from "zod";
import { Virtuoso } from 'react-virtuoso';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';




import type { IItem, IItemsSearch } from '@/lib/model/Items';
import { ZItems, } from '@/lib/model/Items';
import { ItemSearchQueryContext } from '@/lib/context/itemSearchQueryContext';
import Loading from '@/components/common/Loading';
import { ErrorAlerts } from '@/components/common/ErrorAlert';
import { itemGroupOptions } from '@/lib/helper/querying';
import { MAX_TAG_CHIPS_DISPLAY } from '@/lib/helper/defaults';
import {
  FlexEndBox,
  SpaceAroundBox,
  SpaceBetweenBox,
  FlexStartBox
} from '@/components/basics/Box';



export default function Content(): ReactNode {
  const theme: {} = useTheme();
  const query: IItemsSearch = useContext(ItemSearchQueryContext);
  const {
      isPending, isError, data, error
  }: UseQueryResult<string[]> = useQuery(itemGroupOptions(query));

  if (isPending) { return <Loading />; }
  if (isError) {return <ErrorAlerts>Error: {error.message}</ErrorAlerts>;}

  try{
    ZItems.parse(data);
  } catch(error){
    if(error instanceof z.ZodError){
      console.info("Zod issue - ", error.issues);
      return <ErrorAlerts>An error occurred. Please try again</ErrorAlerts>;
    } else {
      console.info("Other issue - ", error);
      return <ErrorAlerts>An error occurred. Please try again</ErrorAlerts>;
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


  return (
    <Fragment>
        <Virtuoso key="data-content"
          style={{ height: '70vh', width: '100%', display: 'block', overflow: 'auto', }}
          data={items}
          itemContent={(_, item) =>
            <Fragment key={item.id}>
              <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: 1,
                    gridTemplateRows: 'auto',
                    gridTemplateAreas: ` "main main main . sidebar" `,
                  }}
                >
                <Box sx={{ gridArea: 'main', }}>
                  <Link href={`/items/${item.id}`} underline="hover" >
                    <ListItemButton key={item.id}>
                      <ListItemText primary={item.summary} />
                    </ListItemButton>
                  </Link>
                </Box>
                <Box sx={{ gridArea: 'sidebar', }}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: 2,
                    }}
                  >
                  <Chip
                    key={item.category} label={item.category}
                    sx={{
                      textTransform: 'capitalize',
                      bgcolor: theme.palette.categoryChip.main,
                      color: theme.palette.categoryChip.contrastText
                    }}
                  />
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
                </Box>
                </Box>
              </Box>
              {/* <Divider /> */}
            </Fragment>
          }
        />
    </Fragment>
  );


  // return (
  //   <Fragment>
  //       <Virtuoso key="data-content"
  //         style={{ height: '70vh', width: '100%', display: 'block', overflow: 'auto', }}
  //         data={items}
  //         itemContent={(_, item) =>
  //           <Fragment key={item.id}>
  //             <Link href={`/items/${item.id}`} underline="hover">
  //               <ListItemButton key={item.id}>
  //               <ListItemText primary={item.summary} />
  //               </ListItemButton>
  //               <Stack direction="row" spacing={1}>
  //                 <Chip key={item.category} label={item.category} />
  //                 {item.tag && item.tag.slice(MAX_TAG_CHIPS_DISPLAY).map((tag) => (
  //                   <Chip key={tag} label={tag} />
  //                 ))}
  //               </Stack>
  //             </Link>
  //             <Divider />
  //           </Fragment>
  //         }
  //       />
  //   </Fragment>
  // );


}
