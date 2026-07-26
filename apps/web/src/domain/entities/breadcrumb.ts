
export type IRouteStrings = "/" | "__root__" | "/tags" | "/filters" | "/items";

export type IBreadcrumbContext = {
  addNewItemClick: () => void,
  addNewFilterClick: () => void,
  addNewTagClick: () => void,
  breadcrumbClick: () => void,
  breadcrumbTail: string | null,
  route: string,
  parent: string,
}
