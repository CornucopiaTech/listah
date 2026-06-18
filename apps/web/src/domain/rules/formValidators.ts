import type {
  ITag,
} from "@/domain/entities/tag";
import {
  validateName,
  validateTagProps,
} from "./fieldLength";




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
