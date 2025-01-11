
// import * as React from 'react';
// import {

// } from 'react';
import {
    Box,
    Stack,
    Button,
    ListSubheader,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    IconButton,
    Tooltip,
    Grid2 as Grid,
    TextField
 } from '@mui/material';

import {
    Send,
    Delete,
    Add,
} from '@mui/icons-material';



import TextFieldsLabelled from '../../components/Form/TextFieldsLabelled';

type ListItemType = {}

export default function ItemView(props){
	const [status, setStatus] = React.useState('viewing');
	const [open, setOpen] = React.useState(true);

    const itemViewState = useSelector(state => state.itemFilter.value)
    const dispatch = useDispatch()



	const handleClick = () => {
	  setOpen(!open);
	};

	function handleTagAdd(){
		alert('Tag add button clicked');
		setStatus('editing');
	}


	function handleDelete(e: React.MouseEvent<HTMLButtonElement>){
		alert('Delete Button Clicked');
		setStatus('deleting');
	}

	function handleSave(e: React.MouseEvent<HTMLButtonElement>){
		alert('Save Button Clicked');
		setStatus('viewing');
	}

	function handleEdit(e: React.MouseEvent<HTMLButtonElement>){
		alert('Edit Button Clicked');
		setStatus('editing');
	}

	function addFormField(itemLabel: string, itemValue: string){
		return <TextFieldsLabelled
					key={itemLabel + '-' + itemValue + '-formField'}
					status={status}
					label={itemLabel.toLowerCase()}
					value={itemValue}
					size='small'/>
	}

	function addFormNestedList(itemLabel: string, itemValue: string){
		return <TextFieldsLabelled
					key={itemLabel + '-' + itemValue + '-formField'}
					status={status}
					label={itemLabel.toLowerCase()}
					value={itemValue}
					size='small'/>
	}

	function createForm(givenItem: ListItemType){
		let result: React.ReactNode[] = [];
		// Add summary field.
		result.push(addFormField('summary', givenItem['summary']));

		// Add other fields.
		Object.entries(givenItem).forEach(([akey, avalue]) => {
			if (!['id', 'summary', 'tags'].includes(akey)){
				result.push(addFormField(akey, avalue));
			}
		});

		// Add tags field.
		result.push(
			<Collapse in={open} timeout="auto" unmountOnExit>
				<List
						sx={{
							width: '100%',
							maxWidth: 360,
							bgcolor: 'background.paper'
						}}
						component="nav"
						aria-labelledby="nested-list-subheader"
						subheader={
							<ListSubheader 	component="div"
											id="nested-list-subheader">
								Tags
							</ListSubheader>
						}>
					{givenItem['tags'].map((item) => (
						<ListItemButton>
							<ListItemIcon>
							<SendIcon />
							</ListItemIcon>
							<ListItemText primary={item} />
						</ListItemButton>
					))}

				</List>
			</Collapse>
		);

		return result;
	}
	function createTagList(givenItem: ListItemType){
		// Add tags field.
		return (
			<React.Fragment>

				<List
						sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
						component="nav"
						aria-labelledby="nested-list-subheader"
						subheader={
							<ListSubheader component="div" id="nested-list-subheader"
											sx={{display: 'flex'}}>
								<ListItemText primary="Tags" />

								<Tooltip title="Add new tag">
									<ListItemIcon onClick={handleTagAdd}>
										<AddIcon />
									</ListItemIcon>
								</Tooltip>
							</ListSubheader>
						}
					>
						{
							status == 'editing' &&
							<TextFieldsLabelled
								key={givenItem['summary'] + 'new-tag-formField'}
								status={status}
								label='New Tag'
								value=''
								size='small'/>
						}
					<Collapse in={open} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						{givenItem['tags'].map((item) => (
							<ListItemButton key={givenItem['summary'] + 'tag-' + item + 'formField'}>
								<ListItemIcon>
								{status == 'editing' && <DeleteIcon />}
								</ListItemIcon>
								<ListItemText primary={item} />
							</ListItemButton>
						))}
					</List>
					</Collapse>
				</List>
			</React.Fragment>

		);
	}

	function createMidItems(givenItem: ListItemType){
		let result: React.ReactNode[] = [];

		// Add other fields.
		Object.entries(givenItem).forEach(([akey, avalue]) => {
			if (!['id', 'summary', 'tags'].includes(akey)){
				result.push(addFormField(akey, avalue));
			}
		});

		return result;
	}

	console.log(props.selected);

	return (
		<Grid size={{xs:12, sm:12,  md: 12, lg:5, xl: 5 }}>
		{/* Item Display list.
			This renders only if an item has been selected and the selected item was not filtered out by the most recent filter.
		*/}

			<Box 	sx={{
						// border: 1,
							bgcolor: 'pink',
							width: '100%',
							flexGrow: 1,
							height: '100%',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
				<Box 	component="form"
                    key={itemViewState.selected.summary + '-Box'}
						sx={{ 	'& .MuiTextField-root': { m: 1, width: '100%', maxWidth: 300, },
								width: '100%', border: 1, p:2,
								borderColor: 'rgba(50,50,50,0.3)',
								bgcolor: 'background.paper',
								maxHeight: {xs:360, sm: 480, md: 600, lg: 720, xl: 840},
								overflow: 'auto',
							}}
						noValidate
						autoComplete="off">
					{
						// Add summary field.
                        addFormField('summary', itemViewState.selected.summary)
					}
					{
						// Add other fields.
                        createMidItems(itemViewState.selected)
					}
					{
						// Add tags field.
                        createTagList(itemViewState.selected)
					}
				</Box>
				<Stack 	spacing={2} direction="row"
                    key={itemViewState.selected.summary + '-Buttons'}
						sx={{
								width: '100%',
								justifyContent: 'space-around',
								bgcolor: 'purple',
								dislay:'inline-flex',
								p:1,
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
		</Grid>
	);
}
