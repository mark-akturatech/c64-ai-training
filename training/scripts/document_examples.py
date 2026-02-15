#!/usr/bin/env python3
# /// script
# dependencies = ["openai"]
# ///
"""
Document C64 assembly examples using OpenAI API.

Reads .asm files from examples/, sends each to OpenAI for analysis,
writes documented versions to training/data/ as example_*.md files.
Tracks MD5 hashes in parsed_sources.json to skip unchanged files.

Usage:
    uv run scripts/document_examples.py                     # Process all examples
    uv run scripts/document_examples.py examples/bars256.asm  # Process one file
    uv run scripts/document_examples.py --force              # Reprocess all
    uv run scripts/document_examples.py --model gpt-4o       # Use different model
    uv run scripts/document_examples.py --dry-run             # Show what would be processed
    uv run scripts/document_examples.py --register            # Register existing files in cache (no AI)
    uv run scripts/document_examples.py --workers 8            # Process 8 files concurrently (default: 4)
"""

import hashlib
import json
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


SYSTEM_PROMPT = """\
You are an expert Commodore 64 and MOS 6502 assembly programmer. Analyze this source code and produce a markdown documentation header optimized for retrieval by an AI coding assistant.

## Output Structure

Return ONLY the markdown header — do NOT include the source code. The script will append it automatically.

# Example: <Short Effect Name>

## Summary
<3-6 sentences explaining HOW the key registers and techniques are used.
Focus on register behavior and programming patterns, not visual appearance.>

## Key Registers
- $XXXX - <chip> <register name> - <how used in this code>
- ...

## Techniques
- <technique 1>
- <technique 2>
- ...

## Hardware
<VIC-II, SID, CIA, etc. — comma-separated>

## Rules
- Return ONLY the header sections above — do NOT include source code
- Include EVERY hardware register accessed in the code:
  - $D000-$D3FF = VIC-II (video)
  - $D400-$D7FF = SID (sound)
  - $DC00-$DCFF = CIA #1 (keyboard, joystick, timers)
  - $DD00-$DDFF = CIA #2 (VIC bank, serial bus, timers)
  - $0000-$0001 = CPU port (bank switching)
  - $0314-$0315 = IRQ vector
- Use searchable vocabulary: "raster interrupt" not "screen effect"
- Focus on HOW registers are used, not what the effect looks like
- Note self-modifying code, unrolled loops, lookup tables, cycle-counted loops
- Do NOT include author names in the title
"""

MULTI_FILE_PROJECTS = {
    'celso_christmas_demo': 'Christmas demo with falling snow sprites, dual bitmap screens, scrolling text, and SID music',
    'c64lib_chipset': 'KickAssembler library with register definitions and macros for VIC-II, CIA, SID, and MOS 6510',
    'dustlayer_intro': 'Color wash intro with SID music, raster interrupts, and animated text',
    'dustlayer_sprites': 'Animated multicolor sprite with keyboard control, custom charset, and border opening',
}


def md5_file(path):
    """Compute MD5 hash of a file's contents."""
    return hashlib.md5(path.read_bytes()).hexdigest()


def load_cache(cache_path):
    """Load the parsed_sources.json cache."""
    if cache_path.exists():
        with open(cache_path, 'r') as f:
            return json.load(f)
    return {"chunks": {}, "examples": {}}


def save_cache(cache_path, cache):
    """Save the parsed_sources.json cache."""
    with open(cache_path, 'w') as f:
        json.dump(cache, f, indent=2)
        f.write('\n')


def derive_output_name(header_text, asm_path, project_root):
    """Derive output filename from the Example header and path."""
    # Extract name from "# Example: <name>"
    m = re.search(r'#\s*Example:\s*(.+)', header_text)
    if not m:
        # Fallback to filename
        name = asm_path.stem
    else:
        name = m.group(1).strip()

    # Convert to snake_case
    name = re.sub(r'[^a-zA-Z0-9\s]', '', name)
    name = re.sub(r'\s+', '_', name.strip()).lower()

    # Check if it's a multi-file project
    rel = asm_path.relative_to(project_root / 'examples')
    parts = rel.parts
    if len(parts) > 1:
        dir_name = parts[0]
        if dir_name in MULTI_FILE_PROJECTS:
            name = f"{dir_name}_{name}"

    return f"example_{name}.md"


