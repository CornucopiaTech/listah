
import {
  useContext,
  useEffect,
  // Fragment,
} from 'react';
import type {
  ReactNode,
  // ChangeEvent,
  // MouseEvent,
} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { Icon } from "@iconify/react";
import {
  useNavigate,
} from '@tanstack/react-router';



import { encodeState } from '@/lib/helper/encoders';
import { ITEMS_URL } from '@/lib/helper/defaults';
import { useBoundStore, type  TBoundStore } from '@/lib/store/boundStore';
import type { IItemsSearch } from '@/lib/model/item';
import CategoryDrawer from '@/components/items/CategoryDrawer';
import TagDrawer from '@/components/items/TagDrawer';
import { ItemSearchQueryContext } from '@/lib/context/queryContext';
import { Success } from '@/components/common/Alerts';




export default function Header({ handleAddItem }: { handleAddItem: (item: string) => void}): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);
  const query: IItemsSearch = useContext(ItemSearchQueryContext);
  const navigate = useNavigate();

  function clearMessage() {
    store.setMessage("");
  }

  // Use Effect to show messages
  useEffect(
    () => {
      if (store.message == "") return;
      const timer = setTimeout(clearMessage, 3000); // alert disappears after 3 seconds
      return () => clearTimeout(timer);
    }, [store.message]
  );


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

  const drawerBoxSx = { width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: "center" }
  const bottomMargin: number = 2;
  const topMargin: number = 1;

  return (
    <Box key='drawer' sx={drawerBoxSx}>
      <Tooltip title="Filter items">
        <Button
          onClick={() => store.setDrawer(true)}
          startIcon={<Icon icon="material-symbols:filter-alt-outline" width="24" height="24" />}/>
          {/* Filter */}
      </Tooltip>
      <Tooltip title="Add new item">
        <Button
          onClick={() => handleAddItem("")}
          startIcon={<Icon icon="material-symbols:add" width="24" height="24" />}/>
          {/* Filter */}
      </Tooltip>

      {store.message != "" && <Success message={store.message} />}

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
