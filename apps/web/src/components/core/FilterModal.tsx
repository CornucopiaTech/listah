
import {
  forwardRef,
  Fragment,
} from "react";
import type {
  ChangeEvent,
  ReactNode,
  FormEvent,
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
import { useUser } from '@clerk/clerk-react';
import { useTheme } from "@mui/material";
import { VirtuosoGrid } from 'react-virtuoso'
import Chip from '@mui/material/Chip';
import DoneIcon from '@mui/icons-material/Done';
import LinearProgress from '@mui/material/LinearProgress';




// Internal imports
import { AppResetButton } from "@/components/core/AppButton";
import {
  SpaceBetweenBox,
} from "@/components/core/Box";
import { AppH6ButtonTypography, AppBody1ButtonTypography } from "@/components/core/ButtonTypography";
import { AppTitleTypography, AppH6Typography } from "@/components/core/Typography";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { postSavedFilter } from "@/lib/helper/fetchers";
import { ErrorAlert, WarnAlert, SuccessAlert } from "@/components/core/Alerts";
import type { AppTheme } from '@/system/theme';
import { DefaultHomeQueryParams } from '@/lib/helper/defaults';
import type {
  THomeQueryParams
} from '@/lib/model/home';
import type {
  ITagCategory,
  ITagCategoryReadResponse,
} from "@/lib/model/tag";
import {  tagGroupOptions } from '@/lib/helper/querying';
import type { ISavedFilter, } from "@/lib/model/savedFilter";
import  { ZSavedFilter } from "@/lib/model/savedFilter";



export function AppFilterModal(): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const queryClient = useQueryClient();
  const { user } = useUser();
  const theme: AppTheme = useTheme();

  const query: THomeQueryParams = {
    savedFilter: {
      ...DefaultHomeQueryParams.savedFilter, userId: user?.id || "", pageSize: -1,
    },
    tag: {
      ...DefaultHomeQueryParams.tag, userId: user?.id || "", pageSize: -1,
    }
  }

  const {
    isPending, isError, data, error
  }: UseQueryResult<ITagCategoryReadResponse> = useQuery(tagGroupOptions(query.tag));


  // Define invalidating  mutation
  const mutation = useMutation({
    mutationFn: (mutateItem: ISavedFilter) => {
      const mi = ZSavedFilter.parse(mutateItem);
      return postSavedFilter(mi);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["savedFilter", query.savedFilter] }),
      ])
    },
    onError: (error) => {
      console.log(error);
      store.setMessage(error.message);
    },
  });


  function closeModal() {
    store.setFilterModal(false);
  }
  function onFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    //Note: form.handleSubmit is automatically called on form submit. it does not need to be called again. Calling it again results in the form getting sent multiple times.

    //Note:  Modal should not be closed after form submission so success or error feedback can be sent to the user.
  }

  type FormObjectType = {
    [key: string]: string | boolean;
  };

  function formSubmission({ value }: {value: FormObjectType}): void {
    console.info("In formSubmission - value ", value);
    let checkedCategories: string[] = [];

    Object.keys(value).forEach(key => {
      if (key !== "___filterName" && value[key]) {
        checkedCategories.push(key);
      }
    });

    const submitValue = {
      id: uuidv4(),
      userId: user?.id || "",
      name: value["___filterName"] as string,
      tags: checkedCategories,
      savedFilters: [],
    }
    console.info("In formSubmission - submitvalue ", submitValue);
    mutation.mutate(submitValue);
  }


  const gridComponents = {
    List: forwardRef(({ style, children, ...props }: { style: any, children: ReactNode, props: any}, ref: any) => (
      <div ref={ref} {...props}
          style={{display: 'flex', flexWrap: 'wrap', ...style,}}>
        {children}
      </div>
    )),
    Item: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
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
    height: '70vh',
    maxHeight: 720,
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
  const tagCategories: ITagCategory[] = data && data.categories ? data.categories : [];



  // Define object for form default values based on tagCategories. Each category is a boolean field in the form that indicates whether the category is selected or not. The field name is the category name. For example, if there are tagCategories "Work" and "Personal", the form will have fields "Work" and "Personal" that are boolean values indicating whether each category is selected or not. Additionally, there is a field for the filter name called "___filterName". This field is used to capture the name of the filter being created or edited. It is separate from the category fields and is used to identify the filter.
  let defaultFormData: any = {
    "___filterName": ""
  }
  defaultFormData = tagCategories.reduce((acc: any, item: ITagCategory) => {
    acc[item.category] = false;
    return acc;
  }, defaultFormData);


  const formData: any[] = [...tagCategories];

  console.info("defaultFormData ", defaultFormData);
  console.info("formData ", formData);

  function eachItem(idx: number): ReactNode {
    const chipLabel = formData[idx] && formData[idx].category ? formData[idx].category : "";
    return (
      <form.Field key={`item-${chipLabel}`} name={chipLabel} children={
        (field) =>
          <Chip
            color="primary"
            // @ts-ignore
            icon={field.state.value && <DoneIcon />}
            sx={{ color: theme.palette.background.default, cursor: "pointer" }}
            label={<AppBody1ButtonTypography>#{chipLabel}</AppBody1ButtonTypography>}
            onClick={() => {
              console.log(`${chipLabel} onClick: ${field.state.value}=>${!field.state.value}`);
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
      // Add validators to the form the same way you would add them to a field
      onChange({ value }: { value: FormObjectType }) {
        const fname = value["___filterName"] as string;
        if (fname.length < 1) {
          return "You must enter a filter name";
        }

        let checked: string[] = [];
        Object.keys(value).forEach(key => {
          const val = value[key];
          if (val && key !== "___filterName") {
            checked.push(key);
          }
        });

        if (checked.length < 1) {
          return "You must select at least one tag category";
        }
        return undefined
      },
      onBlur({ value }: { value: FormObjectType }) {
        const fname = value["___filterName"] as string;
        if (fname.length < 1) {
          return "You must enter a filter name";
        }

        let checked: string[] = [];
        Object.keys(value).forEach(key => {
          const val = value[key];
          if (val && key !== "___filterName") {
            checked.push(key);
          }
        });

        if (checked.length < 1) {
          return "You must select at least one tag category";
        }
        return undefined
      },
    },
  });

  const formErrorMap = useStore(form.store, (state) => state.errorMap)

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
          {isPending &&<LinearProgress />}
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
              <SuccessAlert message="Item updated!" />
            </Fragment>
          )}
          {
            formErrorMap.onChange && (<WarnAlert message={`${formErrorMap.onChange}`} />)
          }
          {
            formErrorMap.onBlur && (<ErrorAlert message={`${formErrorMap.onBlur}`} />)
          }
          <AppTitleTypography> Add a new filter </AppTitleTypography>
          {
            tagCategories && tagCategories.length > 0 &&
            <Fragment>
              <form.Field
                key={`Filter Name`}
                name={`___filterName`}
                validators={{
                  onBlur: ({ value }: {value: any}) =>
                    value.length < 1 ? 'You must enter a filter name' : undefined,
                }}

                children={
                  (field) =>
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
                style={{ height: "70vh", width: '100%' }}
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
            children={([canSubmit, isSubmitting]) => (
              <SpaceBetweenBox sx={{}}>
                <AppResetButton
                  type="submit"
                  variant="contained"
                  disabled={!canSubmit}
                  onClick={form.handleSubmit}
                >
                  <AppH6ButtonTypography>
                    {isSubmitting ? '...' : 'Submit'}
                  </AppH6ButtonTypography>
                </AppResetButton>

                <AppResetButton
                  type="reset"
                  variant="contained"
                  onClick={(e) => {
                    e.preventDefault()
                    form.reset()
                  }}
                >
                  <AppH6ButtonTypography>Reset</AppH6ButtonTypography>
                </AppResetButton>
              </SpaceBetweenBox>
            )}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
}
