
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Box from '@mui/material/Box';
import { Icon } from "@iconify/react";



import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { DEFAULT_ITEM } from "@/lib/helper/defaults";


export function HomeFab() {
  const store: TBoundStore = useBoundStore((state) => state);

  function handleFilterClick() {
    store.setFilterModal(true);
  }

  function handleNewItemClick() {
    store.setDisplayId("");
    store.setDisplayItem(DEFAULT_ITEM);
    store.setItemModal(true);
  }
  const formActions = [
    {
      name: "Create new item", icon: "carbon:new-tab", onClick: handleNewItemClick
    },
    {
      name: "Create new filter", icon: "material-symbols:filter-alt", onClick: handleFilterClick
    },
  ]

  return (
    <Box sx={{ position: "fixed", bottom: 26, right: 6, zIndex: 1000 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "fixed", bottom: 26, right: 6, zIndex: 1000 }}
        icon={<SpeedDialIcon />}
      >
        {formActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={<Icon icon={action.icon} width="36" height="36" />}
            // @ts-ignore
            onClick={action.onClick}
            slotProps={{
              tooltip: {
                title: action.name,
              },
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
