'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Button from '@mui/material/Button';


import TextFieldsFormProps from '@/components/Form/TextFieldsLabelled';

import {DrawerWidth} from '@/model/defaultData';


export default function ItemPopper(props) {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(anchorEl ? null : event.currentTarget);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popper' : undefined;

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
			result.push(
				<TextFieldsFormProps key={key + '-' + value + '-formField'} status='editing'
				label={key} value={value} size='small'/>);

			})

			return result;
		}



		return (
			<Box sx={{ display: 'flex' }}>
				<Button aria-describedby={id}
						sx={{}}
						onClick={handleClick} size='large'>
					{props.summary}
				</Button>

				<Popper id={id} open={open} anchorEl={anchorEl}
						sx={{bgcolor: '#FFB5C0',
							width: { sm: `calc(90% - ${DrawerWidth}px)` },
							ml: {DrawerWidth} }}>
					<Box 	sx={{ border: 1, p: 1, bgcolor: 'background.paper',
							width: { sm: `calc(100% - ${DrawerWidth}px)` },
							ml: {DrawerWidth} }}>
						<Box 	key={props.summary + '-Box'} component="form"
								sx={{ '& .MuiTextField-root': { m: 1, width: '20ch' },
								width: '100%' }}
								noValidate
								autoComplete="off">
							{createForm(props.item)}
						</Box>
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
					</Box>
				</Popper>
			</Box>
			);
		}
