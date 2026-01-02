
import {
  Fragment,
} from 'react';
import type  {
  ReactNode,
} from 'react';
import Box from '@mui/material/Box';




// Internal
import MenuSelect from '@/components/items/MenuSelect';
import Draws from "@/components/items/Drawer";
import Paged, { TablePaged } from "@/components/items/Pagination";
import Content from "@/components/items/Content";



export default function Page(): ReactNode {
  return (
    <Fragment>
      <Box key='head-content' sx={{ mt: 0, }}>
        <Box
          sx={{
            width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center"}}>
          < Draws />

          {/* <Box key='navigation' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center"}}>
            <Paged />
            <MenuSelect />
          </Box> */}
        </Box>
      </Box>
      <Content key="list-content" />
      <Box  key='foot-content'>
        <Box key='navigation' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center"}}>
          <Box key='navigation' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center"}}>
            {/* <Paged /> */}
            <TablePaged />
            {/* <MenuSelect /> */}
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
}


