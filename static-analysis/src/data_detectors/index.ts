import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { DataDetector } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadDetectors(): Promise<DataDetector[]> {
  const files = readdirSync(__dirname).filter(
    (f) =>
      (f.endsWith("_detector.ts") || f.endsWith("_detector.js")) &&
      f !== "types.ts" &&
      f !== "index.ts"
  );

  const detectors: DataDetector[] = [];
  for (const file of files) {
    const mod = await import(pathToFileURL(join(__dirname, file)).href);
    const DetectorClass = Object.values(mod).find(
      (v): v is new () => DataDetector =>
        typeof v === "function" && "prototype" in v && v.prototype?.detect
    );
    if (DetectorClass) detectors.push(new DetectorClass());
  }

  return detectors;
}
