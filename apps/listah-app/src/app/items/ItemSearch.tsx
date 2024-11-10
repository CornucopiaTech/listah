import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';



import TextFieldsLabelled from '@/components/Form/TextFieldsLabelled';



export function ItemCheckboxLabels() {
  return (

	<Box component='form'>
	<Accordion>
		<AccordionSummary
			expandIcon={<ArrowDropDownIcon />}
			aria-controls="panel2-content"
			id="panel2-header"
		>
			<Typography>Category</Typography>
		</AccordionSummary>
		<AccordionDetails>
			<FormGroup>
				<FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
				<FormControlLabel required control={<Checkbox />} label="Required" />
				<FormControlLabel disabled control={<Checkbox />} label="Disabled" />
			</FormGroup>
		</AccordionDetails>
	</Accordion>
	<Accordion>
		<AccordionSummary
			expandIcon={<ArrowDropDownIcon />}
			aria-controls="panel2-content"
			id="panel2-header"
		>
			<Typography>Tags</Typography>
		</AccordionSummary>
		<AccordionDetails>
			<FormGroup>
				<FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
				<FormControlLabel required control={<Checkbox />} label="Required" />
				<FormControlLabel disabled control={<Checkbox />} label="Disabled" />
			</FormGroup>
		</AccordionDetails>
	</Accordion>
</Box>
  );
}


export default function ItemSearch(props) {
  return (
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
  );
}
