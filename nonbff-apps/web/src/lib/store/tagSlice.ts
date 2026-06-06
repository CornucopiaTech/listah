import type { StateCreator } from 'zustand';



import type {
  ITagState,
  ITagSlice,
  IStore,
} from '@/lib/model/store';
import type {
  ITag,
} from "@/lib/model/tag";




export const tagInitState: ITagState = {
  tagModal: false,
  displayTag: undefined,
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
  reset: () => set(tagInitState),
});
