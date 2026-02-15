import type { ReactNode } from 'react';
import { Fragment } from 'react';

import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';


// import type { AppTheme } from '@/system/theme';
import { useBoundStore, type TBoundStore } from '@/lib/store/boundStore';


export function AppSearchBar(): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const textValue = store.searchQuery ? store.searchQuery : "";
  const placeholderText = "Filter by keyword in title, description, or note";

  return (
    <Fragment>
      <Paper
        sx={{
          p: '2px 4px', display: 'flex',
          alignItems: 'center',
          // width: "75vw", margin: "2vh auto",
          width: "100%", margin: 0,
          borderRadius: 8
        }}>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={placeholderText}
          inputProps={{ 'aria-label': 'search google maps' }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.value != placeholderText) {
              store.setSearchQuery(event.target.value);
            }

          }}
          value={textValue}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      <Paper
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          // width: "75vw", margin: "2vh auto",
          width: "100%", //margin: 0,
          borderRadius: 8
        }}>
        <TextField
          fullWidth
          multiline
          label=""
          variant="standard"
          id="outlined-size-small"
          size="small"
          value={textValue}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            store.setSearchQuery(event.target.value);
          }}
          // sx={{border: "none", width: "100%", textDecoration: "none"}}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
    </Fragment>
  );
}
