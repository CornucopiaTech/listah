
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
import { useTheme } from "@mui/material";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from "@mui/material/Divider";
import { Icon } from "@iconify/react";
import { useUser } from '@clerk/react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import RestartIcon from '@iconify-react/mdi/restart';
import RestartOffIcon from '@iconify-react/mdi/restart-off';
import SaveIcon from '@iconify-react/material-symbols/save';
import SaveOffIcon from '@iconify-react/lucide/save-off';
import DeleteIcon from '@iconify-react/mdi/delete';
import DeleteOffIcon from '@iconify-react/mdi/delete-off';
import HourglassOutlineIcon from '@iconify-react/material-symbols/hourglass-outline';




// Internal imports
import type { AppTheme } from '@/system/theme';
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { DefaultTag } from '@/lib/helper/defaults';
import { postTag } from "@/lib/helper/fetchers"; //ToDo: Create this postTag Function.
import type {
  ITag,
} from "@/lib/model/tag";
import {
  ZTag,
} from "@/lib/model/tag";
import {
  ItemFormTagBox,
  ItemFormSpeedDialBox,
} from "@/components/core/AppBox";
import {
  AppModalCloseButton,
} from "@/components/core/AppButton";




type itemFields = "id" | "userId" | "name" | `props[${number}]`

