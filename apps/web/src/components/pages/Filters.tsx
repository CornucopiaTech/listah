
import type {
  ReactNode,
} from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Virtuoso } from 'react-virtuoso';




// Internal
import {
  useAppStore,
} from '@/hooks/store/boundStore';
import type {
  IFilterListContext,
  IListContext,
  IFilterUpdateContext,
  IFormContext,
  IMutatorContext,
} from "@/domain/entities";
import {
  useListFilters,
  useUpdateFilters,
  FormContext,
  ListContext,
  FilterUpdateProvider,
  FilterListProvider,
  ItemSearchProvider,
  ItemUpdateProvider,
  MutatorProvider,
  useMutator,
  BreadcrumbProvider,
} from "@/hooks/context";
import {
  ListItemStyling
} from "@/helpers/defaults";
import {
  AppContainer,
  AppSectionPaper,
  AppTooltip,
  FlexEndBox,
  FlexStartBox,
  FormDialog,
  getFormTextFieldProps,
  ListBox,
  ListLayout,
  OuterBox,
  UpdateFormActions,
  ItemSearchList,
  ItemUpdate,
  AppBreadcrumb,
} from '@/components';




export function Filters(): ReactNode {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <AppContainer mw="xl">

      {/* Update Filter Modal. Rendered on Update Filter Click */}
      <FilterUpdateProvider> <UpdateFilter /> </FilterUpdateProvider>

      {/* Update Item Modal. Rendered on Update Item Click */}
      <ItemUpdateProvider route="/filters"> <ItemUpdate /> </ItemUpdateProvider>

      {/* Item Search Result Modal. Rendered when Item is searched.*/}
      <ItemSearchProvider route="/filters"><ItemSearchList /></ItemSearchProvider>
      <AppSectionPaper>


        {/* Main Page Content */}
        <BreadcrumbProvider route="/filters"><AppBreadcrumb sx={{ display: isMobile ? "block" : "none" }} /></BreadcrumbProvider>
        <MutatorProvider>
          <FilterListProvider> <FilterList /> </FilterListProvider>
        </MutatorProvider>
      </AppSectionPaper>
    </AppContainer >
  );
}


