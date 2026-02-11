#!/usr/bin/env python3
"""Remove ## Incomplete sections from all training/data/*.md files.

Removes everything from '## Incomplete' up to (but not including) the next
'## ' heading or end-of-file. Preserves all other content.
"""
import re
import sys
from pathlib import Path

data_dir = Path(__file__).parent.parent / "training" / "data"
pattern = re.compile(
    r'\n## Incomplete\n.*?(?=\n## |\Z)',
    re.DOTALL
)

fixed = 0
for md in sorted(data_dir.glob("*.md")):
    text = md.read_text()
    if "## Incomplete" not in text:
        continue
    new_text = pattern.sub('', text)
    # Clean up any resulting double-blank-lines
    while '\n\n\n' in new_text:
        new_text = new_text.replace('\n\n\n', '\n\n')
    if new_text != text:
        md.write_text(new_text)
        fixed += 1
        print(f"  fixed: {md.name}")

print(f"\nDone: {fixed} files updated.")
