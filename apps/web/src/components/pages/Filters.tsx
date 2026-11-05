
import type {
  ReactNode,
} from 'react';
import {
  forwardRef,
  Fragment,
  memo,
  useMemo,
} from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
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
import Checkbox from '@mui/material/Checkbox';
import { TableVirtuoso, } from 'react-virtuoso';
import VisibilityIcon from '@mui/icons-material/Visibility';



// Internal
import {
  useAppStore,
} from '@/hooks/store/boundStore';
import type {
  IViewFiltersContext,
  IUpdateFiltersContext,
  IFormContext,
  ICreateContext,
  IPagingContext,
  IFilter,
  IVirtuosoTableContext,
} from "@/app-types";
import {
  useViewFilters,
  useUpdateFilters,
  FormContext,
  PagingContext,
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
  FormDialog,
  getFormTextFieldProps,
  ListBox,
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
      <UpdateFiltersProvider> <UpdateFilter /> </UpdateFiltersProvider>

      {/* Update Item Modal. Rendered on Update Item Click */}
      <UpdateItemsProvider route="/filters"> <ItemUpdate /> </UpdateItemsProvider>

      {/* Item Search Result Modal. Rendered when Item is searched.*/}
      <SearchItemsProvider route="/filters"><ItemSearchList /></SearchItemsProvider>
      <AppSectionPaper>


        {/* Main Page Content */}
        <BreadcrumbProvider route="/filters"><AppBreadcrumb sx={{ display: isMobile ? "block" : "none" }} /></BreadcrumbProvider>
        <CreateProvider>
          <ViewFiltersProvider>
            <ViewFilterShell>
              <ViewFilter />
            </ViewFilterShell>
          </ViewFiltersProvider>
        </CreateProvider>
      </AppSectionPaper>
    </AppContainer >
  );
}

const VirtuosoTableComponents: TableComponents<IFilter> = {
  Scroller: forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} size="small"
      sx={{
        borderCollapse: 'separate', tableLayout: 'fixed'
      }} />
  ),
  TableHead: forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow,
  TableBody: forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

const RowContent = memo(function RowContent(
  {
    item, index, checked, isMobile, allChecked,
    handleCheck, handleEdit, handleViewUsage
  }: {
    item: IFilter, index: number, checked: boolean,
    isMobile: boolean, allChecked: boolean,
    handleCheck: (i: string) => void,
    handleEdit: (i: number) => void,
    handleViewUsage: (i: number) => void
  }) {
  const tc = item?.name ?? "";
  const itemcount = item?.count?.toString() ?? "0";
  const fontSize = isMobile ? "0.9rem" : '1rem';
  const buttonFontSize = isMobile ? "0.9rem" : '1.1rem';
  const iconFontSize = isMobile ? "1.0rem" : "1.5rem";

  return (
    <Fragment>
      <TableCell
        key="select"
        component='td'
        scope={undefined}
        align='left'
        sx={{
          fontSize: fontSize,
        }}>
        <Checkbox disableRipple
          checked={checked || allChecked}
          onChange={() => handleCheck(item.id)}
          slotProps={{
            input: { 'aria-label': 'controlled' },
          }}
        />
      </TableCell>
      <TableCell
        key="name"
        component='th'
        scope='row'
        align='left'
        onClick={() => handleViewUsage(index)}
        sx={{
          fontSize: fontSize,
        }}>
        <Typography variant={isMobile ? "body2m" : "body1"}  >{tc}</Typography>
      </TableCell>
      <TableCell
        key="count"
        component='td'
        scope={undefined}
        align='left'
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
        align='left'
        sx={{
          fontSize: fontSize,
          display: isMobile ? "none" : undefined
        }}>
        <Typography variant={isMobile ? "body2m" : "body1"}  >{item.updatedAt}</Typography>
      </TableCell>
      <TableCell
        key="actions"
        component='td'
        scope={undefined}
        align='left'
        sx={{
          fontSize: fontSize,
        }}>
        <Button
          variant="text" color="inherit"
          onClick={() => handleEdit(index)}
          sx={{
            '&:hover': {
              boxShadow: 2,
            },
            fontSize: buttonFontSize,
            fontWeight: "500",
            p: 0.5, width: "100%",
            justifyContent: 'flex-start', display: 'flex',
          }}
          startIcon={<EditIcon sx={{ fontSize: iconFontSize }} />}>
          <Typography variant={isMobile ? "body2" : "body1"}>Edit filter</Typography>
        </Button>

        <Button
          variant="text" color="inherit"
          onClick={() => handleViewUsage(index)}
          sx={{
            '&:hover': {
              boxShadow: 2,
            },
            fontSize: buttonFontSize,
            fontWeight: "500",
            p: 0.5, width: "100%",
            justifyContent: 'flex-start', display: 'flex',
          }}
          startIcon={<VisibilityIcon sx={{ fontSize: iconFontSize }} />}>

          <Typography variant={isMobile ? "body2" : "body1"}>View items</Typography>
        </Button>
      </TableCell>
    </Fragment>
  );
});

