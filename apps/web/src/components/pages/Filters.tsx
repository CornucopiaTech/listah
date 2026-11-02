
import type {
  ReactNode,
} from 'react';
import {
  forwardRef,
  Fragment
} from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Virtuoso } from 'react-virtuoso';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import type { TableComponents } from 'react-virtuoso';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';



// Internal
import {
  useAppStore,
} from '@/hooks/store/boundStore';
import type {
  IViewFiltersContext,
  ITableContext,
  IUpdateFiltersContext,
  IFormContext,
  ICreateContext,
  IPagingContext,
  IFilter,
} from "@/domain/entities";
import {
  useViewFilters,
  useUpdateFilters,
  FormContext,
  PagingContext,
  TableContext,
  UpdateFiltersProvider,
  ViewFiltersProvider,
  SearchItemsProvider,
  UpdateItemsProvider,
  CreateProvider,
  useMutator,
  BreadcrumbProvider,
} from "@/hooks/context";
import {
  AppContainer,
  AppSectionPaper,
  AppTooltip,
  FormDialog,
  getFormTextFieldProps,
  ListBox,
  TableLayout,
  OuterBox,
  UpdateFormActions,
  ItemSearchList,
  ItemUpdate,
  AppBreadcrumb,
} from '@/components';


const VirtuosoTableComponents: TableComponents<IFilter> = {
  Scroller: forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead: forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow,
  TableBody: forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

export function Filters(): ReactNode {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <AppContainer mw="xl">

      {/* Update Filter Modal. Rendered on Update Filter Click */}
      <UpdateFiltersProvider> <UpdateFilter /> </UpdateFiltersProvider>

      {/* Update Item Modal. Rendered on Update Item Click */}
      <UpdateItemsProvider route="/filters"> <ItemUpdate /> </UpdateItemsProvider>

      {/* Item Search Result Modal. Rendered when Item is searched.*/}
      <SearchItemsProvider route="/filters"><ItemSearchList /></SearchItemsProvider>
      <AppSectionPaper>


        {/* Main Page Content */}
        <BreadcrumbProvider route="/filters"><AppBreadcrumb sx={{ display: isMobile ? "block" : "none" }} /></BreadcrumbProvider>
        <CreateProvider>
          <ViewFiltersProvider> <ViewFilter /> </ViewFiltersProvider>
        </CreateProvider>
      </AppSectionPaper>
    </AppContainer >
  );
}

