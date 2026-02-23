import type {
  ReactNode,
  ChangeEvent,
  MouseEvent,
} from 'react';
import { Fragment } from "react";
import { Virtuoso } from 'react-virtuoso';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';


import { AppCategoryListPaper } from "@/components/core/AppPaper";
import { AppListHeaderBar } from "@/components/core/AppListHeaderBar";
import { AppH5ButtonTypography } from "@/components/core/ButtonTypography";
import { AppH6Typography } from "@/components/core/Typography";
import { AppSectionStack } from "@/components/core/AppBox";
import type {
  ICategory,
} from "@/lib/model/category";



export function CategoryList(
  {
    title, data, count, page, onPageChange,
    rowsPerPage, onRowsPerPageChange,
    handleItemClick
  }: {
    title: string, data: ICategory[],
    rowsPerPage: number,
    count: number, page: number,
    handleItemClick: (item: ICategory) => void,

    onPageChange: (event: MouseEvent<HTMLButtonElement> | null,
        value: number) => void,

    onRowsPerPageChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  }
): ReactNode {

  function eachItem(itemKey: number, item: ICategory): ReactNode {
    const tc: string = item.category ? item.category : ""
    return (
      <ListItem
        style={{ height: 50, width: "100%", }} key={itemKey + tc}
        component="div" disablePadding
        onClick={() => handleItemClick(item) }
      >
        <ListItemButton>
          <ListItemText primary={tc} />
          <Chip sx={{background: "primary"}} label={item.rowCount} />
        </ListItemButton>
      </ListItem>
    );
  }

  return (
    <Fragment>
      <AppCategoryListPaper>
        <AppSectionStack>
          <AppListHeaderBar key="header">
            <AppH5ButtonTypography> {title} </AppH5ButtonTypography>
          </AppListHeaderBar>
          {
            data.length > 0 && <Virtuoso key="data-content"
              style={{
                height: `60vh`,
                width: '100%', display: 'block', overflow: 'auto',
              }}
              data={data}
              itemContent={(itemIndex, item) => eachItem(itemIndex, item)}
            />
          }
          {
            data.length == 0 &&
            <Box key="data-content"
              style={{
                height: `60vh`,
                width: '100%', display: 'block', overflow: 'auto',
              }}>
              <AppH6Typography> No items found </AppH6Typography>
            </Box>
          }

        <TablePagination
          component="div"
          count={count} page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
        />
        </AppSectionStack>
      </AppCategoryListPaper>
    </Fragment>
  );
}
