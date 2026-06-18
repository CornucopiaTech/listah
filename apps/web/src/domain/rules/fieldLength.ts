import type {
  ITag,
} from "@/domain/entities/tag";


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
