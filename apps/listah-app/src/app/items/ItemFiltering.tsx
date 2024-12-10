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
	const [open, setOpen] = React.useState(false);
	const tagsRef = React.useRef(null);
	const categoryRef = React.useRef(null);

	const toggleDrawer = (newOpen: boolean) => () => {
		setOpen(newOpen);
	};

	function focusAccordion(item){
		item.current.focus();
	}

	function handleSubmit(event){
		event.preventDefault();
		toggleDrawer(false);
		console.log('Submitted Event: ');
		console.log(event.target);
	}

	const DrawerList = (
	<Box component='form' sx={{ width: 250, p:2, my: 6}} role="presentation"  onSubmit={handleSubmit}>
		<Accordion ref={tagsRef} sx={{ boxShadow: 0}} onClick={() => focusAccordion(tagsRef)}>
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
							<FormControlLabel 	key={item + '-formControlLabel'}
												control={<Checkbox />}
												label={item} />
						))}
				</FormGroup>
			</AccordionDetails>
		</Accordion>
		<Accordion ref={categoryRef} sx={{ boxShadow: 0}} onClick={() => focusAccordion(categoryRef)}>
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
						<FormControlLabel 	key={item + '-formControlLabel'}
											control={<Checkbox />}
											label={item} />
						))}
				</FormGroup>
			</AccordionDetails>
		</Accordion>
		<Button onClick={toggleDrawer(false)}  type="submit" >Apply</Button>
	</Box>
  );

  return (
	<Box
		sx={{
				mx: 3,
			}}>
      <Button onClick={toggleDrawer(true)} startIcon={<TuneIcon />}>
		Filter

	  </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
	  </Box>
  );
}
