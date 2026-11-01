

import type {
  ReactNode,
} from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';




// Internal
import {
  useAppStore,
} from '@/hooks/store/boundStore';
import type {
  ITagListContext,
  IListContext,
  IFormContext,
  ITagUpdateContext,
  IMutatorContext,
} from '@/domain/entities';
import {
  ListItemStyling
} from "@/helpers/defaults";
import type { AppTheme } from '@/system/theme';
import {
  useTagList,
  FormContext,
  ListContext,
  TagListProvider,
  TagUpdateProvider,
  useUpdateTags,
  ItemSearchProvider,
  ItemUpdateProvider,
  MutatorProvider,
  useMutator,
  BreadcrumbProvider,
} from "@/hooks/context";
import {
  getFormArrayTextFieldProps,
  getFormTextFieldProps,
  ItemFormTagBox,
  AppSectionPaper,
  AppContainer,
  ListLayout,
  ListBox,
  OuterBox,
  FormDialog,
  UpdateFormActions,
  AppTooltip,
  FlexEndBox,
  FlexStartBox,
  ItemSearchList,
  ItemUpdate,
  AppBreadcrumb,
} from "@/components";






export function Tags() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <AppContainer mw="xl">
      {/* Update Tag Modal. Rendered on Update Tag Click */}
      <TagUpdateProvider> <UpdateTag /> </TagUpdateProvider>

      {/* Update Item Modal. Rendered on Update Item Click */}
      <ItemUpdateProvider route="/tags"> <ItemUpdate /> </ItemUpdateProvider>

      {/* Item Search Result Modal. Rendered when Item is searched.*/}
      <ItemSearchProvider route="/tags"><ItemSearchList /></ItemSearchProvider>

      {/* Main Page Content */}
      <BreadcrumbProvider route="/tags"><AppBreadcrumb sx={{ display: isMobile ? "block" : "none" }} /></BreadcrumbProvider>
      <MutatorProvider>
        <TagListProvider> <TagList /> </TagListProvider>
      </MutatorProvider>
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
    viewItemsClick,
    editTagClick,
  } = useTagList() as unknown as ITagListContext;
  const {
    addNewItemClick,
    addNewTagClick,
  } = useMutator() as unknown as IMutatorContext;
  const storeTagScroll = useAppStore((state) => state.tagScroll);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));


  function prevRenderRow(itemKey: number): ReactNode {
    const item = tags[itemKey];
    const tc = item?.name ?? "";
    const itemcount = item?.count?.toString() ?? "0";
    return (
      <ListItem key={itemKey + tc} component="div" disablePadding sx={ListItemStyling} >
        <FlexStartBox >
          <ListItemButton onClick={() => viewItemsClick(itemKey)}>
            <ListItemText primary={<Typography variant="body2" >{tc}</Typography>} />
          </ListItemButton>
        </FlexStartBox>
        <FlexEndBox >
          <Chip variant="contained" sx={{
            marginX: "1rem", marginY: 0,
            display: isMobile ? "none" : "block"
          }}
            // @ts-ignore
            color={itemKey % 2 == 0 ? "inherit" : "secondary"} label={itemcount}
          />
          <IconButton aria-label="edit" onClick={() => editTagClick(itemKey)}> <AppTooltip title="Edit tag"><EditIcon /></AppTooltip> </IconButton>
        </FlexEndBox>
      </ListItem>
    );
  }


  function renderRow(itemKey: number): ReactNode {
    const item = tags[itemKey];
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
        <IconButton aria-label="edit" onClick={() => editTagClick(itemKey)}> <AppTooltip title="Edit filter">
          <EditIcon sx={{ fontSize: isMobile ? "1.1rem" : "1.5rem" }} />
        </AppTooltip> </IconButton>
      </ListItem>
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
    clickRow: viewItemsClick,
    renderRow,
  } as unknown as IListContext;

  function Shell({ children }: { children: ReactNode }) {
    return (
      <Stack>
        {/* Add new item, add new tag, add new filter buttons*/}
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={addNewTagClick}>
            <AddIcon />
            Create tag
          </Button>
          <Button variant="contained" onClick={addNewItemClick}>
            <AddIcon />
            Create item
          </Button>
        </Stack>
        <AppSectionPaper>
          <ListContext.Provider value={contextValue}>
            <ListBox>
              <OuterBox>{children} </OuterBox>
            </ListBox>
          </ListContext.Provider>
        </AppSectionPaper>
      </Stack >
    )
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
  } = useUpdateTags() as unknown as ITagUpdateContext;

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
