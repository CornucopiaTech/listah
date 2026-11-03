

import type {
  ReactNode,
} from 'react';
import {
  forwardRef,
  Fragment,
  memo,
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


// Internal
import {
  useAppStore,
} from '@/hooks/store/boundStore';
import type {
  IViewTagsContext,
  IFormContext,
  ITableContext,
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
  TableContext,
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
  TableLayout,
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
        <ViewTagsProvider> <ViewTag /> </ViewTagsProvider>
      </CreateProvider>
    </AppContainer >
  );
}

export function ViewTag() {
  const {
    tags,
    pagination,
    isPending,
    isError,
    error,
    pageChange,
    pageSizeChange,
    pageSortChange,
    viewItemsClick,
    editTagClick,
    bulkDelete,
    tagCheck,
    checkedTagSet,
  } = useViewTags() as unknown as IViewTagsContext;
  const {
    addNewItemClick,
    addNewTagClick,
  } = useMutator() as unknown as ICreateContext;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const storeTagScroll = useAppStore((state) => state.tagScroll);
  const tagsChecked = useAppStore((state) => state.tagsChecked);
  const fontSize = isMobile ? "0.9rem" : '1rem';
  const iconFontSize = isMobile ? "1.1rem" : "1.5rem";

  const handleTagCheck = tagCheck
  const handleItemsClick = viewItemsClick
  const handleEditClick = editTagClick

  const MemoizedRow = memo((
    { itemKey, isChecked,
      // handleTagCheck,
      // handleItemsClick,
      // handleEditClick,

    }: {
      itemKey: number, isChecked: boolean,
      // handleTagCheck: (i: string) => void,
      // handleItemsClick: (i: number) => void,
      // handleEditClick: (i: number) => void,
    }) => {
    const item = tags[itemKey];
    const tc = item?.name ?? "";
    const itemcount = item?.count?.toString() ?? "0";

    return (
      <Fragment>
        <TableCell
          key="select"
          component='th'
          scope='row'
          align='left'
          sx={{
            fontSize: fontSize,
          }}>
          <Checkbox
            checked={isChecked}
            onChange={() => handleTagCheck(item.id)}
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
          onClick={() => handleItemsClick(itemKey)}
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
          <IconButton aria-label="edit" onClick={() => handleEditClick(itemKey)}>
            <AppTooltip title="Edit filter">
              <EditIcon sx={{ fontSize: iconFontSize }} />
            </AppTooltip>
          </IconButton>
          <IconButton aria-label="edit" onClick={() => handleEditClick(itemKey)}>
            <AppTooltip title="Delete filter">
              <DeleteIcon sx={{ fontSize: iconFontSize, color: "red" }} />
            </AppTooltip>
          </IconButton>
        </TableCell>
      </Fragment>
    );
  }, (prevProps, nextProps) => {
    // Only re-render if the checked state or name explicitly changes
    return (
      prevProps.itemKey === nextProps.itemKey &&
      prevProps.isChecked === nextProps.isChecked //&&
      // prevProps.handleTagCheck === nextProps.handleTagCheck &&
      // prevProps.handleItemsClick === nextProps.handleItemsClick &&
      // prevProps.handleEditClick === nextProps.handleEditClick
    );
  });

  function headerContent() {
    const headerFontSize = isMobile ? "1rem" : '1.4rem';
    return (
      <TableRow>
        <TableCell
          key="select"
          variant="head"
          align='left'
          style={{ width: 20 }}
          sx={{
            backgroundColor: 'background.paper',
            fontSize: headerFontSize,
            fontWeight: 'bold',
          }} >
          Select
        </TableCell>
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

  const pagingContextValue = {
    pagination: pagination.paging,
    pageChange: tags.length > 0 ? pageChange : undefined,
    pageSizeChange: tags.length > 0 ? pageSizeChange : undefined,
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
          <Button size={isMobile ? "small" : "medium"} variant="contained" onClick={addNewTagClick}
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
            <ListBox>
              <OuterBox>{children} </OuterBox>
            </ListBox>
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
  if (tags.length == 0) {
    return (
      <Shell><Typography variant="h6"> No items found </Typography></Shell>
    )
  }
  if (tags.length > 0) {
    return (<Shell>
      <TableVirtuoso
        data={tags}
        components={VirtuosoTableComponents}
        fixedHeaderContent={headerContent}
        itemContent={(index, item) => (
          <MemoizedRow
            itemKey={index}
            isChecked={tagsChecked.has(item.id)}
          // handleTagCheck={tagCheck}
          // handleItemsClick={viewItemsClick}
          // handleEditClick={editTagClick}
          />
        )}
      />
    </Shell>)
  }
  return (
    <Shell><Alert severity="error">"An error occurred. Please try again"</Alert></Shell>
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