def strip_comment_header(text):
    """Strip leading # comment header from source text.

    Returns (header_lines, clean_source) where header_lines are the raw # lines
    and clean_source is the remaining code without the header.
    """
    lines = text.split('\n')

    # Find where the # comment header ends
    header_end = 0
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith('#') or stripped == '':
            continue
        else:
            header_end = i
            break
    else:
        header_end = len(lines)

    return lines[:header_end], '\n'.join(lines[header_end:]).strip()


def parse_comment_header(header_lines):
    """Parse # comment header lines into markdown sections.

    Returns markdown header string.
    """
    # Strip leading # and space
    cleaned = []
    for line in header_lines:
        s = line.strip()
        if s.startswith('# '):
            cleaned.append(s[2:])
        elif s == '#':
            cleaned.append('')
        else:
            cleaned.append(s)

    # Parse sections
    title = ''
    summary_lines = []
    registers = []
    techniques = ''
    hardware = ''
    project = ''

    section = 'summary'
    for line in cleaned:
        if line.startswith('Example:'):
            title = line[len('Example:'):].strip()
            section = 'summary'
        elif line.startswith('Project:'):
            project = line[len('Project:'):].strip()
        elif line.startswith('Key Registers:'):
            section = 'registers'
        elif line.startswith('Techniques:'):
            techniques = line[len('Techniques:'):].strip()
            section = 'done'
        elif line.startswith('Hardware:'):
            hardware = line[len('Hardware:'):].strip()
            section = 'done'
        elif section == 'summary' and line:
            summary_lines.append(line)
        elif section == 'registers' and line.strip():
            registers.append(line.strip())

    # Build markdown header
    md = f"# Example: {title}\n"
    if project:
        md += f"\n**Project:** {project}\n"
    md += f"\n## Summary\n{' '.join(summary_lines)}\n"
    if registers:
        md += "\n## Key Registers\n"
        for r in registers:
            if not r.startswith('- '):
                r = f"- {r}"
            md += f"{r}\n"
    if techniques:
        md += "\n## Techniques\n"
        for t in [x.strip() for x in techniques.split(',')]:
            md += f"- {t}\n"
    if hardware:
        md += f"\n## Hardware\n{hardware}\n"

    return md


def format_markdown(header, source_code):
    """Combine a markdown header with source code in a fenced code block."""
    header = header.rstrip('\n')
    return f"{header}\n\n## Source Code\n```asm\n{source_code}\n```\n"


def document_example(client, model, source_code, asm_path, project_root):
    """Send source code to OpenAI for analysis. Returns documented version."""
    # Build context about multi-file projects
    rel = asm_path.relative_to(project_root / 'examples')
    parts = rel.parts
    extra_context = ""
    if len(parts) > 1:
        dir_name = parts[0]
        if dir_name in MULTI_FILE_PROJECTS:
            desc = MULTI_FILE_PROJECTS[dir_name]
            extra_context = (
                f"\n\nThis file is part of multi-file project '{dir_name}': {desc}. "
                f"Add this line after the title:\n"
                f"**Project:** {dir_name} - {desc}\n"
            )

    user_msg = f"Analyze this C64 assembly source file ({asm_path.name}):{extra_context}\n\n{source_code}"

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_msg},
        ],
    )

    return response.choices[0].message.content, _fmt_response(response)


