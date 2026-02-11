#!/usr/bin/env python3
# /// script
# dependencies = ["openai"]
# ///
"""
Fix incomplete training chunks using OpenAI API with web search.

Finds .md files in training/data/ with ## Incomplete sections,
uses OpenAI with web search to fill in missing information,
including reconstructing missing diagrams as ASCII art.

Usage:
    uv run scripts/fix_incomplete.py                           # Fix all incomplete chunks
    uv run scripts/fix_incomplete.py chunk_name.md [...]       # Fix specific file(s)
    uv run scripts/fix_incomplete.py --dry-run                 # Show what would be fixed
    uv run scripts/fix_incomplete.py --list                    # List incomplete files + issues
    uv run scripts/fix_incomplete.py --model gpt-4o            # Use different model (no search)
    uv run scripts/fix_incomplete.py --force                   # Include false-positive files too
    uv run scripts/fix_incomplete.py --workers 8                # Process 8 files concurrently (default: 4)
"""

import os
import re
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from openai import OpenAI


def _fmt_response(response):
    """Format a one-line summary of an OpenAI API response."""
    usage = response.usage
    parts = [f"model={response.model}"]
    if usage:
        parts.append(f"tokens={usage.prompt_tokens}+{usage.completion_tokens}={usage.total_tokens}")
    return ', '.join(parts)


FIX_SYSTEM_PROMPT = """\
You are fixing incomplete knowledge chunks for a Commodore 64 / 6502 vector database (Qdrant RAG system).

The chunk you receive has a ## Incomplete section listing what's missing.
You MUST use web search to find the missing information from authoritative sources.
Do NOT give up or leave placeholders — search for the original datasheets, manuals, and technical references.
For hardware chips (6510, 6526, 6567/6569, 6581, etc.), search for the original MOS Technology / Commodore datasheet PDFs and extract exact numeric values from the electrical tables.

Architecture reminder (how this data is used downstream):
- Descriptive text (everything before ## Source Code) → embedded as search vectors
- ## Source Code section → stored as metadata payload only, NOT embedded for search
- ## Key Registers → parsed into keyword filter metadata for address matching
- ## References → parsed into metadata for cross-chunk navigation

Rules:
1. PRESERVE the exact structure/format: # Title, **Summary:**, ## sections, ## Source Code, ## Key Registers, ## References
2. Fill in missing technical data from authoritative sources (MOS Technology datasheets, official Commodore manuals)
3. If ALL missing items are resolved → REMOVE the ## Incomplete section entirely
4. If some items remain truly unfixable → keep only those in ## Incomplete
5. Do NOT change content that is already correct — only fix what's listed as missing
6. Do NOT add new sections or expand beyond what's needed to fix the incomplete items
7. Do NOT add tutorial-style elaboration or "practical notes" the source didn't contain
8. Maintain the same tone: terse, technical, reference-oriented
9. The ONLY allowed ## headings are: ## Source Code, ## Key Registers, ## Incomplete, ## References — NEVER invent custom headings like "## Block Diagram", "## Legend", "## Pin Descriptions" etc. Descriptive text goes BEFORE ## Source Code as plain prose or bullet lists under the # title

DIAGRAM/IMAGE RECONSTRUCTION:
When missing items mention diagrams, images, block diagrams, timing diagrams, or pin-outs:
- Reconstruct as ASCII art based on the chip's datasheet
- Block diagrams → show functional blocks, interconnections, and signal flow
- Timing diagrams → show ASCII waveforms with signal names and labeled timing parameters
- Pin-out diagrams → show pin numbers, names, and signal directions

CRITICAL — where reconstructed diagrams go:
- ALL reconstructed diagrams MUST be placed inside the single ## Source Code section as ```text fenced code blocks
- If a ## Source Code section already exists, APPEND the diagram as an additional fenced code block within it
- If no ## Source Code section exists, CREATE one and place the diagram there
- NEVER create a second ## Source Code heading — there must be exactly ONE per file
- The DESCRIPTIVE section (before ## Source Code) should explain what the diagram shows — this text gets embedded for search
- The ASCII diagram itself in ## Source Code is stored for retrieval alongside results, not searched

Source references:
- MOS Technology datasheets for chips (6510, 6526 CIA, 6567/6569 VIC-II, 6581 SID)
- Commodore 64 Programmer's Reference Guide for BASIC/KERNAL
- KickAssembler manual (theweb.dk) for assembler features
- Commodore 1541 User's Guide for disk drive commands

Output the complete fixed Markdown chunk. Do not wrap in additional code fences.
"""


