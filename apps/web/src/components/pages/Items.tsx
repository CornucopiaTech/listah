
import {
  Fragment,
  useState,
  forwardRef,
} from "react";
import type {
  ReactNode,
  SyntheticEvent,
  ChangeEvent,
} from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
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
import type { AppTheme } from '@/system/theme';
import {
  useAppStore,
} from '@/hooks/store/boundStore';
import type {
  IListContext,
  IFormContext,
  ITableContext,
  IViewItemsContext,
  IUpdateItemsContext,
  IPagingContext,
  ITag,
  IItem,
  IItemFormProps,
  ISearchItemsContext,
  ICreateContext,
} from '@/domain/entities';
import {
  DefaultTag,
} from '@/domain/entities';
import {
  ListItemStyling
} from "@/helpers/defaults";
import {
  useViewItems,
  useUpdateItems,
  useSearchItems,
  FormContext,
  PagingContext,
  TableContext,
  ListContext,
  ViewItemsProvider,
  UpdateItemsProvider,
  SearchItemsProvider,
  BreadcrumbProvider,
  useMutator,
  CreateProvider,
} from "@/hooks/context";
import {
  getFormItemPropsArrayTextFieldProps,
  getFormTextFieldProps,
  ItemFormTagBox,
  AppSectionPaper,
  AppContainer,
  ListLayout,
  TableLayout,
  ListBox,
  OuterBox,
  FormDialog,
  UpdateFormActions,
  AppTooltip,
  FlexStartBox,
  ViewOuterBox,
  ViewDialog,
  AlertDialog,
  AppListPagination,
  AppBreadcrumb,
} from "@/components";
import {
  validateItemTag,
} from "@/domain/rules/fieldLength";



// ToDo: Add bulk deletion
// ToDo. Read the url and find out if a filter or tag is being looked at and then add the tags associated with the tag or filter to the create new item form
// ToDo: Add the functionality for inheriting properties from an existing filter.
const VirtuosoTableComponents: TableComponents<IItem> = {
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

export function Items() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <AppContainer mw="xl">
      <UpdateItemsProvider> <ItemUpdate /> </UpdateItemsProvider>
      <SearchItemsProvider route="/items"><ItemSearchList /></SearchItemsProvider>

      <BreadcrumbProvider route="/items"><AppBreadcrumb sx={{ display: isMobile ? "block" : "none" }} /></BreadcrumbProvider>
      <CreateProvider>
        <ViewItemsProvider> <ItemList /> </ViewItemsProvider>
      </CreateProvider>
    </AppContainer >
  );
}


