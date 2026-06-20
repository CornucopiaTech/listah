
import {
  validateName,
  validateTagProps,
  validateFilterFormTag,
} from "./fieldLength";

import type {
  ITag,
  IFilterForm,
} from '@/domain/entities';



export function tagFormValidator({ value }: { value: ITag }) {
  const invalidName = validateName(value.name as string);
  if (invalidName) {
    return invalidName;
  }

  const invalidProps = validateTagProps(value.props);
  if (invalidProps) {
    return invalidProps
  }
  return undefined;
}

export function filterFormValidator({ value }: { value: IFilterForm }) {
  const invalidName = validateName(value.name as string);
  if (invalidName) {
    return invalidName;
  }

  const invalidTag = validateFilterFormTag(value.tags);
  if (invalidTag) {
    return invalidTag
  }
  return undefined;
}

export function itemFormValidator({ value }: { value: IFilterForm }) {
  const invalidName = validateName(value.name as string);
  if (invalidName) {
    return invalidName;
  }

  const invalidTag = validateFilterFormTag(value.tags);
  if (invalidTag) {
    return invalidTag
  }
  return undefined;
}
