import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';


import TextFieldsLabelled from '@/components/Form/TextFieldsLabelled';



export function ItemCheckboxLabels() {
  return (
    <FormGroup>
      <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
      <FormControlLabel required control={<Checkbox />} label="Required" />
      <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
    </FormGroup>
  );
}


export default function ItemFilters(props) {
  return (
	<Box sx={props.style}>
		<Box 	component='form' sx={{p: 1, m: 1}}
				onSubmit={props.searchSubmit}>
			<TextFieldsLabelled
						key='Search-Items'
						status='editing'
						label='Search Field' size='normal'
						style={{width: '70%'}}/>
			<Button variant="outlined" size="small" type='submit'
					sx={{maxWidth: 100,}}>
						Search
			</Button>
		</Box>

		<Box sx={{maxWidth: 300, m: 1,}}>
			<ItemCheckboxLabels/>
		</Box>


		<Button variant="outlined" size="small"
				sx={{maxWidth: 100, ml: 3,}}
				onClick={props.handleReset}
			>
					Reset
		</Button>

	</Box>
  );
}
