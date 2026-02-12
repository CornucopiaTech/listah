
import {
  useContext,
  Fragment,
} from 'react';
import type {
  ReactNode,
  ChangeEvent,
  // MouseEvent,
} from 'react';
import {
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
import Typography  from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox  from '@mui/material/Checkbox';
import ListItem  from '@mui/material/ListItem';
import { Virtuoso } from 'react-virtuoso';



import { useBoundStore, type  TBoundStore } from '@/lib/store/boundStore';
import type { IItemsSearch } from '@/lib/model/Items';
import Loading from '@/components/common/Loading';
import { Error } from '@/components/common/Error';
import { ItemSearchQueryContext } from '@/lib/context/itemSearchQueryContext';
import { tagGroupOptions } from '@/lib/helper/querying';
import type { ITagResponse } from "@/lib/model/tags";


export default function TagDrawer(): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const query: IItemsSearch = useContext(ItemSearchQueryContext);


  const listLeftPadding: number = 3;
  const textPaddingLeft: number = 2;
  const textPaddingBottom: number = 1;

  function handleTagCheck(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, tagName: string) {
    e.stopPropagation();
    const newChecked: Set<string> = store.checkedTag.union(new Set([tagName]))
    if (store.checkedTag.has(tagName)) {
      newChecked.delete(tagName)
    }
    store.setCheckedTag(newChecked);
  }

  const uId = query && query.userId ? query.userId : "";

  const {
    isPending,
    isError,
    data,
    error
  }: UseQueryResult<ITagResponse> = useQuery(tagGroupOptions(uId));


  if (isPending) { return <Loading />; }
  if (isError) {return <Error message={error.message} />;}


  const tag = data.tag ? data.tag : [];

  const typoSx = { flexGrow: 1, textAlign: 'left', pl: textPaddingLeft, pb: textPaddingBottom }


  return (
    <Fragment>
      <Typography variant="body1" component="div" sx={typoSx}> Tag </Typography>
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
  );
}
