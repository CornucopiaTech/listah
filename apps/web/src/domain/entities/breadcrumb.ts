
export type IRouteStrings = "/" | "/items" | "/tags" | "__root__" | "/filters";

export type IBreadcrumbContext = {
  breadcrumbClick: () => void,
  breadcrumbTail: string | null,
}
