'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


import TextFieldsLabelled from '@/components/Form/TextFieldsLabelled';



export default function ItemForm(props){
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

	function createForm(givenItem){
		let result = [];
		Object.entries(givenItem).forEach(([key, value]) => {
			if (key !== 'id'){
				result.push(<TextFieldsLabelled
						key={key + '-' + value + '-formField'}
						status={status}
						label={key} value={value} size='small'/>);

			}});
		return result;
	}

	return (
		<Box 	sx={{
						// border: 1,
						bgcolor: 'pink',
						width: '100%',
						flexGrow: 1,
						height: '100%',

						justifyContent: 'center',
						alignItems: 'center',
					}}>
			<Box 	key={props.summary + '-Box'} component="form"
					sx={{ 	'& .MuiTextField-root': { m: 1, width: '100%', maxWidth: 300, },
							width: '100%', border: 1, p:2,
							borderColor: 'rgba(50,50,50,0.3)',
							bgcolor: 'background.paper',
							maxHeight: {xs:360, sm: 480, md: 600, lg: 720, xl: 840},
							overflow: 'auto',
						}}
					noValidate
					autoComplete="off">
				{createForm(props.item)}
			</Box>
			<Stack spacing={2} direction="row" key={props.summary + '-Buttons'}
					sx={{ 	width: '100%', justifyContent: 'space-around',
							bgcolor: 'purple', dislay:'inline-flex', p:1,
						}}>
				<Button key='edit' size="small"
						sx={{display: status == 'viewing' ? 'block' : 'none'}}
						onClick={handleEdit}>
					Edit
				</Button>
				<Button key='save' size="small"
						sx={{display: status == 'editing' ? 'block' : 'none'}}
						onClick={handleSave}>
					Save
				</Button>
				<Button key='delete'
						size="small" onClick={handleDelete}>
					Delete
				</Button>
			</Stack>
		</Box>
	);
}
