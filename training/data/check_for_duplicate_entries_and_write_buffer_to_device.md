# Search directory buffer for duplicate entries and write device buffer byte

**Summary:** KERNAL disassembly (6502) that scans directory entries at $0100+$X for duplicates of the two‑byte filename in $AC/$AD, advances the directory pointer in $9F when a match is found, compares in‑memory buffer bytes via the indirect pointer at ($AC),Y and — when different — writes a byte with STA ($AC),Y. Calls to helper routines: JSR $FE1C (check/prepare) and later JSR $FCDB (device write finalizer).

## Description
This routine (starts $FB08) performs a search for duplicate directory entries and conditionally writes a byte into the device/buffer pointed to by the zero page pointer at $AC. Control flow and effects:

- LDX $9F; CPX $9E — compare current index/pointer ($9F) against an end pointer ($9E). If equal, branch out (no work).
- Compare two bytes of the candidate filename ($AC and $AD) against directory entry bytes at $0100+X and $0101+X (absolute,X addressing). If either byte differs, exit.
- On match, INC $9F twice: the routine advances $9F by two (skip/advance the directory index).
- Load $93; if $93 == 0 continue, otherwise exit. (Several exit points branch to $FB43.)
- Load $BD and set Y = 0; compare A (=$BD) with memory addressed by the indirect pointer ($AC),Y (CMP ($AC),Y). If equal, exit (no change needed).
- If not equal, INY and store Y into $B6 (this stores the index offset of the differing byte into $B6).
- Load $B6; if zero go to the section that will write the byte; otherwise:
  - LDA #$10; JSR $FE1C; following this JSR, if Z flag clear (BNE) exit. (JSR $FE1C is invoked when the differing byte index is nonzero — likely a check/prepare routine.)
- If $B6 was zero and $93 is zero, TAY to set Y from A, then LDA $BD and STA ($AC),Y — perform indirect-indexed store into the buffer pointed by ($AC) with index Y.
- After successful checks/conditional write the routine will proceed to the finalization step which eventually JSR $FCDB (device write helper) — see referenced chunk "finalize_write_compute_xor_and_cleanup".

Notes:
- Indirect addressing uses the pointer at $AC (two‑byte pointer stored in zero page).
- $9F is treated as an index/pointer that is advanced by two on a duplicate match.
- Multiple early exits branch to $FB43; this is the common "no action" return path for this scan iteration.
- This node preserves exact control flow and comparisons; semantic roles for $93, $BD, $B6, and $9E/$9F are given only as used by the code (no higher-level assumptions beyond the code logic).

## Source Code
```asm
.,FB08 A6 9F    LDX $9F
.,FB0A E4 9E    CPX $9E
.,FB0C F0 35    BEQ $FB43
.,FB0E A5 AC    LDA $AC
.,FB10 DD 00 01 CMP $0100,X
.,FB13 D0 2E    BNE $FB43
.,FB15 A5 AD    LDA $AD
.,FB17 DD 01 01 CMP $0101,X
.,FB1A D0 27    BNE $FB43
.,FB1C E6 9F    INC $9F
.,FB1E E6 9F    INC $9F
.,FB20 A5 93    LDA $93
.,FB22 F0 0B    BEQ $FB2F
.,FB24 A5 BD    LDA $BD
.,FB26 A0 00    LDY #$00
.,FB28 D1 AC    CMP ($AC),Y
.,FB2A F0 17    BEQ $FB43
.,FB2C C8       INY
.,FB2D 84 B6    STY $B6
.,FB2F A5 B6    LDA $B6
.,FB31 F0 07    BEQ $FB3A
.,FB33 A9 10    LDA #$10
.,FB35 20 1C FE JSR $FE1C
.,FB38 D0 09    BNE $FB43
.,FB3A A5 93    LDA $93
.,FB3C D0 05    BNE $FB43
.,FB3E A8       TAY
.,FB3F A5 BD    LDA $BD
.,FB41 91 AC    STA ($AC),Y
```

## Key Registers
- $9F - Zero page - current directory index/pointer (incremented by 2 on match)
- $9E - Zero page - end pointer / limit for $9F comparison
- $AC - Zero page - pointer (low byte) for indirect buffer address used by STA ($AC),Y
- $AD - Zero page - pointer (high byte) / second filename byte for comparison
- $0100-$0101 - RAM (directory buffer) - directory entries compared via absolute,X
- $93 - Zero page - control flag checked to decide write path
- $BD - Zero page - byte compared/written into buffer
- $B6 - Zero page - temporary Y index for differing byte offset (stored after INY)

## References
- "store_name_bytes_into_directory_buffer_and_update_counters" — expands on examines the just-written $0100..$0101 entries for duplicates
- "finalize_write_compute_xor_and_cleanup" — expands on successful checks lead to JSR $FCDB which is handled in the finalization step

## Labels
- $9F
- $9E
- $AC
- $AD
- $93
- $BD
- $B6
