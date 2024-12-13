import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';




export default function SortItems() {
	// Component for sorting each item
	const [sorter, setSorter] = React.useState('');

	const handleChange = (event: SelectChangeEvent) => {
		setSorter(event.target.value as string);
	};

	// console.log(`Value of sorter: ${sorter}`);

	return (
		<Box sx={{ maxWidth: 300, width: 150 }}>
			<FormControl fullWidth size='small' sx={{p: 1}}>
				<InputLabel id="item-sort-select-label">Sort</InputLabel>
				<Select
						labelId="item-sort-select-label"
						id="item-sort-select"
						value={sorter}
						label="Sort"
						onChange={handleChange}
					>
					<MenuItem value={'date added'}>Date Added</MenuItem>
					<MenuItem value={'tag'}>Tag</MenuItem>
					<MenuItem value={'category'}>Category</MenuItem>
				</Select>
			</FormControl>
		</Box>

	);
}
