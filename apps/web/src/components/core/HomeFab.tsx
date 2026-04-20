
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Box from '@mui/material/Box';
import { Icon } from "@iconify/react";


import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';


export function HomeFab() {
  const store: TBoundStore = useBoundStore((state) => state);

  function handleFilterClick() {
    store.setFilterModal(true);
  }

  function handleTagClick() {
    store.setTagModal(true);
  }

  const formActions = [
    {
      name: "Create new tag", icon: "carbon:new-tab", onClick: handleTagClick
    },
    {
      name: "Create new filter", icon: "material-symbols:filter-alt", onClick: handleFilterClick
    },
  ]

  return (
    <Box sx={{
      position: "fixed",
      bottom: { xs: 16, sm: 24, md: 32 },   // responsive spacing
      right: { xs: 16, sm: 24, md: 32 },    // responsive spacing
    }}>
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
