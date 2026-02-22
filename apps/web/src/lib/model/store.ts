


// Tag Store
export type  IListingState = {
  message: string
  drawer: boolean
  modal: boolean
  displayId: string
  displayItem: IItem
  searchQuery: string
  checkedTag: Set<string>
  checkedCategory: Set<string>
  fromDate: string
  toDate: string
}
export type IListingActions = {
  setMessage: (message: string) => void
  setDrawer: (drawer: boolean) => void
  setModal: (modal: boolean) => void
  setDisplayId: (displayId: string) => void
  setDisplayItem: (displayItem: IItem) => void
  setSearchQuery: (searchQuery: string) => void
  setCheckedTag: (checkedTag: Set<string>) => void
  setCheckedCategory: (checkedCategory: Set<string>) => void
  setFromDate: (fromDate: string) => void
  setToDate: (toDate: string) => void
  reset: () => void
}
export type IListingSlice = IListingState & IListingActions;



// Items Store
export type  IDetailState = {
  message: string
  drawer: boolean
  modal: boolean
  displayId: string
  searchQuery: string
  checkedTag: Set<string>
  checkedCategory: Set<string>
  fromDate: string
  toDate: string
}
export type IDetailActions = {
  setMessage: (message: string) => void
  setDrawer: (drawer: boolean) => void
  setModal: (modal: boolean) => void
  setDisplayId: (displayId: string) => void
  setSearchQuery: (searchQuery: string) => void
  setCheckedTag: (checkedTag: Set<string>) => void
  setCheckedCategory: (checkedCategory: Set<string>) => void
  setFromDate: (fromDate: string) => void
  setToDate: (toDate: string) => void
  reset: () => void
}
export type IDetailSlice = IDetailState & IDetailActions;
export type IStore = IDetailSlice & IListingSlice;