export function AppTagModal({ itemTag }: { itemTag?: ITag }): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const theme: AppTheme = useTheme();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const formTag: ITag = itemTag ? itemTag : DefaultTag;



  function validateName(fname: string) {
    if (fname.length < 1) {
      return "tag name is required";
    }
  }

  function validateProp(value: string) {
    if (value.length < 1) {
      return "property name is required";
    }
  }

  function validateProps(value: Array<string>) {
    if (value.filter(i => i !== "").length < 1) {
      return "At least one property is required";
    }
  }

  function formValidator({ value }: { value: ITag }) {
    const invalidName = validateName(value.name as string);
    if (invalidName) {
      return invalidName;
    }

    const invalidProps = validateProps(value.props);
    if (invalidProps) {
      return invalidProps
    }
    return undefined;
  }

  function handleDelete() {
    form.setFieldValue('softDelete', true);
    form.handleSubmit();
  }

  const formData = { ...formTag }
  const form = useForm({
    defaultValues: formData,
    onSubmit: formSubmission,
    validators: {
      onChange({ value }: { value: ITag }) {
        return formValidator({ value });
      },
      onBlur({ value }: { value: ITag }) {
        return formValidator({ value });
      },
    },
  });
  const formErrorMap = useStore(form.store, (state) => state.errorMap);
  const formErrors = useStore(form.store, (state) => state.errors);
  const formCanSubmit = formErrors.length == 0;
  const formIsSubmitting = useStore(form.store, (state) => state.isSubmitting);
  const formIsDirty = useStore(form.store, (state) => state.isDirty);
  const formStateId = useStore(form.store, (state) => state.values.id);


  // Define invalidating  mutation
  const mutation = useMutation({
    mutationFn: (mutateTag: ITag) => {
      const mi = ZTag.parse(mutateTag);
      return postTag(mi);
    },
    onSuccess: async () => {
      // ToDo: Use mutation to update the cache so stale tag is not shown.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["tag"], refetchType: 'all', }),
        queryClient.invalidateQueries({ queryKey: ["item"], refetchType: 'all', }),
      ])
      // router.push()
    },
    onError: (error) => {
      // ToDo: Add error message
      if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
        console.log(error);
      }
    },
  });

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
    // }, [form.state.isSubmitted, mutation.isSuccess]);
  }, [mutation.isSuccess]);

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
      userId,
      id: itemId,
      name: value.name,
      props: value.props?.filter((t) => t != ""),
      softDelete: value?.softDelete,
      count: undefined,
    }
    if (window.runtimeConfig && window.runtimeConfig.debug && window.runtimeConfig.debug == "true") {
      console.log("In formSubmission - submitValue ", submitValue);
    }
    mutation.mutate(submitValue);

  }

  function getSimpleField(key: itemFields) {
    return (
      <form.Field
        key={`item-${key}`}
        name={key}
        validators={{
          onChange: ({ value }) => {
            if (key == "name") {
              return validateName(value as unknown as string)
            }
          },
          onBlur: ({ value }) => {
            if (key == "name") {
              return validateName(value as unknown as string)
            }
          },
        }}
        children={
          (field) =>
            <Grid container sx={{ width: '100%' }} spacing={0}>
              <Grid size={12}>
                <TextField
                  slotProps={{
                    input: { style: { fontSize: "15px" } },
                    inputLabel: { style: { fontSize: "15px" } },
                  }}
                  fullWidth
                  multiline
                  id={`item-${key}`}
                  key={`item-${key}`}
                  value={field.state.value}
                  label={key}
                  onChange={
                    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
                  size="small"
                  variant="standard"
                  margin="dense"
                  error={field.state.meta.errors.length > 0 || field.state.value == ""}
                  helperText={field.state.meta.errors.length > 0 ? field.state.meta.errors.join(', ') : field.state.value == "" ? "tag name is required" : ""}
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
      <form.Field name="props" mode="array"
      // validators={{
      //   onChange: ({ value }) => validateProps(value as unknown as Array<string>),
      //   onBlur: ({ value }) => validateProps(value as unknown as Array<string>),
      // }}
      >
        {
          (field) => (
            <Fragment>
              {/* @ts-ignore */}
              <ItemFormTagBox key="props" component="fieldset">
                <legend style={{ padding: '0 0.5rem', color: theme.palette.primary.main, fontSize: "12px" }}>properties</legend>
                <Button variant="text" color="inherit" onClick={() => field.pushValue("")} >
                  Click here to add a new property
                </Button>
                {
                  field.state.value && field.state.value.length > 0 &&
                  <Grid container spacing={3} sx={{ width: '100%' }}>{
                    field.state.value.map((_, i) => {
                      return <form.Field key={i} name={`props[${i}]`}
                        validators={{
                          onChange: ({ value }) => validateProp(value as unknown as string),
                          onBlur: ({ value }) => validateProp(value as unknown as string),
                        }}>
                        {
                          (subField) => {
                            return (
                              <Grid
                                key={i} //Using the tag id as the key causes the form to lose focus when adding new tags to the form, especially when the form length is longer than the maximum allowed length of the dialog.
                                size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextField
                                  slotProps={{
                                    input: { style: { fontSize: "15px" } },
                                    inputLabel: { style: { fontSize: "15px" } },
                                  }}
                                  id={"item-tag-" + i}
                                  value={subField.state.value}
                                  label=""
                                  onChange={
                                    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => subField.handleChange(e.target.value)}
                                  size="small"
                                  variant="standard"
                                  margin="dense"
                                  error={subField.state.meta.errors.length > 0 || subField.state.value == ""}
                                  helperText={subField.state.meta.errors.length > 0 ? subField.state.meta.errors.join(', ') : subField.state.value == "" ? "property name is required" : ""}
                                />
                              </Grid>
                            )
                          }
                        }
                      </form.Field>
                    })
                  }</Grid>
                }
              </ItemFormTagBox>
            </Fragment>
          )
        }
      </form.Field>
    );
  }

  // ToDo: successful mutation returns an error about Response.json: Body has already been consumed.
  const fields: itemFields[] = ['name'];

  function Dlg(content: ReactNode, actions?: ReactNode): ReactNode {
    return (
      <Dialog fullWidth maxWidth="lg" open={store.tagModal} onClose={closeModal} >
        <DialogTitle id="save-dialog-title" >
          {formTag.id == "" ? "Add new tag" : "Update tag"}
          <AppModalCloseButton aria-label="close dialog"
            size="small" onClick={closeModal}>
            <Icon icon="material-symbols-light:close-rounded" width="30" height="30" />
          </AppModalCloseButton>
        </DialogTitle>
        <Divider />
        {mutation.isSuccess && <Alert severity="success"> {"Changes saved!"} </Alert>}
        {mutation.error && <Alert severity="error"> {mutation.error.message}</Alert>
        }
        {formErrorMap.onChange && <Alert severity="warning"> {`${formErrorMap.onChange}`} </Alert>}
        <Divider />
        <form onSubmit={onFormSubmit}>
          <DialogContent > {content} </DialogContent>
          <Divider />
          {actions && <DialogActions> {actions} </DialogActions>}
        </form>
      </Dialog>
    )
  }


  const con = (
    <Box component="section" >
      <Stack spacing={0} sx={{ width: '100%' }} >
        {fields.map((fds: itemFields) => getSimpleField(fds))}
        {getPropField()}
      </Stack>
    </Box>
  )

  const dummyAction = () => undefined;

  // ToDo: Add way to delete a property after adding it.

  // Return something when form is submitting

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

  return Dlg(con, act);
}
