# Kick Assembler: * / .pc, virtual blocks, .align and .pseudopc

**Summary:** Describes Kick Assembler memory directives: the * directive (alias .pc) to set the program counter and name memory blocks (-showmem), virtual memory blocks (virtual option) and overlapping behavior, the .align directive for page-aligning to avoid a one-cycle penalty when crossing a page boundary, and .pseudopc to assemble code as if located at a different address.

## Memory block placement: * and .pc
- Use * (or alias .pc) to set the assembler program counter and start a named memory block. The optional string argument names the block for the -showmem memory map.
- Old notation ('.pc=$1000') is still supported.
- Example usage creates separate blocks for code and data; the assembler emits the block ranges into the memory map when -showmem is used.

## Virtual memory blocks
- Append the virtual keyword to a .pc/* directive to declare a block that the assembler will reserve for layout/label resolution but will not save into the output file.
- Virtual blocks can overlap other blocks; in the -showmem map they are marked with an asterisk.
- Since virtual blocks are not saved, only non-virtual blocks actually contribute bytes to the output file.

## Page alignment: .align
- Use .align to align the current program counter to a given interval (commonly $100 for 256-byte page alignment).
- Aligning tables or data to page boundaries can avoid a one-cycle penalty incurred when memory-referring instructions cross a 256-byte page boundary.

## Assembling as if located elsewhere: .pseudopc
- Use .pseudopc $ADDR { ... } to assemble the enclosed code as if the program counter were $ADDR, while leaving the actual output placement unchanged.
- Useful for emitting relocatable code where relative/absolute targets must be encoded for a different runtime location.

## Source Code
```asm
!loop:

*=$1000 "Program"
ldx #10
dex
bne !loop
rts

*=$4000 "Data"
.byte 1,0,2,0,3,0,4,0

*=$5000 "More data"
.text "Hello"
```

```text
Memory Map
---------$1000-$1005 Program
$4000-$4007 Data
$5000-$5004 More data
```

```asm
*=$0400 "Data Tables 1" virtual
table1: .fill $100,0
table2: .fill $100,0

*=$0400 "Data Tables 2" virtual
table3: .fill $150,0
table4: .fill $100,0

*=$1000 "Program"
ldx #0
lda table1,x
...
```

```text
Memory Map
---------*$0400-$05ff Data Tables 1
*$0400-$064f Data Tables 2
$1000-$1005 Program
```

```asm
*=$1000 "Program"
ldx #1
lda data,x
rts

data:

*=$10ff
// Bad place for the data
.align $100
// Alignment to the nearest page boundary saves a cycle
.byte 1,2,3,4,5,6,7,8
```

```asm
*=$1000 "Program to be relocated at $2000"
.pseudopc $2000 {
loop:
inc $d020
jmp loop    // will produce JMP $2000 instead of JMP $1000 when encoded
}
```

## References
- "labels_argument_labels_and_multi_labels" — expands on labels, '*' usage and memory positioning
- "prg_files_and_d64_disks_overview" — explains how memory blocks map to output files and disk images (Chapter 11)
