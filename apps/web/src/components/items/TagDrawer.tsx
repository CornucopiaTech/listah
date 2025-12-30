
import {
  Suspense,
  Fragment,
  useContext,
  type ReactNode,
} from 'react';
import {
  useQuery,
  useSuspenseQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  Typography,
  FormControlLabel,
  Checkbox,
  ListItem,
} from '@mui/material';
import { Virtuoso } from 'react-virtuoso';



import { useBoundStore } from '@/lib/store/boundStore';
import type { IItemsSearch } from '@/lib/model/ItemsModel';
import Loading from '@/components/common/Loading';
import { ErrorAlerts } from '@/components/common/ErrorAlert';
import { ItemSearchQueryContext } from '@/lib/context/itemSearchQueryContext';
import { tagGroupOptions } from '@/lib/utils/querying';



export default function TagDrawer(): ReactNode {
  const store = useBoundStore((state) => state);
  const query: IItemsSearch = useContext(ItemSearchQueryContext);


  const listLeftPadding: number = 3;
  const textPaddingLeft: number = 2;
  const textPaddingBottom: number = 1;

  function handleTagCheck(e, tagName: string) {
    e.stopPropagation();
    let newChecked: Set<string> = store.checkedTag.union(new Set([tagName]))
    if (store.checkedTag.has(tagName)) {
      newChecked.delete(tagName)
    }
    store.setCheckedTag(newChecked);
  }
  console.info("In TagDrawer", query);


  // const {
  //   isPending, isError, data, error
  // }: UseQueryResult<string[]> = useSuspenseQuery(tagGroupOptions(query.userId));

  const {
    isPending, isError, data, error
  }: UseQueryResult<string[]> = useQuery(tagGroupOptions(query.userId));


  // if (isPending) { return <Loading />; }
  // if (isError) {return <ErrorAlerts>Error: {error.message}</ErrorAlerts>;}


  const tag = data.tag ? data.tag : [];


  return (
    <Suspense fallback={<Loading />}>
      <Fragment>
        <Typography
          variant="body" component="div"
          sx={{ flexGrow: 1, textAlign: 'left', pl: textPaddingLeft, pb: textPaddingBottom }}>
          Tag
        </Typography>
        < Virtuoso
          style={{ height: '35vh' }}
          data={tag}
          itemContent={(_, item) => (
            <ListItem key={item} disablePadding sx={{ pl: listLeftPadding }}>
              <FormControlLabel
                key={item + '-checkBoxFormControlLabel'}
                control={
                  <Checkbox
                    checked={
                      store.checkedTag.has(item) ||
                      query.tagFilter.indexOf(item) !== -1
                    }
                    // checked={query.tagFilter.indexOf(item) !== -1}
                    onChange={(e) => handleTagCheck(e, item)}
                  />
                }
                label={item}
                name={item}
              />
            </ListItem>
          )}
        />
      </Fragment>
    </Suspense>

  );
}
