---
description: Analyze a training document and create a split configuration JSON
argument-hint: <filename.txt>
---

# Split Training Document Analysis

Analyze the training document `training/raw/$ARGUMENTS` and create a split configuration.

## Your Task

1. Read the file `training/raw/$ARGUMENTS`
2. Analyze its structure (sections, chapters, topics)
3. Identify logical split points where the content changes topic
4. Create a JSON config file in `training/split_config/`

## Split Rules

- Target chunks UNDER 4KB (4000 bytes)
- Allow up to 8KB ONLY if content cannot be logically split smaller
- Split at logical boundaries (section headers, topic changes, chapter breaks)
- NEVER split mid-paragraph or mid-explanation
- Each chunk must be self-contained and readable on its own

## Context Headers

Each split needs a `context` string that will be prepended as a header. This should:
- Identify the document source
- Describe what this specific chunk covers
- Be concise but descriptive (e.g., "6502 Instructions - Branch Operations")

## Output Format

Create `training/split_config/<filename>.json`:

```json
{
  "source_file": "<filename>.txt",
  "target_chunk_size": 4000,
  "splits": [
    {
      "line": <line_number>,
      "context": "<Document Title> - <Section Description>"
    }
  ]
}
```

The `line` field is where a NEW chunk begins (1-indexed). The first chunk always starts at line 1 and doesn't need a split entry.

## After Creating Config

Tell the user to run:
```bash
python3 scripts/split_training.py "<filename>.json"
```

Then reindex with Qdrant.
