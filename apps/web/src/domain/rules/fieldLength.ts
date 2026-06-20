
import type {
  IFilterFormCheckedTag,
  ITag,
} from '@/domain/entities';


export function validateName(fname: string) {
  if (fname.length < 1) {
    return "tag name is required";
  }
}

export function validateTagProp(value: string) {
  return validateName(value);
}

export function validateTagProps(value: Array<string>) {
  if (value.filter(i => i !== "").length < 1) {
    return "At least one property is required";
  }
}


export function validateFilterFormTag(value: Array<IFilterFormCheckedTag>) {
  let checked: Array<IFilterFormCheckedTag> = value.filter((i) => i.checked);
  if (checked.length < 1) {
    return "At least one tag is required";
  }
}


export function validateItemTags(fTagList: ITag[], knownTags: Set<string>) {
  if (fTagList.filter((t) => t.name != "").length < 1) {
    return "Item must contain one tag at least ";
  }
  const unrecognisedTags = fTagList.filter((t) => t.name != "").filter((t) => !knownTags.has(t.name));
  if (unrecognisedTags.length > 0) {
    const unregognisedNames = unrecognisedTags.map(it => it.name).join(',')
    return `Unrecognised tag(s): (${unregognisedNames}) will not be saved.`;
  }
}


export function validateItemTag(fTag: ITag, knownTags: Set<string>) {
  if (fTag.name === "") {
    return "name is required";
  }
  if (!knownTags.has(fTag.name) && fTag.name != "") {
    return `Unrecognised tag (${fTag.name}) will not be saved. Please add new tag to app.`
  }
}