export function ItemList() {
  const {
    items,
    pagination,
    isPending,
    isError,
    error,
    pageChange,
    pageSizeChange,
    pageSortChange,
    editItemClick,
  } = useViewItems() as unknown as IViewItemsContext;

  const storeItemScroll = useAppStore((state) => state.itemScroll);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    addNewItemClick,
  } = useMutator() as unknown as ICreateContext;

  function renderCell(itemKey: number): ReactNode {
    const item = items[itemKey];
    const tc = item?.name ?? "";
    const fontSize = isMobile ? "0.9rem" : '1rem';
    const iconFontSize = isMobile ? "1.1rem" : "1.5rem";
    return (
      <Fragment>
        <TableCell
          key="name"
          component='th'
          scope='row'
          align='left'
          sx={{
            fontSize: fontSize,
          }}>
          <Typography variant={isMobile ? "body2m" : "body1"}  >{tc}</Typography>
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
          <IconButton aria-label="edit" onClick={() => editItemClick(itemKey)}>
            <AppTooltip title="Edit filter">
              <EditIcon sx={{ fontSize: iconFontSize }} />
            </AppTooltip>
          </IconButton>
          <IconButton aria-label="edit" onClick={() => editItemClick(itemKey)}>
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
    data: items,
    isPending,
    isError,
    error,
    scrollIndex: Math.max(0, storeItemScroll),
    renderCell,
    headerContent,
    components: VirtuosoTableComponents,
  } as unknown as ITableContext;

  const pagingContextValue = {
    pagination: pagination.paging,
    pageChange: items.length > 0 ? pageChange : undefined,
    pageSizeChange: items.length > 0 ? pageSizeChange : undefined,
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

  if (items.length == 0) {
    return (
      <Shell><Typography variant="body1" sx={{ textAlign: "center", p: 3 }}> No items found </Typography></Shell>
    )
  }

  if (items.length > 0) {
    return (<Shell><TableLayout /></Shell>)
  }
  return (
    <Shell><Alert severity="error">"An error occurred. Please try again"</Alert></Shell>
  )
}

function AppItemFormTagAutocompleteField(): ReactNode {
  const {
    form,
    formData,
    tags,
  } = useUpdateItems() as unknown as IUpdateItemsContext;
  const { tagsSet } = formData;
  const theme: AppTheme = useTheme();
  const [tagToDelete, setTagToDelete] = useState<{ c: any, p: any } | null>(null);
  const serverTags = tags;


  function addNewTagProps({ value }: any) {
    const oldProps = form.getFieldValue('props');
    let newPropList: string[] = [];
    (value as ITag[]).forEach((iterTag: ITag) => {
      const iterTagProps = iterTag?.props ?? []
      newPropList = [...newPropList, ...iterTagProps]
    }, []);
    newPropList = [...new Set(newPropList)].sort()
    let newProps: IItemFormProps[] = [];
    newPropList.filter(i => i !== "").forEach(
      (iterProp: string) => {
        const inOldProp = oldProps.filter((i: IItemFormProps) => i.key == iterProp)
        if (inOldProp.length == 0) {
          newProps = [...newProps, { key: iterProp, value: "" }]
        } else {
          newProps = [...newProps, { key: iterProp, value: inOldProp[0].value || "" }]
        }
      }
    )
    newProps = newProps.sort((a: IItemFormProps, b: IItemFormProps) => b.value.localeCompare(a.value))
    form.setFieldValue('props', newProps)
  }

  function handleTagsChange(parentF: any, childF: any, newValue: string | null) {
    const sval = newValue ? newValue : "";
    if (sval == "") {
      // If the value was deleted, replace the tag object with the default tag object.
      // @ts-ignore
      setTagToDelete({ c: childF, p: parentF });
    } else {
      // If a nonzero value is added, then use the information to update the tag object.
      handleTagAdd(parentF, childF, newValue)
    }
  }

  function handleTagAdd(parentF: any, childF: any, newValue: string | null) {
    const sval = newValue ? newValue : "";
    const fField = parentF?.state?.value as unknown as ITag[] ?? [];

    // If a nonzero value is added, then use the information to update the tag object.
    const it = serverTags.filter((itt: ITag) => itt.name == sval);
    if (it.length > 0) {
      // If the passed value is a known name of a tag..
      childF.handleChange(it[0]);
      addNewTagProps({ value: [...fField, it[0]] })
    }
    else {
      childF.handleChange({ ...DefaultTag, name: sval });
    }
  }

  function handleTagDeletePostConfirm(uInput: boolean) {
    // if (yesDelete) {
    if (uInput) {
      // @ts-ignore
      const par = tagToDelete?.p;
      // @ts-ignore
      const chd = tagToDelete?.c;
      const fField = par?.state?.value as unknown as ITag[] ?? [];
      const newTagList = fField.filter(fsv => fsv.id != chd.state.value.id);
      addNewTagProps({ value: newTagList });
      if (newTagList.filter(itt => itt.name !== "").length >= 1) {
        const removeIdx = par.state.value.map(
          (iF: ITag) => iF.id
        ).indexOf(chd.state.value.id);
        if (removeIdx > -1) {
          par.removeValue(removeIdx);
        }
      } else {
        chd.handleChange(DefaultTag);
      }
    }
    setTagToDelete(null);
  }

  const dialogTitle = tagToDelete?.c?.state.value.name ?? "";
  const dialogContent = (
    <Fragment>
      <Typography variant="body2">
        Deleting this tag might remove the following item properties:
      </Typography>

      <List>
        {/* @ts-ignore */}
        {tagToDelete?.c?.state.value.props.map((tp) =>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText
                primary={
                  <Typography variant="condensedBody2" >{tp}</Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Fragment>
  );


  const dialogActions = (
    <Stack direction="row" spacing={4}>
      <Button variant="contained" onClick={() => handleTagDeletePostConfirm(false)}>Cancel</Button>
      <Button variant="contained" color="error" onClick={() => handleTagDeletePostConfirm(true)}> Delete </Button>
    </Stack>
  );


  const validator = {
    onChange: ({ value }: { value: ITag }) => validateItemTag(value as unknown as ITag, tagsSet),
    onBlur: ({ value }: { value: ITag }) => validateItemTag(value as unknown as ITag, tagsSet),
  };

  return (
    <form.Field name="tags" mode="array" key="tag-parent" >
      {
        (field: any) => {
          return <Fragment>
            <AlertDialog
              openDialog={tagToDelete !== null}
              title={dialogTitle}
              content={dialogContent}
              actions={dialogActions}
            />
            {/* @ts-ignore */}
            <ItemFormTagBox key="tags" component="fieldset">
              <legend style={{ padding: '0 0.5rem', color: theme.palette.primary.main, fontSize: "12px" }}>tags</legend>
              <Button variant="text" color="inherit" onClick={() => field.pushValue(DefaultTag)} >
                Click here to add a new tag
              </Button>
              {
                field.state.value && field.state.value.length > 0 &&
                <Grid container spacing={3} sx={{ width: '100%' }}>{
                  field.state.value && field.state.value.map((_: any, i: number) => {
                    return (
                      <form.Field key={i} name={`tags[${i}]`} validators={validator} >{
                        (subField: any) => {
                          return (
                            <Grid
                              key={i} //Using the tag id as the key causes the form to lose focus when adding new tags to the form, especially when the form length is longer than the maximum allowed length of the dialog.
                              size={{ xs: 12, sm: 6, lg: 4 }}>
                              <Autocomplete
                                slotProps={{ listbox: { sx: { fontSize: '14px', } }, }}
                                size="small"
                                id={"item-tag-" + i}
                                autoHighlight
                                options={serverTags.map((opt: ITag) => opt.name)}
                                value={subField.state.value.name}
                                inputValue={subField.state.value.name}
                                onChange={
                                  (e: SyntheticEvent<Element, Event>, newValue: string | null) => {
                                    // Handles ONLY changes from the provided options.
                                    e && e.preventDefault();
                                    e && e.stopPropagation();
                                    handleTagsChange(field, subField, newValue);
                                  }
                                }
                                onInputChange={
                                  (e: SyntheticEvent<Element, Event>, newValue: string) => {
                                    // Handles both handwritten and provided option value changes.
                                    e && e.preventDefault();
                                    e && e.stopPropagation();
                                    handleTagsChange(field, subField, newValue);
                                  }
                                }
                                renderInput={
                                  (params) =>
                                    <TextField
                                      error={subField.state.meta.errors.length > 0}
                                      helperText={subField.state.meta.errors.join(', ')}
                                      // slotProps causes autocorrect to stop working
                                      margin="dense"
                                      {...params}
                                      label=""
                                      // label={"tag " + (i + 1)}
                                      variant="standard"
                                    />
                                }
                              />
                            </Grid>
                          )
                        }
                      }</form.Field>
                    );
                  })
                }</Grid>
              }
            </ItemFormTagBox>
          </Fragment>
        }
      }
    </form.Field >
  );

}


export function ItemUpdate() {
  const {
    openDialog,
    closeDialog,
    mutation,
    form,
    title,
    formData,
    isPending,
    error,
    tags,
  } = useUpdateItems() as unknown as IUpdateItemsContext;
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
    const suspension = [
      {
        value: null,
        label: 'None',
      },
      {
        value: 1,
        label: '1 day',
      },
      {
        value: 3,
        label: '3 days',
      },
      {
        value: 7,
        label: '7 days',
      },
      {
        value: 30,
        label: '30 days',
      },
      {
        value: 365,
        label: '365 days',
      },
    ];
    content = (
      <Box component="section" >
        <Stack spacing={0} sx={{ width: '100%' }} >
          <Grid container spacing={3}>
            <form.Field key="name" name="name"
              children={(field: any) => {
                const props = getFormTextFieldProps({ key: "name", field, });
                // @ts-ignore
                return <Grid sx={{ width: { xs: "90%", md: "45%" }, minWidth: "100px" }}><TextField {...props} /> </Grid>
              }}
            />
            <form.Field key="suspension" name="suspension"
              children={(field: any) => {
                return <Grid sx={{ width: { xs: "90%", md: "45%" }, minWidth: "100px" }}>
                  <TextField
                    id="view suspension"
                    select
                    label="view suspension"
                    value={field.state.value}
                    helperText="suspend item from view for"
                    variant="standard"
                    multiline
                    size="small"
                    margin="dense"
                    fullWidth
                    onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)} >
                    {suspension.map((option) => (
                      <MenuItem key={option.value} value={option.value ?? ""}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              }}
            />
            <form.Field key="note" name="note"
              children={(field: any) => {
                const props = getFormTextFieldProps({ key: "note", field, });
                // @ts-ignore
                return <Grid sx={{ width: { xs: "90%", md: "45%" }, minWidth: "100px" }}><TextField key="note" {...props} /> </Grid>
              }}
            />

            <form.Field name="props" mode="array">
              {
                (field: any) => (
                  <Fragment >
                    {
                      field.state.value &&
                      field.state.value.map((_: any, i: number) => {
                        return <form.Field key={"item-prop-key-" + i} name={`props[${i}]`}>{
                          (subField: any) => {
                            const cprops = getFormItemPropsArrayTextFieldProps({ key: "props", field, subField, idx: i });
                            // @ts-ignore
                            return <Grid sx={{ width: { xs: "90%", md: "45%" }, minWidth: "100px" }}><TextField {...cprops} /> </Grid>
                          }
                        }</form.Field>
                      })
                    }
                  </Fragment>
                )
              }
            </form.Field>
          </Grid>
          <AppItemFormTagAutocompleteField />
        </Stack>
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


export function ItemSearchList() {
  const {
    search,
    items,
    pagination,
    isPending,
    isError,
    error,
    pageChange,
    pageSizeChange,
    editItemClick,
    openDialog,
    closeDialog,
  } = useSearchItems() as unknown as ISearchItemsContext;
  const storeItemScroll = useAppStore((state) => state.itemScroll);

  function renderRow(itemKey: number): ReactNode {
    const item = items[itemKey]
    let tc: string = item.name ? item.name : "";
    return (
      <Fragment>
        <ListItem key={itemKey + item.id} component="div" disablePadding sx={{ ...ListItemStyling, }} onClick={() => editItemClick(itemKey)}>
          <Box sx={{ width: "100%", display: 'flex', }}>
            <Box sx={{ width: "95%" }}>
              <FlexStartBox>
                <ListItemButton >
                  <ListItemText primary={<Typography variant="body2" >{tc}</Typography>} />
                </ListItemButton>
              </FlexStartBox>
            </Box>
            <Box sx={{ justifyContent: 'flex-end', display: 'flex', minWidth: "10px" }}>
              <IconButton aria-label="edit" onClick={() => editItemClick(itemKey)}>
                <AppTooltip title="Edit tag"><EditIcon /></AppTooltip>
              </IconButton>
            </Box>
          </Box>
        </ListItem>
        <Divider key="divider" />
      </Fragment>
    );
  }
  const contextValue = {
    data: items,
    pagination: pagination.paging,
    isPending: isPending,
    isError: isError,
    error: error,
    scrollIndex: Math.max(0, storeItemScroll),
    pageChange: items.length > 0 ? pageChange : undefined,
    pageSizeChange: items.length > 0 ? pageSizeChange : undefined,
    clickRow: editItemClick,
    renderRow,
  } as unknown as IListContext;

  let content;
  if (items.length > 0) {
    content = (<ListLayout />)
  }

  if (isPending) {
    content = <LinearProgress />
  }

  if (error) {
    content = <Alert severity="error">{error.message || "An error occurred. Please try again"}</Alert>
  }

  if (!isPending && !error && items.length == 0) {
    content = (
      <Typography variant="body1" sx={{ textAlign: "center", p: 3 }}> No items found </Typography>
    )
  }

  content = <ViewOuterBox>{content}</ViewOuterBox>
  const actions = <AppListPagination />;
  const title = `Items like '${search}'`;
  const dialogVal = {
    title,
    content,
    actions,
    openDialog,
    closeDialog,
  } as unknown as IFormContext;

  return <ListContext.Provider value={contextValue}>
    <FormContext.Provider value={dialogVal} > <ViewDialog /> </FormContext.Provider >
  </ListContext.Provider>
}
