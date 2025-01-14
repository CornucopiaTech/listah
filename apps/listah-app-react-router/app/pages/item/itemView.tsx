
// import * as React from 'react';
import {
	useContext,
	Fragment

} from 'react';
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
    TextField,
	ListItem,
 } from '@mui/material';

import {
    Send,
    Delete,
    Add,
	ExpandLess,
} from '@mui/icons-material';



import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '~/store';
import {
ClickItem,
ToggleCollapseTags,
selectItemView,
ChangeTags,
	ChangeStatus,
	CreateNewTag,
	SaveUpdatedItem
} from '~/hooks/reducers/items/itemViewSlice';
import type { TagChangePayloadInterface } from '~/hooks/reducers/items/itemViewSlice';


export default function ItemView(props){
	const useAppDispatch = useDispatch.withTypes<AppDispatch>()
	const useAppSelector = useSelector.withTypes<RootState>()
	const dispatch = useAppDispatch();

	const itemViewState = useAppSelector(selectItemView);
	const displayViewId = itemViewState.selectedItem ? 'simple-popper' : undefined;


	function handleTagAdd() {
		alert('Tag add button clicked');
	}
	function handleDelete(e: React.MouseEvent<HTMLButtonElement>){
		alert('Delete Button Clicked');
		setStatus('deleting');
	}

	console.log("Selected Items: ");
	console.log(itemViewState.selectedItem);

	return (
		<Grid container
				spacing={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }}
				columns={{ xs: 2, sm: 6, md: 12 }}>
			<Grid size='grow'>
				{/* Item list grid */}
				<List sx={{
							width: '100%', p: 2,
							maxHeight: { xs: 240, sm: 240, md: 360, lg: 720, xl: 840 },
							overflow: 'auto',
							bgcolor: 'cyan',
							justifyContent: "center",
							alignItems: "flex-start",
							border: 1,
							borderColor: 'rgba(50,50,50,0.3)',
						}}>
					{
						// ToDo: Make a vertical stack where the summary contains selected columns for the category
						// ToDo: Have a ticker button at the start of the list
						// ToDO: Long press should bring a menu with quick options for editing an item (for example. removing it temporarily)
						props.data.map((listItem: ItemModel) => (
							<ListItem
								key={listItem.id}
								variant="outlined"
								aria-describedby={displayViewId}
								onClick={() => dispatch(ClickItem(listItem))}
								size='large'>
								<ListItemButton>
									{
										itemViewState.selectedItem &&
										listItem.id == itemViewState.selectedItem.id &&
										<ListItemIcon><ExpandLess /></ListItemIcon>
									}
									<ListItemText primary={listItem.title} />
								</ListItemButton>
							</ListItem>
						))
					}
				</List>
			</Grid>
			{
				// Component for viewing selected item.
				// This renders only if an item has been selected and the selected item was not filtered out by the most recent filter.

				itemViewState.selectedItem &&
				props.data.filter((item: ItemModel) => item.id == itemViewState.selectedItem.id).length != 0 &&
				<Grid size={{xs:12, sm:12,  md: 12, lg:5, xl: 5 }}>
					<Box sx={{
							// border: 1,
							bgcolor: 'pink',
							width: '100%',
							flexGrow: 1,
							height: '100%',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<Box 	component="form"
								key={itemViewState.selectedItem.title + '-Box'}
								sx={{
									'& .MuiTextField-root': { m: 1, width: '100%', maxWidth: 300, },
									width: '100%', border: 1, p: 2,
									borderColor: 'rgba(50,50,50,0.3)',
									bgcolor: 'background.paper',
									maxHeight: { xs: 360, sm: 480, md: 600, lg: 720, xl: 840 },
									overflow: 'auto',
								}}
								noValidate
								autoComplete="off">
								{/* ToDo: Fix updating item attributes. */}

							{
								// Add item note for editing mode
								itemViewState.status === 'editing' &&
								<Fragment>
									<TextField
										required
										multiline
										key={'TextField-title-' + itemViewState.selectedItem.title + '-formField'}
										label="Title"
										value={itemViewState.selectedItem.title}
										onChange={(e) => dispatch(ChangeTags({ current: e.target.value, previous: itemViewState.selectedItem.title }))}
										size='small'
									/>
									<TextField
										required
										multiline
										key={'TextField-note-' + itemViewState.selectedItem.note + '-formField'}
										label="Note"
										value={itemViewState.selectedItem.note}
										onChange={(e) => dispatch(ChangeTags({ current: e.target.value, previous: itemViewState.selectedItem.note }))}
										size='small'
									/>
									<TextField
										required
										multiline
										key={'TextField-description-' + itemViewState.selectedItem.description + '-formField'}
										label="Description"
										value={itemViewState.selectedItem.description}
										onChange={(e) => dispatch(ChangeTags({ current: e.target.value, previous: itemViewState.selectedItem.description }))}
										size='small'
									/>
								</Fragment>

							}
							{
								// Add item note for non-editing mode
								itemViewState.status !== 'editing' &&
								<Fragment>
									<TextField
										disabled
										required
										multiline
										key={'TextField-title-' + itemViewState.selectedItem.title + '-formField'}
										label="Title"
										value={itemViewState.selectedItem.title}
										onChange={(e) => dispatch(ChangeTags({ current: e.target.value, previous: itemViewState.selectedItem.title }))}
										size='small'
									/>
									<TextField
										disabled
										required
										multiline
										key={'TextField-note-' + itemViewState.selectedItem.note + '-formField'}
										label="Note"
										value={itemViewState.selectedItem.note}
										onChange={(e) => dispatch(ChangeTags({ current: e.target.value, previous: itemViewState.selectedItem.note }))}
										size='small'
									/>
									<TextField
										disabled
										required
										multiline
										key={'TextField-description-' + itemViewState.selectedItem.description + '-formField'}
										label="Description"
										value={itemViewState.selectedItem.description}
										onChange={(e) => dispatch(ChangeTags({ current: e.target.value, previous: itemViewState.selectedItem.description }))}
										size='small'
									/>
								</Fragment>

							}
							<List
									// Add List for tags field.
									sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
									component="nav"
									aria-labelledby="nested-list-subheader"
									subheader={
										<ListSubheader component="div" id="nested-list-subheader"
											sx={{ display: 'flex' }}>
											<ListItemText primary="Tags" />

											<Tooltip title="Add new tag">
												<ListItemIcon onClick={() => dispatch(ChangeStatus("editing"))}>
													<Add />
												</ListItemIcon>
											</Tooltip>
										</ListSubheader>
									}>
								{
									itemViewState.status == 'editing' &&
									<TextField
										required
										multiline
										key={'TextField-newTag-' + itemViewState.selectedItem.title + '-formField'}
										label='New Tag'
											value={itemViewState.newTag}
											onChange={(e) => dispatch(CreateNewTag(e.target.value))}
										size='small'
									/>
								}
								<Collapse 	in={itemViewState.tagCollapsed}
											timeout="auto" unmountOnExit
											onClick={() => dispatch(ToggleCollapseTags())}>
									<List component="div" disablePadding>
										{
											itemViewState.selectedItem.tags.map((tagItem: string) => (
												<ListItemButton key={itemViewState.selectedItem.title + 'tag-' + tagItem + 'formField'}>
													<ListItemIcon>
														{
															itemViewState.status == 'editing' &&
															// ToDO: Fix delete button function.
															<Delete onClick={() => dispatch(ChangeTags({ current: null, previous: tagItem }))} />
														}
													</ListItemIcon>
													<ListItemText primary={tagItem} />
												</ListItemButton>
											))
										}
									</List>
								</Collapse>
							</List>

						</Box>
						<Stack spacing={2} direction="row"
								key={itemViewState.selectedItem.title + '-Buttons'}
								sx={{
									width: '100%',
									justifyContent: 'space-around',
									bgcolor: 'purple',
									dislay: 'inline-flex',
									p: 1,
								}}>
							<Button key='edit' size="small"
									sx={{ display: itemViewState.status == 'viewing' ? 'block' : 'none' }}
									onClick={() => dispatch(ChangeStatus("editing"))}>
								Edit
							</Button>
							<Button key='save' size="small"
									sx={{ display: itemViewState.status == 'editing' ? 'block' : 'none' }}
									onClick={() => dispatch(SaveUpdatedItem())}>
								Save
							</Button>
							<Button key='delete'
									size="small" onClick={handleDelete}>
								Delete
							</Button>
						</Stack>
					</Box>
				</Grid>
			}
		</Grid>
	);
}


// import * as React from 'react';
import {
	useContext,
	Fragment

} from 'react';
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
    TextField,
	ListItem,
 } from '@mui/material';

