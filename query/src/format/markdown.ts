/**
 * Result formatting for Claude consumption.
 */

import type { SearchHit } from "../types.js";

/** Format search results as markdown */
export function formatResults(results: SearchHit[], searchMode: string): string {
  if (results.length === 0) return "No results found.";

  const parts: string[] = [];

  if (searchMode) {
    parts.push(`_Search mode: ${searchMode}_\n`);
  }

  for (let i = 0; i < results.length; i++) {
    const hit = results[i];
    const payload = hit.payload;
    const title = payload.title || payload.filename || "untitled";
    const filename = payload.filename || "";
    const docType = payload.type || "unknown";
    const document = payload.document || "";
    const refs = payload.references || [];

    const header = `### Result ${i + 1}: ${title}`;
    const metaParts = [`score=${hit.score.toFixed(3)}`, `type=${docType}`];
    if (filename) metaParts.push(`file=${filename}`);
    const meta = metaParts.join(" | ");

    const resultParts = [header, `_${meta}_`, "", document];

    if (refs.length > 0) {
      resultParts.push("\n**Related chunks:**");
      for (const ref of refs) {
        resultParts.push(`- \`${ref.chunk}\` \u2014 ${ref.description}`);
      }
    }

    parts.push(resultParts.join("\n"));
  }

  return parts.join("\n\n---\n\n");
}
