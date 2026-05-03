
import {
  forwardRef,
  Fragment,
  useEffect,
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




// Internal imports
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Box from '@mui/material/Box';
import { AppBody1ButtonTypography } from "@/components/core/ButtonTypography";
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


export function AppFilterModal(): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const queryClient = useQueryClient();
  const { user } = useUser();
  const theme: AppTheme = useTheme();
  const storeFilter: IFilter = useBoundStore((state) => state.displayFilter);

  const tagQuery = {
    ...DefaultTagRead,
    userId: user?.id || "",
    pageSize: -1,
  }

  const {
    isPending, isError, data, error
  }: UseQueryResult<ITagReadResponse> = useQuery(tagGroupOptions(tagQuery));


  // Define invalidating  mutation
  const mutation = useMutation({
    mutationFn: (mutateItem: IFilter) => {
      if (mutateItem.tags.length == 0) {
        throw Error("At least one tag is required")
      }
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

  type FormObjectType = {
    [key: string]: string | boolean;
  };

  function formSubmission({ value }: { value: FormObjectType }): void {
    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
      console.log("In formSubmission - value ", value);
    }
    let checkedCategories: string[] = [];

    Object.keys(value).forEach(key => {
      if (key !== "___filterName" && key !== "id" && value[key]) {
        checkedCategories.push(key);
      }
    });

    const prevId = value["id"] as string;

    const submitValue = {
      id: prevId !== "" ? prevId : uuidv4(),
      userId: user?.id || "",
      name: value["___filterName"] as string,
      tags: checkedCategories,
      filters: [],
      count: 0,
    };
    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
      console.info("In formSubmission - submitvalue ", submitValue);
    }
    mutation.mutate(submitValue);
  }

  const gridComponents = {
    List: forwardRef(({ style, children, ...props }: { style: any, children: ReactNode, props: any }, ref: any) => (
      <div ref={ref} {...props}
        style={{ display: 'flex', flexWrap: 'wrap', ...style, }}>
        {children}
      </div>
    )),
    Item: ({ children, ...props }: { children: ReactNode;[key: string]: unknown }) => (
      <div
        {...props}
        style={{
          padding: '2%', width: 'fit-content', display: 'flex',
          flex: 'wrap', boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    ),
  }

  const dialogSx = {
    display: 'block',
    maxWidth: "lg",
    width: "lg",
    height: 'fit-content',
    // height: '70vh',
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
  const tagCategories: ITag[] = data && data.tags ? data.tags : [];


  // ToDo: Changing Filtername creates a new filter and does not update the existing filter.

  // Define object for form default values based on tagCategories. Each category is a boolean field in the form that indicates whether the category is selected or not. The field name is the category name. For example, if there are tagCategories "Work" and "Personal", the form will have fields "Work" and "Personal" that are boolean values indicating whether each category is selected or not. Additionally, there is a field for the filter name called "___filterName". This field is used to capture the name of the filter being created or edited. It is separate from the category fields and is used to identify the filter.

  const formFilterName = storeFilter ? storeFilter.name : "";
  const formFilterId = storeFilter ? storeFilter.id : "";
  const existingTags = storeFilter ? new Set([...storeFilter.tags]) : new Set([]);

  let defaultFormData: any = { "___filterName": formFilterName, "id": formFilterId, }
  defaultFormData = tagCategories.reduce((acc: any, item: ITag) => {
    if (existingTags.has(item.id)) {
      acc[item.name] = true;
    } else {
      acc[item.name] = false;
    }
    return acc;
  }, defaultFormData);


  const formData: any[] = [...tagCategories];


  function eachItem(idx: number): ReactNode {
    const chipLabel = formData[idx] && formData[idx].name ? formData[idx].name : "";
    return (
      <form.Field
        key={`item-${chipLabel}`} name={chipLabel}
        children={(field) =>
          <Chip
            color="primary"
            // @ts-ignore
            icon={field.state.value && <DoneIcon />}
            sx={{ color: theme.palette.background.default, cursor: "pointer" }}
            label={<AppBody1ButtonTypography>#{chipLabel}</AppBody1ButtonTypography>}
            onClick={() => {
              if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
                console.log(`${chipLabel} onClick: ${field.state.value}=>${!field.state.value}`);
              }
              field.handleChange(!field.state.value)
            }}
          />
        }
      />
    )
  }


  const form = useForm({
    defaultValues: defaultFormData,
    onSubmit: formSubmission,
    validators: {
      onChange({ value }: { value: FormObjectType }) {
        const fname = value["___filterName"] as string;
        if (fname.length < 1) {
          return "Filter name is required";
        }

        let checked: string[] = [];
        Object.keys(value).forEach(key => {
          const val = value[key];
          if (val && key !== "___filterName") {
            checked.push(key);
          }
        });

        if (checked.length < 1) {
          return "At least one tag is required";
        }
        return undefined
      },
      onBlur({ value }: { value: FormObjectType }) {
        const fname = value["___filterName"] as string;
        if (fname.length < 1) {
          return "Filter name is required";
        }

        let checked: string[] = [];
        Object.keys(value).forEach(key => {
          const val = value[key];
          if (val && key !== "___filterName") {
            checked.push(key);
          }
        });

        if (checked.length < 1) {
          return "At least one tag is required";
        }
        return undefined
      },
    },
  });

  function handleClone() {
    const fname = form.state.values.___filterName || "";
    form.setFieldValue('id', uuidv4());
    form.setFieldValue('___filterName', "[Clone of] - " + fname);
  }

  const saveIcon = form.state.isSubmitting ? "material-symbols:hourglass-top" : form.state.canSubmit ? "material-symbols:save-sharp" : "lucide:save-off";
  const saveTooltip = !form.state.canSubmit ? "Unable to save" : "Save";
  const cloneIcon = form.state.values.id == "" ? "tabler:copy-off" : "material-symbols:content-copy-sharp";
  const cloneTooltip = form.state.values.id == "" ? "Unable to clone" : "Clone";

  const formActions = [
    { name: cloneTooltip, icon: cloneIcon, onClick: handleClone },
    { name: saveTooltip, icon: saveIcon, onClick: form.handleSubmit },
    { name: "Reset", icon: "material-symbols-light:restart-alt", onClick: form.reset },
  ]
  const formErrorMap = useStore(form.store, (state) => state.errorMap);
  const formTitle = storeFilter ? "Update filter" : "Create new filter";

  return (
    <Dialog fullWidth open={store.filterModal} onClose={closeModal} >
      <IconButton aria-label="delete"
        sx={{
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
        }}
        onClick={closeModal}>
        <Icon icon="material-symbols-light:close-rounded" width="40" height="40" />
      </IconButton>


      <form onSubmit={onFormSubmit}>
        <DialogContent sx={dialogSx} >
          {isPending && <LinearProgress />}
          {
            !isPending && isError &&
            <ErrorAlert message={error?.message || "An error occurred. Please try again"} />
          }
          {
            !isError && !isPending && tagCategories.length == 0 &&
            <AppH6Typography> No items found </AppH6Typography>
          }
          {mutation.error && (
            <Fragment>
              <ErrorAlert message={mutation.error.message} />
              <h5 onClick={() => mutation.reset()}>{mutation.error.message}</h5>
            </Fragment>
          )}
          {mutation.isSuccess && (
            <Fragment>
              <SuccessAlert message="Filter updated!" />
            </Fragment>
          )}
          {
            formErrorMap.onChange && (<WarnAlert message={`${formErrorMap.onChange}`} />)
          }
          {
            formErrorMap.onBlur && (<ErrorAlert message={`${formErrorMap.onBlur}`} />)
          }
          <AppH6Typography> {formTitle} </AppH6Typography>
          {
            tagCategories && tagCategories.length > 0 &&
            <Fragment>
              <form.Field
                key={`Filter Name`}
                name={`___filterName`}
                // validators={{
                //   onBlur: ({ value }: { value: any }) =>
                //     value.length < 1 ? 'You must enter a filter name' : undefined,
                // }}

                children={(field) =>
                  <Fragment>
                    <TextField
                      fullWidth
                      multiline
                      id={`Filter Name`}
                      key={`___filterName`}
                      value={field.state.value}
                      label={`Filter Name`}
                      onChange={
                        (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
                      size="small"
                      variant="standard"
                    />
                    {!field.state.meta.isValid && (
                      <ErrorAlert message={field.state.meta.errors.join(', ')} />
                    )}
                  </Fragment>
                }
              />
              <VirtuosoGrid
                style={{ height: "60vh", width: '100%' }}
                totalCount={tagCategories.length}
                // @ts-ignore
                components={gridComponents}
                itemContent={
                  (index) => eachItem(index)
                }
              />
            </Fragment>
          }
        </DialogContent>
        <DialogActions>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={() => (
              <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
                <SpeedDial
                  ariaLabel="SpeedDial basic example"
                  sx={{ position: 'absolute', bottom: 16, right: 16 }}
                  icon={<SpeedDialIcon />}
                >
                  {formActions.map((action) => (
                    <SpeedDialAction
                      key={action.name}
                      icon={<Icon icon={action.icon} width="36" height="36" />}
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
              </Box>
            )}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
}
