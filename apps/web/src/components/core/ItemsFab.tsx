
import {
  getRouteApi,
} from '@tanstack/react-router';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Box from '@mui/material/Box';
import { Icon } from "@iconify/react";



import {
  DefaultItem,
} from "@/lib/helper/defaults";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import type {
  IItemReadRequest,
} from "@/lib/model/item";
import {
  decodeState,
} from '@/lib/helper/encoders';
import type {
  ITag,
} from "@/lib/model/tag";
import type {
  IFilter,
} from "@/lib/model/filter";


export function ItemsFab() {
  const store: TBoundStore = useBoundStore((state) => state);
  const routeApi = getRouteApi('/items/');
  const routeSearch: { s: string, src: string } = routeApi.useSearch()
  let search: IItemReadRequest = decodeState(routeSearch.s) as IItemReadRequest;
  let rtSrc: undefined | ITag | IFilter = store.itemReference as undefined | ITag | IFilter;

  console.info("In Items Fab: search", search);
  console.info("In Items Fab: src", rtSrc);

  const isTag = store.displayTag !== undefined;

  const isFilter = store.displayFilter !== undefined;


  function handleItemClick() {
    let newTags: string[] = []
    if (isTag) {
      newTags = [...newTags, store.displayTag.id]
    }
    if (isFilter) {
      newTags = [...newTags, ...store.displayFilter.tags]
    }
    store.setDisplayItem({ ...DefaultItem, tags: newTags, });
    store.setItemModal(true);
  }


  function handleCategoryClick() {
    if (isTag) {
      // store.setDisplayTag(rtSrc as ITag);
      store.setTagModal(true);
    } else if (isFilter) {
      // store.setDisplayFilter(rtSrc as IFilter);
      store.setFilterModal(true);
      // ToDo: Update Filter Modal to be able to create new filters and update existing filters.
    }
  }

  let formActions = [
    {
      name: "Create new item", icon: "carbon:new-tab", onClick: handleItemClick
    },
    // {
    //   name: isTag ? "Update tag" : "Update filter",
    //   icon: "material-symbols:edit-outline",
    //   onClick: handleCategoryClick
    // },
  ]
  if (isTag) {
    formActions = [
      ...formActions,
      {
        name: "Update tag", icon: "material-symbols:edit-outline",
        onClick: handleCategoryClick
      },
    ]
  }
  if (isFilter) {
    formActions = [
      ...formActions,
      {
        name: "Update filter", icon: "material-symbols:edit-outline",
        onClick: handleCategoryClick
      },
    ]
  }

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


export function ItemsTitleFab() {
  const store: TBoundStore = useBoundStore((state) => state);
  const routeApi = getRouteApi('/items/{-$title}');
  const routeSearch: { s: string, src: string } = routeApi.useSearch()
  let search: IItemReadRequest = decodeState(routeSearch.s) as IItemReadRequest;
  let rtSrc: ITag | IFilter = decodeState(routeSearch.src) as ITag | IFilter;

  console.info("In Items Fab: search", search);
  console.info("In Items Fab: src", rtSrc);

  const isTag = rtSrc && (rtSrc as ITag).props !== undefined && (rtSrc as ITag).props !== null;

  const isFilter = rtSrc && (rtSrc as IFilter).tags !== undefined && (rtSrc as IFilter).tags !== null;


  function handleItemClick() {
    store.setDisplayItem({
      ...DefaultItem,
      tags: search && search.query && search.query.tags ? search.query.tags : []
    });
    store.setItemModal(true);
  }


  function handleCategoryClick() {
    if (isTag) {
      store.setDisplayTag(rtSrc as ITag);
      store.setTagModal(true);
    } else if (isFilter) {
      store.setDisplayFilter(rtSrc as IFilter);
      store.setFilterModal(true);
      // ToDo: Update Filter Modal to be able to create new filters and update existing filters.
    }
  }

  let formActions = [
    {
      name: "Create new item", icon: "carbon:new-tab", onClick: handleItemClick
    },
    // {
    //   name: isTag ? "Update tag" : "Update filter",
    //   icon: "material-symbols:edit-outline",
    //   onClick: handleCategoryClick
    // },
  ]
  if (isTag) {
    formActions = [
      ...formActions,
      {
        name: "Update tag", icon: "material-symbols:edit-outline",
        onClick: handleCategoryClick
      },
    ]
  }
  if (isFilter) {
    formActions = [
      ...formActions,
      {
        name: "Update filter", icon: "material-symbols:edit-outline",
        onClick: handleCategoryClick
      },
    ]
  }

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
