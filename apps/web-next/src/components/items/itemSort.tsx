import {
  useState,
} from 'react';
import {
  Box,
  InputLabel,
  MenuItem,
  Select,
  FormControl
} from '@mui/material';
import type {
  SelectChangeEvent
} from '@mui/material';



export function ItemSort() {
// Component for sorting each item
const [sorter, setSorter] = useState('');

const handleChange = (event: SelectChangeEvent) => {
  setSorter(event.target.value as string);
};

return (
  <Box sx={{ maxWidth: 300, width: 150 }}>
    <FormControl fullWidth size='small' sx={{p: 1}}>
      <InputLabel id="item-sort-select-label">Sort</InputLabel>
      <Select
          labelId="item-sort-select-label"
          id="item-sort-select"
          value={sorter}
          label="Sort"
          onChange={handleChange}>
        <MenuItem value={'date added'}>Date Added</MenuItem>
        <MenuItem value={'tag'}>Tag</MenuItem>
        <MenuItem value={'category'}>Category</MenuItem>
        <MenuItem value={'category'}>Summary</MenuItem>
      </Select>
    </FormControl>
  </Box>
);
}
