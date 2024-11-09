'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import StarIcon from '@mui/icons-material/Star';

import TextFieldsFormProps from '@/components/Form/TextFieldsLabelled';

import {DrawerWidth} from '@/model/defaultData';


function ItemPopper(props){
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
				result.push(<TextFieldsFormProps
						key={key + '-' + value + '-formField'}
						status='editing'
						label={key} value={value} size='small'/>);

			}});
		return result;
	}

	return (
		<Popper id={props.id} open={props.open} anchorEl={props.anchor}
				sx={{	bgcolor: '#FFB5C0',
						width: { sm: `calc(90% - ${DrawerWidth}px)` },
						ml: {DrawerWidth}
					}}
				placement='bottom'>
			<Box 	sx={{ 	border: 1, p: 1, bgcolor: 'background.paper',
							width: { sm: `calc(100% - ${DrawerWidth}px)` },
							ml: {DrawerWidth}
						}}>
				<Box 	key={props.summary + '-Box'} component="form"
						sx={{ 	'& .MuiTextField-root': { m: 1, width: '20ch' },
								width: '100%', border: 1, p: 1,
								bgcolor: 'background.paper',
							}}
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
	);
}

function PopperButtons(props){
	return (
		<Button variant="outlined"
				// key={props.id}
				id={props.id}
				aria-describedby={props.id}
				sx={{}}
				onClick={props.onClick} size='large'
				endIcon={props.isSelected ? <StarIcon/> : null}>
			{props.label}
		</Button>
	);
}


export default function ItemPopperButton(props) {
	const [popperInfo, setPopperInfo] = React.useState<HTMLButtonElement | null>(null);
	const id = popperInfo ? 'simple-popper' : undefined;


	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		if (popperInfo){
			console.log(`Prerender Anchor: ${popperInfo.id}   Clicked: ${event.currentTarget.textContent}  `);
		} else {
			console.log(`Prerender Anchor: ${popperInfo}   Clicked: ${event.currentTarget.textContent}  `);
		}
		// console.log(event.currentTarget.textContent + '  :  ' + anchorEl.textContent);

		if (popperInfo && popperInfo.id == event.currentTarget.id){
			setPopperInfo( null)
		} else {
			setPopperInfo(event.currentTarget)
		}
	};


	if (popperInfo){
		console.log(`Current Anchor: ${popperInfo.textContent}`);
	} else {
		console.log(`Current Anchor: ${popperInfo}`);
	}

	return (
		<>

			<Grid 	container
					spacing={{ xs: 1, sm: 2, md: 2 }}
					columns={12}>
				<Grid
						spacing={{ xs: 1, sm: 2, md: 2 }}
						columns={6}>
					{
						props.data.map((item) => (
							<PopperButtons 	variant="outlined"
											key={item.id}
											aria-describedby={id}
											sx={{}}
											id={item.summary}
											onClick={handleClick} size='large'
											isSelected={popperInfo && item.id == popperInfo.id}
											label={item.summary}
							/>
						))
					}
				</Grid>
				<Grid
						spacing={{ xs: 1, sm: 2, md: 2 }}
						columns={6}>
					{
						popperInfo &&
						<ItemPopper key='ItemPopper' open={Boolean(popperInfo)}
									id={id}
									item={props.data.find((item) => item.summary = popperInfo.id)} />

					}
				</Grid>
			</Grid>
		</>

	);
}
