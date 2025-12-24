import {
  Fragment,
  type ReactNode,
} from 'react';
import {
  Box,
  Paper,
} from '@mui/material';

import { AppBarHeight } from '@/lib/model/appNavBarModel';
import { WebAppContext } from "@/lib/context/webappContext";
import type { ItemProto, ItemsProto, ItemsProtoSchema, IItemsSearch } from '@/lib/model/ItemsModel';
import { ItemsDrawer } from "./ItemsDrawer";


export function PrevItemsNoContent(): ReactNode {
  return(
    <Fragment>
      <Box sx={{ height: '100%', bgcolor: 'paper', }}>
        <Box
            sx={{
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

export default function ItemsNoContent({ tag, category, query }: { tag: string[], category: string[], query: IItemsSearch }): ReactNode {
  return (
    <Fragment>
      <Box
        sx={{ maxHeight: '720px', mt: AppBarHeight, p: 1 }}>

        <Box  key='head-content' sx={{ mt: 0, }}>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center"}}>
            <Box key='drawer' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: "center"}}>
              <ItemsDrawer tag={tag} category={category} query={query}/>
                {/* <ItemsSearch /> */}
            </Box>
          </Box>
        </Box>

        <Paper >
          <Box sx={{ height: '70vh', width: '100%', display: 'block', overflow: 'auto', }}>
          </Box>
        </Paper>

      </Box>
    </Fragment>
  );
}
