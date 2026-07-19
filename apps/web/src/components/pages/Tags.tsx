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
  MenuItem,
} from '@/components/base/Menubar';
import {
  useAppStore,
} from '@/hooks/store/boundStore';
import {
  AppTagModal,
  AppFilterModal,
  AppContainer,
  AppListHeader,
  ListLayout,
  ListBox,
  OuterBox,
} from '@/components/layout';
import type {
  ITagDataContext,
  IListContext,
} from '@/domain/entities';
import {
  TagFormDataProvider,
  TagFormProvider,
  FilterFormDataProvider,
  FilterFormProvider,
} from '@/hooks/services/useForm';
import {
  useTags
} from "@/hooks/context/tags";
import {
  ListContext,
} from "@/hooks/context/lists";
import { ListItemStyling } from "@/utils/defaults";



export function TagShell({ children }: { children: ReactNode }) {
  const {
    tags,
    pagination,
    isPending,
    isError,
    isFetching,
    error,
    pageChange,
    pageSizeChange,
    listItemClick,
  } = useTags() as unknown as ITagDataContext;
  const storeTagScroll = useAppStore((state) => state.tagScroll);
  const storeTagModal = useAppStore((state) => state.tagModal);
  const storeFilterModal = useAppStore((state) => state.filterModal);

  const storeSetTagModal = useAppStore((state) => state.setTagModal);
  const storeSetFilterModal = useAppStore((state) => state.setFilterModal);


  function renderRow(itemKey: number): ReactNode {
    const item = tags[itemKey];
    const tc = item && item.name ? item.name : "";
    return (
      <ListItem key={itemKey + tc} component="div" disablePadding sx={ListItemStyling} onClick={() => listItemClick(itemKey)} >
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
    data: tags,
    pagination: pagination.paging,
    isPending,
    isError,
    isFetching,
    error,
    scrollIndex: Math.max(0, storeTagScroll),
    pageChange,
    pageSizeChange,
    clickRow: listItemClick,
    renderRow,
  } as unknown as IListContext;

  const mItems = <Fragment>
    <MenuItem key="tag" onClick={() => storeSetTagModal(true)}>
      <Typography variant="body1">Create new tag </Typography>
    </MenuItem>
    <MenuItem key="filter" onClick={() => storeSetFilterModal(true)}>
      <Typography variant="body1">Create new filter </Typography>
    </MenuItem>
  </Fragment >


  return (
    <AppContainer mw="md" >
      <AppListHeader title="Tags" menuItems={mItems} />
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



export function Tags() {
  const {
    tags,
    isPending,
    error,
  } = useTags() as unknown as ITagDataContext;

  if (isPending) {
    return <LinearProgress />
  }


  if (error) {
    return <Alert severity="error">{error.message || "An error occurred. Please try again"}</Alert>
  }
  if (tags.length == 0) {
    return (
      <Typography variant="h6"> No items found </Typography>
    )
  }

  if (tags.length > 0) {
    return (<ListLayout />)
  }
  return (
    <Alert severity="error">"An error occurred. Please try again"</Alert>
  )
}
