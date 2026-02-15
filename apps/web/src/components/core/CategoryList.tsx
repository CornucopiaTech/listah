import type { ReactNode } from "react";
import { Fragment } from "react";
import { Virtuoso } from 'react-virtuoso';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

import { AppCategoryListPaper } from "@/components/core/AppPaper";
import { AppListHeaderBar } from "@/components/core/AppListHeaderBar";
import { AppH5ButtonTypography } from "@/components/core/ButtonTypography";
import { AppH6Typography } from "@/components/core/Typography";
import type { CategoryGroup } from '@/lib/model/common';




export function CategoryList(
  {
    title, data, handleItemClick
  }: {
    title: string, data: CategoryGroup[], handleItemClick: (item: CategoryGroup) => void
  }
): ReactNode {

  function eachItem(itemKey: number, item: CategoryGroup): ReactNode {
    return (
      <ListItem
        style={{ height: 50, width: "100%", }} key={itemKey + item.title}
        component="div" disablePadding
        onClick={() => handleItemClick(item) }
      >
        <ListItemButton>
          <ListItemText primary={item.title} />
          <Chip label={item.numberOfItems} />
        </ListItemButton>
      </ListItem>
    );
  }


  return (
    <Fragment>
      <AppCategoryListPaper>
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
      </AppCategoryListPaper>
    </Fragment>
  );
}
