
import {
  forwardRef,
  Fragment,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import type {
  ChangeEvent,
  ReactNode,
} from 'react';
import {
  useForm,
  useStore,
} from "@tanstack/react-form";
import {
  useQueryClient,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import {
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  v4 as uuidv4,
} from 'uuid';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import { Icon } from "@iconify/react";
import { useUser } from '@clerk/react';
import { useTheme } from "@mui/material";
import { VirtuosoGrid } from 'react-virtuoso'
import Chip from '@mui/material/Chip';
import DoneIcon from '@mui/icons-material/Done';
import LinearProgress from '@mui/material/LinearProgress';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from "@mui/material/Divider";
import { Virtuoso } from 'react-virtuoso';
import RestartIcon from '@iconify-react/mdi/restart';
import RestartOffIcon from '@iconify-react/mdi/restart-off';
import SaveIcon from '@iconify-react/material-symbols/save';
import SaveOffIcon from '@iconify-react/lucide/save-off';
import DeleteIcon from '@iconify-react/mdi/delete';
import DeleteOffIcon from '@iconify-react/mdi/delete-off';
import HourglassOutlineIcon from '@iconify-react/material-symbols/hourglass-outline';
import { useVirtualizer, useWindowVirtualizer } from '@tanstack/react-virtual';




// Internal imports
import {
  AppBody1ButtonTypography,
} from "@/components/core/ButtonTypography";
import { AppH6Typography } from "@/components/core/Typography";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { postFilter } from "@/lib/helper/fetchers";
import { ErrorAlert, WarnAlert, SuccessAlert } from "@/components/core/Alerts";
import type { AppTheme } from '@/system/theme';
import type {
  ITag,
  ITagReadResponse,
} from "@/lib/model/tag";
import { tagGroupOptions } from '@/lib/helper/querying';
import type { IFilter, } from "@/lib/model/filter";
import { ZFilter } from "@/lib/model/filter";
import {
  DefaultTagRead,
} from '@/lib/helper/defaults';
import {
  SpaceBetweenBox,
} from "@/components/core/AppBox";



export function WrongAppFilterModal({ compPropFilter }: { compPropFilter?: IFilter }): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const queryClient = useQueryClient();
  const { user } = useUser();
  const theme: AppTheme = useTheme();
  // The scrollable element for your list
  const parentRef = useRef(null)

  const tagQuery = { ...DefaultTagRead, userId: user?.id || "", pageSize: -1, }
  const {
    isPending, isError, data, error
  }: UseQueryResult<ITagReadResponse> = useQuery(tagGroupOptions(tagQuery));


  // Define invalidating  mutation
  const mutation = useMutation({
    mutationFn: (mutateItem: IFilter) => {
      const mi = ZFilter.parse(mutateItem);
      return postFilter(mi);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["filter"] }),
      ])
    },
    onError: (error) => {
      if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
        console.log(error);
      }
      store.setMessage(error.message);
    },
  });

  function closeModal() {
    store.setFilterModal(false);
    store.setDisplayFilter(undefined);
  }

  useEffect(() => {
    // if (!form.state.isSubmitted) return;
    if (!mutation.isSuccess) return;

    const timer = setTimeout(
      () => {
        if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
          console.log("Timer fired after 2 seconds");
        }
        closeModal();
      }, 2000);
    return () => clearTimeout(timer); // cleanup
  }, [mutation.isSuccess]
  );
  // }, [form.state.isSubmitted, mutation.isSuccess]);


  function onFormSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    //Note: form.handleSubmit is automatically called on form submit. it does not need to be called again. Calling it again results in the form getting sent multiple times.

    //Note:  Modal should not be closed after form submission so success or error feedback can be sent to the user.
  }

  function formSubmission({ value }: { value: FormObjectType }): void {
    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
      console.log("In formSubmission - value ", value);
    }
    let checkedCategories: string[] = value.tags.filter((i) => i.checked).map(i => i.id);


    const prevId = value["id"] as string;

    const submitValue = {
      id: prevId !== "" ? prevId : uuidv4(),
      userId: user?.id || "",
      name: value.name as string,
      tags: checkedCategories,
      filters: [],
      count: 0,
    };
    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
      console.info("In formSubmission - submitvalue ", submitValue);
    }
    mutation.mutate(submitValue);
  }

  const tagCategories: ITag[] = data && data.tags ? data.tags : [];


  // ToDo: Changing Filtername creates a new filter and does not update the existing filter.
  // ToDo: Change the type of tags from list of string, to list of tag object. and upon submission, retain on the id from the tag object to send to api.


  // Define object for form default values based on tagCategories. Each category is a boolean field in the form that indicates whether the category is selected or not. The field name is the category name. For example, if there are tagCategories "Work" and "Personal", the form will have fields "Work" and "Personal" that are boolean values indicating whether each category is selected or not. Additionally, there is a field for the filter name called "___filterName". This field is used to capture the name of the filter being created or edited. It is separate from the category fields and is used to identify the filter.

  const existingTags = compPropFilter ? new Set([...compPropFilter.tags]) : new Set([]);

  type CheckedTagType = {
    name: string,
    id: string,
    checked: boolean,
  };

  type FormObjectType = {
    // [key: string]: string | boolean;
    name: string,
    id: string,
    tags: Array<CheckedTagType>,
    softDelete: boolean,
  };
  let newFormData: FormObjectType = {
    name: compPropFilter?.name ?? "",
    id: compPropFilter?.id ?? "",
    tags: [],
    softDelete: false,
  };

  tagCategories.forEach((item: ITag) => {
    if (existingTags.has(item.id)) {
      newFormData.tags = [...newFormData.tags, { id: item.id, name: item.name, checked: true }];
    } else {
      newFormData.tags = [...newFormData.tags, { id: item.id, name: item.name, checked: false }];
    }
  });


  function validateName(fname: string) {
    if (fname.length < 1) {
      return "Filter name is required";
    }
  }

  function validateTag(value: Array<CheckedTagType>) {
    let checked: Array<CheckedTagType> = value.filter((i) => i.checked);
    console.info('In validateTag', checked);
    if (checked.length < 1) {
      return "At least one tag is required";
    }
  }

  function formValidator({ value }: { value: FormObjectType }) {
    const invalidName = validateName(value.name as string);
    if (invalidName) {
      return invalidName;
    }

    const invalidTag = validateTag(value.tags);
    if (invalidTag) {
      return invalidTag
    }
    return undefined;
  }

  const form = useForm({
    defaultValues: newFormData,
    onSubmit: formSubmission,
    validators: {
      onChange({ value }: { value: FormObjectType }) {
        return formValidator({ value });
      },
      onBlur({ value }: { value: FormObjectType }) {
        return formValidator({ value });
      },
    },
  });


  function handleFilterDelete() {
    form.setFieldValue('softDelete', true);
    form.handleSubmit();
  }

  const formErrorMap = useStore(form.store, (state) => state.errorMap);
  const formTitle = compPropFilter ? "Update filter" : "Add new filter";

  const dialogSx = {
    display: 'block',
    // maxWidth: "lg",
    width: "100%",
    // height: 'fit-content',
    height: '70vh',
    // maxHeight: 720,
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '15px', // width of the entire scrollbar
    },
    '&::-webkit-scrollbar-track': {
      background: theme.palette.background.paper, // color of the tracking area
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.background.default, // color of the scroll thumb
      borderRadius: '10px', // roundness of the scroll thumb
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: theme.palette.background.default,
    },
  }

  function Dlg(content: ReactNode, actions?: ReactNode) {
    return (
      <Dialog fullWidth maxWidth="md" open={store.filterModal} onClose={closeModal} >
        <SpaceBetweenBox >
          <DialogTitle
            id="save-dialog-title"
            sx={{
              display: "flex", alignItems: "flex-start",
              justifyContent: "space-between",
              pb: 0, pt: 2, px: 3,
            }}
          >{formTitle}
          </DialogTitle>
          <IconButton aria-label="delete"
            sx={{
              display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
            }}
            onClick={closeModal}>
            <Icon icon="material-symbols-light:close-rounded" width="30" height="30" />
          </IconButton>
        </SpaceBetweenBox>
        <Divider />
        {mutation.error && (
          <Fragment>
            <ErrorAlert message={mutation.error.message} />
          </Fragment>
        )}
        {mutation.isSuccess && <SuccessAlert message="Filter updated!" />}
        {formErrorMap.onChange && <WarnAlert message={`${formErrorMap.onChange}`} />}
        {(formErrorMap.onChange || mutation.isSuccess) && <Divider />}

        <form onSubmit={onFormSubmit}>
          <DialogContent sx={dialogSx} >
            <Box
              component="section"
              sx={{ marginTop: 0, padding: 0, marginRight: "2.5rem", }}>
              {content}
            </Box>
          </DialogContent>
          <DialogActions>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={() => (
                <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
                  {actions}
                </Box>
              )}
            />
          </DialogActions>
        </form>
      </Dialog>
    );
  }

  if (isPending) { return Dlg(<LinearProgress />); }
  if (isError) { return Dlg(<ErrorAlert message={error?.message || "An error occurred. Please try again"} />); }
  if (tagCategories.length == 0) { return Dlg(<AppH6Typography> No tags found </AppH6Typography>) }


  // The virtualizer
  // const rowVirtualizer = useVirtualizer({
  //   count: tagCategories.length,
  //   getScrollElement: () => parentRef.current,
  //   estimateSize: () => 35,
  //   overscan: 5,
  // });
  const rowVirtualizer = useVirtualizer({
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  const cont = (
    <Fragment>
      <form.Field
        key={`name`}
        name={`name`}
        validators={{
          onChange: ({ value }) => validateName(value as unknown as string),
          onBlur: ({ value }) => validateName(value as unknown as string),
        }}
        children={(field) =>
          <Fragment>
            <TextField
              fullWidth
              slotProps={{
                input: { style: { fontSize: "1rem" } },
                inputLabel: { style: { fontSize: "1rem" } },
              }}
              multiline
              id={`name`}
              key={`___filterName`}
              value={field.state.value}
              label={`name`}
              onChange={
                (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
              size="small"
              variant="standard"
              error={field.state.meta.errors.length > 0}
              helperText={field.state.meta.errors.join(', ')}
            />
          </Fragment>
        }
      />
      <>
        <div
          ref={parentRef}
          className="List"
          style={{
            height: `50vh`,
            width: `100%`,
            overflow: 'auto',
            contain: 'strict',

          }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: `${columnVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => (
              <Fragment key={virtualRow.key}>
                {columnVirtualizer.getVirtualItems().map((virtualColumn) => (
                  <div
                    key={virtualColumn.key}
                    className={
                      virtualColumn.index % 2
                        ? virtualRow.index % 2 === 0
                          ? 'ListItemOdd'
                          : 'ListItemEven'
                        : virtualRow.index % 2
                          ? 'ListItemOdd'
                          : 'ListItemEven'
                    }
                    style={{
                      // position: 'absolute',
                      // top: 0,
                      // left: 0,
                      width: `${virtualColumn.size}px`,
                      height: `${virtualRow.size}px`,
                      transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                    }}
                  >
                    Cell {virtualRow.index}, {virtualColumn.index}
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </>
    </Fragment >
  );

  // const saveIcon = form.state.isSubmitting ? "material-symbols:hourglass-top" : form.state.canSubmit ? "material-symbols:save-sharp" : "lucide:save-off";
  // const saveTooltip = !form.state.canSubmit ? "Unable to save" : "Save";
  // const cloneIcon = form.state.values.id == "" ? "tabler:copy-off" : "material-symbols:content-copy-sharp";
  // const cloneTooltip = form.state.values.id == "" ? "Unable to clone" : "Clone";

  // const formActions = [
  //   { name: cloneTooltip, icon: cloneIcon, onClick: handleClone },
  //   { name: saveTooltip, icon: saveIcon, onClick: form.handleSubmit },
  //   { name: "Reset", icon: "material-symbols-light:restart-alt", onClick: form.reset },
  // ]


  const deleteTooltip = (
    form.state.values.id == "" ? "new filter can't be deleted" :
      form.state.isSubmitting ? "filter is being saved" : "delete filter"
  );
  const saveTooltip = (
    form.state.isPristine ? "no changes to save" :
      form.state.isSubmitting ? "filter is being saved" :
        !form.state.canSubmit ? "changes contain errors" : "save changes"
  );
  const resetTooltip = form.state.isDirty ? "reset" : "no changes to reset";
  const deleteIcon = (
    form.state.isSubmitting || form.state.values.id == "" ? <DeleteOffIcon height="1.5rem" /> :
      <DeleteIcon height="1.5rem" />
  );
  const saveIcon = form.state.isSubmitting ? <HourglassOutlineIcon height="1.5rem" /> :
    (!form.state.isPristine && form.state.canSubmit) ? <SaveIcon height="1.5rem" /> :
      <SaveOffIcon height="1.5rem" />;
  const resetIcon = form.state.isDirty ? <RestartIcon height="1.5rem" /> : <RestartOffIcon height="1.5rem" />;


  const formActions = [
    { name: deleteTooltip, icon: deleteIcon, onClick: handleFilterDelete },
    { name: saveTooltip, icon: saveIcon, onClick: form.handleSubmit },
    { name: resetTooltip, icon: resetIcon, onClick: form.reset },
  ]


  const acts = (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: 'absolute', bottom: 0, right: 0 }}
      icon={<SpeedDialIcon />}
    >
      {formActions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          // @ts-ignore
          onClick={action.onClick}
          slotProps={{
            tooltip: {
              title: action.name,
            },
          }}
        />
      ))}
    </SpeedDial>
  );

  return Dlg(cont, acts);
}


export function FaultyAppFilterModal({ compPropFilter }: { compPropFilter?: IFilter }): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const queryClient = useQueryClient();
  const { user } = useUser();
  const theme: AppTheme = useTheme();
  // The scrollable element for your list
  const parentRef = useRef(null)

  const tagQuery = { ...DefaultTagRead, userId: user?.id || "", pageSize: -1, }
  const {
    isPending, isError, data, error
  }: UseQueryResult<ITagReadResponse> = useQuery(tagGroupOptions(tagQuery));


  const rowVirtualizer = useVirtualizer({
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: 4,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  // Define invalidating  mutation
  const mutation = useMutation({
    mutationFn: (mutateItem: IFilter) => {
      const mi = ZFilter.parse(mutateItem);
      return postFilter(mi);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["filter"] }),
      ])
    },
    onError: (error) => {
      if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
        console.log(error);
      }
      store.setMessage(error.message);
    },
  });

  function closeModal() {
    store.setFilterModal(false);
    store.setDisplayFilter(undefined);
  }

  useEffect(() => {
    // if (!form.state.isSubmitted) return;
    if (!mutation.isSuccess) return;

    const timer = setTimeout(
      () => {
        if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
          console.log("Timer fired after 2 seconds");
        }
        closeModal();
      }, 2000);
    return () => clearTimeout(timer); // cleanup
  }, [mutation.isSuccess]
  );
  // }, [form.state.isSubmitted, mutation.isSuccess]);



  function onFormSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    //Note: form.handleSubmit is automatically called on form submit. it does not need to be called again. Calling it again results in the form getting sent multiple times.

    //Note:  Modal should not be closed after form submission so success or error feedback can be sent to the user.
  }

  function formSubmission({ value }: { value: FormObjectType }): void {
    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
      console.log("In formSubmission - value ", value);
    }
    let checkedCategories: string[] = value.tags.filter((i) => i.checked).map(i => i.id);


    const prevId = value["id"] as string;

    const submitValue = {
      id: prevId !== "" ? prevId : uuidv4(),
      userId: user?.id || "",
      name: value.name as string,
      tags: checkedCategories,
      filters: [],
      count: 0,
    };
    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
      console.info("In formSubmission - submitvalue ", submitValue);
    }
    mutation.mutate(submitValue);
  }

  const tagCategories: ITag[] = data && data.tags ? data.tags : [];


  const existingTags = compPropFilter ? new Set([...compPropFilter.tags]) : new Set([]);

  type CheckedTagType = {
    name: string,
    id: string,
    checked: boolean,
  };

  type FormObjectType = {
    // [key: string]: string | boolean;
    name: string,
    id: string,
    tags: Array<CheckedTagType>,
    softDelete: boolean,
  };
  let newFormData: FormObjectType = {
    name: compPropFilter?.name ?? "",
    id: compPropFilter?.id ?? "",
    tags: [],
    softDelete: false,
  };

  tagCategories.forEach((item: ITag) => {
    if (existingTags.has(item.id)) {
      newFormData.tags = [...newFormData.tags, { id: item.id, name: item.name, checked: true }];
    } else {
      newFormData.tags = [...newFormData.tags, { id: item.id, name: item.name, checked: false }];
    }
  });


  function validateName(fname: string) {
    if (fname.length < 1) {
      return "Filter name is required";
    }
  }

  function validateTag(value: Array<CheckedTagType>) {
    let checked: Array<CheckedTagType> = value.filter((i) => i.checked);
    console.info('In validateTag', checked);
    if (checked.length < 1) {
      return "At least one tag is required";
    }
  }

  function formValidator({ value }: { value: FormObjectType }) {
    const invalidName = validateName(value.name as string);
    if (invalidName) {
      return invalidName;
    }

    const invalidTag = validateTag(value.tags);
    if (invalidTag) {
      return invalidTag
    }
    return undefined;
  }

  function handleFilterDelete() {
    form.setFieldValue('softDelete', true);
    form.handleSubmit();
  }

  const form = useForm({
    defaultValues: newFormData,
    onSubmit: formSubmission,
    validators: {
      onChange({ value }: { value: FormObjectType }) {
        return formValidator({ value });
      },
      onBlur({ value }: { value: FormObjectType }) {
        return formValidator({ value });
      },
    },
  });


  const formErrorMap = useStore(form.store, (state) => state.errorMap);
  const formTitle = compPropFilter ? "Update filter" : "Add new filter";

  const dialogSx = {
    display: 'block',
    maxWidth: "100%",
    width: "100%",
    height: '70vh',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '15px', // width of the entire scrollbar
    },
    '&::-webkit-scrollbar-track': {
      background: theme.palette.background.paper, // color of the tracking area
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.background.default, // color of the scroll thumb
      borderRadius: '10px', // roundness of the scroll thumb
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: theme.palette.background.default,
    },
  }

  function Dlg(content: ReactNode, actions?: ReactNode) {
    return (
      <Dialog fullWidth ref={parentRef} maxWidth="md" open={store.filterModal} onClose={closeModal} className="List">
        <SpaceBetweenBox >
          <DialogTitle
            id="save-dialog-title"
            sx={{
              display: "flex", alignItems: "flex-start",
              justifyContent: "space-between",
              pb: 0, pt: 2, px: 3,
            }}
          >{formTitle}
          </DialogTitle>
          <IconButton aria-label="delete"
            sx={{
              display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
            }}
            onClick={closeModal}>
            <Icon icon="material-symbols-light:close-rounded" width="30" height="30" />
          </IconButton>
        </SpaceBetweenBox>
        <Divider />
        {mutation.error && (
          <Fragment>
            <ErrorAlert message={mutation.error.message} />
          </Fragment>
        )}
        {mutation.isSuccess && <SuccessAlert message="Filter updated!" />}
        {formErrorMap.onChange && <WarnAlert message={`${formErrorMap.onChange}`} />}
        {(formErrorMap.onChange || mutation.isSuccess) && <Divider />}

        <form onSubmit={onFormSubmit}>
          <DialogContent sx={dialogSx} >
            <Box
              component="section"
              sx={{ padding: 0, marginTop: 0, marginRight: "2.5rem", }}>
              {content}
            </Box>
          </DialogContent>
          <DialogActions>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={() => (
                <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
                  {actions}
                </Box>
              )}
            />
          </DialogActions>
        </form>
      </Dialog>
    );
  }

  if (isPending) { return Dlg(<LinearProgress />); }
  if (isError) { return Dlg(<ErrorAlert message={error?.message || "An error occurred. Please try again"} />); }
  if (tagCategories.length == 0) { return Dlg(<AppH6Typography> No tags found </AppH6Typography>) }


  const cont = (
    <Fragment>
      <form.Field
        key={`name`}
        name={`name`}
        validators={{
          onChange: ({ value }) => validateName(value as unknown as string),
          onBlur: ({ value }) => validateName(value as unknown as string),
        }}
        children={(field) =>
          <Fragment>
            <TextField
              fullWidth
              slotProps={{
                input: { style: { fontSize: "1rem" } },
                inputLabel: { style: { fontSize: "1rem" } },
              }}
              multiline
              id={`name`}
              key={`___filterName`}
              value={field.state.value}
              label={`name`}
              onChange={
                (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
              size="small"
              variant="standard"
              error={field.state.meta.errors.length > 0}
              helperText={field.state.meta.errors.join(', ')}
            />
          </Fragment>
        }
      />
      <>
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: `fit-content`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <Fragment key={virtualRow.key}>
              {columnVirtualizer.getVirtualItems().map((virtualColumn) => (
                <div
                  key={virtualColumn.key}
                  className={
                    virtualColumn.index % 2
                      ? virtualRow.index % 2 === 0
                        ? 'ListItemOdd'
                        : 'ListItemEven'
                      : virtualRow.index % 2
                        ? 'ListItemOdd'
                        : 'ListItemEven'
                  }
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${virtualColumn.size}px`,
                    // width: `${virtualColumn.size}px`,
                    height: `${virtualRow.size}px`,
                    transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                  }}
                >
                  {/* Cell {virtualRow.index}, {virtualColumn.index} */}
                  <form.Field
                    key={virtualItem.index} name={`tags[${virtualItem.index}]`} >
                    {
                      (subField: any) => {
                        return (
                          subField &&
                          <Grid size="auto" sx={{
                            // position: 'absolute',
                            // top: 0,
                            // left: 0,
                            // width: '100%',
                            // height: `${virtualItem.size}px`,
                            // transform: `translateY(${virtualItem.start}px)`,
                          }}>
                            <Chip
                              color="primary"
                              // @ts-ignore
                              icon={subField.state.value.checked && <DoneIcon />}
                              sx={{ color: theme.palette.background.default, cursor: "pointer" }}
                              label={<AppBody1ButtonTypography>#{subField.state.value.name}</AppBody1ButtonTypography>}
                              onClick={() => {
                                if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
                                  console.log(`${subField.state.value.name} onClick: ${subField.state.value.checked}=>${!subField.state.value.checked}`);
                                }
                                subField.handleChange({ ...subField.state.value, checked: !subField.state.value.checked });
                              }}
                            />
                          </Grid>
                        );
                      }
                    }
                  </form.Field>
                  <Chip
                    color="primary"
                    // @ts-ignore
                    icon={subField.state.value.checked && <DoneIcon />}
                    sx={{ color: theme.palette.background.default, cursor: "pointer" }}
                    label={<AppBody1ButtonTypography>#{subField.state.value.name}</AppBody1ButtonTypography>}
                    onClick={() => {
                      if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
                        console.log(`${subField.state.value.name} onClick: ${subField.state.value.checked}=>${!subField.state.value.checked}`);
                      }
                      subField.handleChange({ ...subField.state.value, checked: !subField.state.value.checked });
                    }}
                  />
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </>
    </Fragment >
  );

  const deleteTooltip = (
    form.state.values.id == "" ? "new filter can't be deleted" :
      form.state.isSubmitting ? "filter is being saved" : "delete filter"
  );
  const saveTooltip = (
    form.state.isPristine ? "no changes to save" :
      form.state.isSubmitting ? "filter is being saved" :
        !form.state.canSubmit ? "changes contain errors" : "save changes"
  );
  const resetTooltip = form.state.isDirty ? "reset" : "no changes to reset";
  const deleteIcon = (
    form.state.isSubmitting || form.state.values.id == "" ? <DeleteOffIcon height="1.5rem" /> :
      <DeleteIcon height="1.5rem" />
  );
  const saveIcon = form.state.isSubmitting ? <HourglassOutlineIcon height="1.5rem" /> :
    (!form.state.isPristine && form.state.canSubmit) ? <SaveIcon height="1.5rem" /> :
      <SaveOffIcon height="1.5rem" />;
  const resetIcon = form.state.isDirty ? <RestartIcon height="1.5rem" /> : <RestartOffIcon height="1.5rem" />;


  const formActions = [
    { name: deleteTooltip, icon: deleteIcon, onClick: handleFilterDelete },
    { name: saveTooltip, icon: saveIcon, onClick: form.handleSubmit },
    { name: resetTooltip, icon: resetIcon, onClick: form.reset },
  ]


  const acts = (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: 'absolute', bottom: 0, right: 0 }}
      icon={<SpeedDialIcon />}
    >
      {formActions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          // @ts-ignore
          onClick={action.onClick}
          slotProps={{
            tooltip: {
              title: action.name,
            },
          }}
        />
      ))}
    </SpeedDial>
  );

  return Dlg(cont, acts);

  return (
    <>
      <div
        ref={parentRef}
        className="List"
        style={{ height: `50vh`, width: `100%`, overflow: 'auto', }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: `100%`,
            // width: `${columnVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <Fragment key={virtualRow.key}>
              {columnVirtualizer.getVirtualItems().map((virtualColumn) => (
                <div
                  key={virtualColumn.key}
                  className={
                    virtualColumn.index % 2
                      ? virtualRow.index % 2 === 0
                        ? 'ListItemOdd'
                        : 'ListItemEven'
                      : virtualRow.index % 2
                        ? 'ListItemOdd'
                        : 'ListItemEven'
                  }
                  style={{
                    position: 'relative',
                    // position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${virtualColumn.size}px`,
                    height: `${virtualRow.size}px`,
                    transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                  }}
                >
                  Cell {virtualRow.index}, {virtualColumn.index}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </>
  )
}


export function AppFilterModal({ compPropFilter }: { compPropFilter?: IFilter }): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const queryClient = useQueryClient();
  const { user } = useUser();
  const theme: AppTheme = useTheme();
  // The scrollable element for your list

  const tagQuery = { ...DefaultTagRead, userId: user?.id || "", pageSize: -1, }
  const {
    isPending, isError, data, error
  }: UseQueryResult<ITagReadResponse> = useQuery(tagGroupOptions(tagQuery));



  // Define invalidating  mutation
  const mutation = useMutation({
    mutationFn: (mutateItem: IFilter) => {
      const mi = ZFilter.parse(mutateItem);
      return postFilter(mi);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["filter"] }),
      ])
    },
    onError: (error) => {
      if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
        console.log(error);
      }
      store.setMessage(error.message);
    },
  });

  function closeModal() {
    store.setFilterModal(false);
    store.setDisplayFilter(undefined);
  }

  useEffect(() => {
    // if (!form.state.isSubmitted) return;
    if (!mutation.isSuccess) return;

    const timer = setTimeout(
      () => {
        if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
          console.log("Timer fired after 2 seconds");
        }
        closeModal();
      }, 2000);
    return () => clearTimeout(timer); // cleanup
  }, [mutation.isSuccess]
  );
  // }, [form.state.isSubmitted, mutation.isSuccess]);



  function onFormSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    //Note: form.handleSubmit is automatically called on form submit. it does not need to be called again. Calling it again results in the form getting sent multiple times.

    //Note:  Modal should not be closed after form submission so success or error feedback can be sent to the user.
  }

  function formSubmission({ value }: { value: FormObjectType }): void {
    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
      console.log("In formSubmission - value ", value);
    }
    let checkedCategories: string[] = value.tags.filter((i) => i.checked).map(i => i.id);


    const prevId = value["id"] as string;

    const submitValue = {
      id: prevId !== "" ? prevId : uuidv4(),
      userId: user?.id || "",
      name: value.name as string,
      tags: checkedCategories,
      filters: [],
      count: 0,
    };
    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
      console.info("In formSubmission - submitvalue ", submitValue);
    }
    mutation.mutate(submitValue);
  }

  const tagCategories: ITag[] = data && data.tags ? data.tags : [];
  const count = tagCategories.length
  const existingTags = compPropFilter ? new Set([...compPropFilter.tags]) : new Set([]);

  type CheckedTagType = {
    name: string,
    id: string,
    checked: boolean,
  };

  type FormObjectType = {
    // [key: string]: string | boolean;
    name: string,
    id: string,
    tags: Array<CheckedTagType>,
    softDelete: boolean,
  };
  let newFormData: FormObjectType = {
    name: compPropFilter?.name ?? "",
    id: compPropFilter?.id ?? "",
    tags: [],
    softDelete: false,
  };

  tagCategories.forEach((item: ITag) => {
    if (existingTags.has(item.id)) {
      newFormData.tags = [...newFormData.tags, { id: item.id, name: item.name, checked: true }];
    } else {
      newFormData.tags = [...newFormData.tags, { id: item.id, name: item.name, checked: false }];
    }
  });


  function validateName(fname: string) {
    if (fname.length < 1) {
      return "Filter name is required";
    }
  }

  function validateTag(value: Array<CheckedTagType>) {
    let checked: Array<CheckedTagType> = value.filter((i) => i.checked);
    console.info('In validateTag', checked);
    if (checked.length < 1) {
      return "At least one tag is required";
    }
  }

  function formValidator({ value }: { value: FormObjectType }) {
    const invalidName = validateName(value.name as string);
    if (invalidName) {
      return invalidName;
    }

    const invalidTag = validateTag(value.tags);
    if (invalidTag) {
      return invalidTag
    }
    return undefined;
  }

  function handleFilterDelete() {
    form.setFieldValue('softDelete', true);
    form.handleSubmit();
  }

  const form = useForm({
    defaultValues: newFormData,
    onSubmit: formSubmission,
    validators: {
      onChange({ value }: { value: FormObjectType }) {
        return formValidator({ value });
      },
      onBlur({ value }: { value: FormObjectType }) {
        return formValidator({ value });
      },
    },
  });

  const formErrorMap = useStore(form.store, (state) => state.errorMap);
  const formTitle = compPropFilter ? "Update filter" : "Add new filter";

  const dialogSx = {
    display: 'block',
    maxWidth: "100%",
    width: "100%",
    height: '70vh',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '15px', // width of the entire scrollbar
    },
    '&::-webkit-scrollbar-track': {
      background: theme.palette.background.paper, // color of the tracking area
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.background.default, // color of the scroll thumb
      borderRadius: '10px', // roundness of the scroll thumb
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: theme.palette.background.default,
    },
  }

  function Dlg(content: ReactNode, actions?: ReactNode) {
    return (
      <Dialog fullWidth maxWidth="md" open={store.filterModal} onClose={closeModal} >
        <SpaceBetweenBox >
          <DialogTitle
            id="save-dialog-title"
            sx={{
              display: "flex", alignItems: "flex-start",
              justifyContent: "space-between",
              pb: 0, pt: 2, px: 3,
            }}
          >{formTitle}
          </DialogTitle>
          <IconButton aria-label="delete"
            sx={{
              display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
            }}
            onClick={closeModal}>
            <Icon icon="material-symbols-light:close-rounded" width="30" height="30" />
          </IconButton>
        </SpaceBetweenBox>
        <Divider />
        {mutation.error && (
          <Fragment>
            <ErrorAlert message={mutation.error.message} />
          </Fragment>
        )}
        {mutation.isSuccess && <SuccessAlert message="Filter updated!" />}
        {formErrorMap.onChange && <WarnAlert message={`${formErrorMap.onChange}`} />}
        {(formErrorMap.onChange || mutation.isSuccess) && <Divider />}

        <form onSubmit={onFormSubmit}>
          <DialogContent sx={dialogSx} >
            <Box
              component="section"
              sx={{ padding: 0, marginTop: 0, marginRight: "2.5rem", }}>
              {content}
            </Box>
          </DialogContent>
          <DialogActions>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={() => (
                <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
                  {actions}
                </Box>
              )}
            />
          </DialogActions>
        </form>
      </Dialog>
    );
  }

  const parentRef = useRef<HTMLDivElement | null>(null)

  const parentOffsetRef = useRef(0)

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0
  }, [])

  // const getColumnWidth = (index: number) => columns[index].width
  const getColumnWidth = (index: number) => 100

  const virtualizer = useWindowVirtualizer({
    count,
    estimateSize: () => 350,
    overscan: 5,
    scrollMargin: parentOffsetRef.current,
  })

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: 4,
    getScrollElement: () => parentRef.current,
    estimateSize: getColumnWidth,
    overscan: 5,
  })
  const columnItems = columnVirtualizer.getVirtualItems()
  const [before, after] =
    columnItems.length > 0
      ? [
        columnItems[0].start,
        columnVirtualizer.getTotalSize() -
        columnItems[columnItems.length - 1].end,
      ]
      : [0, 0]


  if (isPending) { return Dlg(<LinearProgress />); }
  if (isError) { return Dlg(<ErrorAlert message={error?.message || "An error occurred. Please try again"} />); }
  if (tagCategories.length == 0) { return Dlg(<AppH6Typography> No tags found </AppH6Typography>) }


  const cont = (
    <Fragment>
      <form.Field
        key={`name`}
        name={`name`}
        validators={{
          onChange: ({ value }) => validateName(value as unknown as string),
          onBlur: ({ value }) => validateName(value as unknown as string),
        }}
        children={(field) =>
          <Fragment>
            <TextField
              fullWidth
              slotProps={{
                input: { style: { fontSize: "1rem" } },
                inputLabel: { style: { fontSize: "1rem" } },
              }}
              multiline
              id={`name`}
              key={`___filterName`}
              value={field.state.value}
              label={`name`}
              onChange={
                (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
              size="small"
              variant="standard"
              error={field.state.meta.errors.length > 0}
              helperText={field.state.meta.errors.join(', ')}
            />
          </Fragment>
        }
      />
      <div
        ref={parentRef}
        style={{ overflowY: 'auto', border: '1px solid #c8c8c8' }}
      >
        <div
          style={{
            height: virtualizer.getTotalSize(),
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((row) => {
            console.info('row', row);
            return (
              <div
                key={row.key}
                data-index={row.index}
                ref={virtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  transform: `translateY(${row.start - virtualizer.options.scrollMargin
                    }px)`,
                  display: 'flex',
                }}
              >
                <div style={{ width: `${before}px` }} />
                {columnItems.map((column) => {
                  // console.info('column', column);
                  return (
                    <div
                      key={column.key}
                      style={{
                        minHeight: row.index === 0 ? 50 : row.size,
                        width: getColumnWidth(column.index),
                        borderBottom: '1px solid #c8c8c8',
                        borderRight: '1px solid #c8c8c8',
                        padding: '7px 12px',
                      }}
                    >
                      Col
                      {/* {row.index === 0 ? (
                        <div>{columns[column.index].name}</div>
                      ) : (
                        <div>{tagCategories[row.index*column.index].name}</div>
                      )} */}
                    </div>
                  )
                })}
                <div style={{ width: `${after}px` }} />
              </div>
            )
          })}
        </div>
      </div>




    </Fragment >
  );

  const deleteTooltip = (
    form.state.values.id == "" ? "new filter can't be deleted" :
      form.state.isSubmitting ? "filter is being saved" : "delete filter"
  );
  const saveTooltip = (
    form.state.isPristine ? "no changes to save" :
      form.state.isSubmitting ? "filter is being saved" :
        !form.state.canSubmit ? "changes contain errors" : "save changes"
  );
  const resetTooltip = form.state.isDirty ? "reset" : "no changes to reset";
  const deleteIcon = (
    form.state.isSubmitting || form.state.values.id == "" ? <DeleteOffIcon height="1.5rem" /> :
      <DeleteIcon height="1.5rem" />
  );
  const saveIcon = form.state.isSubmitting ? <HourglassOutlineIcon height="1.5rem" /> :
    (!form.state.isPristine && form.state.canSubmit) ? <SaveIcon height="1.5rem" /> :
      <SaveOffIcon height="1.5rem" />;
  const resetIcon = form.state.isDirty ? <RestartIcon height="1.5rem" /> : <RestartOffIcon height="1.5rem" />;


  const formActions = [
    { name: deleteTooltip, icon: deleteIcon, onClick: handleFilterDelete },
    { name: saveTooltip, icon: saveIcon, onClick: form.handleSubmit },
    { name: resetTooltip, icon: resetIcon, onClick: form.reset },
  ]


  const acts = (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: 'absolute', bottom: 0, right: 0 }}
      icon={<SpeedDialIcon />}
    >
      {formActions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          // @ts-ignore
          onClick={action.onClick}
          slotProps={{
            tooltip: {
              title: action.name,
            },
          }}
        />
      ))}
    </SpeedDial>
  );

  return Dlg(cont, acts);

}
