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
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';




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
  ITagListContext,
  IListContext,
} from '@/domain/entities';
import {
  TagFormDataProvider,
  TagFormProvider,
  FilterFormDataProvider,
  FilterFormProvider,
} from '@/hooks/services/useForm';
import {
  useListTags
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
  } = useListTags() as unknown as ITagListContext;
  const storeTagScroll = useAppStore((state) => state.tagScroll);
  const storeTagModal = useAppStore((state) => state.tagModal);
  const storeFilterModal = useAppStore((state) => state.filterModal);

  const storeSetTagModal = useAppStore((state) => state.setTagModal);
  const storeSetFilterModal = useAppStore((state) => state.setFilterModal);


  function renderRow(itemKey: number): ReactNode {
    const item = tags[itemKey];
    const tc = item && item.name ? item.name : "";
    const itemcount = item.count ? item.count.toString() : "0";
    return (
      <Fragment>
        {/* <ListItem key={itemKey + tc} component="div" sx={ListItemStyling} onClick={() => listItemClick(itemKey)} >
          <Typography variant="body2" component="div">{tc}</Typography>
          <ListItemButton>
            <Typography variant="body2" component="div">{tc}</Typography>
            <ListItemText primary={<Typography variant="body2" component="div">{tc}</Typography>} />
            <ListItemText primary={<Typography variant="body2">Item count: {item.count ? item.count.toString() : "0"}</Typography>} />
            <Chip
              variant="contained"
              // @ts-ignore
              color={itemKey % 2 == 0 ? "inherit" : "secondary"}
              label={item.count ? item.count.toString() : "0"}
            />
          </ListItemButton>
        </ListItem> */}
        <TableCell key={itemKey + tc} sx={ListItemStyling} >
          <Typography variant="body1" component="div">{tc}</Typography>
          <Stack direction="row" spacing={1}>
            {/* <Typography variant="body2" sx={{ fontWeight: "700" }}>Item count: {itemcount}
            </Typography> */}
            <Button variant="text" >Item count: {itemcount}</Button>
            <Button variant="text" > Edit</Button>
            <Button variant="text"> Delete</Button>
            <Button variant="text" sx={{ display: itemcount == "0" ? "none" : "inline-flex" }} onClick={() => listItemClick(itemKey)}> View items</Button>
          </Stack>
          <Stack direction="row" spacing="auto">
            <Typography variant="body2" >Item count:
              {itemcount}
            </Typography>
            <Typography variant="body2">Edit
            </Typography>
            <Typography variant="body2" >Delete
            </Typography>
            <Typography variant="body2" sx={{ display: itemcount == "0" ? "none" : "inline-flex" }} onClick={() => listItemClick(itemKey)}> View items</Typography>
          </Stack>

        </TableCell>
        <Divider />
      </Fragment>

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
    <AppContainer mw="sm" >
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
  } = useListTags() as unknown as ITagListContext;

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
