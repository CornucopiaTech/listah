import type {
  ITag,
} from "@/domain/entities/tag";


export function validateName(fname: string) {
  if (fname.length < 1) {
    return "tag name is required";
  }
}

export function validateTagProp(value: string) {
  if (value.length < 1) {
    return "property name is required";
  }
}

export function validateTagProps(value: Array<string>) {
  if (value.filter(i => i !== "").length < 1) {
    return "At least one property is required";
  }
}


export function formValidator({ value }: { value: ITag }) {
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
