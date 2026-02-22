import type {
  ReactNode,
} from 'react';
import { Fragment } from 'react';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Stack from "@mui/material/Stack";
import {
  useNavigate,
} from '@tanstack/react-router';



import type {
  IItemRequest,
} from "@/lib/model/item";
import { useSearchQuery } from '@/lib/context/queryContext';
import { encodeState } from '@/lib/helper/encoders';



import { AppSearchPaper } from '@/components/core/AppPaper';
import { useBoundStore, type TBoundStore } from '@/lib/store/boundStore';


export function AppSearchBar(): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const query: IItemRequest = useSearchQuery();
  const navigate = useNavigate();
  const textValue = store.searchQuery ? store.searchQuery : "";
  const placeholderText = "Filter by keyword in title, description, or note";

  function handleSearchSubmit() {
    console.log("In handleItemclick - e ");
    const q: IItemRequest = {
      ...query, filter: [],
      pageNumber: 0, searchQuery: store.searchQuery,
    };
    const encoded = encodeState(q);
    console.info("In handlePageChange - q ", q);
    console.info("In handlePageChange - Encoded ", encoded);
    navigate({ to: "/items", search: { s: encoded }, });
  }

  return (
    <Fragment>
      <AppSearchPaper>
        <Stack direction="row" spacing={2}
          sx={{maxWidth: "100%", width: "100%", p: "1%"}} justifyContent="center" alignItems="center">
          <InputBase
            sx={{ ml: 1, flex: 1, width: "90%" }}
            placeholder={placeholderText}
            inputProps={{ 'aria-label': 'search google maps' }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.target.value != placeholderText) {
                store.setSearchQuery(event.target.value);
              }

            }}
            value={textValue}
          />
          <IconButton type="button" aria-label="search" onClick={handleSearchSubmit}>
            <SearchIcon />
          </IconButton>
        </Stack>
      </AppSearchPaper>
    </Fragment>
  );
}

