import {
  Suspense,
  Fragment,
  useContext,
} from 'react';
import type {
  ReactNode,
} from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ListItem from '@mui/material/ListItem';
import { Virtuoso } from 'react-virtuoso';
import {
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query';


import { ItemSearchQueryContext } from '@/lib/context/itemSearchQueryContext';
import { categoryGroupOptions } from '@/lib/helper/querying';
import { useBoundStore } from '@/lib/store/boundStore';
import type {  IItemsSearch } from '@/lib/model/Items';
import Loading from '@/components/common/Loading';
import { ErrorAlerts } from '@/components/common/ErrorAlert';


export default function CategoryDrawer(): ReactNode {
  const store = useBoundStore((state) => state);
  const query: IItemsSearch = useContext(ItemSearchQueryContext);


  const listLeftPadding: number = 3;
  const textPaddingLeft: number = 2;
  const textPaddingBottom: number = 1;

  function handleCategoryCheck(e, categoryName: string) {
    e.stopPropagation();
    let newChecked: Set<string> = store.checkedCategory.union(new Set([categoryName]));

    if (store.checkedCategory.has(categoryName)) {
      // Remove category from filter
      newChecked.delete(categoryName)
    }
    store.setCheckedCategory(newChecked);
  }


  const {
    isPending, isError, data, error
  }: UseQueryResult<string[]> = useQuery(categoryGroupOptions(query.userId));


  if (isPending) { return <Loading />; }
  if (isError) { return <ErrorAlerts>Error: {error.message}</ErrorAlerts>; }


  const category = data.category ? data.category : [];


  return (
    <Suspense fallback={<Loading />}>
      <Fragment>
        <Typography variant="body" component="div" sx={{ flexGrow: 1, textAlign: 'left', pl: textPaddingLeft, pb: textPaddingBottom }}>
          Category
        </Typography>
        < Virtuoso
          style={{ height: '35vh' }}
          data={category}
          itemContent={(_, item) => (
            <ListItem key={item} disablePadding sx={{ pl: listLeftPadding }}>
              <FormControlLabel
                key={item + '-checkBoxFormControlLabel'}
                control={
                  <Checkbox
                    checked={
                      store.checkedCategory.has(item) ||
                      query.categoryFilter.indexOf(item) !== -1
                    }
                    onChange={(e) => handleCategoryCheck(e, item)}
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
};
