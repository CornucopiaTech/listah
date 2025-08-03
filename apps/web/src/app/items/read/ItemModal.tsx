"use client"

import {
  Fragment,
  ReactNode,
  useState,
} from 'react';
import { redirect, RedirectType } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
  Box,
  Stack,
  Modal,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  TextField,
  Tooltip,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Add,
  Create,
  Close,
  Delete,
} from '@mui/icons-material';

import type { IProtoItem } from '@/app/items/ItemsModel';


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "75%",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


export function ItemModalEnabled(
  { item, handleOpen, handleClose, open }: {
    item: IProtoItem,
    handleOpen: () => void,
    handleClose: () => void,
    open: boolean,
  }
): ReactNode {
  const [tagCollapsed, setTagCollapsed] = useState(true);
  const router = useRouter();

  return (
    <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
      <Fragment>
        <Box sx={modalStyle}>
          <Box  sx={{width: '100%', flexGrow: 1,
                height: '100%', justifyContent: 'center', alignItems: 'center',}}>
            <Stack  spacing={ 2 } direction="row" key={ item.title + '-Buttons' }
                    sx={{ width: '100%', justifyContent: 'space-around',
                       dislay: 'inline-flex', p: 1,}}>
              <IconButton onClick={handleClose}>
                <Tooltip title="Close"><Close/></Tooltip>
              </IconButton>
              <IconButton onClick={ () => router.push(`/item/${item.id}/update`) }>
                <Tooltip title="Edit"><Create/></Tooltip>
              </IconButton>
              <IconButton onClick={ () => router.push(`/item/${item.id}/delete`)  }>
                <Tooltip title="Delete"><Delete/></Tooltip>
              </IconButton>
            </Stack>
            <Box  component="form" key={ item.title + '-Box' }
                  sx={{ '& .MuiTextField-root': {
                        m: 1, width: '100%', maxWidth: 640,
                      }, width: '100%',  p: 2, overflow: 'auto',
                      maxHeight: { xs: 360, sm: 480, md: 600, lg: 720, xl: 840 },
                    }}
                    noValidate autoComplete="off">


              <TextField required multiline variant="standard"
                  key='TextField-title-formField'
                  label="Summary" value={ item.summary } size='small'
              />
              <TextField required multiline variant="standard"
                key={ 'TextField-note-formField' }
                label="Note" value={ item.note } size='small'
              />
              <TextField required multiline variant="standard"
                key='TextField-description-formField'
                label="Description" value={ item.description } size='small'
              />
              <List
                  sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                  aria-labelledby="nested-list-subheader"
                  subheader={
                    <ListSubheader component="div" id="nested-list-subheader"
                      sx={{ display: 'flex', }}>
                      <ListItemText primary="Tags" />
                      <Tooltip title="Add new tag">
                        <ListItemIcon onClick={ () => {} }>
                          <Add />
                        </ListItemIcon>
                      </Tooltip>
                    </ListSubheader>
                  }>
                <Collapse in={tagCollapsed} timeout="auto" >
                  <List component="div" disablePadding>
                    {
                      item.tags.map((tagItem: string) => (
                        <ListItem key={ 'tag-' + tagItem + 'formField' }>
                          <ListItemIcon/>
                          <ListItemText key={ 'tag-' + tagItem + 'formField' }
                              primary={ tagItem } />
                        </ListItem>
                      ))
                    }
                  </List>
                </Collapse>
              </List>
            </Box>
          </Box>
        </Box>
      </Fragment>
    </Modal>
  );
}


export function ItemModalDisabled(
  { item, open , handleOpen, handleClose, handleEdit, handleDelete
  }: {
    item: IProtoItem,
    open: boolean,
    handleOpen: () => void,
    handleClose: () => void,
    handleEdit: (value: IProtoItem) => void,
    handleDelete: (value: IProtoItem) => void,

  }
): ReactNode {
  const [tagCollapsed, setTagCollapsed] = useState(true);
  const router = useRouter();

  return (
    <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
      <Fragment>
        <Box sx={modalStyle}>
          <Box  sx={{width: '100%', flexGrow: 1,
                height: '100%', justifyContent: 'center', alignItems: 'center',}}>
            <Stack  spacing={ 2 } direction="row" key={ item.title + '-Buttons' }
                    sx={{ width: '100%', justifyContent: 'space-around',
                       dislay: 'inline-flex', p: 1,
                    }}>
              <IconButton onClick={handleClose}>
                <Tooltip title="Close"><Close/></Tooltip>
              </IconButton>
              {/* <IconButton onClick={ () => router.push(`/item/${item.id}/update`) }> */}
              <IconButton onClick={() => handleEdit(item)}>
                <Tooltip title="Edit"><Create/></Tooltip>
              </IconButton>
              {/* <IconButton onClick={ () => router.push(`/item/${item.id}/delete`)  }> */}
              <IconButton onClick={ () => handleDelete(item) }>
                <Tooltip title="Delete"><Delete/></Tooltip>
              </IconButton>
            </Stack>
            <Box
                component="form" key={ item.title + '-Box' }
                noValidate autoComplete="off"
                sx={{
                  width: '100%',  p: 2, overflow: 'auto',
                  maxHeight: { xs: 360, sm: 480, md: 600, lg: 720, xl: 840 },
                  '& .MuiTextField-root': {
                    m: 1, width: '100%', maxWidth: 640,
                  },
                }}
              >


              <TextField disabled required multiline variant="standard"
                  key='TextField-title-formField'
                  label="Summary" value={ item.summary } size='small'
              />
              <TextField disabled required multiline variant="standard"
                key={ 'TextField-note-formField' }
                label="Note" value={ item.note } size='small'
              />
              <TextField disabled required multiline variant="standard"
                key='TextField-description-formField'
                label="Description" value={ item.description } size='small'
              />
              <List
                  sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                  aria-labelledby="nested-list-subheader"
                  subheader={
                    <ListSubheader component="div" id="nested-list-subheader"
                      sx={{ display: 'flex', opacity: 0.54 }}>
                      <ListItemText primary="Tags" />
                      <Tooltip title="Add new tag">
                        <ListItemIcon onClick={ () => {} }>
                          <Add />
                        </ListItemIcon>
                      </Tooltip>
                    </ListSubheader>
                  }>
                <Collapse in={tagCollapsed} timeout="auto" >
                  <List component="div" disablePadding>
                    {
                      item.tags.map((tagItem: string) => (
                        <ListItem key={ 'tag-' + tagItem + 'formField' }>
                          <ListItemIcon/>
                          <ListItemText key={ 'tag-' + tagItem + 'formField' }
                              primary={ tagItem } sx={{ opacity: 0.54 }}/>
                        </ListItem>
                      ))
                    }
                  </List>
                </Collapse>
              </List>
            </Box>
          </Box>
        </Box>
      </Fragment>
    </Modal>
  );
}
