
// import * as React from 'react';
import {
	useSelector,
	useDispatch
} from 'react-redux';

// Components
import {
	Box,
	Drawer,
	Button,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
	FormGroup,
	FormControlLabel,
	Checkbox
} from '@mui/material';

import {
	ArrowDropDown,
	Tune
} from '@mui/icons-material';



// Defined Reducers
import {
	openDrawer,
	closeDrawer,
	toggleDrawer
} from '../../hooks/reducers/items/itemDrawerSlice';


import {
	filterChecked, filterApply, filterReset
} from '../../hooks/reducers/items/itemFilterSlice';


export function FilterItems(props) {
	const drawerState = useSelector(state => state.itemDrawer.value)
	const filterState = useSelector(state => state.itemFilter.value)
	const dispatch = useDispatch()


	const DrawerList = (
		<Box component='form' sx={{ width: 250, p:2, my: 6}} role="presentation" >
			<Accordion defaultExpanded sx={{ boxShadow: 1,}}>
				<AccordionSummary
					expandIcon={<ArrowDropDown />}
					aria-controls="panel1-content"
					id="panel1-header"
				>
					<Typography>Category</Typography>
				</AccordionSummary>
				<AccordionDetails sx={{ maxHeight: 300, overflow: 'auto',}}>
					<FormGroup>
						{props.categories.map((item) => (
							<FormControlLabel
									key={item + '-checkBoxFormControlLabel'}
									control={<Checkbox />}
									label={item}
									checked={filterState.includes(item)}
									value={filterState.includes(item)}
									name={item}
									onChange={() => dispatch(filterChecked(item))}
							/>
							))}
					</FormGroup>
				</AccordionDetails>
			</Accordion>
			<Accordion defaultExpanded sx={{ boxShadow: 1}}>
				<AccordionSummary
					expandIcon={<ArrowDropDown />}
					aria-controls="panel2-content"
					id="panel2-header"
				>
					<Typography>Tags</Typography>
				</AccordionSummary>
				<AccordionDetails sx={{ maxHeight: 300, overflow: 'auto',}}>
					<FormGroup>
						{props.tags.map((item) => (
							<FormControlLabel
								key={item + '-checkBoxFormControlLabel'}
								control={<Checkbox />}
								label={item}
								checked={filterState.includes(item)}
								value={filterState.includes(item)}
								name={item}
								onChange={() => dispatch(filterChecked(item))}
							/>
							))}
					</FormGroup>
				</AccordionDetails>
			</Accordion>
			<Box sx={{width: '100', my: 6, justifyContent: 'space-around',}}>
				<Button
					sx={{justifyContent: 'space-around', mx:2,}}
					onClick={() => dispatch(filterReset())}
				>
						Reset
				</Button>
				<Button
					sx={{ justifyContent: 'space-around', mx: 2, }}
					onClick={() => dispatch(closeDrawer())}
				>Close</Button>
			</Box>

		</Box>
	);

	return <Box
			sx={{
					mx: 3,
				}}>
			<Button onClick={() => dispatch(openDrawer())}
					startIcon={<Tune />}>
				Filter
			</Button>

			<Drawer open={drawerState}
					onClose={() => dispatch(closeDrawer())}>
				{DrawerList}
			</Drawer>

		</Box>;
}