_FALSE_POSITIVE_PATTERNS = re.compile(
    r'(?i)(none\s*detected|none\s*found|none\s*specific|none\s*identified|\(none|n/a|no\s*missing|nothing\s*missing)',
)


def strip_incomplete_section(md_content):
    """Remove ## Incomplete section (and trailing blank lines) from markdown content."""
    marker = '## Incomplete'
    idx = md_content.find(marker)
    if idx == -1:
        return md_content

    after = md_content[idx + len(marker):]
    next_heading = re.search(r'^## ', after, re.MULTILINE)
    if next_heading:
        # Keep everything before ## Incomplete + everything from next heading onward
        rest = after[next_heading.start():]
        before = md_content[:idx].rstrip('\n')
        return before + '\n\n' + rest
    else:
        # ## Incomplete was the last section — just trim it
        return md_content[:idx].rstrip('\n') + '\n'


def find_incomplete_files(data_dir):
    """Find .md files with ## Incomplete sections, parse their issues.

    Returns list of (path, incomplete_text, is_false_positive) sorted by name.
    """
    results = []
    for md_path in sorted(data_dir.glob('*.md')):
        content = md_path.read_text(encoding='utf-8', errors='replace')
        marker = '## Incomplete'
        idx = content.find(marker)
        if idx == -1:
            continue

        # Extract text from ## Incomplete to next ## heading or EOF
        after = content[idx + len(marker):]
        next_heading = re.search(r'^## ', after, re.MULTILINE)
        if next_heading:
            incomplete_text = after[:next_heading.start()].strip()
        else:
            incomplete_text = after.strip()

        # Check if false positive
        is_fp = bool(_FALSE_POSITIVE_PATTERNS.search(incomplete_text))

        results.append((md_path, incomplete_text, is_fp))

    return results


def _build_search_directive(md_content, incomplete_text):
    """Build an explicit search directive from the incomplete items."""
    # Extract the title for context
    title_match = re.match(r'^#\s+(.+)', md_content)
    title = title_match.group(1).strip() if title_match else 'unknown chunk'

    # Extract individual missing items
    items = [line.strip().lstrip('- ') for line in incomplete_text.split('\n')
             if line.strip().startswith('- ')]

    if not items:
        return ''

    lines = [
        f'The chunk titled "{title}" has these missing items that you MUST resolve using web search:',
        '',
    ]
    for i, item in enumerate(items, 1):
        lines.append(f'{i}. {item}')

    lines.extend([
        '',
        'Search for the original datasheets, official manuals, and technical references to find the exact values.',
        'Do NOT leave "SEE DATASHEET" placeholders — replace them with actual values from your search results.',
        'If a value truly cannot be found after searching, note the specific value that is missing.',
    ])

    return '\n'.join(lines)


def fix_chunk(client, model, md_content, incomplete_text=''):
    """Send chunk to OpenAI with web search to fix incomplete items.

    Returns (fixed_content, response_info_string).
    """
    messages = [
        {"role": "system", "content": FIX_SYSTEM_PROMPT},
    ]

    # Add explicit search directive as a separate user message if we have incomplete text
    if incomplete_text:
        directive = _build_search_directive(md_content, incomplete_text)
        if directive:
            messages.append({"role": "user", "content": directive})
            messages.append({"role": "assistant", "content":
                "I'll search for the missing information now and fix the chunk."})

    messages.append({"role": "user", "content":
        "Here is the chunk to fix. Output the complete fixed Markdown:\n\n" + md_content})

    kwargs = {
        'model': model,
        'messages': messages,
    }

    # Only add web_search_options for search-capable models
    if 'search' in model:
        kwargs['web_search_options'] = {
            'search_context_size': 'high',
        }

    response = client.chat.completions.create(**kwargs)
    result = response.choices[0].message.content.strip()

    # Strip markdown wrapper if model wrapped output in ```markdown ... ```
    if result.startswith('```markdown') or result.startswith('```md'):
        first_newline = result.index('\n')
        result = result[first_newline + 1:]
        if result.endswith('```'):
            result = result[:-3].rstrip()

    result = _fix_headings(result)
    return result, _fmt_response(response)


