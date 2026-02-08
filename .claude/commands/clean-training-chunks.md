---
description: Clean up split training chunks — remove artifacts, normalize whitespace, trim verbosity, ensure self-containment
argument-hint: [filename.txt | (none for all files)]
---

# Clean Training Chunks

Clean up files in `training/split/` after splitting. Removes book/PDF artifacts, normalizes whitespace, trims unnecessary verbosity, and ensures each chunk is self-contained and useful for retrieval.

## Progress Tracking

Use **TodoWrite** to track progress. For full runs, create a todo per batch of files being processed and mark completed as you go.

## Hard Stops

**STOP and ask the user before continuing** if:
- More than 25% of files would be deleted — something may be wrong with the split configs
- A file's content is ambiguous (can't tell if it's garbled junk or a legitimate technical table) — ask rather than guess

## Modes

### No argument — Process all files
If `$ARGUMENTS` is empty, process every `.txt` file in `training/split/`.

### File argument — Single file
If `$ARGUMENTS` is a filename, process only that file in `training/split/`.

## Skip Rules

**Skip** these files entirely (do not read or modify):
- Files starting with `example_` — assembly examples have their own formatting managed by `/document-examples`

## Per-file Processing

For each `.txt` file, read the full content and apply the steps below **in order**. After all steps, write the cleaned content back to the same file.

### Step 1: Strip character artifacts
- Remove BOM characters (`﻿`, U+FEFF) and other zero-width Unicode characters
- Remove standalone tilde page-break lines (lines containing only `~` or `~~`, with optional whitespace)

### Step 2: Remove page markers
Remove lines that are **standalone page markers** — lines that contain only:
- A roman numeral: `i`, `ii`, `iii`, `iv`, `v`, `vi`, `vii`, `viii`, `ix`, `x`, `xi`, `xii`, etc.
- A colon-wrapped roman numeral: `:i:`, `:ii:`, `:iii:`, etc.
- A bare page number: just a number like `46` or `147` on a line by itself

**Be careful**: only remove these when the line contains nothing else (after trimming whitespace). Do NOT remove lines where a number or roman numeral is part of a sentence, list item, table row, or code.

### Step 3: Normalize indentation
Check if the majority (>75%) of non-blank lines share a common leading whitespace prefix (e.g., 26 spaces). If so:
- Strip that common prefix from all lines
- Preserve relative indentation within the content (nested lists, code blocks, sub-sections)

**Exception**: Do NOT strip indentation from lines that look like ASCII art (lines with box-drawing characters like `+`, `|`, `-`, `o`, or lines with significant internal spacing patterns). These are diagrams and must be preserved exactly.

### Step 4: Collapse excess blank lines
- Reduce 3+ consecutive blank lines down to 2
- Remove leading blank lines at the start of the file (after the `#` header line)
- Remove trailing blank lines at the end of the file

### Step 5: Strip trailing whitespace
- Remove trailing spaces/tabs from every line

### Step 6: AI judgment — DELETE or KEEP

After cleaning, read the result and decide whether the file should be **deleted**:

**DELETE** the file if:
- Content is mostly garbled or unreadable (e.g., a PDF table that became disconnected hex addresses/numbers with no explanatory text)
- Content is purely book metadata (copyright notices, ISBN, publisher credits, editor names) with no technical content
- Content is a table of contents or index that somehow wasn't caught by `ignore` in the split config
- Content has no educational value for C64/6502/assembler programming

**KEEP** the file if it contains any of:
- Technical explanations or tutorials (even if rough)
- Register descriptions, memory maps, or address tables with context
- Code examples or hex data with surrounding explanation
- ASCII art diagrams (bus layouts, register maps, chip pinouts)
- Meaningful reference tables (instruction sets, frequency tables, color codes)

When in doubt, **keep** the file. It's better to have a slightly noisy chunk than to lose useful technical content.

### Step 7: Table tidying (light touch)
- If tables have wildly inconsistent column spacing, normalize to consistent alignment
- Do NOT convert plain-text tables to markdown format
- Do NOT reflow or restructure tables — just fix spacing

### Step 8: Trim verbosity

Remove prose that has no technical value when the chunk is retrieved standalone:
- **Transitional filler**: "In the previous sections we discussed...", "As mentioned earlier...", "We will now look at...", "Before we begin..."
- **Author commentary**: "I won't give you source code...", "You might not understand exactly how...", "This is left as an exercise..."
- **Book navigation**: "See Chapter 5 for...", "Refer to the appendix...", "As shown in Figure 3.2..." (unless the figure/table is actually in the chunk)
- **Redundant introductions**: If a paragraph just restates what the `#` header already says, remove it

**Do NOT remove**:
- Technical explanations, even if conversational in tone ("The trick here is to...")
- Motivational context that explains *why* a technique matters ("This is important because the VIC-II only has 63 cycles per line...")
- Caveats and warnings ("Be careful not to write to this register during...")
- Any sentence that contains a register address, opcode, memory location, or technical term

**Guideline**: If removing a sentence would cause a reader to miss any technical fact, keep it. Only remove sentences that are purely structural/navigational prose from the original book format.

### Step 9: Self-containment check

Read the cleaned chunk and check whether it makes sense as a standalone document. Consider: if this chunk is retrieved by a semantic search, will the reader understand it without any other chunks?

**Fix these issues**:

1. **Undefined references**: If the chunk uses a concept without defining it (e.g., mentions "the ADSR envelope" without explaining what ADSR is), add a brief parenthetical:
   - `(The SID ADSR envelope shapes each note's volume through Attack, Decay, Sustain, and Release phases.)`
   - Keep these to one sentence maximum

2. **Dangling context**: If the chunk starts mid-topic (e.g., "Continuing with the sprite registers..."), add a one-line context sentence at the top (after the `#` header):
   - `The VIC-II chip at $D000-$D02E controls all sprite positioning, colors, and display priority on the C64.`

3. **Assumed knowledge**: If the chunk assumes the reader knows something C64-specific that isn't obvious (e.g., what $D018 does, what "opening the border" means), add a minimal inline clarification the first time it appears

**Rules for added context**:
- Keep additions minimal — one sentence max per concept
- Use parenthetical format `(...)` for inline additions so they're visually distinct from original content
- Never add more than 3-4 clarifications per chunk — if it needs more, the split config may need restructuring
- Do NOT add context for basic 6502 knowledge (what registers are, what hex is, what assembly is) — assume the reader knows 6502 basics

## Hard Rules

**Do NOT**:
- Remove the `# Context - Description` header line that `split_training.py` prepended — this is critical for search
- Remove the `---` cross-references footer if present — this was added by the split script
- Modify files in `documents/` or `training/split_config/`
- Rewrite technical content in your own words — only remove filler and add minimal context
- Change the meaning or emphasis of any technical statement

## Reporting

For each file processed, report one of:
- **Cleaned** `filename.txt` — brief list of what changed (e.g., "removed 3 page markers, stripped 26-char indent, trimmed 4 filler paragraphs, added 2 context notes")
- **Deleted** `filename.txt` — explain why (e.g., "content was publisher metadata with no technical value")
- **Skipped** `filename.txt` — reason (e.g., "example file" or "already clean")

## Summary

After all files are processed, report:
- Total files processed
- Files cleaned (with changes)
- Files deleted
- Files skipped (examples + already clean)
- Context notes added (total count across all files)
