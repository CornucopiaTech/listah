import { useDispatch, useSelector } from 'react-redux';

// Components
import {
  Box,
  Drawer,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TuneIcon from '@mui/icons-material/Tune';

import type {
  AppDispatch,
  RootState
} from 'app/store';

import {
  selectItem,
  AddFilter, //Add logic to take care of removing or adding filters.
  ChangeEditStatus,
  ChangeSelectedItemDescription,
  ChangeSelectedItemNote,
  ChangeSelectedItemSummary,
  ChangeSelectedItemTags,
  ChangeSelectedItemTitle,
  ChooseSelectedItem,
  CloseFilterDrawer,
  CreateSelectedItemNewTag,
  DeleteSelectedItemTag,
  OpenFilterDrawer,
  ResetFilter,
  SaveUpdatedItem,
  ToggleCollapseTags,
  ToggleFilterDrawer,
  AddNewTagToSelectedItem,
  SetStateAfterItemSave,
  ResetState,
  AddCategoryFilter,
  AddTagFilter,
} from '~/hooks/state/itemSlice';
import type { ItemStateInterface } from '~/model/items';

import {
  getAllCategories,
  getAllTags
} from 'app/repository/fetcher';



export function ItemFilter() {
  const useAppDispatch = useDispatch.withTypes<AppDispatch>().withTypes<AppDispatch>()
  const dispatch = useAppDispatch();

  const useAppSelector = useSelector.withTypes<RootState>()
  const itemState: ItemStateInterface = useAppSelector(selectItem);

  const tags: string [] = getAllTags();
  const categories: string [] = getAllCategories();

  const DrawerList = (
    <Box  component='form' sx={{ width: 250, p:2, my: 6}}
          role="presentation" >
      <Accordion defaultExpanded sx={{ boxShadow: 1,}}>
        <AccordionSummary
              expandIcon={ <ArrowDropDownIcon /> }
              aria-controls="panel1-content"
              id="panel1-header">
          <Typography>Category</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ maxHeight: 300, overflow: 'auto', }}>
          <FormGroup>{
              categories.map((item: string) => (
                <FormControlLabel
                        key={item + '-checkBoxFormControlLabel'}
                        control={ <Checkbox /> }
                        label={ item }
                        checked={ itemState.categoryFilters.includes(item) }
                        name={ item }
                        onChange={ (e) => dispatch(AddCategoryFilter({filterName: item, filterChecked: e.target.checked}))}
                    />
              ))
          }</FormGroup>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded sx={{ boxShadow: 1 }}>
        <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel2-header">
          <Typography>Tags</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ maxHeight: 300, overflow: 'auto', }}>
          <FormGroup>{
            tags.map((item: string) => (
                <FormControlLabel
                  key={item + '-checkBoxFormControlLabel'}
                  control={<Checkbox />}
                  label={item}
                  checked={ itemState.tagFilters.includes(item) }
                  name={item}
                  onChange={(e) => dispatch(AddTagFilter({filterName: item, filterChecked: e.target.checked }))}
                />
            ))
          }</FormGroup>
        </AccordionDetails>
      </Accordion>
      <Box sx={{ width: '100', my: 6, justifyContent: 'space-around', }}>
        <Button
                sx={{ justifyContent: 'space-around', mx:2, }}
                onClick={() => dispatch(ResetFilter())}>
          Reset
        </Button>
        <Button
                sx={{ justifyContent: 'space-around', mx: 2, }}
                onClick={() => dispatch(CloseFilterDrawer())}>
          Close
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ mx: 3, }}>
      <Button onClick={(e) => {
                e.stopPropagation();
                dispatch(OpenFilterDrawer());
              }}
          startIcon={<TuneIcon />}>
        Filter
      </Button>

      <Drawer open={itemState.filterDrawerStatus}
              onClose={() => dispatch(CloseFilterDrawer())}>
        {DrawerList}
      </Drawer>
    </Box>);
}
