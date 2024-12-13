import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TuneIcon from '@mui/icons-material/Tune';



export default function FilterItems(props) {

	const DrawerList = (
		<Box component='form' sx={{ width: 250, p:2, my: 6}} role="presentation" >
			<Accordion defaultExpanded sx={{ boxShadow: 1,}}>
				<AccordionSummary
					expandIcon={<ArrowDropDownIcon />}
					aria-controls="panel1-content"
					id="panel1-header"
				>
					<Typography>Category</Typography>
				</AccordionSummary>
				<AccordionDetails sx={{ maxHeight: 300, overflow: 'auto',}}>
					<FormGroup>
						{props.categories.map((item) => (
							<FormControlLabel 	key={item + '-checkBoxFormControlLabel'}
												control={<Checkbox />}
												label={item}
												checked={props.filterChecked.get(item)}
												value={props.filterChecked.get(item)}
												name={item}
												onChange={props.handleFilterChecked}
							/>
							))}
					</FormGroup>
				</AccordionDetails>
			</Accordion>
			<Accordion defaultExpanded sx={{ boxShadow: 1}}>
				<AccordionSummary
					expandIcon={<ArrowDropDownIcon />}
					aria-controls="panel2-content"
					id="panel2-header"
				>
					<Typography>Tags</Typography>
				</AccordionSummary>
				<AccordionDetails sx={{ maxHeight: 300, overflow: 'auto',}}>
					<FormGroup>
						{props.tags.map((item) => (
							<FormControlLabel 	key={item + '-checkBoxFormControlLabel'}
												control={<Checkbox />}
												label={item}
												checked={props.filterChecked.get(item)}
												value={props.filterChecked.get(item)}
												name={item}
												onChange={props.handleFilterChecked}
							/>
							))}
					</FormGroup>
				</AccordionDetails>
			</Accordion>
			<Box sx={{width: '100', my: 6, justifyContent: 'space-around',}}>
				<Button sx={{justifyContent: 'space-around', mx:2,}} onClick={props.handleFilterReset} >Reset</Button>
				<Button sx={{justifyContent: 'space-around', mx:2,}} onClick={props.closeFilterDrawer} >Close</Button>
			</Box>

		</Box>
	);

	return (
		<Box
			sx={{
					mx: 3,
				}}>
			<Button 	onClick={() => props.toggleFilterDrawer(true)}
						startIcon={<TuneIcon />}>
				Filter
			</Button>

			<Drawer 	open={props.filterDrawerOpen}
						onClose={() => props.toggleFilterDrawer(false)}>
				{DrawerList}
			</Drawer>

		</Box>
	);
}
