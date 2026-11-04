

import type {
  ReactNode,
} from 'react';
import {
  forwardRef,
  Fragment,
  memo,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
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
import ButtonGroup from '@mui/material/ButtonGroup';

// Internal
import {
  useAppStore,
} from '@/hooks/store/boundStore';
import type {
  IViewTagsContext,
  IFormContext,
  IUpdateTagsContext,
  ICreateContext,
  IPagingContext,
  ITag,
} from '@/domain/entities';
import type { AppTheme } from '@/system/theme';
import {
  useViewTags,
  FormContext,
  PagingContext,
  ViewTagsProvider,
  UpdateTagsProvider,
  useUpdateTags,
  SearchItemsProvider,
  UpdateItemsProvider,
  CreateProvider,
  useMutator,
  BreadcrumbProvider,
} from "@/hooks/context";
import {
  getFormArrayTextFieldProps,
  getFormTextFieldProps,
  ItemFormTagBox,
  AppSectionPaper,
  AppContainer,
  ListBox,
  OuterBox,
  FormDialog,
  UpdateFormActions,
  AppTooltip,
  ItemSearchList,
  ItemUpdate,
  AppBreadcrumb,
} from "@/components";




const VirtuosoTableComponents: TableComponents<ITag> = {
  Scroller: forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} size="small" sx={{
      borderCollapse: 'separate',

      // , tableLayout: 'fixed'
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

export function Tags() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <AppContainer mw="xl">
      {/* Update Tag Modal. Rendered on Update Tag Click */}
      <UpdateTagsProvider> <UpdateTag /> </UpdateTagsProvider>

      {/* Update Item Modal. Rendered on Update Item Click */}
      <UpdateItemsProvider route="/tags"> <ItemUpdate /> </UpdateItemsProvider>

      {/* Item Search Result Modal. Rendered when Item is searched.*/}
      <SearchItemsProvider route="/tags"><ItemSearchList /></SearchItemsProvider>

      {/* Main Page Content */}
      <BreadcrumbProvider route="/tags"><AppBreadcrumb sx={{ display: isMobile ? "block" : "none" }} /></BreadcrumbProvider>
      <CreateProvider>
        <ViewTagsProvider> <ViewTagShell><ViewTag /></ViewTagShell> </ViewTagsProvider>
      </CreateProvider>
    </AppContainer >
  );
}

const RowContent = memo(function RowContent(
  {
    item, index, checked, isMobile, allChecked,
    handleCheck, handleEdit, handleViewUsage
  }: {
    item: ITag, index: number, checked: boolean,
    isMobile: boolean, allChecked: boolean,
    handleCheck: (i: string) => void,
    handleEdit: (i: number) => void,
    handleViewUsage: (i: number) => void
  }) {
  const tc = item?.name ?? "";
  const itemcount = item?.count?.toString() ?? "0";
  const fontSize = isMobile ? "0.9rem" : '1rem';
  const iconFontSize = isMobile ? "1.1rem" : "1.5rem";

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
        <IconButton aria-label="edit" onClick={() => handleEdit(index)}>
          <AppTooltip title="Edit filter">
            <EditIcon sx={{ fontSize: iconFontSize }} />
          </AppTooltip>
        </IconButton>
        <IconButton aria-label="edit" onClick={() => handleEdit(index)}>
          <AppTooltip title="Delete filter">
            <DeleteIcon sx={{ fontSize: iconFontSize, color: "red" }} />
          </AppTooltip>
        </IconButton>
      </TableCell>
    </Fragment>
  );
});


function HeaderContent({ isMobile }: { isMobile: boolean }) {
  const {
    toggleSelectAllTags,
  } = useViewTags() as unknown as IViewTagsContext;
  const allTagsChecked = useAppStore((state) => state.allTagsChecked);
  const headerFontSize = isMobile ? "1rem" : '1.4rem';


  return (
    <TableRow sx={{
    }}>
      <TableCell
        key="select"
        variant="head"
        align='left'
        style={{ width: 20 }}
        sx={{
          // backgroundColor: 'background.paper',
          fontSize: headerFontSize,
          fontWeight: 'bold',
        }} >
        <Checkbox disableRipple
          checked={allTagsChecked}
          onChange={toggleSelectAllTags}
          slotProps={{
            input: { 'aria-label': 'controlled' },
          }}
        />
        Select
      </TableCell>
      <TableCell
        key="name"
        variant="head"
        align='left'
        style={{ width: isMobile ? 80 : 100 }}
        sx={{
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
          // backgroundColor: 'background.paper',
          fontSize: headerFontSize,
          fontWeight: 'bold'
        }} >
        Actions
      </TableCell>
    </TableRow >
  );
}

