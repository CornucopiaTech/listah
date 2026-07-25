
export type IRouteStrings = "/" | "/tags" | "__root__" | "/filters";

export type IBreadcrumbContext = {
  addNewItemClick: () => void,
  addNewFilterClick: () => void,
  addNewTagClick: () => void,
  breadcrumbClick: () => void,
  breadcrumbTail: string | null,
  route: string,
}