function HeaderContent({ isMobile }: { isMobile: boolean }) {
  const {
    toggleSelectAll,
  } = useViewFilters() as unknown as IViewFiltersContext;
  const allFiltersChecked = useAppStore((state) => state.allFiltersChecked);
  const headerFontSize = isMobile ? "1rem" : '1.2rem';


  return (
    <TableRow sx={{}}>
      <TableCell
        key="select"
        variant="head"
        align='left'
        style={{ width: 20 }}
        sx={{
          fontSize: headerFontSize,
          fontWeight: 'bold',
          backgroundColor: "primary.dark",
          color: "primary.contrastText",
          '& .MuiTableCell-root': {
            color: "primary.contrastText",
          },
        }} >
        <Checkbox disableRipple
          checked={allFiltersChecked}
          onChange={toggleSelectAll}
          slotProps={{
            input: { 'aria-label': 'controlled' },
          }}
          sx={{
            color: "primary.contrastText",
            '&.Mui-checked': {
              color: "primary.contrastText",
            },
          }}
        />
      </TableCell>
      <TableCell
        key="name"
        variant="head"
        align='left'
        style={{ width: isMobile ? 80 : 120 }}
        sx={{
          fontSize: headerFontSize, fontWeight: 'bold',
          backgroundColor: "primary.dark",
          color: "primary.contrastText",
          '& .MuiTableCell-root': {
            color: "primary.contrastText",
          },
        }} >
        Name
      </TableCell>
      <TableCell
        key="count"
        variant="head"
        align='left'
        style={{ width: 30 }}
        sx={{
          fontSize: headerFontSize,
          fontWeight: 'bold',
          display: isMobile ? "none" : undefined,
          backgroundColor: "primary.dark",
          color: "primary.contrastText",
          '& .MuiTableCell-root': {
            color: "primary.contrastText",
          },
        }} >
        Usage
      </TableCell>
      <TableCell
        key="updatedAt"
        variant="head"
        align='left'
        style={{ width: 80 }}
        sx={{
          fontSize: headerFontSize,
          fontWeight: 'bold',
          display: isMobile ? "none" : undefined,
          backgroundColor: "primary.dark",
          color: "primary.contrastText",
          '& .MuiTableCell-root': {
            color: "primary.contrastText",
          },
        }} >
        Last Update
      </TableCell>
      <TableCell
        key="actions"
        variant="head"
        align='left'
        style={{ width: isMobile ? 80 : 100 }}
        sx={{
          fontSize: headerFontSize,
          fontWeight: 'bold',
          backgroundColor: "primary.dark",
          color: "primary.contrastText",
          '& .MuiTableCell-root': {
            color: "primary.contrastText",
          },
        }} >
        Actions
      </TableCell>
    </TableRow >
  );
}

