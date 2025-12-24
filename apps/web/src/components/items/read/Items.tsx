
import {
  Fragment,
  type ReactNode,
  useContext,
} from 'react';
import {
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
import { Navigate, useNavigate } from '@tanstack/react-router';
import {
  Box,
  Divider,
  Pagination,
  Link,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import * as z from "zod";
import { Virtuoso } from 'react-virtuoso';



// Internal store
import { encodeState } from '@/lib/utils/encoders';
import { useBoundStore } from '@/lib/store/boundStore';
import { AppBarHeight } from '@/lib/model/appNavBarModel';
import type { ItemProto, ItemsProto, IItemsSearch } from '@/lib/model/ItemsModel';
import { ItemsProtoSchema, ItemProtoSchema } from '@/lib/model/ItemsModel';
import type { IListingState, IDetailState } from '@/lib/model/ItemsModel';
import Loading from '@/components/common/Loading';
import { ErrorAlerts } from '@/components/common/ErrorAlert';
import ItemsNoContent from './ItemsNoContent';
import { getItemsGroupOptions } from '@/lib/utils/itemHelper';
import { WebAppContext } from "@/lib/context/webappContext";
import { ItemsDrawer } from "./ItemsDrawer";
import MenuSelect from '@/components/common/MenuSelect';
import { DefaultQueryParams, ITEMS_URL } from '@/lib/utils/defaults';



const menuItemsOptions = [
  { label: 10, value: 10 }, { label: 20, value: 20 },
  { label: 50, value: 50 }, { label: 100, value: 100 }
]

const defaultPageSize = 50;


export default function Items({ query }: { query: IItemsSearch }): ReactNode {
  const webState = useContext(WebAppContext);
  const store = useBoundStore((state) => state);
  const navigate = useNavigate();

  // navigate({ search: encodeState(query)});

  console.info("In Component - Items");
  console.info(query);
  console.info(query.pageSize);


  function handlePageChange(event: React.ChangeEvent<unknown>, value: number) {
    const q = { ...query, pageNumber: value };
    const encoded = encodeState(q);
    console.info("In handlePageChange - Encoded ", encoded);
    navigate({ to: ITEMS_URL, search: { s: encoded } });
  };

  function handlePageCountChange(e: React.ChangeEvent<unknown>) {
    // store.setItemsPerPage(e.target.value);
    const q = { ...query, pageSize: e.target.value };
    const encoded = encodeState(q);
    console.info("In handlePageChange - q ", q);
    console.info("In handlePageChange - Encoded ", encoded);
    navigate({ to: ITEMS_URL, search: { s: encoded } });
  };


  const {
    isPending, isError, data, error
  }: UseQueryResult<ItemsProto> = useQuery(
    getItemsGroupOptions(
      webState.userId, query.categoryFilter, query.tagFilter,
      query.pageNumber, query.pageSize, query.searchQuery,
      query.fromDate, query.toDate, query.sortQuery
    )
  );

  if (isPending) { return <Loading />; }
  // ToDo: Fix this error message
  if (isError) {return <ErrorAlerts>Error: {error.message}</ErrorAlerts>;}

  try{
    ItemsProtoSchema.parse(data);
  } catch(error){
    if(error instanceof z.ZodError){
      console.info("Zod issue - ", error.issues);
      return <ErrorAlerts>An error occurred. Please try again</ErrorAlerts>;
    } else {
      console.info("Other issue - ", error);
      return <ErrorAlerts>An error occurred. Please try again</ErrorAlerts>;
    }
  }


  const allTag = data.tag ? data.tag : [];
  const allCategory = data.category ? data.category : [];
  const items: ItemProto[] = data.items ? data.items : [];
  const totalRecords: number = data.pageSize ? data.pageSize : 1;
  const maxPages = Math.ceil(totalRecords / query.pageSize);

  if (!items || items.length == 0) { return <ItemsNoContent tag={allTag} category={allCategory} query={query} />;}


  return (
    <Fragment>
      <Box
        sx={{ maxHeight: '720px', mt: AppBarHeight, p: 1 }}>

        <Box  key='head-content' sx={{ mt: 0, }}>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center"}}>
            <Box key='drawer' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: "center"}}>
              <ItemsDrawer tag={allTag} category={allCategory} query={query}/>
                {/* <ItemsSearch /> */}
            </Box>
            <Box key='navigation' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center"}}>
              <Pagination
                count={maxPages} page={query.pageNumber}
                onChange={handlePageChange}
              />
              <MenuSelect
                // defaultValue={defaultPageSize}
                defaultValue={query.pageSize}
                handleChange={handlePageCountChange}
                formHelperText="Items per page" label="Page count"
                menuItems={menuItemsOptions}/>
            </Box>
          </Box>
        </Box>


        <Virtuoso key="data-content"
          style={{ height: '70vh', width: '100%', display: 'block', overflow: 'auto', }}
          data={items}
          itemContent={(_, item) =>
            <Fragment key={item.id}>
              <Link href={`/items/${item.id}`} underline="hover">
                <ListItemButton key={item.id}>
                <ListItemText primary={item.summary} />
                </ListItemButton>
              </Link>
              <Divider />
            </Fragment>
          }
        />

        <Box  key='foot-content'>
          <Box key='navigation' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center"}}>
            <Box key='navigation' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center"}}>
              <Pagination count={maxPages} page={query.pageNumber} onChange={handlePageChange} />
              <MenuSelect
                // defaultValue={defaultPageSize}
                defaultValue={query.pageSize}
                handleChange={handlePageCountChange}
                formHelperText="Items per page" label="Page count"
                menuItems={menuItemsOptions}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
}
