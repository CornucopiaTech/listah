import Fab from '@mui/material/Fab';
import { Icon } from "@iconify/react";



import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';



export function FilterFab() {
  const store: TBoundStore = useBoundStore((state) => state);


  function handleFilterClick() {
    store.setFilterModal(true);
  }

  return (
    <Fab color="primary" size="medium" onClick={handleFilterClick}>
      <Icon icon="material-symbols:filter-alt" width="24" height="24" />
    </Fab>
  );
}
