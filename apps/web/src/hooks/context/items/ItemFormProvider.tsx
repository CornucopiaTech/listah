
import {
  useMemo,
  useRef,
} from 'react';
import type {
  ReactNode,
} from 'react';
import { useUser } from '@clerk/react';
import {
  useForm,
} from "@tanstack/react-form";
import {
  useNavigate,
  getRouteApi,
} from '@tanstack/react-router';
import {
  type UseQueryResult,
} from '@tanstack/react-query';




// Internal imports
import type {
  ITag,
  IUrlSearch,
  IEditor,
  IRouteStrings,
  ITagReadResponse,
  IItemForm,
  IItemFormContext,
} from "@/domain/entities";
import {
  DefaultEditor,
  DefaultReadRequest,
  DefaultReadQuery,
  DefaultPagination,
  DefaultItem,
} from '@/domain/entities';
import {
  encodeState,
  decodeState
} from '@/helpers/encoders';
import {
  prepItemUpdate,
  validateItemTags,
  validateName,
} from "@/domain/rules";
import {
  useUpdateItem,
  useListTag,
  ItemUpdateContext,
} from "@/hooks/context";




function prepFormData({ item, data, }) {
  const serverTags: ITag[] = data?.tags ?? [];
  const knownServerTagNames = useRef<Set<string>>(new Set(serverTags.map(p => p.name)));


  const serverTagPropMap = new Map<string, { value: string[] }>(Object.entries(data?.tagidPropMap ?? {}));

  // Use the list of all possible tags for the display object using the tags in the item iteself and the tags from the passed tag or passed filter.
  let allItemTags = item && item.tags ? [...item.tags] : [];
  let tgs = item && item.tags ? [...item.tags] : [];
  allItemTags = [...new Set(allItemTags)]
  tgs = [...new Set(tgs)]

  // Use this comprehensive list of tags to get all possible properties for the display item using serverTags.
  let displayItemProps: string[] = []
  allItemTags.forEach(
    (it) => {
      const iVal = serverTagPropMap.get(it);
      if (iVal) {
        displayItemProps = [...displayItemProps, ...iVal.value]
      }
    }
  );
  displayItemProps = [...new Set(displayItemProps)]


  // Get the key-values object for the identified properties.
  const displayItemPropsObj = displayItemProps.map((tg) => {
    const ap = item?.propObjs?.filter(ip => ip.key == tg) ?? []
    if (ap.length == 0) {
      return { key: tg, value: "" }
    }
    return ap[0]
  })

  let tagObj: ITag[] = []
  allItemTags.forEach((tg: string) => {
    const ap = serverTags?.filter(ip => ip.id == tg) ?? [];
    if (ap.length > 0) {
      tagObj = [...tagObj, ap[0]]
    }
  });


  const formData = {
    data: {
      id: item.id, userId: item.userId, name: item.name,
      note: item.note, props: displayItemPropsObj, tags: tagObj,
      softDelete: item.softDelete
    },
    knownTags: knownServerTagNames
  };
  return formData;
}

export function ItemFormProvider({ children, route }: { children: ReactNode, route: IRouteStrings }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const routeApi = getRouteApi(route);
  const { obj, flag, modal } = decodeState(routeApi.useSearch({ select: (search) => search.e, })) as unknown as IEditor;

  const tagQuery = {
    ...DefaultReadRequest,
    query: { ...DefaultReadQuery, userId: user?.id || "" },
    pagination: { ...DefaultPagination, pageSize: -1, }
  }
  const {
    isPending, isError, data, error
  }: UseQueryResult<ITagReadResponse> = useListTag(tagQuery);
  const tags = data?.tags ?? [];




  const item = obj ?? DefaultItem;
  const title = item.id == "" ? "Add new item" : "Update item";
  const formData = prepFormData({ item, data, })



  const mutation = useUpdateItem();
  const formSubmission = ({ value }: { value: IItemForm }) => {
    const submitValue = prepItemUpdate({ value, userId: user?.id || "" });
    mutation.mutate(submitValue);
  };

  function formValidator({ value }: { value: IItemForm }) {
    const invalidName = validateName(value.name as string);
    if (invalidName) {
      return invalidName;
    }

    const invalidTag = validateItemTags(value.tags, formData.knownTags.current);
    if (invalidTag) {
      return invalidTag
    }
    return undefined;
  }

  const form = useForm({
    defaultValues: { ...formData.data },
    onSubmit: formSubmission,
    validators: {
      // @ts-ignore
      onChange({ value }: { value: IItemForm }) {
        return formValidator({ value });
      },
      // @ts-ignore
      onBlur({ value }: { value: IItemForm }) {
        return formValidator({ value });
      },
    },
  });

  const openDialog = flag && modal && modal == "item" ? flag : false;
  const closeDialog = () => {
    form.reset();
    mutation.reset();
    navigate({
      to: ".",
      search: (prev: IUrlSearch) => { return { ...prev, e: encodeState(DefaultEditor) } }
    });
  };


  const contextValue = useMemo(() => ({
    openDialog,
    closeDialog,
    mutation,
    form,
    title,
    tags,
    formData,
    isPending,
    error
  } as unknown as IItemFormContext),
    [obj, flag, modal]
  );

  return <ItemUpdateContext.Provider value={contextValue}>
    {children}
  </ItemUpdateContext.Provider>
}
