import {
  Fragment,
} from "react";
import type {
  ReactNode,
} from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';



// Internal
import {
  useAppStore,
} from '@/hooks/store/boundStore';
import {
  AppTagModal,
  AppFilterModal,
  ListLayout,
  AppContainer,
  AppListHeader,
  ListBox,
  OuterBox,
} from '@/components/layout';
import {
  MenuItem,
} from '@/components/base/Menubar';
import {
} from "@/domain/rules";
import type {
  IFilter,
  IFilterListContext,
  IListContext,
} from "@/domain/entities";
import {
  TagFormDataProvider,
  TagFormProvider,
  FilterFormDataProvider,
  FilterFormProvider,
} from '@/hooks/services/useForm';
import {
  useListFilters,
} from "@/hooks/context/filters";
import {
  ListContext,
} from "@/hooks/context/lists";
import { ListItemStyling } from "@/utils/defaults";




export function FilterShell({ children }: { children: ReactNode }) {
  const {
    filters,
    pagination,
    isPending,
    isError,
    isFetching,
    error,
    pageChange,
    pageSizeChange,
    listItemClick,
  } = useListFilters() as unknown as IFilterListContext;
  const storeFilterScroll = useAppStore((state) => state.filterScroll);
  const storeTagModal = useAppStore((state) => state.tagModal);
  const storeFilterModal = useAppStore((state) => state.filterModal);

  function renderRow(itemKey: number): ReactNode {
    const item: IFilter = filters[itemKey];
    const tc = item && item.name ? item.name : "";
    return (
      <ListItem
        key={itemKey + tc}
        component="div" disablePadding
        sx={ListItemStyling}
        onClick={() => listItemClick(itemKey)}
      >
        <ListItemButton>
          <ListItemText primary={<Typography variant="body2">{tc}</Typography>} />
          <Chip
            variant="contained"
            // @ts-ignore
            color={itemKey % 2 == 0 ? "inherit" : "secondary"}
            label={item.count ? item.count.toString() : "0"}
          />
        </ListItemButton>
      </ListItem>
    );
  }



  const contextValue = {
    data: filters,
    pagination: pagination.paging,
    isPending,
    isError,
    isFetching,
    error,
    scrollIndex: Math.max(0, storeFilterScroll),
    pageChange,
    pageSizeChange,
    clickRow: listItemClick,
    renderRow,
  } as unknown as IListContext;

  const menuItems = <Fragment>
    <MenuItem key="tag" onClick={() => store.setTagModal(true)}>
      <Typography variant="body2">Create new tag </Typography>
    </MenuItem>
    <MenuItem key="filter" onClick={() => store.setFilterModal(true)}>
      <Typography variant="body2">Create new filter </Typography>
    </MenuItem>
  </Fragment>


  return (
    <AppContainer mw="md" >
      <AppListHeader title="Filters" menuItems={menuItems} />
      {
        storeTagModal &&
        <TagFormDataProvider>
          <TagFormProvider>
            <AppTagModal />
          </TagFormProvider>
        </TagFormDataProvider>
      }
      {
        storeFilterModal &&
        <FilterFormDataProvider>
          <FilterFormProvider >
            <AppFilterModal />
          </ FilterFormProvider>
        </FilterFormDataProvider>
      }
      <ListContext.Provider value={contextValue}>
        <ListBox><OuterBox>{children}  </OuterBox></ListBox>
      </ListContext.Provider>
    </AppContainer >
  );
}


export function Filters() {
  const {
    filters,
    isPending,
    error,
  } = useListFilters() as unknown as IFilterListContext;

  if (isPending) { return <LinearProgress /> }

  if (error) {
    return <Alert severity="error">{error.message || "An error occurred. Please try again"}</Alert>
  }
  if (filters.length == 0) {
    return (<Typography variant="h6"> No items found </Typography>)
  }

  if (filters.length > 0) { return (<ListLayout />) }
  return (
    <Alert severity="error">"An error occurred. Please try again"</Alert>
  )
}
