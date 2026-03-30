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
  getRouteApi,
} from '@tanstack/react-router';
import { useUser } from '@clerk/react';


import type {
  IItemReadRequest,
} from "@/lib/model/item";

import type {
  ITagReadRequest,
} from "@/lib/model/tag";

import type {
  IFilterReadRequest,
} from "@/lib/model/filter";
import { encodeState } from '@/lib/helper/encoders';
import { AppSearchPaper } from '@/components/core/AppPaper';
import { useBoundStore, type TBoundStore } from '@/lib/store/boundStore';
import { decodeState } from "@/lib/helper/encoders";
import {
  DefaultItemRead,
  DefaultTagRead,
  DefaultFilterRead,
} from '@/lib/helper/defaults';


// export function ItemSearchBar({ route }: { route: "/tags" | "/filters" | "/items/{-$title}" }): ReactNode {
export function ItemSearchBar(): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const { user } = useUser();
  const routeApi = getRouteApi("/items/{-$title}");
  const routeSearch: { s: string } = routeApi.useSearch()
  let search: IItemReadRequest = decodeState(routeSearch.s) as IItemReadRequest;
  const query: IItemReadRequest = { ...search, userId: user?.id || "" };
  const navigate = useNavigate();
  const textValue = store.searchQuery ? store.searchQuery : "";
  const placeholderText = "Filter by keyword in name, or tag";

  function handleSearchSubmit() {
    const q: IItemReadRequest = {
      ...DefaultItemRead,
      userId: query.userId,
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

export function TagSearchBar(): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const { user } = useUser();
  const navigate = useNavigate();
  const textValue = store.searchQuery ? store.searchQuery : "";
  const placeholderText = "Filter by keyword in name, or tag";

  function handleSearchSubmit() {
    const q: ITagReadRequest = {
      ...DefaultTagRead,
      userId: user?.id || "",
      query: { ...DefaultTagRead.query, text: textValue },
    };
    const encoded = encodeState(q);
    navigate({ to: ".", search: { s: encoded }, params: { title: textValue } });
    // navigate({ to: ".", search: { s: encoded }, params: { title: `Tags like '${textValue}'` } });
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

export function FilterSearchBar(): ReactNode {
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
    navigate({ to: ".", search: { s: encoded }, params: { title: textValue } });
    //  navigate({ to: "/items/{-$title}", search: { s: encoded }, params: { title: `Items like '${textValue}'` } });
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
