
import { ItemsSearchSchema } from '@/lib/model/ItemsModel';
import { decodeState } from '@/lib/utils/encoders';
import { DefaultQueryParams } from '@/lib/utils/defaults';


export function validateItemsUrlSearch(params: any) {
  if (!params || Object.keys(params).length === 0  || !params.s) {
    console.info("In validateItemQueryParams - using default");
    // return null;
    return DefaultQueryParams;
  }

  console.info("In validateItemQueryParams - Raw ");
  console.info(params);
  const dcd = decodeState(params.s);
  const parsed = ItemsSearchSchema.safeParse(dcd);

  console.info("In validateItemQueryParams - Decoded ");
  console.info(dcd);
  console.info("In validateItemQueryParams - Parsed ");
  console.info(parsed);

  return parsed.data

}
