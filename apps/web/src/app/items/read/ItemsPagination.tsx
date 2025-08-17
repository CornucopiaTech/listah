"use client"

import {
  ReactNode,
  useContext,
} from 'react';
import {
  Box,
  Pagination,
} from '@mui/material';



import { ItemsDrawer } from "@/app/items/read/ItemsDrawer";
// import ItemsDatePicker from "@/app/items/read/ItemsDatePicker";
import ItemsSearch from '@/app/items/read/ItemsSearch';
import MenuSelect from '@/components/MenuSelect';


export function ItemsTopPagination({
  maxPages, page, recordsPerPage, handlePageChange, handlePageCountChange
}: {
  maxPages: number, page: number, recordsPerPage: number,
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void,
  handlePageCountChange: (event: React.ChangeEvent<unknown>) => void,
}): ReactNode {

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center"}}>
      <Box key='drawer' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: "center"}}>
        <ItemsDrawer />
          {/* <ItemsSearch /> */}
        </Box>
      <Box key='navigation' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center"}}>
        <Pagination count={maxPages} page={page} onChange={handlePageChange} />
        <MenuSelect defaultValue={recordsPerPage}
            handleChange={handlePageCountChange}
            formHelperText="Items per page" label="Page count"
            menuItems={[
              {label: 10, value: 10}, {label: 20, value: 20},
              {label: 50, value: 50}, {label: 100, value: 100}]}/>
      </Box>
    </Box>
  );
}

export function ItemsBottomPagination({
  maxPages, page, recordsPerPage, handlePageChange, handlePageCountChange
}: {
  maxPages: number, page: number, recordsPerPage: number,
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void,
  handlePageCountChange: (event: React.ChangeEvent<unknown>) => void,
}): ReactNode {

  return (
    <Box key='navigation' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center"}}>
      <Pagination count={maxPages} page={page} onChange={handlePageChange} />
      <MenuSelect defaultValue={recordsPerPage}
          handleChange={handlePageCountChange}
          formHelperText="Items per page" label="Page count"
          menuItems={[
            {label: 10, value: 10}, {label: 20, value: 20},
            {label: 50, value: 50}, {label: 100, value: 100}]}/>
    </Box>
  );
}
