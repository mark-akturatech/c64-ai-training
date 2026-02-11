# Kick Assembler: .segment / .segmentdef example (Code/Data separation)

**Summary:** Example showing Kick Assembler .segmentdef and .segment usage: .segmentdef Code [start=$0900], .segmentdef Data [start=$8000], .file with named segments, multiple named .segment blocks ("Main", "Colors", "Text Setup"), local labels (e.g. text:), memory map ($0914-$0924, $8000-$800e), default memory block behavior, and parameters start and startAfter.

## Example overview
This chunk demonstrates placing code and data close together in the source while assigning them to different memory regions using .segment and .segmentdef. It shows:
- Named segments and how to switch between them in-source (.segment Code "Main", .segment Data "Colors", .segment Code "Text Setup").
- Local labels scoped to a segment (e.g. a local label named text: used only by the Text Setup code).
- Resulting memory placement (addresses shown below).
- The default memory block behavior: code appended to the current default memory block until the origin (asterisk) is moved to start a new memory block.
- The start parameter on .segmentdef (sets the start of the default memory block) and startAfter (start the segment after another named segment).

Scoping note: labels defined while a segment is active are local to that segment scope; you can reuse the same label name (for example text) in different routines/segments without collisions.

Memory map from the example:
- $0914-$0924 — Text Setup (Code segment)
- Data segment:
  - $8000-$8001 — Colors
  - $8002-$800e — Static Text

The examples also demonstrate using .file to assemble multiple segments into a single PRG and using startAfter to place one segment directly after another.

## Source Code
```asm
; File and segment definitions example
.file [name="segments.prg", segments="Code,Data", modify="BasicUpstart", marg1=$0900]

.segmentdef Code [start=$0900]
.segmentdef Data [start=$8000]

; Multiple named segments within the same segment type
.segment Code "Main"
; ... main code ...

.segment Data "Colors"
colors:.byte LIGHT_GRAY, DARK_GRAY

.segment Code "Text Setup"
; text label is local within this Text Setup segment
text:.text "hello world!"
.byte $ff

; Memory layout comments (example resulting placement)
; $0914-$0924 Text Setup
; Data-segment:
; $8000-$8001 Colors
; $8002-$800e Static Text

; ----------------------------
; Default memory block example
.segment Code [start=$1000]
inc $d020
; Places code in the default memoryblock
jmp *-3

*=$2000
inc $d021
jmp *-3

; Start a new memoryblock by changing the origin (*)
; The default memory block is controlled by parameters given when the segment is defined.
; Example using start and startAfter
.segmentdef Code [start=$1000]
.segmentdef Data [startAfter="Code"]

; Using segments to share memory for initialization and runtime buffers
.file [name="program.prg", segments="Code, InitCode"]
.segmentdef Code
.segmentdef InitCode
.segmentdef Buffer

[start=$1000]        ; Code default memory block start
[startAfter="Code"] ; InitCode placed after Code
[startAfter="Code"] ; Buffer startAfter usage
```

## Key Registers
- $D020-$D021 - VIC-II - border/background color registers

## References
- "naming_memory_blocks_when_switching_segment" — using text names for memory blocks when switching segments
- "memory_map_and_scope_segments" — resulting memory map and segment scoping behavior