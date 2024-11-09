'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';



import TextFieldsFormProps from '@/components/Form/TextFieldsLabelled';


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
						status={status}
						label={key} value={value} size='small'/>);

			}});
		return result;
	}

	return (
		<Box 	sx={{ 	border: 1, bgcolor: 'pink',
						width: '100%',
					}}>
			<Box 	key={props.summary + '-Box'} component="form"
					sx={{ 	'& .MuiTextField-root': { m: 1, width: '25ch' },
							width: '100%', border: 1, p:1,
							bgcolor: 'background.paper',
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

function PopperButtons(props){
	return (
		<ListItem 	 aria-describedby={props.id} disablePadding
					onClick={props.onClick} size='large'>
			<ListItemButton>
			<ListItemIcon>
				{props.isSelected && <ExpandLessIcon/>}
			</ListItemIcon>
			<ListItemText primary={props.label} />
			</ListItemButton>
		</ListItem>
	);
}


export default function ItemsDisplay(props) {
	const [popperInfo, setPopperInfo] = React.useState(null);
	const id = popperInfo ? 'simple-popper' : undefined;


	function handleClick(clickedItem) {
		if (popperInfo){
			console.log(`Prerender Anchor: ${popperInfo.summary}   Clicked: ${clickedItem.summary}  `);
		} else {
			console.log(`Prerender Anchor: ${popperInfo}   Clicked: ${clickedItem.summary}  `);
		}

		if (popperInfo && popperInfo.id == clickedItem.id){
			setPopperInfo( null)
		} else {
			setPopperInfo(clickedItem)
		}
	};


	return (
		<>
			<Box 	sx={{ 	flexGrow: 1, display: 'block',
							width: '100%',
							height: '100%',
							bgcolor: '#7F4FD4',
							justifyContent: 'center',
							alignItems: 'center',
						}}
				>
				<List 		sx={{ 	width: '100%', p:1,
									maxHeight: {'xs':180, 'sm': 300, md: 420, 'lg': 540},
									overflow: 'auto',
									bgcolor: 'cyan',
									justifyContent: "center",
									alignItems: "flex-start",
						}}>
					{
						// ToDo: Make a vertical stack where the summary contains selected columns for the category
						// ToDo: Have a ticker button at the start of the list
						// ToDO: Long press should bring a menu with quick options for editing an item (for example. removing it temporarily)
						props.data.map((item) => (
							<PopperButtons 	variant="outlined"
											key={item.id}
											aria-describedby={id}
											sx={{}}
											onClick={() => handleClick(item)} size='large'
											isSelected={popperInfo && item.id == popperInfo.id}
											label={item.summary}
							/>
						))
					}
				</List>
				<Box 	sx={{
							flexGrow: 1, p: 3, display: 'inline-flex',
							width: '100%',
							maxHeight: 300,
							overflow: 'auto',
							bgcolor: 'yellow',
							justifyContent: 'center',
							alignItems: 'center',
						}}
						>
					{
						popperInfo &&
						<ItemPopper key='ItemPopper' open={Boolean(popperInfo)}
									id={id}
									item={props.data.find((item) => item.id == popperInfo.id)} />

					}
				</Box>
			</Box>
		</>

	);
}