export function FilterList(): ReactNode {
  const {
    filters,
    pagination,
    isPending,
    isError,
    error,
    pageChange,
    pageSizeChange,
    viewItemsClick,
    editFilterClick,
  } = useListFilters() as unknown as IFilterListContext;
  const storeFilterScroll = useAppStore((state) => state.filterScroll);
  const {
    addNewItemClick,
    addNewFilterClick,
  } = useMutator() as unknown as IMutatorContext;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));


  function prevRenderRow(itemKey: number): ReactNode {
    const item = filters[itemKey];
    const tc = item?.name ?? "";
    const itemcount = item?.count?.toString() ?? "0";
    return (
      <ListItem key={itemKey + tc} component="div" disablePadding sx={ListItemStyling} >
        <FlexStartBox >
          <ListItemButton onClick={() => viewItemsClick(itemKey)}>
            <ListItemText primary={
              <Typography variant={isMobile ? "body2m" : "body2"}  >{tc}</Typography>
            } />
          </ListItemButton>
        </FlexStartBox>
        <FlexEndBox >
          <Chip variant="contained" sx={{
            marginX: "0.3rem", marginY: 0,
            fontSize: isMobile ? '0.65rem' : "1rem",
            // display: isMobile ? "none" : "block"
          }}
            // @ts-ignore
            color={itemKey % 2 == 0 ? "inherit" : "secondary"} label={itemcount}
            size={isMobile ? "small" : "medium"}
          />
          <IconButton aria-label="edit" onClick={() => editFilterClick(itemKey)}> <AppTooltip title="Edit filter">
            <EditIcon fontSize={isMobile ? "small" : "medium"} />
          </AppTooltip> </IconButton>
        </FlexEndBox>
      </ListItem>
    );
  }

  function renderRow(itemKey: number): ReactNode {
    const item = filters[itemKey];
    const tc = item?.name ?? "";
    const itemcount = item?.count?.toString() ?? "0";
    return (
      <ListItem key={itemKey + tc} component="div" disablePadding sx={ListItemStyling} >
        <ListItemButton onClick={() => viewItemsClick(itemKey)}>
          <ListItemText primary={
            <Typography variant={isMobile ? "body2m" : "body2"}  >{tc}</Typography>
          } />
        </ListItemButton>
        <Chip variant="contained"
          sx={{
            marginX: "0.3rem", marginY: 0,
            fontSize: isMobile ? '0.65rem' : "1rem",
          }}
          // @ts-ignore
          color={itemKey % 2 == 0 ? "inherit" : "secondary"} label={itemcount}
          size={isMobile ? "small" : "medium"}
        />
        <IconButton aria-label="edit" onClick={() => editFilterClick(itemKey)}> <AppTooltip title="Edit filter">
          <EditIcon sx={{ fontSize: isMobile ? "1.1rem" : "1.5rem" }} />
        </AppTooltip> </IconButton>
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
    clickRow: viewItemsClick,
    renderRow,
  } as unknown as IListContext;

  function Shell({ children }: { children: ReactNode }) {
    return (
      <Stack>
        {/* Add new item, add new tag, add new filter buttons*/}
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={addNewFilterClick}>
            <AddIcon />
            Create filter
          </Button>
          <Button variant="contained" onClick={addNewItemClick}>
            <AddIcon />
            Create item
          </Button>
        </Stack>
        <AppSectionPaper>
          <ListContext.Provider value={contextValue}><ListBox><OuterBox>{children} </OuterBox></ListBox></ListContext.Provider>
        </AppSectionPaper>
      </Stack >
    );
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

function UpdateFilter(): ReactNode {
  const {
    openDialog,
    closeDialog,
    mutation,
    form,
    title,
    isPending,
    error,
    tags,
    formData,
  } = useUpdateFilters() as unknown as IFilterUpdateContext;

  function renderCell(idx: number): ReactNode {
    return (
      <form.Field name={`tags[${idx}]`}
        children={(field: any) => {
          const lbl = !field.state.value ? "" : field.state.value.name
          return (
            <FormControlLabel control={
              <Checkbox
                checked={field.state.value?.checked}
                onChange={() => {
                  field.handleChange({ ...field.state.value, checked: !field.state.value.checked })
                }}
                slotProps={{
                  input: { 'aria-label': 'controlled' },
                }}
              />
            } label={lbl} />
          );
        }}
      />
    )
  }

  let content = <LinearProgress />;
  let actions = undefined;
  if (isPending) {
    content = <LinearProgress />;
  }
  if (error) {
    content = (
      <Alert severity="error"> {error?.message || "An error occurred. Please try again"}</Alert>
    );
  }
  if (!isPending && !error && tags.length == 0) {
    content = (
      <Typography variant="h6"> No tags found </Typography>
    );
  }
  if (tags.length > 0 && formData) {
    content = (
      <Box component="section" >
        <form.Field
          key="name"
          name="name"
          children={
            (field: any) => {
              const props = getFormTextFieldProps({ key: "name", field, });
              // @ts-ignore
              return < TextField {...props} />
            }
          }
        />
        <Virtuoso
          key="data-content"
          style={{ height: "40vh" }}
          initialTopMostItemIndex={0}
          totalCount={tags.length}
          itemContent={(i) => renderCell(i)}
        />
      </Box>
    );
    actions = <UpdateFormActions />
  }




  const contextValue = {
    title,
    content,
    actions,
    openDialog,
    closeDialog,
    form,
    mutation,
  } as unknown as IFormContext;

  return <FormContext.Provider value={contextValue} > <FormDialog /> </FormContext.Provider >
}
