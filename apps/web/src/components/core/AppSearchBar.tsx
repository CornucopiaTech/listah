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
import { useUser } from '@clerk/react';


import type {
  IItemReadRequest,
} from "@/lib/model/item";
import { encodeState } from '@/lib/helper/encoders';
import { AppSearchPaper } from '@/components/core/AppPaper';
import { useBoundStore, type TBoundStore } from '@/lib/store/boundStore';
import { DefaultItemRead } from '@/lib/helper/defaults';




export function AppSearchBar(): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const { user } = useUser();
  const navigate = useNavigate();
  const textValue = store.searchQuery ? store.searchQuery : "";
  const placeholderText = "Filter by keyword in name, or tag";

  function handleSearchSubmit() {
    const q: IItemReadRequest = {
      ...DefaultItemRead,
      userId: user?.id || "",
      query: { ...DefaultItemRead.query, text: textValue },
    };
    const encoded = encodeState(q);
    navigate({ to: "/items/{-$title}", search: { s: encoded }, params: { title: `Items like '${textValue}'` } });
  }

  return (
    <Fragment>
      <AppSearchPaper>
        <Stack direction="row" spacing={2}
          sx={{ maxWidth: "100%", width: "100%", p: "1%" }} justifyContent="center" alignItems="center">
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


export function AppItemSearchBar(): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const { user } = useUser();
  const navigate = useNavigate();
  const textValue = store.searchQuery ? store.searchQuery : "";
  const placeholderText = "Filter by keyword in name, or tag";

  function handleSearchSubmit() {
    const q: IItemReadRequest = {
      ...DefaultItemRead,
      userId: user?.id || "",
      query: { ...DefaultItemRead.query, text: textValue },
    };
    const encoded = encodeState(q);
    navigate({ to: "/items", from: "/", search: { s: encoded }, });
    store.setItemTitle(`Items like '${textValue}'`);
    store.setItemReference(undefined);
    store.setDisplayFilter(undefined);
    store.setDisplayTag(undefined);
  }

  return (
    <Fragment>
      <AppSearchPaper>
        <Stack direction="row" spacing={2}
          sx={{ maxWidth: "100%", width: "100%", p: "1%", justifyContent: "center", alignItems: "center" }} >
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
