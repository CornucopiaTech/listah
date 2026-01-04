
import {
  Fragment,
} from 'react';
import type  {
  ReactNode,
} from 'react';
import Box from '@mui/material/Box';
import { Icon } from "@iconify/react";



// Internal
import Draws from "@/components/items/Header";
import { TablePaged } from "@/components/items/Footer";
import Content from "@/components/items/Content";



export default function Page(): ReactNode {
  return (
    <Fragment>
      <Box key='head-content' sx={{ mt: 0, }}>< Draws /></Box>
      {/* <Icon icon="material-symbols:arrow-downward" width="24" height="24" /> */}
      <Content key="list-content" />
      <Box key='foot-content' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center" }}>
        <TablePaged />
      </Box>
    </Fragment>
  );
}


