//  @ts-check
import {  globalIgnores } from "eslint/config";
import { tanstackConfig } from "@tanstack/eslint-config";

export default [...tanstackConfig,
  globalIgnores([
    ".config/*",
    "**/routeTree.gen.ts"]
)];
