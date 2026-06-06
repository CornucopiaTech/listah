
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
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Icon } from "@iconify/react";
import { useUser } from '@clerk/react';
import Chip from '@mui/material/Chip';
import DoneIcon from '@mui/icons-material/Done';
import LinearProgress from '@mui/material/LinearProgress';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import Divider from "@mui/material/Divider";
import RestartIcon from '@iconify-react/mdi/restart';
import RestartOffIcon from '@iconify-react/mdi/restart-off';
import SaveIcon from '@iconify-react/material-symbols/save';
import SaveOffIcon from '@iconify-react/lucide/save-off';
import DeleteIcon from '@iconify-react/mdi/delete';
import DeleteOffIcon from '@iconify-react/mdi/delete-off';
import HourglassOutlineIcon from '@iconify-react/material-symbols/hourglass-outline';
import { VirtuosoGrid } from 'react-virtuoso'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


// Internal imports

import { AppH6Typography } from "@/components/core/Typography";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { postFilter } from "@/lib/helper/fetchers";
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
  ItemFormSpeedDialBox,
} from "@/components/core/AppBox";
import {
  AppModalCloseButton,
} from "@/components/core/AppButton";




export function AppFilterModal({ itemFilter }: { itemFilter?: IFilter }): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const queryClient = useQueryClient();
  const { user } = useUser();
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
      softDelete: value?.softDelete,
    };
    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
      console.info("In formSubmission - submitvalue ", submitValue);
    }
    mutation.mutate(submitValue);
  }

  const tagCategories: ITag[] = data && data.tags ? data.tags : [];
  const existingTags = itemFilter ? new Set([...itemFilter.tags]) : new Set([]);

  type CheckedTagType = {
    name: string,
    id: string,
    checked: boolean,
  };

  type FormObjectType = {
    name: string,
    id: string,
    tags: Array<CheckedTagType>,
    softDelete: boolean,
  };

  let newFormData: FormObjectType = {
    name: itemFilter?.name ?? "",
    id: itemFilter?.id ?? "",
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

  function handleDelete() {
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
  const formTitle = itemFilter ? "Update filter" : "Add new filter";
  const formErrors = useStore(form.store, (state) => state.errors);
  const formCanSubmit = formErrors.length == 0;
  const formIsSubmitting = useStore(form.store, (state) => state.isSubmitting);
  const formIsDirty = useStore(form.store, (state) => state.isDirty);
  const formStateId = useStore(form.store, (state) => state.values.id);


  function Dlg(content: ReactNode, actions?: ReactNode) {
    return (
      <Dialog fullWidth maxWidth="md" open={store.filterModal} onClose={closeModal} >
        <SpaceBetweenBox >
          <DialogTitle id="save-dialog-title" >{formTitle} </DialogTitle>
          <AppModalCloseButton aria-label="close dialog"
            size="small" onClick={closeModal}>
            <Icon icon="material-symbols-light:close-rounded" width="30" height="30" />
          </AppModalCloseButton>
        </SpaceBetweenBox>
        <Divider />

        {mutation.error && (
          <Fragment>
            <Alert severity="error"> {mutation.error.message}</Alert>
            <h5 onClick={() => mutation.reset()}>{mutation.error.message}</h5>
          </Fragment>
        )}
        {mutation.isSuccess && <Alert severity="success"> {"Filter updated!"} </Alert>}
        {formErrorMap.onChange && <Alert severity="warning"> {`${formErrorMap.onChange}`} </Alert>}
        {(formErrorMap.onChange || mutation.isSuccess) && <Divider />}

        <form onSubmit={onFormSubmit}>
          <DialogContent > {content} </DialogContent>
          <Divider />
          {actions && <DialogActions> {actions} </DialogActions>}
        </form>
      </Dialog>
    );
  }

  const gridComponents = {
    // @ts-ignore
    List: forwardRef(({ style, children, ...props }, ref) => (
      <div
        // @ts-ignore
        ref={ref}
        {...props}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          ...style,
        }}
      >
        {children}
      </div>
    )),
    // @ts-ignore
    Item: ({ children, ...props }) => (
      <div
        {...props}
        style={{
          padding: '0.5rem',
          width: '20%',
          height: "50px",
          display: 'flex',
          flex: 'none',
          alignContent: 'stretch',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    ),
  }

  function eachItem(idx: number): ReactNode {
    return (
      <form.Field name={`tags[${idx}]`}
        children={(field) => {
          const mxLbl = field.state.value && field.state.value.checked ? 5 : 10;
          const lbl = field.state.value && field.state.value.name.length > mxLbl ? field.state.value.name.substring(0, mxLbl) + "..." : field.state.value ? field.state.value.name : "";
          return (<Tooltip title={<Typography variant="body2">#{field.state.value?.name ?? ""}</Typography>}>
            <Chip
              color="primary"
              sx={{ width: 'fit-content' }}
              // @ts-ignore
              icon={field.state.value?.checked && <DoneIcon />}

              label={<Typography variant="body2">#{lbl}</Typography>}
              onClick={() => {
                if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
                  console.log(`${field.state.value.name} onClick: ${field.state.value.checked}=>${!field.state.value.checked}`);
                }
                field.handleChange({ ...field.state.value, checked: !field.state.value.checked })
              }}
            />
          </Tooltip>);
        }

        }
      />
    )
  }


  if (isPending) { return Dlg(<LinearProgress />); }
  if (isError) {
    return Dlg(
      <Alert severity="error"> {error?.message || "An error occurred. Please try again"}</Alert>
    );
  }
  if (tagCategories.length == 0) { return Dlg(<AppH6Typography> No tags found </AppH6Typography>) }

  const con = (
    <Box component="section" >
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
                error={field.state.meta.errors.length > 0 || field.state.value == ""}
                helperText={field.state.meta.errors.length > 0 ? field.state.meta.errors.join(', ') : field.state.value == "" ? "filter name is required" : ""}
              />
            </Fragment>
          }
        />
        <VirtuosoGrid
          style={{ height: "40vh" }}
          totalCount={tagCategories.length}
          // @ts-ignore
          components={gridComponents}
          itemContent={(index) => eachItem(index)}
        />
      </Fragment >
    </Box>

  );

  const dummyAction = () => undefined;

  const canDelete = !formIsSubmitting && formStateId !== "";
  const saveIcon = formIsSubmitting ? <HourglassOutlineIcon height="1.5rem" /> :
    formCanSubmit ? <SaveIcon height="1.5rem" /> : <SaveOffIcon height="1.5rem" />
  const act = (
    <ItemFormSpeedDialBox>
      <SpeedDial ariaLabel="SpeedDial basic example"
        icon={<SpeedDialIcon />} >
        <SpeedDialAction
          key={"delete"}
          icon={canDelete ? <DeleteIcon height="1.5rem" /> : <DeleteOffIcon height="1.5rem" />}
          // @ts-ignore
          onClick={canDelete ? handleDelete : dummyAction}
          slotProps={{
            tooltip: { title: formCanSubmit ? "save" : "cannot save changes", },
          }}
        />

        <SpeedDialAction
          key={"save"}
          icon={saveIcon}
          // @ts-ignore
          onClick={formCanSubmit ? form.handleSubmit : dummyAction}
          slotProps={{
            tooltip: { title: formCanSubmit ? "save" : "cannot save changes", },
          }}
        />

        <SpeedDialAction
          key={formIsDirty ? "reset" : "No changes yet"}
          icon={formIsDirty ? <RestartIcon height="1.5rem" /> : <RestartOffIcon height="1.5rem" />}
          // @ts-ignore
          onClick={formIsDirty ? form.reset : dummyAction}
          slotProps={{
            tooltip: { title: formIsDirty ? "reset" : "no changes yet", },
          }}
        />
      </SpeedDial>
    </ItemFormSpeedDialBox>
  );

  if (formIsSubmitting) {
    // ToDo: Verify that this works
    return <Backdrop
      sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  }

  return Dlg(con, act);

}
