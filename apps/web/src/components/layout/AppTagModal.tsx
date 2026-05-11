
import {
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
} from '@tanstack/react-query';
import {
  v4 as uuidv4,
} from 'uuid';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Icon } from "@iconify/react";
import { useUser } from '@clerk/react';
import { useTheme } from "@mui/material";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Box from '@mui/material/Box';



// Internal imports
import {
  AppSubtitle1Typography,

} from "@/components/core/Typography";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { DefaultTag } from '@/lib/helper/defaults';
// import { postTag } from "@/lib/helper/fetchers"; //ToDo: Create this postTag Function.
import { ErrorAlert, SuccessAlert, WarnAlert } from "@/components/core/Alerts";
import type { AppTheme } from '@/system/theme';
import type {
  ITag,
} from "@/lib/model/tag";
import { AppH6Typography } from "@/components/core/Typography";


type itemFields = "id" | "userId" | "name" | `props[${number}]`

export function AppTagModal(): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const { user } = useUser();
  const storeTag: undefined | ITag = useBoundStore((state) => state.displayTag);
  const formTag: ITag = storeTag ? storeTag : DefaultTag;


  const queryClient = useQueryClient();
  const theme: AppTheme = useTheme();
  const formData = {
    ...formTag
  }
  const form = useForm({
    defaultValues: formData,
    onSubmit: formSubmission,
    validators: {
      onChange({ value }: { value: ITag }) {
        if (value.name.length < 1) {
          return "Tag name is required";
        }
        if (value.props.length < 1) {
          return "A least one property is required";
        }
        return undefined
      },
      onBlur({ value }: { value: ITag }) {
        if (value.name.length < 1) {
          return "Tag name is required";
        }
        if (value.props.length < 1) {
          return "A least one property is required";
        }
        return undefined
      },
    },
  });

  // Define invalidating  mutation
  const mutation = useMutation({
    // mutationFn: (mutateTag: ITag) => {
    //   // return () => mutateTag
    //   // const mi = ZTag.parse(mutateTag);
    //   // return postTag(mi); //ToDo: Change mutation exec function
    // },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["item"] }),
        queryClient.invalidateQueries({ queryKey: ["tag"] }),
        queryClient.invalidateQueries({ queryKey: ["filter"] }),
      ])
    },
    onError: (error) => {
      // ToDo: Add error message
      if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
        console.log(error);
      }
    },
  });
  useEffect(() => {
    if (!form.state.isSubmitted) return;
    if (!mutation.isSuccess) return;

    const timer = setTimeout(
      () => {
        if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
          console.log("Timer fired after 2 seconds");
        }
        closeModal();
      }, 2000);
    return () => clearTimeout(timer); // cleanup
  }, [form.state.isSubmitted, mutation.isSuccess]);


  function closeModal() {
    store.setTagModal(false);
    store.setDisplayTag(undefined);
  }

  function onFormSubmit(e: ChangeEvent) {
    e.preventDefault()
    e.stopPropagation()
    //Note: form.handleSubmit is automatically called on form submit. it does not need to be called again. Calling it again results in the form getting sent multiple times.

    //Note:  Modal should not be closed after form submission so success or error feedback can be sent to the user.
  }

  function formSubmission({ value }: { value: ITag }) {
    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
      console.log("In formSubmission - value ", value);
    }
    const itemId = value.id && value.id != "" ? value.id : uuidv4();
    const userId = user && user.id ? user.id : value.userId;
    const submitValue = {
      ...value,
      userId,
      id: itemId,
      props: value.props?.filter((t) => t != ""),
    }
    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
      console.log("In formSubmission - submitValue ", submitValue);
    }
    // mutation.mutate(submitValue);

  }

  function getSimpleField(key: itemFields) {
    const sx = (key == "id" || key == "userId") ? { display: 'none' } : {}
    return (
      <form.Field
        key={`item-${key}`}
        name={key}
        children={
          (field) =>
            <Grid container sx={{ width: '100%' }} spacing={0}>
              <Grid size={12}>
                <TextField
                  sx={sx}
                  slotProps={{
                    input: { style: { fontSize: "15px" } },
                    inputLabel: { style: { fontSize: "15px" } },
                  }}
                  fullWidth
                  multiline
                  id={`item-${key}`}
                  key={`item-${key}`}
                  value={field.state.value}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  onChange={
                    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
                  size="small"
                  variant="standard"
                  // variant="outlined"
                  margin="dense"
                />
              </Grid>
            </Grid>
        }
      />
    );
  }

  function getPropField() {
    // ToDo: Use Virtualised list for this.
    return (
      <form.Field name="props" mode="array">
        {
          (field) => (
            <Fragment>
              <Box
                component="fieldset"
                sx={{
                  '& legend': { fontSize: '12px', color: 'rgba(0, 0, 0, 0.6)' },
                  border: `0.5px solid`,
                  borderColor: "rgba(0, 0, 0, 0.23)",
                  margin: 0, borderRadius: 1,
                  fontSize: '15px',
                  padding: '16.5px 14px', // Matches standard TextField padding
                  transition: 'border-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    // Standard MUI hover border color
                    borderColor: 'rgba(0, 0, 0, 0.87)',
                  },
                  '&:focus-within': {
                    // Matches the "active" blue focus state
                    border: '2px solid',
                    borderColor: 'primary.main',
                    // Adjust padding to prevent "jumping" when border thickness changes
                    padding: '15.5px 13px',
                  },
                }}>
                <legend style={{ padding: '0 0.5rem' }}>Properties</legend>
                <Button disableElevation sx={{ display: 'flex', justifyContent: "flex-start", alignContent: "center", }}
                  onClick={() => field.pushValue('')}
                  type="button">
                  <AppSubtitle1Typography sx={{ textTransform: "none", justifyContent: "center", alignContent: "center", fontSize: '15px', }}>
                    Click to add new property
                  </AppSubtitle1Typography>
                </Button>
                {
                  field.state.value &&
                  <Grid container spacing={3} sx={{ width: '100%' }}>{
                    field.state.value.map((_, i) => {
                      return <form.Field key={i} name={`props[${i}]`}>{
                        (subField) => {
                          return (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                              <TextField
                                slotProps={{
                                  input: { style: { fontSize: "15px" } },
                                  inputLabel: { style: { fontSize: "15px" } },
                                }}
                                id={"item-tag-" + i}
                                key={"item-tag-" + i}
                                value={subField.state.value}
                                label=""
                                onChange={
                                  (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => subField.handleChange(e.target.value)}
                                size="small"
                                variant="standard"
                                // variant="outlined"
                                margin="dense"
                              />
                            </Grid>
                          )
                        }
                      }</form.Field>
                    })
                  }</Grid>
                }
              </Box>
            </Fragment>
          )
        }
      </form.Field>
    );
  }


  function handleDelete() {
    // form.setFieldValue('softDelete', true); //ToDo Add soft delete as a feature of tags and filters.
    form.handleSubmit();
  }

  // function handleClone() {
  //   const title = form.state.values.name || "";
  //   form.setFieldValue('id', uuidv4());
  //   form.setFieldValue('name', "[Clone of] - " + title);
  // }

  const fields: itemFields[] = ['id', 'userId', 'name'];
  const dialogSx = {
    display: 'block',
    width: "lg",
    maxWidth: "lg",
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





  const deleteIcon = form.state.isSubmitting ? "ic:baseline-auto-delete" : (!form.state.canSubmit || form.state.values.id == "") ? "mdi:delete-off" : "ic:sharp-delete";
  const deleteTooltip = (!form.state.canSubmit || form.state.values.id == "") ? "Unable to delete" : "Delete";

  const saveIcon = form.state.isSubmitting ? "material-symbols:hourglass-top" : form.state.canSubmit ? "material-symbols:save-sharp" : "lucide:save-off";
  const saveTooltip = !form.state.canSubmit ? "Unable to save" : "Save";
  // const cloneIcon = form.state.values.id == "" ? "tabler:copy-off" : "material-symbols:content-copy-sharp";
  // const cloneTooltip = form.state.values.id == "" ? "Unable to clone" : "Clone";


  const formActions = [
    // { name: cloneTooltip, icon: cloneIcon, onClick: handleClone },
    { name: deleteTooltip, icon: deleteIcon, onClick: handleDelete },
    { name: saveTooltip, icon: saveIcon, onClick: form.handleSubmit },
    { name: "Reset", icon: "material-symbols-light:restart-alt", onClick: form.reset },
  ]
  const formErrorMap = useStore(form.store, (state) => state.errorMap)


  function Dlg(content: ReactNode, actions?: ReactNode): ReactNode {
    return (
      <Dialog fullWidth maxWidth="lg" open={store.tagModal} onClose={closeModal} >
        <IconButton aria-label="delete"
          sx={{
            display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
          }}
          onClick={closeModal}>
          <Icon icon="material-symbols-light:close-rounded" width="40" height="40" />
        </IconButton>
        <form onSubmit={onFormSubmit}>
          <DialogContent sx={dialogSx} >
            {content}
          </DialogContent>
          {actions &&
            <DialogActions>
              {actions}
            </DialogActions>}
        </form>
      </Dialog>
    )
  }


  const formTitle = storeTag ? "Update tag" : "Add new tag";
  const con = (
    <Box
      component="section"
      sx={{
        marginTop: { xs: '0rem', sm: '1rem', md: '1rem' },
        marginRight: "4rem",
        fontSize: '15px',
        padding: { xs: '0rem', sm: '1rem', md: '1rem' },
      }}>
      <Stack spacing={1} sx={{ width: '100%' }} >
        {mutation.error && (
          <Fragment>
            <ErrorAlert message={mutation.error.message} />
            <h5 onClick={() => mutation.reset()}>{mutation.error.message}</h5>
          </Fragment>
        )}
        {mutation.isSuccess && (
          <Fragment>
            <SuccessAlert message="Tag updated!" />
          </Fragment>
        )}
        {
          formErrorMap.onChange && (<WarnAlert message={`${formErrorMap.onChange}`} />)
        }
        {
          formErrorMap.onBlur && (<ErrorAlert message={`${formErrorMap.onBlur}`} />)
        }
        <AppH6Typography> {formTitle} </AppH6Typography>
        {fields.map((fds: itemFields) => getSimpleField(fds))}

        {/* ToDo: fix display for tags and fields. */}
        {getPropField()}
      </Stack>
    </Box>
  )

  const act = (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting, state.values.name]}
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
  )
  return Dlg(con, act);
}
