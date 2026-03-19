
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Box from '@mui/material/Box';
import { Icon } from "@iconify/react";



import { DefaultItem } from "@/lib/helper/defaults";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';



export function ItemsFab() {
  const store: TBoundStore = useBoundStore((state) => state);


  function handleItemClick() {
    store.setDisplayId("");
    store.setDisplayItem(DefaultItem);
    store.setItemModal(true);
  }
  const formActions = [
    {
      name: "Create new item", icon: "carbon:new-tab", onClick: handleItemClick
    },
  ]

  return (
    <Box sx={{ position: "fixed", bottom: 26, right: 6, zIndex: 1000 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
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