_ALLOWED_H2 = {'## Source Code', '## Key Registers', '## Incomplete', '## References'}


def _fix_headings(md):
    """Rewrite disallowed ## headings into bold paragraphs.

    Moves any code blocks under disallowed headings into ## Source Code.
    """
    lines = md.split('\n')
    out = []
    code_blocks = []  # orphaned code blocks to move into ## Source Code
    in_bad_section = False
    in_code_block = False
    code_buf = []

    for line in lines:
        # Track fenced code blocks
        if line.strip().startswith('```'):
            if in_code_block:
                # Closing fence
                code_buf.append(line)
                if in_bad_section:
                    code_blocks.append('\n'.join(code_buf))
                else:
                    out.extend(code_buf)
                code_buf = []
                in_code_block = False
                continue
            else:
                in_code_block = True
                code_buf = [line]
                continue

        if in_code_block:
            code_buf.append(line)
            continue

        # Check for ## headings
        if line.startswith('## '):
            heading = line.strip()
            if heading in _ALLOWED_H2:
                in_bad_section = False
                # If this is ## Source Code, inject orphaned code blocks after it
                if heading == '## Source Code':
                    out.append(line)
                    if code_blocks:
                        out.append('')
                        for block in code_blocks:
                            out.append(block)
                            out.append('')
                        code_blocks = []
                    continue
                out.append(line)
            else:
                # Convert to bold paragraph
                text = line[3:].strip()
                out.append(f'**{text}**')
                in_bad_section = True
            continue

        # Regular line — keep in_bad_section state until next heading
        out.append(line)

    # If there are orphaned code blocks and no ## Source Code existed, insert one
    # before ## Key Registers / ## References (whichever comes first)
    if code_blocks:
        insert_lines = ['', '## Source Code', '']
        for block in code_blocks:
            insert_lines.append(block)
            insert_lines.append('')

        # Find first trailing metadata section to insert before
        insert_idx = len(out)
        for i, l in enumerate(out):
            if l.strip() in ('## Key Registers', '## Incomplete', '## References'):
                # Back up past any blank lines before the heading
                insert_idx = i
                while insert_idx > 0 and not out[insert_idx - 1].strip():
                    insert_idx -= 1
                break
        out[insert_idx:insert_idx] = insert_lines

    return '\n'.join(out)