export function ViewFilterShell({ children }: { children: ReactNode }) {
  const {
    filters,
    pagination,
    pageChange,
    pageSizeChange,
    pageSortChange,
    bulkDelete,
  } = useViewFilters() as unknown as IViewFiltersContext;
  const {
    addNewItemClick,
    addNewFilterClick,
  } = useMutator() as unknown as ICreateContext;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const filtersChecked = useAppStore((state) => state.filtersChecked);
  const allFiltersChecked = useAppStore((state) => state.allFiltersChecked);

  const canBulkDelete = allFiltersChecked || filtersChecked.size > 0;
  const deleteButtonAction = canBulkDelete ? bulkDelete : () => undefined;

  const pagingContextValue = {
    pagination: pagination.paging,
    pageChange: filters.length > 0 ? pageChange : undefined,
    pageSizeChange: filters.length > 0 ? pageSizeChange : undefined,
  } as unknown as IPagingContext;
  return (
    <Stack sx={{ marginTop: "2rem", }}>
      <Box sx={{ flexGrow: 1 }}>
        {/* Add new item, add new tag, add new filter buttons*/}
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3, }} >
            <FormControl sx={{}}>
              <InputLabel id="sortinput">Sort</InputLabel>
              <Select
                labelId="sortinput"
                id="sortselect"
                value={pagination.paging.sort}
                label="rows-per-page"
                //  @ts-ignore
                onChange={pageSortChange}
                sx={{
                  height: "fit-content",                     // overall component height
                  '& .MuiSelect-select': {
                    paddingY: 1,                // vertical padding
                  },
                }} >
                {pagination.sortOptions.map((i, _) =>
                  <MenuItem value={i.value}> <Typography variant={isMobile ? "condensedBody2" : "body2"} component="div" textAlign={"left"} sx={{}}> {i.label} </Typography>  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 9, lg: 9, xl: 9, }} >
            <Stack spacing={2} direction="row"
              sx={{
                justifyContent: isMobile ? 'flex-start' : 'flex-end', display: 'flex'
              }}>
              <Button variant="contained" onClick={deleteButtonAction} startIcon={<DeleteIcon sx={{ fontSize: isMobile ? "1rem" : "1.5rem", width: "100%" }} />}>
                <Typography variant={isMobile ? "h7m" : "h7"} textAlign={"left"}> delete {isMobile ? "" : " selected "} </Typography>
              </Button>
              <Button
                variant="contained"
                onClick={addNewFilterClick}
                startIcon={<AddIcon sx={{ fontSize: isMobile ? "1rem" : "1.5rem", width: "100%" }} />}>
                <Typography variant={isMobile ? "h7m" : "h7"} textAlign={"left"} sx={{}}> {isMobile ? "" : "create new "} filter </Typography>
              </Button>
              <Button variant="contained" onClick={addNewItemClick} startIcon={<AddIcon sx={{ fontSize: isMobile ? "1rem" : "1.5rem" }} />}>
                <Typography variant={isMobile ? "h7m" : "h7"} textAlign={"left"} sx={{}}> {isMobile ? "" : "create new "} item </Typography>
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <AppSectionPaper>
        <PagingContext.Provider value={pagingContextValue}>
          <ListBox>
            <OuterBox>{children} </OuterBox>
          </ListBox>
        </PagingContext.Provider>
      </AppSectionPaper>
    </Stack >
  );
}

export function ViewFilter(): ReactNode {
  const {
    filters,
    isPending,
    error,
    viewItemsClick,
    editFilterClick,
    check,
  } = useViewFilters() as unknown as IViewFiltersContext;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const filtersChecked = useAppStore((state) => state.filtersChecked);
  const allFiltersChecked = useAppStore((state) => state.allFiltersChecked);

  const context = useMemo(
    () => ({
      isMobile,
      selected: filtersChecked,
      allSelected: allFiltersChecked,
      handleSelected: check,
      handleViewUsage: viewItemsClick,
      handleEdit: editFilterClick
    }),
    [filtersChecked, check, editFilterClick, viewItemsClick]
  );


  if (isPending) {
    return <LinearProgress />
  }
  if (error) {
    return <Alert severity="error">{error.message || "An error occurred. Please try again"}</Alert>
  }
  if (filters.length == 0) {
    return (
      <Typography variant="h6"> No items found </Typography>
    )
  }
  if (filters.length > 0) {
    return (<Fragment>
      <TableVirtuoso
        data={filters}
        context={context}
        computeItemKey={(_, row) => row.id}
        // @ts-ignore
        components={VirtuosoTableComponents}
        fixedHeaderContent={() => <HeaderContent isMobile={isMobile} />}
        itemContent={
          (i: number, row: IFilter, ctx: IVirtuosoTableContext) => <RowContent
            isMobile={ctx.isMobile}
            item={row} index={i}
            checked={ctx.selected.has(row.id)}
            allChecked={ctx.allSelected}
            handleCheck={ctx.handleSelected}
            handleEdit={ctx.handleEdit}
            handleViewUsage={ctx.handleViewUsage}
          />
        }
      />
    </Fragment>)
  }
  return (
    <Alert severity="error">"An error occurred. Please try again"</Alert>
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
