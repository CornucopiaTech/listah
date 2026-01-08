import {
  Fragment,
  useContext,
} from 'react';
import type {
  ReactNode,
} from 'react';
import { useNavigate } from '@tanstack/react-router';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Virtuoso } from 'react-virtuoso';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import {
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query';



import { ItemSearchQueryContext } from '@/lib/context/itemSearchQueryContext';
import { tagGroupOptions } from '@/lib/helper/querying';
import type {  IItemsSearch } from '@/lib/model/Items';
import Loading from '@/components/common/Loading';
import { Error } from '@/components/common/Error';
import { encodeState } from '@/lib/helper/encoders';
import TableFooter from "@/components/tags/Footer";


export default function Tags(): ReactNode {
  const theme: {} = useTheme();
  const query: IItemsSearch = useContext(ItemSearchQueryContext);
  const navigate = useNavigate();


  const {
    isPending, isError, data, error
  }: UseQueryResult<string[]> = useQuery(tagGroupOptions(query.userId));

  // ToDo: Explore using middleware to set the userId

  if (isPending) { return <Loading />; }
  if (isError) { return <Error message={error.message} />; }

  const tag = data.tag ? data.tag : [];


  function handleTagClick(tagName: string) {
    const q = { ...query, tagFilter: [tagName]}
    const dq = encodeState(q);
    navigate({
      to: '/tags/{-$tagFilter}',
      params: { tagFilter: tagName },
      search: {s: dq},
    })
  }

  function eachTag(catIdx: number, catName: string): ReactNode {
    return (
      <Fragment>
        <Grid container key={catName + "-" + catIdx}
              size={{ md: 10, xs: 12 }}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.nav.main, // Color on hover
                },
                p: 1,
              }}
          onClick={() => { handleTagClick(catName); }}>
          <Typography variant="body" sx={{
            alignContent: 'center',
            display: 'flex', width: '100%', flexWrap: 'wrap',
          }}>
            {catName}
          </Typography>
        </Grid>
        <Divider />
      </Fragment>
    );
  }


  return (

    <Fragment>
      <Typography variant="h2" sx={{
        alignContent: 'center',
        display: 'flex', width: '100%', flexWrap: 'wrap',
      }}>
        Tags
      </Typography>
      <Virtuoso key="data-content"
        style={{
          height: `80vh`, width: '100%', display: 'block', overflow: 'auto',
          // justifyItems:
        }}
        data={tag}
        itemContent={(cIdx, cName) => eachTag(cIdx, cName)}
      />
      <Box key='foot-content' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center" }}>
        <TableFooter />
      </Box>
    </Fragment>
  );
};
