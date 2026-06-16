import type { StateCreator } from 'zustand';



import type {
  ITagState,
  ITagSlice,
  IStore,
} from '@/entities/store';
import type {
  ITag,
} from "@/entities/tag";




export const tagInitState: ITagState = {
  tagModal: false,
  displayTag: undefined,
  tagScroll: 0,
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
  reset: () => set(tagInitState),
});
