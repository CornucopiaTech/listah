
import {
  Suspense,
  useContext,
  type ReactNode,
} from 'react';
import {
  useNavigate,
} from '@tanstack/react-router';
import {
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  Select
} from '@mui/material';




import { encodeState } from '@/lib/utils/encoders';
import type { IItemsSearch } from '@/lib/model/ItemsModel';
import { ITEMS_URL, PAGE_SIZE_OPTIONS } from '@/lib/utils/defaults';
import { ItemSearchQueryContext } from '@/lib/context/itemSearchQueryContext';
import Loading from '@/components/common/Loading';
import { ErrorAlerts } from '@/components/common/ErrorAlert';


export default function MenuSelect(): ReactNode {
  const query: IItemsSearch = useContext(ItemSearchQueryContext);
  const navigate = useNavigate();

  console.info("In MenuSelect", query);

  function handlePageSizeChange(e: React.ChangeEvent<unknown>) {
    const q = { ...query, pageSize: e.target.value };
    const encoded = encodeState(q);
    console.info("In handlePageChange - q ", q);
    console.info("In handlePageChange - Encoded ", encoded);
    navigate({ to: ITEMS_URL, search: { s: encoded } });
  };


  const label: string = "Page count";


  return (
    <Suspense fallback={<Loading />}>
      <div>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="ItemsSelectMenuLabel">{label}</InputLabel>
          <Select
              labelId="ItemsSelectMenuLabel"
              id={"ItemsSelectMenuLabel"}
              value={query.pageSize}
              label="Page count"
              onChange={handlePageSizeChange}
            >
            {
              PAGE_SIZE_OPTIONS.map(
                (val: any, ) => (
                  <MenuItem value={val.value}>{val.label}</MenuItem>
                )
              )
            }
          </Select>
          <FormHelperText>Items per page</FormHelperText>
        </FormControl>
      </div>
    </Suspense>
  );
}
