import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';


import { DEFAULT_ITEM } from "@/lib/helper/defaults";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';



export function NewItemFab() {
  const store: TBoundStore = useBoundStore((state) => state);


  function handleItemClick() {
    store.setDisplayId("");
    store.setDisplayItem(DEFAULT_ITEM);
    store.setModal(true);
  }

  return (
    <Fab color="primary" onClick={handleItemClick}> <AddIcon /> </Fab>
  );
}