import {
    Send,
    Delete,
    Add,
	ExpandLess,
} from '@mui/icons-material';



import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '~/store';
import {
ClickItem,
ToggleCollapseTags,
selectItemView,
ChangeTags,
	ChangeStatus,
	CreateNewTag,
	SaveUpdatedItem
} from '~/hooks/reducers/items/itemViewSlice';
import type { TagChangePayloadInterface } from '~/hooks/reducers/items/itemViewSlice';


export default function ItemView(props){
	const useAppDispatch = useDispatch.withTypes<AppDispatch>()
	const useAppSelector = useSelector.withTypes<RootState>()
	const dispatch = useAppDispatch();

	const itemViewState = useAppSelector(selectItemView);
	const displayViewId = itemViewState.selectedItem ? 'simple-popper' : undefined;


	function handleTagAdd() {
		alert('Tag add button clicked');
	}
	function handleDelete(e: React.MouseEvent<HTMLButtonElement>){
		alert('Delete Button Clicked');
		setStatus('deleting');
	}

	console.log("Selected Items: ");
	console.log(itemViewState.selectedItem);

	return (
		<Grid container
				spacing={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }}
				columns={{ xs: 2, sm: 6, md: 12 }}>
			<Grid size='grow'>
				{/* Item list grid */}
				<List sx={{
							width: '100%', p: 2,
							maxHeight: { xs: 240, sm: 240, md: 360, lg: 720, xl: 840 },
							overflow: 'auto',
							bgcolor: 'cyan',
							justifyContent: "center",
							alignItems: "flex-start",
							border: 1,
							borderColor: 'rgba(50,50,50,0.3)',
						}}>
					{
						// ToDo: Make a vertical stack where the summary contains selected columns for the category
						// ToDo: Have a ticker button at the start of the list
						// ToDO: Long press should bring a menu with quick options for editing an item (for example. removing it temporarily)
						props.data.map((listItem: ItemModel) => (
							<ListItem
								key={listItem.id}
								variant="outlined"
								aria-describedby={displayViewId}
								onClick={() => dispatch(ClickItem(listItem))}
								size='large'>
								<ListItemButton>
									{
										itemViewState.selectedItem &&
										listItem.id == itemViewState.selectedItem.id &&
										<ListItemIcon><ExpandLess /></ListItemIcon>
									}
									<ListItemText primary={listItem.title} />
								</ListItemButton>
							</ListItem>
						))
					}
				</List>
			</Grid>
			{
				// Component for viewing selected item.
				// This renders only if an item has been selected and the selected item was not filtered out by the most recent filter.

				itemViewState.selectedItem &&
				props.data.filter((item: ItemModel) => item.id == itemViewState.selectedItem.id).length != 0 &&
				<Grid size={{xs:12, sm:12,  md: 12, lg:5, xl: 5 }}>
					<Box sx={{
							// border: 1,
							bgcolor: 'pink',
							width: '100%',
							flexGrow: 1,
							height: '100%',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<Box 	component="form"
								key={itemViewState.selectedItem.title + '-Box'}
								sx={{
									'& .MuiTextField-root': { m: 1, width: '100%', maxWidth: 300, },
									width: '100%', border: 1, p: 2,
									borderColor: 'rgba(50,50,50,0.3)',
									bgcolor: 'background.paper',
									maxHeight: { xs: 360, sm: 480, md: 600, lg: 720, xl: 840 },
									overflow: 'auto',
								}}
								noValidate
								autoComplete="off">
								{/* ToDo: Fix updating item attributes. */}

							{
								// Add item note for editing mode
								itemViewState.status === 'editing' &&
								<Fragment>
									<TextField
										required
										multiline
										key={'TextField-title-' + itemViewState.selectedItem.title + '-formField'}
										label="Title"
										value={itemViewState.selectedItem.title}
										onChange={(e) => dispatch(ChangeTags({ current: e.target.value, previous: itemViewState.selectedItem.title }))}
										size='small'
									/>
									<TextField
										required
										multiline
										key={'TextField-note-' + itemViewState.selectedItem.note + '-formField'}
										label="Note"
										value={itemViewState.selectedItem.note}
										onChange={(e) => dispatch(ChangeTags({ current: e.target.value, previous: itemViewState.selectedItem.note }))}
										size='small'
									/>
									<TextField
										required
										multiline
										key={'TextField-description-' + itemViewState.selectedItem.description + '-formField'}
										label="Description"
										value={itemViewState.selectedItem.description}
										onChange={(e) => dispatch(ChangeTags({ current: e.target.value, previous: itemViewState.selectedItem.description }))}
										size='small'
									/>
								</Fragment>

							}
							{
								// Add item note for non-editing mode
								itemViewState.status !== 'editing' &&
								<Fragment>
									<TextField
										disabled
										required
										multiline
										key={'TextField-title-' + itemViewState.selectedItem.title + '-formField'}
										label="Title"
										value={itemViewState.selectedItem.title}
										onChange={(e) => dispatch(ChangeTags({ current: e.target.value, previous: itemViewState.selectedItem.title }))}
										size='small'
									/>
									<TextField
										disabled
										required
										multiline
										key={'TextField-note-' + itemViewState.selectedItem.note + '-formField'}
										label="Note"
										value={itemViewState.selectedItem.note}
										onChange={(e) => dispatch(ChangeTags({ current: e.target.value, previous: itemViewState.selectedItem.note }))}
										size='small'
									/>
									<TextField
										disabled
										required
										multiline
										key={'TextField-description-' + itemViewState.selectedItem.description + '-formField'}
										label="Description"
										value={itemViewState.selectedItem.description}
										onChange={(e) => dispatch(ChangeTags({ current: e.target.value, previous: itemViewState.selectedItem.description }))}
										size='small'
									/>
								</Fragment>

							}
							<List
									// Add List for tags field.
									sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
									component="nav"
									aria-labelledby="nested-list-subheader"
									subheader={
										<ListSubheader component="div" id="nested-list-subheader"
											sx={{ display: 'flex' }}>
											<ListItemText primary="Tags" />

											<Tooltip title="Add new tag">
												<ListItemIcon onClick={() => dispatch(ChangeStatus("editing"))}>
													<Add />
												</ListItemIcon>
											</Tooltip>
										</ListSubheader>
									}>
								{
									itemViewState.status == 'editing' &&
									<TextField
										required
										multiline
										key={'TextField-newTag-' + itemViewState.selectedItem.title + '-formField'}
										label='New Tag'
											value={itemViewState.newTag}
											onChange={(e) => dispatch(CreateNewTag(e.target.value))}
										size='small'
									/>
								}
								<Collapse 	in={itemViewState.tagCollapsed}
											timeout="auto" unmountOnExit
											onClick={() => dispatch(ToggleCollapseTags())}>
									<List component="div" disablePadding>
										{
											itemViewState.selectedItem.tags.map((tagItem: string) => (
												<ListItemButton key={itemViewState.selectedItem.title + 'tag-' + tagItem + 'formField'}>
													<ListItemIcon>
														{
															itemViewState.status == 'editing' &&
															// ToDO: Fix delete button function.
															<Delete onClick={() => dispatch(ChangeTags({ current: null, previous: tagItem }))} />
														}
													</ListItemIcon>
													<ListItemText primary={tagItem} />
												</ListItemButton>
											))
										}
									</List>
								</Collapse>
							</List>

						</Box>
						<Stack spacing={2} direction="row"
								key={itemViewState.selectedItem.title + '-Buttons'}
								sx={{
									width: '100%',
									justifyContent: 'space-around',
									bgcolor: 'purple',
									dislay: 'inline-flex',
									p: 1,
								}}>
							<Button key='edit' size="small"
									sx={{ display: itemViewState.status == 'viewing' ? 'block' : 'none' }}
									onClick={() => dispatch(ChangeStatus("editing"))}>
								Edit
							</Button>
							<Button key='save' size="small"
									sx={{ display: itemViewState.status == 'editing' ? 'block' : 'none' }}
									onClick={() => dispatch(SaveUpdatedItem())}>
								Save
							</Button>
							<Button key='delete'
									size="small" onClick={handleDelete}>
								Delete
							</Button>
						</Stack>
					</Box>
				</Grid>
			}
		</Grid>
	);
}
