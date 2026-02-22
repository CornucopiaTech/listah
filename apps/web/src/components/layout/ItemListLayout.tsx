import type { ReactNode } from "react";
import { Fragment } from "react";
import {
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
import * as z from "zod";


import { ItemList } from "@/components/core/ItemList";
import type {
  IItem,
  IItemRequest,
  IItemResponse,
} from "@/lib/model/item";
import {
  ZItemResponse,
} from "@/lib/model/item";
import {
  useBoundStore,
  type TBoundStore
} from '@/lib/store/boundStore';
import { AppItemModal } from "@/components/core/AppItemModal";
// import { DEFAULT_ITEM } from "@/lib/helper/defaults";
import { useSearchQuery } from '@/lib/context/queryContext';
import { itemGroupOptions } from '@/lib/helper/querying';
import Loading from '@/components/common/Loading';
import { Error } from '@/components/common/Error';



export function ItemListLayout(): ReactNode {
  // ToDo: Define mutation
  const mutateItem = (anitem: IItem) => console.log(anitem);
  const store: TBoundStore = useBoundStore((state) => state);
  const query: IItemRequest = useSearchQuery();
  const {
    isPending, isError, data, error
  }: UseQueryResult<IItemResponse> = useQuery(itemGroupOptions(query));

  if (isPending) { return <Loading />; }
  if (isError) { return <Error message={error.message} />; }

  try{
    ZItemResponse.parse(data);
  } catch(error){
    if(error instanceof z.ZodError){
      console.info("Zod issue - ", error.issues);
      return <Error message="An error occurred. Please try again" />;
    } else {
      console.info("Other issue - ", error);
      return <Error message="An error occurred. Please try again" />;
    }
  }

  const items: IItem[] = data && data.items ? data.items : [];

  return (
    <Fragment>
      {store.modal && <AppItemModal mutateItem={mutateItem} />}
      <ItemList title="Category - CHANGE ME " data={items} />
    </Fragment>
  );
}
