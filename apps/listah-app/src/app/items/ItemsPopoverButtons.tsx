'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import StarIcon from '@mui/icons-material/Star';

import TextFieldsFormProps from '@/components/Form/TextFieldsLabelled';

import {DrawerWidth} from '@/model/defaultData';


export default function ItemPopperButton(props) {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popper' : undefined;

	const [status, setStatus] = React.useState('viewing');
	const [selectedItem, setSelectedItem] = React.useState(null);


	const handleClick = (event: React.MouseEvent<HTMLElement>, clickedContent) => {
		setAnchorEl(anchorEl ? null : event.currentTarget);
		setSelectedItem(clickedContent);
	};

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
		<>
		<Box sx={{flexGrow: 1,
			justifyContent: 'space-evenly',
			alignItems: 'center', flexWrap: 'wrap',
			p: { xs: 4, md: 6 },
			height: '100%',
			width: '100%', bgcolor: '#cfffff'}}>
			<Grid container
				spacing={{ xs: 1, sm: 2, md: 2 }}
				columns={{ xs: 1, sm: 2, md: 2 }}>
			{
				props.data.map((item) => (

					<Button variant="outlined"
						key={item.id}
						aria-describedby={id}
						sx={{}}
						onClick={(event) => handleClick(event, item)} size='large'
						endIcon={selectedItem && item.id == selectedItem.id ? <StarIcon/> : null}>
						{item.summary}
					</Button>
				))
			}


			{
				selectedItem &&
				<Popper id={id} open={open} anchorEl={anchorEl}
					sx={{bgcolor: '#FFB5C0',
						width: { sm: `calc(90% - ${DrawerWidth}px)` },
						ml: {DrawerWidth} }}>
				<Box 	sx={{ border: 1, p: 1, bgcolor: 'background.paper',
						width: { sm: `calc(100% - ${DrawerWidth}px)` },
						ml: {DrawerWidth} }}>
					<Box 	key={props.summary + '-Box'} component="form"
							sx={{ '& .MuiTextField-root': { m: 1, width: '20ch' },
								width: '100%', border: 1, p: 1,
								bgcolor: 'background.paper',}}
							noValidate
							autoComplete="off">
						{createForm(selectedItem)}
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
			}
			</Grid>
		</Box>
		</>

	);
}



// 	return (
// 		<>
// 		<Box sx={{flexGrow: 1,
// 			justifyContent: 'space-evenly',
// 			alignItems: 'center', flexWrap: 'wrap',
// 			p: { xs: 4, md: 6 },
// 			height: '100%',
// 			width: '100%', bgcolor: '#cfffff'}}>
// 			<Grid container
// 				spacing={{ xs: 1, sm: 2, md: 2 }}
// 				columns={{ xs: 1, sm: 2, md: 2 }}>
// 			{
// 				props.data.map((item) => (
// 					<Button variant="outlined"
// 						key={item.id}
// 						aria-describedby={id}
// 						sx={{}}
// 						onClick={(event) => handleClick(event, item)} size='large'>
// 						{item.summary}
// 					</Button>
// 				))
// 			}


// 			{
// 				selectedItem &&
// 				<Popper id={id} open={open} anchorEl={anchorEl}
// 					sx={{bgcolor: '#FFB5C0',
// 						width: { sm: `calc(90% - ${DrawerWidth}px)` },
// 						ml: {DrawerWidth} }}>
// 				<Box 	sx={{ border: 1, p: 1, bgcolor: 'background.paper',
// 						width: { sm: `calc(100% - ${DrawerWidth}px)` },
// 						ml: {DrawerWidth} }}>
// 					<Box 	key={props.summary + '-Box'} component="form"
// 							sx={{ '& .MuiTextField-root': { m: 1, width: '20ch' },
// 								width: '100%', border: 1, p: 1,
// 								bgcolor: 'background.paper',}}
// 							noValidate
// 							autoComplete="off">
// 						{createForm(selectedItem)}
// 					</Box>
// 					<Button key='edit' size="small"
// 							sx={{display: status == 'viewing' ? 'block' : 'none'}}
// 							onClick={handleEdit}>
// 						Edit
// 					</Button>
// 					<Button key='save' size="small"
// 							sx={{display: status == 'editing' ? 'block' : 'none'}}
// 							onClick={handleSave}>
// 						Save
// 					</Button>
// 					<Button key='delete'
// 							size="small" onClick={handleDelete}>
// 						Delete
// 					</Button>
// 				</Box>
// 				</Popper>
// 			}
// 			</Grid>
// 		</Box>

// 		<Box sx={{ display: 'flex', width: { sm: `calc(100% - ${DrawerWidth}px)` },}}>
// 			{
// 				props.data.map((item) => (
// 					<Button variant="outlined"
// 						key={item.id}
// 						aria-describedby={id}
// 						sx={{}}
// 						onClick={(event) => handleClick(event, item)} size='large'>
// 						{item.summary}
// 					</Button>
// 				))
// 			}


// 			{
// 				selectedItem &&
// 				<Popper id={id} open={open} anchorEl={anchorEl}
// 					sx={{bgcolor: '#FFB5C0',
// 						width: { sm: `calc(90% - ${DrawerWidth}px)` },
// 						ml: {DrawerWidth} }}>
// 				<Box 	sx={{ border: 1, p: 1, bgcolor: 'background.paper',
// 						width: { sm: `calc(100% - ${DrawerWidth}px)` },
// 						ml: {DrawerWidth} }}>
// 					<Box 	key={props.summary + '-Box'} component="form"
// 							sx={{ '& .MuiTextField-root': { m: 1, width: '20ch' },
// 								width: '100%', border: 1, p: 1,
// 								bgcolor: 'background.paper',}}
// 							noValidate
// 							autoComplete="off">
// 						{createForm(selectedItem)}
// 					</Box>
// 					<Button key='edit' size="small"
// 							sx={{display: status == 'viewing' ? 'block' : 'none'}}
// 							onClick={handleEdit}>
// 						Edit
// 					</Button>
// 					<Button key='save' size="small"
// 							sx={{display: status == 'editing' ? 'block' : 'none'}}
// 							onClick={handleSave}>
// 						Save
// 					</Button>
// 					<Button key='delete'
// 							size="small" onClick={handleDelete}>
// 						Delete
// 					</Button>
// 				</Box>
// 				</Popper>
// 			}
// 		</Box>
// 		</>

// 	);
// }
