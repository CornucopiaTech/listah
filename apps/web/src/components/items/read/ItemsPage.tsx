
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



import { useItemsStore, } from '@/lib/store/items/ItemsStoreProvider';
import { AppBarHeight } from '@/lib/model/appNavBarModel';
import type { ItemProto, ItemsProto, ZItemsProto, ItemsStore } from '@/lib/model/ItemsModel';
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
  const itemStore: ItemsStore = useItemsStore((state) => state);
  const webState = useContext(WebAppContext);


  function handlePageChange(event: React.ChangeEvent<unknown>, value: number) {
    itemStore.updateItemsCurrentPage(value);
  };

  function handlePageCountChange(event: React.ChangeEvent<unknown>) {
    itemStore.updateItemsPageRecordCount(event.target.value);
  };

  function handleClick(item: ItemProto) {
    // router.push(`/item/${item.id}`);
  }


  const { isPending, isError, data, error }: UseQueryResult<ItemsProto> = useQuery(getItemsGroupOptions(webState.userId, itemStore.categoryFilter, itemStore.tagFilter, itemStore.currentPage, itemStore.itemsPerPage));

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
  const maxPages = Math.ceil(totalRecords / itemStore.itemsPerPage);

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
              <Pagination count={maxPages} page={itemStore.currentPage} onChange={handlePageChange} />
              <MenuSelect defaultValue={itemStore.itemsPerPage}
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
              <ListItemButton key={item.id} onClick={() => handleClick(item)}>
                <ListItemText primary={item.summary} />
                <Link href={`/item/${item.id}`} >View More</Link>
              </ListItemButton>
              <Divider />
            </Fragment>
          }
          // components={{ Footer: Footer }}
        />

        <Box  key='foot-content'>
          <Box key='navigation' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center"}}>
            <Box key='navigation' sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: "center"}}>
              <Pagination count={maxPages} page={itemStore.currentPage} onChange={handlePageChange} />
              <MenuSelect defaultValue={itemStore.itemsPerPage}
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
