
import {
  Fragment,
} from "react";
import type {
  ReactNode,
} from 'react';
import { useTheme, } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import EditIcon from '@mui/icons-material/Edit';


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
  ListLayout,
  ListBox,
  OuterBox,
  ItemList,
} from '@/components/layout';
import type {
  ITagListContext,
  IListContext,
  IItemListContext,
} from '@/domain/entities';
import {
  TagFormDataProvider,
  TagFormProvider,
  FilterFormDataProvider,
  FilterFormProvider,
  ItemFormDataProvider,
  ItemFormProvider,
} from '@/hooks/services/useForm';
import {
  useListTags
} from "@/hooks/context/tags";
import {
  ListContext,
} from "@/hooks/context/lists";
import {
  ListItemStyling
} from "@/helpers/defaults";
import {
  AppSectionPaper,
} from '@/components/core/AppPaper';
import type { AppTheme } from '@/system/theme';
import {
  AppItemModal
} from "@/components/layout/AppItemModal";
import CategoryIcon from '@mui/icons-material/Category';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TagIcon from '@mui/icons-material/Tag';
import {
  ItemListContext,
  useListItems,

} from "@/hooks/context/items";


// ToDo: Disable pagination button when there is no content
export function Tags() {
  const theme: AppTheme = useTheme();
  const storeTagModal = useAppStore((state) => state.tagModal);
  const storeFilterModal = useAppStore((state) => state.filterModal);
  const storeSetTagModal = useAppStore((state) => state.setTagModal);
  const storeSetFilterModal = useAppStore((state) => state.setFilterModal);
  const storeItemModal = useAppStore((state) => state.itemModal);
  const {
    items,
    childPagination,
    childIsPending,
    childIsError,
    childError,
    childPageChange,
    childPageSizeChange,
    childListItemClick,
    breadcrumbClick,
    breadcrumbTail,
  } = useListTags() as unknown as ITagListContext;

  const contextValue = {
    items,
    pagination: childPagination,
    isPending: childIsPending,
    isError: childIsError,
    error: childError,
    pageChange: childPageChange,
    pageSizeChange: childPageSizeChange,
    listItemClick: childListItemClick,
  } as unknown as IItemListContext;


  const mItems = <Fragment>
    <MenuItem key="tag" onClick={() => storeSetTagModal(true)}>
      <Typography variant="body1">Create new tag </Typography>
    </MenuItem>
    <MenuItem key="filter" onClick={() => storeSetFilterModal(true)}>
      <Typography variant="body1">Create new filter </Typography>
    </MenuItem>
  </Fragment >


  // ToDo: change background colour of tooltip of speeddial
  const actions = [
    { icon: <TagIcon />, name: 'Create new tag' },
    { icon: <CategoryIcon />, name: 'Create new filter' },
    { icon: <ListAltIcon />, name: 'Create new item' },
  ];

  return (
    <AppContainer mw="md" >
      <SpeedDial
        direction="up"
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 10 }}
        icon={<EditIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            slotProps={{
              tooltip: {
                title: action.name,
                sx: {
                  // bgcolor: 'primary.main'
                  // '& .MuiTooltip-tooltip': {
                  //   backgroundColor: 'primary.main',
                  // },
                }
              },
            }}
          />
        ))}
      </SpeedDial>
      {
        storeItemModal &&
        <ItemFormDataProvider>
          <ItemFormProvider>
            <AppItemModal />
          </ItemFormProvider>
        </ItemFormDataProvider>
      }
      {
        storeTagModal &&
        <TagFormDataProvider> <TagFormProvider> <AppTagModal /> </TagFormProvider> </TagFormDataProvider>
      }
      {
        storeFilterModal &&
        <FilterFormDataProvider> <FilterFormProvider > <AppFilterModal /> </ FilterFormProvider> </FilterFormDataProvider>
      }
      <Grid container spacing={1} sx={{ marginTop: "10px" }}>
        <Grid key="tag" size={4} >
          <Typography variant="h6" component="div" color="primary.dark" textAlign={"left"}> Tags </Typography>
          <AppSectionPaper><TagList /></AppSectionPaper>
        </Grid>
        <Divider orientation="vertical" key="divider" sx={{ borderColor: theme.palette.primary.contrastText }} />
        <Grid key="item" size={7.5} >
          <Breadcrumbs aria-label="breadcrumb" >
            <Link underline="hover" color="inherit" onClick={breadcrumbClick}>
              <Typography variant="h6" component="div" textAlign={"left"}> Tags </Typography>
            </Link>
            <Typography variant="h6" component="div" textAlign={"left"}> {breadcrumbTail} </Typography>
          </Breadcrumbs>
          <AppSectionPaper><ItemListContext.Provider value={contextValue}>
            <ItemList />
          </ItemListContext.Provider></AppSectionPaper>
        </Grid>
      </Grid>
    </AppContainer >
  );
}


export function TagList() {
  const {
    tags,
    pagination,
    isPending,
    isError,
    error,
    pageChange,
    pageSizeChange,
    listItemClick,
  } = useListTags() as unknown as ITagListContext;
  const storeTagScroll = useAppStore((state) => state.tagScroll);

  function renderRow(itemKey: number): ReactNode {
    const item = tags[itemKey];
    const tc = item?.name ?? "";
    const itemcount = item?.count?.toString() ?? "0";
    return (
      <Fragment>
        <List key={itemKey + tc} sx={{ ...ListItemStyling, padding: "30px" }} onClick={() => listItemClick(itemKey)}>
          <ListItem key={itemKey + tc + "text "} component="div" >
            <Typography variant="body1">{tc}</Typography>
          </ListItem>
          <ListItem key={itemKey + tc + "count"} component="div" >
            <Typography variant="body2" >Item count:
              {itemcount}
            </Typography>
          </ListItem>
          <Divider />
        </List>
      </Fragment>
    );
  }

  const contextValue = {
    data: tags,
    pagination: pagination.paging,
    isPending,
    isError,
    error,
    scrollIndex: Math.max(0, storeTagScroll),
    pageChange: tags.length > 0 ? pageChange : undefined,
    pageSizeChange: tags.length > 0 ? pageSizeChange : undefined,
    clickRow: listItemClick,
    renderRow,
  } as unknown as IListContext;

  function Shell({ children }: { children: ReactNode }) {
    return <ListContext.Provider value={contextValue}><ListBox><OuterBox>{children} </OuterBox></ListBox></ListContext.Provider>
  }

  if (isPending) {
    return <Shell><LinearProgress /></Shell>
  }


  if (error) {
    return <Shell><Alert severity="error">{error.message || "An error occurred. Please try again"}</Alert></Shell>
  }
  if (tags.length == 0) {
    return (
      <Shell><Typography variant="h6"> No items found </Typography></Shell>
    )
  }

  if (tags.length > 0) {
    return (<Shell><ListLayout /></Shell>)
  }
  return (
    <Shell><Alert severity="error">"An error occurred. Please try again"</Alert></Shell>
  )
}
