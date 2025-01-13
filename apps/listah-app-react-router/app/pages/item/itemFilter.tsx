
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

import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '~/store';

import {
	filterChecked, filterApply, filterReset, selectItemFilter
} from '../../hooks/reducers/items/itemFilterSlice';
import { selectItemDrawer } from '../../hooks/reducers/items/itemDrawerSlice';



export function FilterItems(props) {
	const useAppDispatch = useDispatch.withTypes<AppDispatch>()
	const useAppSelector = useSelector.withTypes<RootState>()
	const dispatch = useAppDispatch();

	const drawerState = useAppSelector(selectItemDrawer);
	const filterState = useAppSelector(selectItemFilter);


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
						{props.categories.map((item: string) => (
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
						{props.tags.map((item: string) => (
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
