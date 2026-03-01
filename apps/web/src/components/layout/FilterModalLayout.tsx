
import type {
  ReactNode,
  ChangeEvent,
  MouseEvent,
} from 'react';
import {
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
import * as z from "zod";
import {
  useNavigate,
} from '@tanstack/react-router';
import Drawer from '@mui/material/Drawer';
import { Fragment } from "react";
import { Virtuoso } from 'react-virtuoso';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';




import { AppCategoryListPaper } from "@/components/core/AppPaper";
import { AppListHeaderBar } from "@/components/core/AppListHeaderBar";
import { AppH5ButtonTypography } from "@/components/core/ButtonTypography";
import { AppH6Typography } from "@/components/core/Typography";
import { AppSectionStack } from "@/components/core/AppBox";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import type {
  ICategory,
  ICategoryRequest,
  ICategoryResponse,
} from "@/lib/model/category";
import {
  ZCategoryResponse,
} from "@/lib/model/category";
import { CategoryList } from "@/components/core/CategoryList";
import { useSearchQuery } from '@/lib/context/queryContext';
import { categoryGroupOptions } from '@/lib/helper/querying';
import Loading from '@/components/common/Loading';
import { ErrorAlert } from "@/components/core/Alerts";
import { encodeState } from '@/lib/helper/encoders';
import { FilterModal } from "@/components/core/FilterModal";



export function FilterDrawer(): ReactNode {
  const store: TBoundStore = useBoundStore((state) => state);

  const query: ICategoryRequest = useSearchQuery();
  const navigate = useNavigate();
  const {
    isPending, isError, data, error
  }: UseQueryResult<ICategoryResponse> = useQuery(categoryGroupOptions(query));


  if (isPending) { return <Loading />; }
  if (isError) { return <ErrorAlert message={error.message} />; }

  try{
    ZCategoryResponse.parse(data);
  } catch(error){
    if(error instanceof z.ZodError){
      console.info("Zod issue - ", error.issues);
      return <ErrorAlert message="An error occurred. Please try again" />;
    } else {
      console.info("Other issue - ", error);
      return <ErrorAlert message="An error occurred. Please try again" />;
    }
  }

  const categories: ICategory[] = data && data.categories ? data.categories : [];


  function handleTagClick(item: ICategory) {
    // const encodedState = encodeState({
    //   category: item.category,
    // });
    // navigate({ to: "/search", search: `?q=${encodedState}` });
  }


  function eachItem(itemKey: number, item: ICategory): ReactNode {
    const tc: string = item.category ? item.category : ""
    return (
      <ListItem
        // style={{ height: 50, width: "100%", }}
        key={itemKey + tc}
        // component="div"
        disablePadding
        onClick={() => handleTagClick(item)}
      >
        <ListItemButton>
          <Chip sx={{ background: "primary" }} label={item.rowCount} />
        </ListItemButton>
      </ListItem>
    );
  }


  return (
    <Fragment key="filter">
      <Drawer anchor="right" open={store.drawer} onClose={() => store.setDrawer(false)}>
        <AppCategoryListPaper>
          <AppSectionStack>
            <AppListHeaderBar key="header">
              <AppH5ButtonTypography> Create Filter </AppH5ButtonTypography>
            </AppListHeaderBar>
            {
              categories.length > 0 && <Virtuoso key="data-content"
                style={{
                  height: `60vh`,
                  width: '100%', display: 'block', overflow: 'auto',
                }}
                data={categories}
                itemContent={(itemIndex, item) => eachItem(itemIndex, item)}
              />
            }
            {
              categories.length == 0 &&
              <Box key="data-content"
                style={{
                  height: `60vh`,
                  width: '100%', display: 'block', overflow: 'auto',
                }}>
                <AppH6Typography> No tags found </AppH6Typography>
              </Box>
            }

            {/* <TablePagination
              component="div"
              count={count} page={page}
              onPageChange={onPageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={onRowsPerPageChange}
            /> */}
          </AppSectionStack>
        </AppCategoryListPaper>
      </Drawer>
    </Fragment>
  );
}
