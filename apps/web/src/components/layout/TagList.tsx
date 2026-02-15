import type { ReactNode } from "react";
import { Fragment } from "react";



import type { CategoryGroup } from '@/lib/model/common';
import { CategoryList } from "../core/CategoryList";



const modelData: CategoryGroup[] = [
  { title: "Tag 1", numberOfItems: 10 },
  { title: "Tag 2", numberOfItems: 20 },
  { title: "Tag 3", numberOfItems: 30 },
  { title: "Tag 4", numberOfItems: 40 },
  { title: "Tag 5", numberOfItems: 50 },
];

export function TagList(): ReactNode {

  return (
    <Fragment>
      <CategoryList title="Tags" data={modelData}
        handleItemClick={() => (1 + 1)}
      />
    </Fragment>
  );
}
