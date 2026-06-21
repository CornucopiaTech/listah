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
  IReadQuery,
} from "@/domain/entities";
import {
  DefaultReadRequest,
  DefaultReadQuery,
} from "@/domain/entities";
import { encodeState } from '@/utils/encoders';
import { AppSearchPaper } from '@/components/core/AppPaper';
import { useAppStore, type TAppStore } from '@/hooks/store/boundStore';



export function AppItemSearchBar(): ReactNode {
  const store: TAppStore = useAppStore((state) => state);
  const { user } = useUser();
  const navigate = useNavigate();
  const textValue = store.searchQuery ? store.searchQuery : "";
  const placeholderText = "Search for item";

  function handleSearchSubmit() {
    const q: IReadQuery = { ...DefaultReadQuery, userId: user?.id || "", text: textValue };
    const s = { ...DefaultReadRequest, query: q, title: `Items like '${textValue}'` }
    const encoded = encodeState(s);

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
          sx={{ maxWidth: "100%", width: "100%", p: "10px", height: "100%", justifyContent: "center", alignItems: "center" }} >
          <InputBase
            sx={{ ml: 1, flex: 1, width: "90%", }}
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
