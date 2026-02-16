import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { InputParser } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadParsers(): Promise<InputParser[]> {
  const files = readdirSync(__dirname).filter(
    (f) => f.endsWith("_parser.ts") || f.endsWith("_parser.js")
  );

  const parsers: InputParser[] = [];
  for (const file of files) {
    const mod = await import(pathToFileURL(join(__dirname, file)).href);
    const ParserClass = Object.values(mod).find(
      (v): v is new () => InputParser =>
        typeof v === "function" && "prototype" in v && v.prototype?.detect
    );
    if (ParserClass) parsers.push(new ParserClass());
  }

  return parsers.sort((a, b) => a.priority - b.priority);
}
