

import type { ReactNode } from "react";
import { Fragment } from "react";


import type { CategoryGroup } from '@/lib/model/common';
import { CategoryList } from "@/components/core/CategoryList";



// const modelData: CategoryGroup[] = [
//   { title: "Saved Filter 1", numberOfItems: 10 },
//   { title: "Saved Filter 2", numberOfItems: 20 },
//   { title: "Saved Filter 3", numberOfItems: 30 },
//   { title: "Saved Filter 4", numberOfItems: 40 },
//   { title: "Saved Filter 5", numberOfItems: 50 },
// ];

const emptyModelData: CategoryGroup[] = [];

export function SavedFilterListLayout(): ReactNode {

  return (
    <Fragment>
      {/* <CategoryList title="Saved Filters" data={modelData} /> */}
      <CategoryList
          title="Saved Filters" data={emptyModelData}
          handleItemClick={ () => (1 + 1) }
      />
    </Fragment>
  );
}
