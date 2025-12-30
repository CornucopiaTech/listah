
import {
  Fragment,
  type ReactNode,
} from 'react';
import {
  Box,
} from '@mui/material';


import { AppBarHeight } from '@/lib/model/appNavBarModel';
import MenuSelect from '@/components/items/MenuSelect';
import Draws from "@/components/items/Drawer";
import Paged from "@/components/items/Pagination";
import Content from "@/components/items/Content";



export default function Page(): ReactNode {
  return (
    <Fragment>
      <Box sx={{ maxHeight: '720px', mt: AppBarHeight, p: 1 }}>
        <Box  key='head-content' sx={{ mt: 0, }}>
          <Box
            sx={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center"}}>
            < Draws />

            <Box key='navigation' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center"}}>
              <Paged />
              <MenuSelect />
            </Box>
          </Box>
        </Box>
        <Content key="list-content" />
        <Box  key='foot-content'>
          <Box key='navigation' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center"}}>
            <Box key='navigation' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center"}}>
              <Paged />
              <MenuSelect />
            </Box>
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
}