export function ViewFilterMobile(): ReactNode {
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
  } = useViewFilters() as unknown as IViewFiltersContext;
  const storeFilterScroll = useAppStore((state) => state.filterScroll);
  const {
    addNewItemClick,
    addNewFilterClick,
  } = useMutator() as unknown as ICreateContext;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  function renderCell(itemKey: number): ReactNode {
    const item = filters[itemKey];
    const tc = item?.name ?? "";
    const itemcount = item?.count?.toString() ?? "0";
    const fontSize = isMobile ? "0.9rem" : '1rem';
    const iconFontSize = isMobile ? "1.1rem" : "1.5rem";
    return (
      <Fragment>
        <TableCell
          key="name"
          component='th'
          scope='row'
          align='left'
          onClick={() => viewItemsClick(itemKey)}
          sx={{
            fontSize: fontSize,
          }}>
          {tc}
        </TableCell>
        <TableCell
          key="count"
          component='td'
          scope={undefined}
          align='right'
          sx={{
            fontSize: fontSize,
            display: isMobile ? "none" : undefined
          }}>
          {itemcount}
        </TableCell>
        <TableCell
          key="updatedAt"
          component='td'
          scope={undefined}
          align='right'
          sx={{
            fontSize: fontSize,
            display: isMobile ? "none" : undefined
          }}>
          {item.updatedAt ?? ""}
        </TableCell>
        <TableCell
          key="actions"
          component='td'
          scope={undefined}
          align='right'
          sx={{
            fontSize: fontSize,
          }}>
          <IconButton aria-label="edit" onClick={() => editFilterClick(itemKey)}>
            <AppTooltip title="Edit filter">
              <EditIcon sx={{ fontSize: iconFontSize }} />
            </AppTooltip>
          </IconButton>
          <IconButton aria-label="edit" onClick={() => editFilterClick(itemKey)}>
            <AppTooltip title="Delete filter">
              <DeleteIcon sx={{ fontSize: iconFontSize, color: "red" }} />
            </AppTooltip>
          </IconButton>
        </TableCell>
      </Fragment>
    );
  }

  function headerContent() {
    const headerFontSize = isMobile ? "1rem" : '1.4rem';
    return (
      <TableRow>
        <TableCell
          key="name"
          variant="head"
          align='left'
          style={{ width: isMobile ? 80 : 100 }}
          sx={{
            backgroundColor: 'background.paper',
            fontSize: headerFontSize,
            fontWeight: 'bold',
          }} >
          Name
        </TableCell>
        <TableCell
          key="count"
          variant="head"
          align='right'
          style={{ width: 50 }}
          sx={{
            backgroundColor: 'background.paper',
            fontSize: headerFontSize,
            fontWeight: 'bold',
            display: isMobile ? "none" : undefined
          }} >
          Usage
        </TableCell>
        <TableCell
          key="updatedAt"
          variant="head"
          align='right'
          style={{ width: 100 }}
          sx={{
            backgroundColor: 'background.paper',
            fontSize: headerFontSize,
            fontWeight: 'bold',
            display: isMobile ? "none" : undefined
          }} >
          Updated At
        </TableCell>
        <TableCell
          key="actions"
          variant="head"
          align='right'
          style={{ width: 50 }}
          sx={{
            backgroundColor: 'background.paper',
            fontSize: headerFontSize,
            fontWeight: 'bold'
          }} >
          Actions
        </TableCell>
      </TableRow>
    );
  }


  const tableContextValue = {
    data: filters,
    isPending,
    isError,
    error,
    scrollIndex: Math.max(0, storeFilterScroll),
    clickRow: viewItemsClick,
    renderCell,
    headerContent,
    components: VirtuosoTableComponents,
  } as unknown as ITableContext;

  const pagingContextValue = {
    pagination: pagination.paging,
    pageChange: filters.length > 0 ? pageChange : undefined,
    pageSizeChange: filters.length > 0 ? pageSizeChange : undefined,
  } as unknown as IPagingContext;

  const sortOptions = [
    { value: "name asc", label: "Name Asc" },
    { value: "name desc", label: "Name Desc" },
    { value: "updatedAt asc", label: "Last Updated Asc" },
    { value: "updatedAt desc", label: "Last Updated  Desc" },
  ]

  function Shell({ children }: { children: ReactNode }) {
    return (
      <Stack>
        {/* Add new item, add new tag, add new filter buttons*/}
        <Stack direction="row" spacing={1} sx={{
          justifyContent: 'flex-end', alignContent: 'center',
          display: 'flex', width: '100%', flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={""}
            label="rows-per-page"
            //  @ts-ignore
            onChange={() => undefined}
            sx={{
              // height: 36,                     // overall component height
              height: "fit-content",                     // overall component height
              '& .MuiSelect-select': {
                paddingY: 1.2,                // vertical padding
              },
            }}
          >
            {sortOptions.map((i, _) =>
              <MenuItem value={i.value}>{isMobile ? "" : "Sort by: "} <Typography variant={isMobile ? "body2m" : "body2"} component="div" textAlign={"left"} sx={{}}> {i.label} </Typography>  </MenuItem>
            )}
          </Select>
          <Button size={isMobile ? "small" : "medium"} variant="contained" onClick={addNewFilterClick}
            sx={{ fontSize: isMobile ? "0.6rem" : "1rem", p: 1, }}>
            <AddIcon sx={{ display: isMobile ? "none" : undefined }} />
            <Typography variant={isMobile ? "h7m" : "h7"} component="div" textAlign={"left"} sx={{}}> Create filter </Typography>

          </Button>
          <Button size={isMobile ? "small" : "medium"}
            sx={{ fontSize: isMobile ? "0.6rem" : "1rem", p: 1, }}
            variant="contained" onClick={addNewItemClick}>
            <AddIcon sx={{ display: isMobile ? "none" : undefined }} />
            <Typography variant={isMobile ? "h7m" : "h7"} component="div" textAlign={"left"} sx={{}}> Create item </Typography>
          </Button>
        </Stack>
        <AppSectionPaper>
          <PagingContext.Provider value={pagingContextValue}>
            <TableContext.Provider value={tableContextValue}>
              <ListBox>
                <OuterBox>{children} </OuterBox>
              </ListBox>
            </TableContext.Provider>
          </PagingContext.Provider>
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
    return (<Shell><TableLayout /></Shell>)
  }
  return (
    <Shell><Alert severity="error">"An error occurred. Please try again"</Alert></Shell>
  )
}

export function ViewFilterDesktop(): ReactNode {
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
  } = useViewFilters() as unknown as IViewFiltersContext;
  const storeFilterScroll = useAppStore((state) => state.filterScroll);
  const {
    addNewItemClick,
    addNewFilterClick,
  } = useMutator() as unknown as ICreateContext;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  function renderCell(itemKey: number): ReactNode {
    const item = filters[itemKey];
    const tc = item?.name ?? "";
    const itemcount = item?.count?.toString() ?? "0";
    const fontSize = '1rem';
    const iconFontSize = "1.5rem";
    // const toDisplay = undefined;
    return (
      <Fragment>
        <TableCell
          key="name"
          component='th'
          scope='row'
          align='left'
          onClick={() => viewItemsClick(itemKey)}
          sx={{
            fontSize: fontSize,
          }}>
          {tc}
        </TableCell>
        <TableCell
          key="count"
          component='td'
          scope={undefined}
          align='right'
          sx={{
            fontSize: fontSize,
          }}>
          {itemcount}
        </TableCell>
        <TableCell
          key="updatedAt"
          component='td'
          scope={undefined}
          align='right'
          sx={{
            fontSize: fontSize,
          }}>
          {item.updatedAt ?? ""}
        </TableCell>
        <TableCell
          key="actions"
          component='td'
          scope={undefined}
          align='right'
          sx={{
            fontSize: fontSize,
          }}>
          <IconButton aria-label="edit" onClick={() => editFilterClick(itemKey)}>
            <AppTooltip title="Edit filter">
              <EditIcon sx={{ fontSize: iconFontSize }} />
            </AppTooltip>
          </IconButton>
          <IconButton aria-label="edit" onClick={() => editFilterClick(itemKey)}>
            <AppTooltip title="Delete filter">
              <DeleteIcon sx={{ fontSize: iconFontSize, color: "red" }} />
            </AppTooltip>
          </IconButton>
        </TableCell>
      </Fragment>
    );
  }

  function headerContent() {
    const headerFontSize = '1.4rem';
    return (
      <TableRow>
        <TableCell
          key="name"
          variant="head"
          align='left'
          style={{ width: isMobile ? 80 : 100 }}
          sx={{
            backgroundColor: 'background.paper',
            fontSize: headerFontSize,
            fontWeight: 'bold',
          }} >
          Name
        </TableCell>
        <TableCell
          key="count"
          variant="head"
          align='right'
          style={{ width: 50 }}
          sx={{
            backgroundColor: 'background.paper',
            fontSize: headerFontSize,
            fontWeight: 'bold',
            display: undefined
          }} >
          Usage
        </TableCell>
        <TableCell
          key="updatedAt"
          variant="head"
          align='right'
          style={{ width: 100 }}
          sx={{
            backgroundColor: 'background.paper',
            fontSize: headerFontSize,
            fontWeight: 'bold',
            display: undefined
          }} >
          Updated At
        </TableCell>
        <TableCell
          key="actions"
          variant="head"
          align='right'
          style={{ width: 50 }}
          sx={{
            backgroundColor: 'background.paper',
            fontSize: headerFontSize,
            fontWeight: 'bold'
          }} >
          Actions
        </TableCell>
      </TableRow>
    );
  }


  const tableContextValue = {
    data: filters,
    isPending,
    isError,
    error,
    scrollIndex: Math.max(0, storeFilterScroll),
    clickRow: viewItemsClick,
    renderCell,
    headerContent,
    components: VirtuosoTableComponents,
  } as unknown as ITableContext;

  const pagingContextValue = {
    pagination: pagination.paging,
    pageChange: filters.length > 0 ? pageChange : undefined,
    pageSizeChange: filters.length > 0 ? pageSizeChange : undefined,
  } as unknown as IPagingContext;

  const sortOptions = [
    { value: "name asc", label: "Name Asc" },
    { value: "name desc", label: "Name Desc" },
    { value: "updatedAt asc", label: "Last Updated Asc" },
    { value: "updatedAt desc", label: "Last Updated  Desc" },
  ]

  function Shell({ children }: { children: ReactNode }) {
    return (
      <Stack>
        {/* Add new item, add new tag, add new filter buttons*/}
        <Stack direction="row" spacing={1} sx={{
          justifyContent: 'flex-end', alignContent: 'center',
          display: 'flex', width: '100%', flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={""}
            label="rows-per-page"
            //  @ts-ignore
            onChange={() => undefined}
            sx={{
              // height: 36,                     // overall component height
              height: "fit-content",                     // overall component height
              '& .MuiSelect-select': {
                paddingY: 1.2,                // vertical padding
              },
            }}
          >
            {sortOptions.map((i, _) =>
              <MenuItem value={i.value}>"Sort by: " <Typography variant="body2" component="div" textAlign={"left"} sx={{}}> {i.label} </Typography>  </MenuItem>
            )}
          </Select>
          <Button size={isMobile ? "small" : "medium"} variant="contained" onClick={addNewFilterClick}
            sx={{ fontSize: isMobile ? "0.6rem" : "1rem", p: 1, }}>
            <AddIcon sx={{ display: isMobile ? "none" : undefined }} />
            <Typography variant={isMobile ? "h7m" : "h7"} component="div" textAlign={"left"} sx={{}}> Create filter </Typography>

          </Button>
          <Button size={isMobile ? "small" : "medium"}
            sx={{ fontSize: isMobile ? "0.6rem" : "1rem", p: 1, }}
            variant="contained" onClick={addNewItemClick}>
            <AddIcon sx={{ display: isMobile ? "none" : undefined }} />
            <Typography variant={isMobile ? "h7m" : "h7"} component="div" textAlign={"left"} sx={{}}> Create item </Typography>
          </Button>
        </Stack>
        <AppSectionPaper>
          <PagingContext.Provider value={pagingContextValue}>
            <TableContext.Provider value={tableContextValue}>
              <ListBox>
                <OuterBox>{children} </OuterBox>
              </ListBox>
            </TableContext.Provider>
          </PagingContext.Provider>
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
    return (<Shell><TableLayout /></Shell>)
  }
  return (
    <Shell><Alert severity="error">"An error occurred. Please try again"</Alert></Shell>
  )
}

export function ViewFilter(): ReactNode {
  const {
    filters,
    pagination,
    isPending,
    isError,
    error,
    pageChange,
    pageSizeChange,
    pageSortChange,
    viewItemsClick,
    editFilterClick,
  } = useViewFilters() as unknown as IViewFiltersContext;
  const storeFilterScroll = useAppStore((state) => state.filterScroll);
  const {
    addNewItemClick,
    addNewFilterClick,
  } = useMutator() as unknown as ICreateContext;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  function renderCell(itemKey: number): ReactNode {
    const item = filters[itemKey];
    const tc = item?.name ?? "";
    const itemcount = item?.count?.toString() ?? "0";
    const fontSize = isMobile ? "0.9rem" : '1rem';
    const iconFontSize = isMobile ? "1.1rem" : "1.5rem";
    return (
      <Fragment>
        <TableCell
          key="name"
          component='th'
          scope='row'
          align='left'
          onClick={() => viewItemsClick(itemKey)}
          sx={{
            fontSize: fontSize,
          }}>
          <Typography variant={isMobile ? "body2m" : "body1"}  >{tc}</Typography>
        </TableCell>
        <TableCell
          key="count"
          component='td'
          scope={undefined}
          align='right'
          sx={{
            fontSize: fontSize,
            display: isMobile ? "none" : undefined
          }}>
          <Typography variant={isMobile ? "body2m" : "body1"}  >{itemcount}</Typography>
        </TableCell>
        <TableCell
          key="updatedAt"
          component='td'
          scope={undefined}
          align='right'
          sx={{
            fontSize: fontSize,
            display: isMobile ? "none" : undefined
          }}>
          <Typography variant={isMobile ? "body2m" : "body1"}  >{item.updatedAt ?? ""}</Typography>
        </TableCell>
        <TableCell
          key="actions"
          component='td'
          scope={undefined}
          align='right'
          sx={{
            fontSize: fontSize,
          }}>
          <IconButton aria-label="edit" onClick={() => editFilterClick(itemKey)}>
            <AppTooltip title="Edit filter">
              <EditIcon sx={{ fontSize: iconFontSize }} />
            </AppTooltip>
          </IconButton>
          <IconButton aria-label="edit" onClick={() => editFilterClick(itemKey)}>
            <AppTooltip title="Delete filter">
              <DeleteIcon sx={{ fontSize: iconFontSize, color: "red" }} />
            </AppTooltip>
          </IconButton>
        </TableCell>
      </Fragment>
    );
  }

  function headerContent() {
    const headerFontSize = isMobile ? "1rem" : '1.4rem';
    return (
      <TableRow>
        <TableCell
          key="name"
          variant="head"
          align='left'
          style={{ width: isMobile ? 80 : 100 }}
          sx={{
            backgroundColor: 'background.paper',
            fontSize: headerFontSize,
            fontWeight: 'bold',
          }} >
          Name
        </TableCell>
        <TableCell
          key="count"
          variant="head"
          align='right'
          style={{ width: 50 }}
          sx={{
            backgroundColor: 'background.paper',
            fontSize: headerFontSize,
            fontWeight: 'bold',
            display: isMobile ? "none" : undefined
          }} >
          Usage
        </TableCell>
        <TableCell
          key="updatedAt"
          variant="head"
          align='right'
          style={{ width: 100 }}
          sx={{
            backgroundColor: 'background.paper',
            fontSize: headerFontSize,
            fontWeight: 'bold',
            display: isMobile ? "none" : undefined
          }} >
          Updated At
        </TableCell>
        <TableCell
          key="actions"
          variant="head"
          align='right'
          style={{ width: 50 }}
          sx={{
            backgroundColor: 'background.paper',
            fontSize: headerFontSize,
            fontWeight: 'bold'
          }} >
          Actions
        </TableCell>
      </TableRow>
    );
  }


  const tableContextValue = {
    data: filters,
    isPending,
    isError,
    error,
    scrollIndex: Math.max(0, storeFilterScroll),
    clickRow: viewItemsClick,
    renderCell,
    headerContent,
    components: VirtuosoTableComponents,
  } as unknown as ITableContext;

  const pagingContextValue = {
    pagination: pagination.paging,
    pageChange: filters.length > 0 ? pageChange : undefined,
    pageSizeChange: filters.length > 0 ? pageSizeChange : undefined,
  } as unknown as IPagingContext;

  function Shell({ children }: { children: ReactNode }) {
    return (
      <Stack sx={{ marginTop: "1rem" }}>
        {/* Add new item, add new tag, add new filter buttons*/}
        <Stack direction="row" spacing={1}
          sx={{
            justifyContent: 'flex-end', alignContent: 'center',
            display: 'flex', width: '100%', flexWrap: 'wrap',
            alignItems: 'center'
          }}>
          <FormControl sx={{}}>
            <InputLabel id="sortinput">Sort by</InputLabel>
            <Select
              labelId="sortinput"
              id="sortselect"
              value={pagination.paging.sort}
              label="rows-per-page"
              //  @ts-ignore
              onChange={pageSortChange}
              sx={{
                // height: 36,                     // overall component height
                height: "fit-content",                     // overall component height
                '& .MuiSelect-select': {
                  paddingY: 1.2,                // vertical padding
                },
              }} >
              {pagination.sortOptions.map((i, _) =>
                <MenuItem value={i.value}> <Typography variant={isMobile ? "condensedBody2" : "body2"} component="div" textAlign={"left"} sx={{}}> {i.label} </Typography>  </MenuItem>
              )}
            </Select>
          </FormControl>
          <Button size={isMobile ? "small" : "medium"} variant="contained" onClick={addNewFilterClick}
            sx={{ fontSize: isMobile ? "0.6rem" : "1rem", p: 1, }}>
            <AddIcon sx={{
              // display: isMobile ? "none" : undefined,
              fontSize: isMobile ? "1rem" : "1.5rem"
            }} />
            <Typography variant={isMobile ? "h7m" : "h7"} component="div" textAlign={"left"} sx={{}}> {isMobile ? "" : "create new "} filter </Typography>

          </Button>
          <Button size={isMobile ? "small" : "medium"}
            sx={{ fontSize: isMobile ? "0.6rem" : "1rem", p: 1, }}
            variant="contained" onClick={addNewItemClick}>
            <AddIcon sx={{
              // display: isMobile ? "none" : undefined,
              fontSize: isMobile ? "1rem" : "1.5rem"
            }} />
            <Typography variant={isMobile ? "h7m" : "h7"} component="div" textAlign={"left"} sx={{}}> {isMobile ? "" : "create new "} item </Typography>
          </Button>
        </Stack>
        <AppSectionPaper>
          <PagingContext.Provider value={pagingContextValue}>
            <TableContext.Provider value={tableContextValue}>
              <ListBox>
                <OuterBox>{children} </OuterBox>
              </ListBox>
            </TableContext.Provider>
          </PagingContext.Provider>
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
    return (<Shell><TableLayout /></Shell>)
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
  } = useUpdateFilters() as unknown as IUpdateFiltersContext;

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
