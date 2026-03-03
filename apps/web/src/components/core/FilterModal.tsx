
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
import { useUser } from '@clerk/clerk-react';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from "@mui/material";
import {
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
import { VirtuosoGrid } from 'react-virtuoso'
import Chip from '@mui/material/Chip';
import DoneIcon from '@mui/icons-material/Done';



// Internal imports
import { AppResetButton } from "@/components/core/AppButton";
import {
  SpaceBetweenBox,
} from "@/components/core/Box";
import { AppH6ButtonTypography, AppBody1ButtonTypography } from "@/components/core/ButtonTypography";
import { AppBody1Typography } from "@/components/core/Typography";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { DEFAULT_ITEM } from '@/lib/helper/defaults';
import {
  ZItem
} from "@/lib/model/item";
import { postItem } from "@/lib/helper/fetchers";
import {  } from '@/lib/context/queryContext';
import type {
  IItem,
  IItemReadRequest,
} from "@/lib/model/item";
import { ErrorAlert, SuccessAlert } from "@/components/core/Alerts";
import type { AppTheme } from '@/system/theme';
import { DefaultHomeQueryParams } from '@/lib/helper/defaults';
import type {
  THomeQueryParams
} from '@/lib/model/home';
import type {
  ITagCategory,
  ITagCategoryReadResponse,
} from "@/lib/model/tag";
import {
  ZTagCategoryReadResponse,
} from "@/lib/model/tag";
import { tagGroupOptions } from '@/lib/helper/querying';
import { id } from "zod/v4/locales";





export function AppFilterModal(): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const queryClient = useQueryClient();
  const { user } = useUser();
  const theme: AppTheme = useTheme();

  const query: THomeQueryParams = {
    savedFilter: {
      ...DefaultHomeQueryParams.savedFilter,
      userId: user.id,
      pageSize: -1,
    },
    tag: {
      ...DefaultHomeQueryParams.tag,
      userId: user.id,
      pageSize: -1,
    }
  }

  const {
    isPending, isError, data, error
  }: UseQueryResult<ITagCategoryReadResponse> = useQuery(tagGroupOptions(query.tag));


  // Define invalidating  mutation
  const mutation = useMutation({
    mutationFn: (mutateItem: IItem) => {
      const mi = ZItem.parse(mutateItem);
      return postItem(mi);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["item", query] }),
        queryClient.invalidateQueries({ queryKey: ["tag", query] }),
        queryClient.invalidateQueries({ queryKey: ["savedFilter", query] }),
        queryClient.invalidateQueries({ queryKey: ["category", query] }),
      ])
    },
    onError: (error) => {
      console.log(error);
      store.setMessage(error.message);
    },
  });


  function closeModal() {
    store.setFilterModal(false);
    store.setDisplayId("");
    store.setDisplayItem(DEFAULT_ITEM);
  }
  function onFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    //Note: form.handleSubmit is automatically called on form submit. it does not need to be called again. Calling it again results in the form getting sent multiple times.

    //Note:  Modal should not be closed after form submission so success or error feedback can be sent to the user.
  }

  function formSubmission({ value }: { value: IItem }) {
    console.info("In formSubmission - value ", value);

    let checkedCategories: string[] = [];

    Object.keys(value).forEach(key => {
      const val = value[key];
      console.log(key, val);
      if (val && key !== "___filterName") {
        checkedCategories.push(key);
      }
    });

    const submitValue = {
    id: uuidv4(),
    userId: user.id,
      name: value["___filterName"],
      tags: checkedCategories,
    }
    console.info("In formSubmission - submitvalue ", submitValue);
    // mutation.mutate(submitValue);
  }


  const gridComponents = {
    List: forwardRef(({ style, children, ...props }, ref) => (
      <div
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
    Item: ({ children, ...props }) => (
      <div
        {...props}
        style={{
          padding: '2%',
          width: 'fit-content',
          display: 'flex',
          flex: 'wrap',
          // alignContent: 'stretch',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    ),
  }

  function eachItem(item: ITagCategory): ReactNode {
    const tc: string = item && item.category ? item.category : ""
    return (
      <form.Field
        key={`item-${tc}`}
        name={tc}
        children={
          (field) =>
          <Chip
            color="primary"
            icon={field.state.value && <DoneIcon />}
            sx={{ color: theme.palette.background.default, cursor: "pointer" }}
            label={<AppBody1ButtonTypography>#{tc}</AppBody1ButtonTypography>}
            onClick={() => {
              console.log("In onClick - field ",tc, field.state.value)
              field.handleChange(!field.state.value)
            }
          }
          />
        }
      />

    )
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
  const categories: ITagCategory[] = data && data.categories ? data.categories : [];

  console.info("In AppFilterModal - categories ", categories);

  // Define object for form default values based on categories. Each category is a boolean field in the form that indicates whether the category is selected or not. The field name is the category name. For example, if there are categories "Work" and "Personal", the form will have fields "Work" and "Personal" that are boolean values indicating whether each category is selected or not. Additionally, there is a field for the filter name called "___filterName". This field is used to capture the name of the filter being created or edited. It is separate from the category fields and is used to identify the filter.
  const defaultFormObject = categories.reduce((obj, item, index) => {
    obj[item.category] = false;
    return obj;
  }, {});


  console.log('obj', defaultFormObject);

  const form = useForm({
    defaultValues: defaultFormObject,
    onSubmit: formSubmission,
  });

  return (
    <Dialog fullWidth open={store.filterModal} onClose={closeModal} >
      <IconButton aria-label="delete"
        sx={{
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
        }}
        onClick={closeModal}>
        <Icon icon="material-symbols-light:close-rounded" width="40" height="40" />
      </IconButton>

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

      <form onSubmit={onFormSubmit}>
        <DialogContent sx={dialogSx} >
          {
            categories && categories.length > 0 &&
            <Fragment>
              <form.Field
                key={`Filter Name`}
                name={`___filterName`}
                children={
                  (field) =>
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
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="clear content">
                              <Icon
                                icon="material-symbols-light:cancel-outline"
                                width="24" height="24"
                                onClick={() => field.handleChange("")}
                              />
                            </Tooltip>
                          </InputAdornment>),
                      },
                    }}
                  />
                }
              />
              <VirtuosoGrid
                style={{ height: "65vh" }}
                totalCount={categories.length}
                components={gridComponents}
                itemContent={
                  (index) => eachItem(categories[index])
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
