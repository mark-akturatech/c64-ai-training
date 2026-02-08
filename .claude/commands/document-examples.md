---
description: Analyze C64 assembly examples and add searchable description headers
argument-hint: [example.asm | (none for all examples)]
---

# Document Examples

Analyze C64 assembly example files and prepend description headers optimized for Qdrant search discoverability.

## Modes

### No argument — Process all examples
If `$ARGUMENTS` is empty, recursively find every `.asm` file under `examples/` (including all subdirectories). Skip `.prg` and other non-source files.

### File argument — Single example
If `$ARGUMENTS` is a path to a `.asm` file, process only that file.

## Skip Detection

Before processing each file, check if it **already has a valid description header**. A valid header starts with:
```
# Example: <name>
```
as the first line of the file.

If the header exists and looks complete (has Key Registers, Techniques, Hardware sections), **skip the file** and report it as "already documented".

If the header exists but is incomplete or poorly written, **regenerate it**.

## Analysis Process

For each undocumented `.asm` file:

1. **Read the source code** carefully
2. **Identify all hardware register accesses** — look for addresses like `$D000-$D3FF` (VIC-II), `$D400-$D7FF` (SID), `$DC00-$DCFF` (CIA1), `$DD00-$DDFF` (CIA2), and zero-page locations used for I/O
3. **Understand the technique** — what effect does this code produce? What C64 programming pattern does it demonstrate?
4. **Search Qdrant** if available — query the knowledge base for any registers or techniques you're unsure about
5. **Write the description header** (see format below)
6. **Save the file** — write the header + original source back to the same `.asm` file

## Description Header Format

The description must be written for **discoverability** — an AI reading unfamiliar code will encounter a register like `$D012` and search Qdrant. This description must surface when that happens.

```
# Example: <Short Effect Name>
#
# <Description focusing on HOW the key registers and techniques are
# used in this code. Explain what each register does in context, not
# just what the overall effect looks like. 3-6 sentences.>
#
# Key Registers:
#   $XXXX - <chip> <register name> - <how it's used in this code>
#   $XXXX - <chip> <register name> - <how it's used in this code>
#
# Techniques: <comma-separated list>
# Hardware: <VIC-II, SID, CIA, etc.>
# Project: <directory_name> - <short project description>  (ONLY for multi-file projects)
#

<original source code>
```

### Multi-file projects

Some example directories contain multiple `.asm` files that form a single project (connected via `#import`, `!source`, or similar). For these, add a `# Project:` line so Qdrant can link all files from the same project. The project name should match the directory name.

**How to detect:** Check if files in the same directory import/include each other (look for `#import`, `!source`, `!src`, `.include`). If they do, it's a multi-file project. Standalone files in a collection directory do NOT get a Project line.

**Current multi-file projects:**
- `celso_christmas_demo` — Christmas demo with falling snow sprites, dual bitmap screens, scrolling text, and SID music
- `c64lib_chipset` — KickAssembler library with register definitions and macros for VIC-II, CIA, SID, and MOS 6510
- `dustlayer_intro` — Color wash intro with SID music, raster interrupts, and animated text
- `dustlayer_sprites` — Animated multicolor sprite with keyboard control, custom charset, and border opening

### Good example (standalone):
```
# Example: Raster Color Bars
#
# Creates animated color bars by polling VIC-II raster counter $D012
# in a tight loop, writing color values to $D020 and $D021 at each
# raster line to produce horizontal color bands. Bar positions are
# animated using a pre-computed sine table stored at $1200. The main
# loop uses NOP padding for cycle-exact timing to prevent jitter.
#
# Key Registers:
#   $D012 - VIC-II raster line counter - polled to sync color changes with beam position
#   $D020 - VIC-II border color - written each raster line to create bar effect
#   $D021 - VIC-II background color - written alongside border for full-width bars
#   $D011 - VIC-II control register - bit 7 extends $D012 for lines > 255
#
# Techniques: raster polling, cycle-exact timing, sine table lookup, self-modifying code
# Hardware: VIC-II
#
```

### Good example (multi-file project):
```
# Example: Keyboard Matrix Scanning
#
# Scans keyboard matrix to detect U/D keys for sprite Y-movement and SPACE
# for exit. Configures CIA port A ($DC00) as output and port B ($DC01) as
# input, then scans specific matrix rows for column patterns.
#
# Key Registers:
#   $DC00 - CIA port A - row scan patterns
#   $DC01 - CIA port B - column read for key detection
#
# Techniques: keyboard matrix scanning, CIA port configuration
# Hardware: CIA, VIC-II
# Project: dustlayer_sprites - Animated multicolor sprite with keyboard control, custom charset, and border opening
#
```

### Description guidelines
- Focus on HOW registers are used, not just WHAT the effect looks like
- Include every hardware register address accessed in the code
- Use the same vocabulary someone would use when searching (e.g., "raster interrupt" not "screen effect")
- Mention zero-page usage if significant
- Note self-modifying code, unrolled loops, or other 6502 idioms used

### Naming in the header
- Describe the effect/technique: "Raster Color Bars", "DYCP Text Scroller", "Custom Character Set"
- Do NOT include author names in the title
- Keep it short but specific

## Output

Report for each file:
- **Documented**: filename — "Example: <name>"
- **Skipped**: filename — already documented
- **Warning**: filename — could not determine purpose

At the end, summarize: X files documented, Y skipped, Z warnings.
