
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





export function AppFilterModal(): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const item: IItem = useBoundStore((state) => state.displayItem);
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

  const form = useForm({
    defaultValues: item,
    onSubmit: formSubmission,
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

  function handleItemClick(it: ITagCategory) {
  }

  function eachItem(itemKey: number, item: ITagCategory): ReactNode {
    const tc: string = item && item.category ? item.category : ""
    return (
      <Chip
        color="primary"
        sx={{ color: theme.palette.background.default, cursor: "pointer" }}
        label={<AppBody1ButtonTypography>#{tc}</AppBody1ButtonTypography>}
        onClick={() => handleItemClick(item)}
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
            categories && categories.length > 0 && <VirtuosoGrid
              style={{ height: "65vh" }}
              totalCount={categories.length}
              components={gridComponents}
              itemContent={(index) => eachItem(index, categories[index])}
            />
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
