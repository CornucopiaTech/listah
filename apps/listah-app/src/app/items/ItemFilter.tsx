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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';


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


export function ItemCheckboxFilters() {
	/**
	 * This component enables the filtering of items based on category or tags.
	 *
	 */
	const [checked, setChecked] = React.useState([0]);

	const handleToggle = (value: number) => () => {
	  const currentIndex = checked.indexOf(value);
	  const newChecked = [...checked];

	  if (currentIndex === -1) {
		newChecked.push(value);
	  } else {
		newChecked.splice(currentIndex, 1);
	  }

	  setChecked(newChecked);
	};

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
			<List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
			{[0, 1, 2, 3].map((value) => {
				const labelId = `checkbox-list-label-${value}`;

				return (
				<ListItem
							key={value}
							disablePadding
				>
					<ListItemButton role={undefined} onClick={handleToggle(value)} dense>
						<ListItemIcon>
							<Checkbox
										edge="start"
										checked={checked.includes(value)}
										tabIndex={-1}
										disableRipple
										inputProps={{ 'aria-labelledby': labelId }}
							/>
						</ListItemIcon>
						<ListItemText id={labelId} primary={`Line item ${value + 1}`} />
					</ListItemButton>
				</ListItem>
				);
			})}
			</List>
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


export default function ItemFilters(props): React.JSX.Element {
	/**
	 * This component enables the filtering of items based on category or tags.
	 * It consists of:
	 * - Search input field to search for phrases contained within the description of an item
	 * - Check boxes to filter based on category or tags.
	 *
	 */
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
			{/* <ItemCheckboxLabels/> */}
			<ItemCheckboxFilters/>
		</Box>


		<Box>
			<Button variant="outlined" size="small"
					sx={{maxWidth: 100, ml: 3,}}
					onClick={props.handleReset}
				>
						Reset
			</Button>
			<Button variant="outlined" size="small"
					sx={{maxWidth: 100, ml: 3,}}
					onClick={props.handleApply}
				>
						Apply
			</Button>
		</Box>

	</Box>
  );
}