export function ViewTagShell({ children }: { children: ReactNode }) {
  const {
    tags,
    pagination,
    pageChange,
    pageSizeChange,
    pageSortChange,
    bulkDelete,
  } = useViewTags() as unknown as IViewTagsContext;
  const {
    addNewItemClick,
    addNewTagClick,
  } = useMutator() as unknown as ICreateContext;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const tagsChecked = useAppStore((state) => state.tagsChecked);
  const allTagsChecked = useAppStore((state) => state.allTagsChecked);

  const canBulkDelete = allTagsChecked || tagsChecked.size > 0;
  const deleteButtonAction = canBulkDelete ? bulkDelete : () => undefined;

  const pagingContextValue = {
    pagination: pagination.paging,
    pageChange: tags.length > 0 ? pageChange : undefined,
    pageSizeChange: tags.length > 0 ? pageSizeChange : undefined,
  } as unknown as IPagingContext;
  return (
    <Stack sx={{ marginTop: "1rem" }}>

      {/* Add new item, add new tag, add new filter buttons*/}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3, lg: 3 }} >
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
                // height: 36,                     // overall component height
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
        <Grid size={{ xs: 3, md: 3, lg: 3 }}
          sx={{
            justifyContent: 'space-between',
            display: 'flex',
          }}>
          <ButtonGroup variant="contained" aria-label="Basic button group" sx={{ mx: 1 }}>
            <Button variant="contained" onClick={deleteButtonAction} startIcon={<DeleteIcon sx={{ fontSize: isMobile ? "1rem" : "1.5rem" }} />}>
              <Typography variant={isMobile ? "h7m" : "h7"} component="div" textAlign={"left"} sx={{}}> delete {isMobile ? "" : " selected "} </Typography>
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid size={{ xs: 3, md: 3, lg: 3 }}
          sx={{
            justifyContent: 'space-between',
            display: 'flex',
          }}>
          <ButtonGroup variant="contained" aria-label="Basic button group" sx={{ mx: 1 }}>
            <Button
              variant="contained"
              onClick={addNewTagClick}
              startIcon={<AddIcon sx={{ fontSize: isMobile ? "1rem" : "1.5rem" }} />}>
              <Typography variant={isMobile ? "h7m" : "h7"} component="div" textAlign={"left"} sx={{}}> {isMobile ? "" : "create new "} tag </Typography>
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid size={{ xs: 3, md: 3, lg: 3 }}
          sx={{
            justifyContent: 'space-between',
            display: 'flex',
          }}>
          <ButtonGroup variant="contained" aria-label="Basic button group" sx={{ mx: 1 }}>
            <Button variant="contained" onClick={addNewItemClick} startIcon={<AddIcon sx={{ fontSize: isMobile ? "1rem" : "1.5rem" }} />}>
              <Typography variant={isMobile ? "h7m" : "h7"} component="div" textAlign={"left"} sx={{}}> {isMobile ? "" : "create new "} item </Typography>
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>

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

export function ViewTag() {
  const {
    tags,
    isPending,
    error,
    viewItemsClick,
    editTagClick,
    tagCheck,
  } = useViewTags() as unknown as IViewTagsContext;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const tagsChecked = useAppStore((state) => state.tagsChecked);
  const allTagsChecked = useAppStore((state) => state.allTagsChecked);

  const context = useMemo(
    () => ({
      isMobile,
      selected: tagsChecked,
      allSelected: allTagsChecked,
      handleSelected: tagCheck,
      handleViewUsage: viewItemsClick,
      handleEdit: editTagClick
    }),
    [tagsChecked, tagCheck, editTagClick, viewItemsClick]
  );

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
    return (<Fragment>
      <TableVirtuoso
        data={tags}
        context={context}
        computeItemKey={(_, row) => row.id}
        components={VirtuosoTableComponents}
        fixedHeaderContent={() => <HeaderContent isMobile={isMobile} />}
        itemContent={
          (i, row, ctx) => <RowContent
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

function UpdateTag() {
  const theme: AppTheme = useTheme();
  const legendStyle = {
    padding: '0 0.5rem',
    color: theme.palette.primary.main,
    fontSize: "12px"
  }
  const {
    openDialog,
    closeDialog,
    mutation,
    form,
    title,
  } = useUpdateTags() as unknown as IUpdateTagsContext;

  const content = (
    <Box component="section" >
      <Stack spacing={0} sx={{ width: '100%' }} >
        <form.Field
          key="name"
          name="name"
          // validators={validator}
          children={
            (field: any) => {
              const props = getFormTextFieldProps({ key: "name", field, });
              // @ts-ignore
              return < TextField {...props} />
            }
          }
        />
        <form.Field key="props" name="props" mode="array" >
          {(field: any) => (
            // @ts-ignore
            <ItemFormTagBox component="fieldset">
              <legend style={legendStyle}>properties</legend>
              <Button variant="text" color="inherit" onClick={() => field.pushValue("")} >
                Click here to add a new property
              </Button>
              {
                field.state.value && field.state.value.length > 0 &&
                <Grid container spacing={3} sx={{ width: '100%' }}>{
                  field.state.value && field.state.value.map((_: any, i: number) => {
                    const childKeyName = "props" + `[${i}]`;
                    return <form.Field key={i} name={childKeyName}
                    // validators={validator}
                    >
                      {(subField: any) => {
                        const cprops = getFormArrayTextFieldProps({ key: "props", field, subField, idx: i });

                        return (
                          <Grid size="auto" key={i} /*Using the tag id as the key causes the form to lose focus when adding new tags to the form, especially when the form length is longer than the maximum allowed length of the dialog. */ >
                            {/* @ts-ignore */}
                            <TextField {...cprops} />
                          </Grid>
                        )
                      }}
                    </form.Field>
                  })
                }</Grid>
              }
            </ItemFormTagBox>
          )}
        </form.Field>
      </Stack>
    </Box>
  )

  const contextValue = {
    title,
    content,
    actions: <UpdateFormActions />,
    openDialog,
    closeDialog,
    form,
    mutation,
  } as unknown as IFormContext;

  return <FormContext.Provider value={contextValue} > <FormDialog /> </FormContext.Provider >
}
