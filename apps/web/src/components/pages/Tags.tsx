

import type {
  ReactNode,
} from 'react';
import { useTheme, } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';




// Internal
import {
  useAppStore,
} from '@/hooks/store/boundStore';
import type {
  ITagListContext,
  IListContext,
  IFormContext,
  ITagUpdateContext,
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
  TagItemListProvider,
  TagUpdateProvider,
  useUpdateTags,
  BreadcrumbProvider,
  ItemUpdateProvider,
  ItemSearchProvider,
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
  ItemList,
  FormDialog,
  UpdateFormActions,
  AppTooltip,
  FlexEndBox,
  FlexStartBox,
  ItemUpdate,
  AppBreadcrumb,
  ItemSearchList,
} from "@/components";




export function Tags() {
  const theme: AppTheme = useTheme();
  return (
    <AppContainer mw="md">
      <TagUpdateProvider> <UpdateTag /> </TagUpdateProvider>
      <ItemUpdateProvider route="/tags"> <ItemUpdate /> </ItemUpdateProvider>
      <BreadcrumbProvider route="/tags"><AppBreadcrumb title="Tags" /></BreadcrumbProvider>
      <ItemSearchProvider route="/tags"><ItemSearchList /></ItemSearchProvider>
      <AppSectionPaper>
        <TagListProvider> <TagList /> </TagListProvider>
      </AppSectionPaper>

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
  const storeTagScroll = useAppStore((state) => state.tagScroll);

  function renderRow(itemKey: number): ReactNode {
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
          <Chip variant="contained" sx={{ marginX: "10px", marginY: 0, }}
            // @ts-ignore
            color={itemKey % 2 == 0 ? "inherit" : "secondary"} label={itemcount}
          />
          <IconButton aria-label="view" onClick={() => viewItemsClick(itemKey)}> <AppTooltip title="View items in tag"><VisibilityIcon /></AppTooltip> </IconButton>
          <IconButton aria-label="edit" onClick={() => editTagClick(itemKey)}> <AppTooltip title="Edit tag"><EditIcon /></AppTooltip> </IconButton>
        </FlexEndBox>
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
