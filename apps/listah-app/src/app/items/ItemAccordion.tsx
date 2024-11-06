'use client'

import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';


import TextFieldsFormProps from '@/components/Form/TextFieldsLabelled';



export default function ItemAccordion(props) {
	const [status, setStatus] = React.useState('viewing');

	function handleDelete(e){
		alert('Delete Button Clicked');
		setStatus('deleting');
	}

	function handleSave(e){
		alert('Save Button Clicked');
		setStatus('viewing');
	}

	function handleEdit(e){
		alert('Edit Button Clicked');
		setStatus('editing');
	}


	function createAccordionForm(givenItem){
		let result = [];
		Object.entries(givenItem).forEach(([key, value]) => {
			result.push(
				<TextFieldsFormProps key={value + '-formField'} status='editing'
									 label={key} value={value} size='small'/>);

		})

		return result;
	}


	return (
	<Accordion key={props.summary + '-Accordion'}>
		<AccordionSummary
			expandIcon={<ExpandMoreIcon />}
			aria-controls={`panel${props.index}-content`}
			id={`panel${props.index}-header`}
		>
			{props.summary}
		</AccordionSummary>
		<AccordionDetails key={props.summary + '-AccordionDetails'}>
			{
				<Box key={props.summary + '-Box'} component="form"
				sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
				noValidate
				autoComplete="off">
					{
						createAccordionForm(props.item)
					}
				</Box>
			}
		</AccordionDetails>
		<AccordionActions>
			<Button key='edit' size="small"
					sx={{display: status == 'viewing' ? 'block' : 'none'}}
					onClick={handleEdit}>Edit </Button>
			<Button key='save' size="small"
					sx={{display: status == 'editing' ? 'block' : 'none'}}
					onClick={handleSave}>Save </Button>
			<Button key='delete'
					size="small" onClick={handleDelete}>Delete </Button>
		</AccordionActions>
	</Accordion>

	);
}