def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    data_dir = project_root / 'training' / 'data'

    # Parse arguments
    force = '--force' in sys.argv
    dry_run = '--dry-run' in sys.argv
    list_mode = '--list' in sys.argv
    model = 'gpt-4o-search-preview'

    if '--model' in sys.argv:
        idx = sys.argv.index('--model')
        model = sys.argv[idx + 1]

    workers = 4
    if '--workers' in sys.argv:
        idx = sys.argv.index('--workers')
        workers = int(sys.argv[idx + 1])

    # Collect positional args (specific filenames)
    skip_flags = {'--force', '--dry-run', '--list', '--model', '--workers'}
    args = []
    skip_next = False
    for a in sys.argv[1:]:
        if skip_next:
            skip_next = False
            continue
        if a in ('--model', '--workers'):
            skip_next = True
            continue
        if a not in skip_flags:
            args.append(a)

    # Find all incomplete files
    all_incomplete = find_incomplete_files(data_dir)

    if not all_incomplete:
        print("No files with ## Incomplete sections found.")
        return

    # Filter to specific files if positional args given
    if args:
        name_set = set()
        for a in args:
            a = Path(a).name  # strip directory components
            if not a.endswith('.md'):
                a = a + '.md'
            name_set.add(a)
        all_incomplete = [
            (p, t, fp) for p, t, fp in all_incomplete if p.name in name_set
        ]
        if not all_incomplete:
            print(f"None of the specified files have ## Incomplete sections.")
            sys.exit(1)

    # List mode: just show what's incomplete and exit
    if list_mode:
        fp_count = sum(1 for _, _, fp in all_incomplete if fp)
        real_count = len(all_incomplete) - fp_count

        print(f"Found {len(all_incomplete)} files with ## Incomplete "
              f"({real_count} actionable, {fp_count} false positives)\n")

        for path, text, is_fp in all_incomplete:
            status = " [FALSE POSITIVE]" if is_fp else ""
            print(f"  {path.name}{status}")
            # Show first 3 lines of incomplete text
            lines = text.strip().split('\n')
            for line in lines[:4]:
                print(f"    {line.strip()}")
            if len(lines) > 4:
                print(f"    ... ({len(lines) - 4} more lines)")
            print()
        return

    # Clean false positives: strip their ## Incomplete sections entirely
    false_positives = [(p, t) for p, t, fp in all_incomplete if fp]
    if false_positives and not dry_run:
        print(f"Stripping {len(false_positives)} false-positive ## Incomplete section(s):")
        for fp_path, _ in false_positives:
            content = fp_path.read_text(encoding='utf-8', errors='replace')
            cleaned = strip_incomplete_section(content)
            fp_path.write_text(cleaned, encoding='utf-8')
            print(f"  {fp_path.name}")
        print()
    elif false_positives and dry_run:
        print(f"Would strip {len(false_positives)} false-positive ## Incomplete section(s):")
        for fp_path, _ in false_positives:
            print(f"  {fp_path.name}")
        print()

    # Filter out false positives from API processing (already stripped above)
    all_incomplete = [(p, t, fp) for p, t, fp in all_incomplete if not fp]

    if not all_incomplete:
        print("No actionable incomplete files to process.")
        return

    # Check API key
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key and not dry_run:
        print("Error: OPENAI_API_KEY environment variable not set")
        sys.exit(1)

    client = None
    if not dry_run:
        client = OpenAI(api_key=api_key)

    total = len(all_incomplete)
    print(f"Processing {total} incomplete file(s) with model={model}")
    if 'search' in model:
        print(f"  (web search enabled)")
    print()

    if dry_run:
        for i, (file_path, incomplete_text, _) in enumerate(all_incomplete, 1):
            lines = incomplete_text.strip().split('\n')
            issue_count = sum(1 for l in lines if l.strip().startswith('- '))
            print(f"  [{i}/{total}] Would fix: {file_path.name} ({issue_count} issue(s))")
        print(f"\n{'='*50}")
        print(f"Fixed: {total} to process (of {total} total)")
        print("(dry run - no files were modified)")
        return

    # Worker function for thread pool
    counter = {'processed': 0, 'errors': 0, 'done': 0}
    counter_lock = threading.Lock()

    def process_one(file_path, incomplete_text):
        name = file_path.name

        with counter_lock:
            counter['done'] += 1
            n = counter['done']
        print(f"  [{n}/{total}] Fixing: {name} ...", flush=True)

        try:
            md_content = file_path.read_text(encoding='utf-8', errors='replace')
            result, resp_info = fix_chunk(client, model, md_content, incomplete_text)

            if not result.startswith('#'):
                print(f"    WARNING {name}: result doesn't start with # heading, skipping write")
                with counter_lock:
                    counter['errors'] += 1
                return

            file_path.write_text(result, encoding='utf-8')

            still_incomplete = '## Incomplete' in result
            status = "partially fixed" if still_incomplete else "fully fixed"
            print(f"    done -> {name} ({status}) [{resp_info}]")

            with counter_lock:
                counter['processed'] += 1

        except Exception as e:
            with counter_lock:
                counter['errors'] += 1
            print(f"    ERROR {name}: {e}")

    print(f"Using {workers} workers...")
    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = [pool.submit(process_one, fp, txt)
                   for fp, txt, _ in all_incomplete]
        for f in as_completed(futures):
            f.result()

    # Summary
    print(f"\n{'='*50}")
    print(f"Fixed: {counter['processed']} processed, {counter['errors']} errors (of {total} total)")


if __name__ == '__main__':
    main()
