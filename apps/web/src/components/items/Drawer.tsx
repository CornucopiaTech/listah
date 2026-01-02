import {
  useContext,
} from 'react';
import type {
  ReactNode,
} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TuneIcon from '@mui/icons-material/Tune';
import {
  useNavigate,
} from '@tanstack/react-router';



import { encodeState } from '@/lib/helper/encoders';
import { ITEMS_URL } from '@/lib/helper/defaults';
import { useBoundStore } from '@/lib/store/boundStore';
import type { IItemsSearch } from '@/lib/model/Items';
import CategoryDrawer from '@/components/items/CategoryDrawer';
import TagDrawer from '@/components/items/TagDrawer';
import { ItemSearchQueryContext } from '@/lib/context/itemSearchQueryContext';



export default function Draws(): ReactNode {
  const store = useBoundStore((state) => state);
  const query: IItemsSearch = useContext(ItemSearchQueryContext);

  const navigate = useNavigate();
  const bottomMargin: number = 2;
  const topMargin: number = 1;


  function handleApplyFilter() {
    const q = {
      ...query,
      pageNumber: 1,
      categoryFilter: [...query.categoryFilter, ...store.checkedCategory],
      tagFilter: [...query.tagFilter, ...store.checkedTag]
    };
    const encoded = encodeState(q);
    console.info("In handlePageChange - Encoded ", encoded);
    store.setDrawer(false);
    store.setCheckedCategory(new Set([]));
    store.setCheckedTag(new Set([]));
    navigate({ to: ITEMS_URL, search: { s: encoded } });
  }

  function handleResetFilter() {
    store.setCheckedCategory(new Set([]));
    store.setCheckedTag(new Set([]));
    store.setSearchQuery("");
    store.setFromDate("");
    store.setToDate("");
    store.setDrawer(false);

    const q = { ...query, pageNumber: 1, categoryFilter: [], tagFilter: []};
    const encoded = encodeState(q);
    console.info("In handlePageChange - Encoded ", encoded);
    navigate({ to: ITEMS_URL, search: { s: encoded } });
  }


  return (
    <Box key='drawer' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: "center" }}>
      <Button onClick={() => store.setDrawer(true)} startIcon={<TuneIcon />}>
        Filter
      </Button>
      <Drawer open={store.drawer} onClose={() => store.setDrawer(false)}>
        <Box sx={{ width: 360, my: '10%', height: '100vh', overflow: 'auto', }} role="presentation" >

          <CategoryDrawer />
          <Divider sx={{ mb: bottomMargin, mt: topMargin }} />
          <TagDrawer />
          <Divider sx={{ mb: bottomMargin, mt: topMargin }} />

          <Box sx={{ display: 'flex', width: '100', justifyContent: 'space-between', }}>
            <Button onClick={handleApplyFilter}> Apply</Button>
            <Button onClick={handleResetFilter}> Reset</Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};
