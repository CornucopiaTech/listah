import type { ReactNode } from "react";
import { Fragment } from "react";
import { Virtuoso } from 'react-virtuoso';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';

import { AppCategoryListPaper } from "@/components/core/AppPaper";
import { AppListHeaderBar } from "@/components/core/AppListHeaderBar";
import { AppH5ButtonTypography } from "@/components/core/ButtonTypography";
import { AppH6Typography } from "@/components/core/Typography";
import { AppSectionStack } from "@/components/core/AppBox";
import type { IItem } from "@/lib/model/Items";
import { useBoundStore, type TBoundStore } from '@/lib/store/boundStore';



export function ItemList(
  {
    title, data
  }: {
      title: string, data: IItem[]
  }
): ReactNode {

  const store: TBoundStore = useBoundStore((state) => state);

  function eachItem(itemKey: number, item: IItem): ReactNode {
    let dis: string = item.summary ? item.summary : "";
    return (
      <ListItem
        style={{ height: 50, width: "100%", }} key={itemKey + dis}
        component="div" disablePadding
        onClick={() => handleItemClick(item) }>
        <ListItemButton>
          <ListItemText primary={dis} />
        </ListItemButton>
      </ListItem>
    );
  }

  function handleItemClick(anitem: IItem) {
    store.setDisplayId(anitem.id);
    store.setDisplayItem(anitem);
    store.setModal(true);
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
        </AppSectionStack>
      </AppCategoryListPaper>
    </Fragment>
  );
}
