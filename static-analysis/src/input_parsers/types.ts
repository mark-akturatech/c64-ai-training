import type { ParsedRegion } from "../types.js";

export interface InputParser {
  name: string;
  extensions: string[];
  priority: number;
  detect(data: Uint8Array, filename: string): number;
  parse(data: Uint8Array, filename: string): ParsedRegion[];
}
