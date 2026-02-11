# Kick Assembler: Segment Modifiers and the BasicUpstart Modifier

**Summary:** Kick Assembler supports segment modifiers (functions that take a memory block and return a modified block — e.g., packers/crunchers). The built-in BasicUpstart modifier inserts a $0801 BASIC upstart block that JMPs to a given start address; modifiers are selected with the modify parameter and modifier arguments are passed prefixed by an underscore (e.g., .segment Name [start=$8000, modify="BasicUpstart", _start=$8000]).

## Segment modifiers — what they are and how to use them
Segment modifiers are processing functions applied to the output bytes of a named segment. They receive a block of memory (the segment contents) and must produce a transformed block (for example: compressed/crunched data, or the same data prefixed with a loader/upstart). Typical uses:
- Add a $0801 BASIC upstart header that chains into the assembled binary (BasicUpstart).
- Implement custom packers/crunchers as plug-ins that rewrite segment contents.

How to request a modifier:
- Supply a modify property on the segment declaration (or use .modify / .filemodify directives — see references).
- Modifier-specific arguments are passed by prefixing the argument name with an underscore on the same attribute list. Example:
  .segment Code [start=$8000, modify="BasicUpstart", _start=$8000]
This asks Kick Assembler to run the built-in BasicUpstart modifier and pass start=$8000 as the target address to jump to from the generated $0801 upstart block.

Writing modifiers:
- Modifiers are authored as plug-ins (scripts/functions) compatible with Kick Assembler's modifier API. They accept the segment byte array and return the modified byte array. (API details are in the modify_directives / built_in_modifiers_list references.)

## Source Code
```asm
; Main code
BasicUpstart2(start)
sei
ldx #0
lda zpCode,x
sta zpStart,x
inx
cpx #zpCodeSize
bne loop
jmp zpStart

zpCode: .segmentout [segments="ZeroPage_Code"]
.label zpCodeSize = *-zpCode
; Zeropage code
.segment ZeroPage_Code [start=$10]
zpStart:
inc $d020
jmp *-3
```

## Key Registers
- $D020 - VIC-II - Border color register (writes change screen border color)

## References
- "built_in_modifiers_list" — expands on list of built-in modifiers (includes BasicUpstart)
- "modify_directives" — expands on using modifiers via .modify and .filemodify