def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    examples_dir = project_root / 'examples'
    data_dir = project_root / 'data'
    cache_path = project_root / 'parsed_sources.json'

    # Parse arguments
    force = '--force' in sys.argv
    dry_run = '--dry-run' in sys.argv
    register = '--register' in sys.argv
    model = 'gpt-5-mini'

    if '--model' in sys.argv:
        idx = sys.argv.index('--model')
        model = sys.argv[idx + 1]

    workers = 4
    if '--workers' in sys.argv:
        idx = sys.argv.index('--workers')
        workers = int(sys.argv[idx + 1])

    # Collect target files
    skip_flags = {'--force', '--dry-run', '--register', '--model', '--workers'}
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

    if args:
        asm_files = []
        for a in args:
            p = Path(a)
            if not p.is_absolute():
                p = project_root / a
            if p.exists() and p.suffix == '.asm':
                asm_files.append(p)
            else:
                print(f"File not found or not .asm: {a}")
        if not asm_files:
            sys.exit(1)
    else:
        asm_files = sorted(examples_dir.rglob('*.asm'))

    if not asm_files:
        print("No .asm files found in examples/")
        sys.exit(0)

    # Ensure output dir exists
    data_dir.mkdir(parents=True, exist_ok=True)

    # Load cache
    cache = load_cache(cache_path)
    if 'examples' not in cache:
        cache['examples'] = {}

    # Check API key
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key and not dry_run and not register:
        print("Error: OPENAI_API_KEY environment variable not set")
        sys.exit(1)

    client = None
    if not dry_run and not register:
        client = OpenAI(api_key=api_key)

    # Filter to files that need processing
    to_process = []
    skipped = 0
    total = len(asm_files)

    for asm_path in asm_files:
        try:
            cache_key = str(asm_path.relative_to(project_root))
        except ValueError:
            cache_key = str(asm_path)

        current_md5 = md5_file(asm_path)

        cached = cache['examples'].get(cache_key)
        if cached and cached.get('source_md5') == current_md5 and not force:
            output_path = data_dir / cached['output']
            if output_path.exists():
                skipped += 1
                continue

        to_process.append((asm_path, cache_key, current_md5))

    if dry_run:
        for i, (asm_path, cache_key, _) in enumerate(to_process, 1):
            cached = cache['examples'].get(cache_key)
            reason = "forced" if force else ("changed" if cached else "new")
            print(f"  [{i}/{len(to_process)}] Would process: {cache_key} ({reason})")
        print(f"\n{'='*50}")
        print(f"Examples: {len(to_process)} to process, {skipped} skipped (of {total} total)")
        print("(dry run - no files were modified)")
        return

    if register:
        for i, (asm_path, cache_key, current_md5) in enumerate(to_process, 1):
            raw_text = asm_path.read_text(encoding='utf-8', errors='replace')
            header_lines, clean_source = strip_comment_header(raw_text)
            if header_lines and any(l.strip().startswith('#') for l in header_lines):
                header_md = parse_comment_header(header_lines)
            else:
                header_md = f"# Example: {asm_path.stem}\n\n## Summary\nC64 assembly example.\n"
                clean_source = raw_text
            output_name = derive_output_name(raw_text, asm_path, project_root)
            output_path = data_dir / output_name
            output_path.write_text(format_markdown(header_md, clean_source), encoding='utf-8')

            cache['examples'][cache_key] = {
                'source_md5': current_md5,
                'output': output_name,
            }
            save_cache(cache_path, cache)
            print(f"  [{i}/{len(to_process)}] Registered: {cache_key} -> {output_name}")

        print(f"\n{'='*50}")
        print(f"Examples: {len(to_process)} registered, {skipped} skipped (of {total} total)")
        print("(register mode - files copied as-is, no AI processing)")
        return

    # Worker function for thread pool
    cache_lock = threading.Lock()
    counter = {'processed': 0, 'errors': 0, 'done': 0}

    def process_one(asm_path, cache_key, current_md5):
        with cache_lock:
            counter['done'] += 1
            n = counter['done']
        print(f"  [{n}/{len(to_process)}] Processing: {cache_key} ...", flush=True)

        try:
            raw_text = asm_path.read_text(encoding='utf-8', errors='replace')
            _, clean_source = strip_comment_header(raw_text)
            if not clean_source:
                clean_source = raw_text
            header, resp_info = document_example(client, model, raw_text, asm_path, project_root)

            output_name = derive_output_name(header, asm_path, project_root)
            output_path = data_dir / output_name
            output_path.write_text(format_markdown(header, clean_source), encoding='utf-8')

            with cache_lock:
                cache['examples'][cache_key] = {
                    'source_md5': current_md5,
                    'output': output_name,
                }
                save_cache(cache_path, cache)
                counter['processed'] += 1

            print(f"    done -> {output_name} [{resp_info}]")

        except Exception as e:
            with cache_lock:
                counter['errors'] += 1
            print(f"    ERROR {cache_key}: {e}")

    print(f"Processing {len(to_process)} examples with {workers} workers...")
    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = [pool.submit(process_one, ap, ck, md5) for ap, ck, md5 in to_process]
        for f in as_completed(futures):
            f.result()

    # Summary
    print(f"\n{'='*50}")
    print(f"Examples: {counter['processed']} processed, {skipped} skipped, {counter['errors']} errors (of {total} total)")


if __name__ == '__main__':
    main()
