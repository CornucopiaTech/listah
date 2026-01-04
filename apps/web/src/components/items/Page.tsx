
import {
  Fragment,
} from 'react';
import type  {
  ReactNode,
} from 'react';
import Box from '@mui/material/Box';
import { Icon } from "@iconify/react";



// Internal
import Draws from "@/components/items/Drawer";
import { TablePaged } from "@/components/items/Pagination";
import Content from "@/components/items/Content";



export default function Page(): ReactNode {
  return (
    <Fragment>
      <Box key='head-content' sx={{ mt: 0, }}>
        <Box
          sx={{
            width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center"}}>
          < Draws />
        </Box>
      </Box>
      {/* <Icon icon="material-symbols:arrow-downward" width="24" height="24" /> */}
      <Content key="list-content" />
      <Box  key='foot-content'>
        <Box key='navigation' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center"}}>
          <Box key='navigation' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center"}}>
            <TablePaged />
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
}


