import type { StateCreator } from 'zustand';



import type {
  ITagState,
  ITagSlice,
  IStore,
  ITag,
} from "@/domain/entities";




export const tagInitState: ITagState = {
  tagModal: false,
  displayTag: undefined,
  tagScroll: 0,
  tagAlertMsg: undefined,
  alertMsg: undefined,
}

export const createTagSlice: StateCreator<
  IStore,
  [['zustand/devtools', never]],
  [],
  ITagSlice
> = (set) => ({
  ...tagInitState,
  setTagModal: (tagModal: boolean) => set(() => ({ tagModal })),
  setDisplayTag: (displayTag: undefined | ITag) => set(() => ({ displayTag })),
  setTagScroll: (tagScroll: undefined | number) => set(() => ({ tagScroll })),
  setTagAlertMsg: (tagAlertMsg: undefined | string) => set(() => ({ tagAlertMsg })),
  setAlertMsg: (alertMsg: undefined | string) => set(() => ({ alertMsg })),
  reset: () => set(tagInitState),
});
