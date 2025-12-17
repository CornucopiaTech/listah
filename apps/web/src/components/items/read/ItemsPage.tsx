
import {
  Fragment,
  type ReactNode,
  useContext,
} from 'react';
import {
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
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
import { useAppSelector, useAppDispatch } from '@/lib/state/hook';
import { AppBarHeight } from '@/lib/model/appNavBarModel';
import type { ItemProto, ItemsProto, ZItemsProto } from '@/lib/model/ItemsModel';
import type { IListingState, IDetailState } from '@/lib/model/ItemsModel';
import Loading from '@/components/common/Loading';
import { ErrorAlerts } from '@/components/common/ErrorAlert';
import ItemsNoContent from './ItemsNoContent';
import { getItemsGroupOptions } from '@/lib/utils/itemHelper';
import { WebAppContext } from "@/lib/context/webappContext";
import { ItemsDrawer } from "./ItemsDrawer";
import MenuSelect from '@/components/common/MenuSelect';


const menuItemsOptions = [
  { label: 10, value: 10 }, { label: 20, value: 20 },
  { label: 50, value: 50 }, { label: 100, value: 100 }
]



export default function ItemsPage(): ReactNode {
  const webState = useContext(WebAppContext);
  const listingState = useAppSelector((state) => state.listing);
  const dispatch = useAppDispatch();

  function handlePageChange(event: React.ChangeEvent<unknown>, value: number) {
    dispatch(listingState.setCurrentPage(value));
  };

  function handlePageCountChange(e: React.ChangeEvent<unknown>) {
    // listingState.updateItemsPageRecordCount(event.target.value);
    dispatch(listingState.setItemsPerPage(e.target.value))
  };

  function handleClick(item: ItemProto) {
    listingState.setItem(item);
    listingState.updateNewTag(null);
    // router.push(`/item/${item.id}`);
  }


  const { isPending, isError, data, error }: UseQueryResult<ItemsProto> = useQuery(getItemsGroupOptions(webState.userId, listingState.categoryFilter, listingState.tagFilter, listingState.currentPage, listingState.itemsPerPage));

  if (isPending) { return <Loading />; }
  // ToDo: Fix this error message
  if (isError) {return <ErrorAlerts>Error: {error.message}</ErrorAlerts>;}

  let apiItems: ItemsProto;
  try{
    apiItems = ZItemsProto.parse(data);
  } catch(error){
    if(error instanceof z.ZodError){
      console.info(error.issues);
      return <ErrorAlerts>An error occurred. Please try again</ErrorAlerts>;

    }
  }


  const allTag = data.tag ? data.tag : [];
  const allCategory = data.category ? data.category : [];
  const items: ItemProto[] = data.items ? data.items : [];
  const totalRecords: number = data.totalRecordCount ? data.totalRecordCount : 1;
  const maxPages = Math.ceil(totalRecords / listingState.itemsPerPage);

  if (!items || items.length == 0){return<ItemsNoContent />;}


  return (
    <Fragment>
      <Box
        sx={{ maxHeight: '720px', mt: AppBarHeight, p: 1 }}>

        <Box  key='head-content' sx={{ mt: 0, }}>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: "center"}}>
            <Box key='drawer' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: "center"}}>
              <ItemsDrawer tag={allTag} category={allCategory} />
                {/* <ItemsSearch /> */}
            </Box>
            <Box key='navigation' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center"}}>
              <Pagination
                  count={maxPages} page={listingState.currentPage}
                  onChange={handlePageChange}
              />
              <MenuSelect defaultValue={listingState.itemsPerPage}
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
              <Link href={`/items/${item.id}`} >
                <ListItemButton key={item.id} onClick={() => handleClick(item)}>
                <ListItemText primary={item.summary} />
                </ListItemButton>
              </Link>
              <Divider />
            </Fragment>
          }
        />

        {/* <Virtuoso key="data-content"
          style={{ height: '70vh', width: '100%', display: 'block', overflow: 'auto', }}
          data={items}
          itemContent={(_, item) =>
            <Fragment key={item.id}>
              <ListItemButton key={item.id} onClick={() => handleClick(item)}>
                <ListItemText primary={item.summary} />
                <Link href={`/items/${item.id}`} >View More</Link>
              </ListItemButton>
              <Divider />
            </Fragment>
          }
          // components={{ Footer: Footer }}
        /> */}

        <Box  key='foot-content'>
          <Box key='navigation' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center"}}>
            <Box key='navigation' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center"}}>
              <Pagination count={maxPages} page={listingState.currentPage} onChange={handlePageChange} />
              <MenuSelect defaultValue={listingState.itemsPerPage}
                  handleChange={handlePageCountChange}
                  formHelperText="Items per page" label="Page count"
                  menuItems={menuItemsOptions}/>
            </Box>
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
}
