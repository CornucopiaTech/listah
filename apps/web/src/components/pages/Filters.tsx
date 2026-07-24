import {
  Fragment,
} from "react";
import type {
  ReactNode,
} from 'react';
import { useTheme, } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import EditIcon from '@mui/icons-material/Edit';
import CategoryIcon from '@mui/icons-material/Category';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TagIcon from '@mui/icons-material/Tag';



// Internal
import {
  useAppStore,
} from '@/hooks/store/boundStore';
import {

  ListLayout,
  AppContainer,
  ListBox,
  OuterBox,
  ItemList,
  // AppItemModal,
  // AppTagModal,
  // AppFilterModal,
} from '@/components/layout';
import {
} from "@/domain/rules";
import type {

  IFilterListContext,
  IBreadcrumbContext,
  IListContext,
} from "@/domain/entities";
// import {
//   TagFormDataProvider,
//   TagFormProvider,
//   FilterFormDataProvider,
//   FilterFormProvider,
//   ItemFormDataProvider,
//   ItemFormProvider,
// } from '@/hooks/services/useForm';
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
  useListFilters,
  FilterListProvider,
  FilterItemListProvider,
} from "@/hooks/context/filters";
import {
  BreadcrumbProvider,
  useBreadcrumb,
} from "@/hooks/context/breadcrumb";




// ToDo: Stop List (or Tag) from re-rendering when the other changes its context.
// ToDo: Disable pagination button when there is no content
export function Filters() {
  const theme: AppTheme = useTheme();
  // const storeTagModal = useAppStore((state) => state.tagModal);
  // const storeFilterModal = useAppStore((state) => state.filterModal);
  // const storeItemModal = useAppStore((state) => state.itemModal);

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
        sx={{ position: 'absolute', bottom: 16, right: 4 }}
        icon={<EditIcon sx={{ fontSize: "1rem" }} />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            slotProps={{
              tooltip: {
                title: action.name,
                sx: {
                }
              },
            }}
          />
        ))}
      </SpeedDial>

      <Grid container spacing={1}>
        <Grid key="tag" size={5} >
          <Link underline="none" color="primary.dark" >
            <Typography variant="h6" component="div" color="inherit" textAlign={"left"}> Filters </Typography>
          </Link>

          <AppSectionPaper>
            <FilterListProvider> <FilterList /> </FilterListProvider>
          </AppSectionPaper>
        </Grid>
        <Divider orientation="vertical" key="divider" sx={{ borderColor: theme.palette.primary.contrastText }} />
        <Grid key="item" size={6.5} >
          <BreadcrumbProvider route="/filters"><ListedItems /></BreadcrumbProvider>
        </Grid>
      </Grid>
      {/* {
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
      } */}
    </AppContainer >
  );
}


export function FilterList() {
  const {
    filters,
    pagination,
    isPending,
    isError,
    error,
    pageChange,
    pageSizeChange,
    listItemClick,
  } = useListFilters() as unknown as IFilterListContext;
  const storeFilterScroll = useAppStore((state) => state.filterScroll);

  function renderRow(itemKey: number): ReactNode {
    const item = filters[itemKey];
    const tc = item?.name ?? "";
    const itemcount = item?.count?.toString() ?? "0";
    return (
      <ListItem key={itemKey + tc} component="div"
        disablePadding sx={ListItemStyling}
        onClick={() => listItemClick(itemKey)} >
        <ListItemButton>
          <ListItemText primary={<Typography variant="body2">{tc}</Typography>} />
          <Chip
            variant="contained"
            // @ts-ignore
            color={itemKey % 2 == 0 ? "inherit" : "secondary"}
            label={itemcount}
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
    error,
    scrollIndex: Math.max(0, storeFilterScroll),
    pageChange: filters.length > 0 ? pageChange : undefined,
    pageSizeChange: filters.length > 0 ? pageSizeChange : undefined,
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
  if (filters.length == 0) {
    return (
      <Shell><Typography variant="h6"> No items found </Typography></Shell>
    )
  }

  if (filters.length > 0) {
    return (<Shell><ListLayout /></Shell>)
  }
  return (
    <Shell><Alert severity="error">"An error occurred. Please try again"</Alert></Shell>
  )
}


function ListedItems() {
  const {
    breadcrumbClick,
    breadcrumbTail,
  } = useBreadcrumb() as unknown as IBreadcrumbContext;
  return (<Fragment>
    <Breadcrumbs aria-label="breadcrumb" >
      <Link underline="hover" color="inherit" onClick={breadcrumbClick}>
        <Typography variant="h6" component="div" textAlign={"left"}> Filters </Typography>
      </Link>
      <Typography variant="h6" component="div" textAlign={"left"}> {breadcrumbTail} </Typography>
    </Breadcrumbs>
    <AppSectionPaper>
      <FilterItemListProvider> <ItemList /> </FilterItemListProvider>
    </AppSectionPaper>
  </Fragment>)
}
