# KERNAL OPN050–OPN060: set up RIBUF/ROBUF pointers and allocate buffers

**Summary:** Sets RIDBE->RIDBS and RODBE->RODBS ($029B-$029E), calls GETTOP ($FE27) to obtain MEMSIZ, allocates RIBUF/ROBUF (zero page $F7-$FA) if not already allocated, signals a top-of-memory change (SEC) and jumps to SETTOP ($FE2D). Searchable terms: RIDBE, RIDBS, RODBE, RODBS, RIBUF, ROBUF, GETTOP $FE27, SETTOP $FE2D, zero page $F7-$FA.

## Description
- Copy DBE (buffer end) bytes into DBS (buffer start) pointers:
  - LDA $029B / STA $029C — RIDBE -> RIDBS
  - LDA $029E / STA $029D — RODBE -> RODBS
- Call GETTOP (JSR $FE27) to load MEMSIZ (top-of-memory) for allocation.
- Allocation checks and behavior:
  - RIBUF+1 is at $F8, RIBUF low byte at $F7.
  - If RIBUF+1 is nonzero (BNE), allocation for the input buffer already exists; skip adjusting.
  - If zero, DEY / STY $F8 and STX $F7 decrement the high byte and set the low byte to allocate 256 bytes (DEY adjusts high byte when subtracting 256).
  - Similarly for ROBUF: ROBUF+1 is $FA, ROBUF low byte is $F9. If $FA = 0, DEY / STY $FA and STX $F9 apply allocation.
- After allocation checks, SEC is set to signal a top-of-memory change to the caller of SETTOP.
- Load A with #$F0 and JMP SETTOP ($FE2D) to apply the new top-of-memory and record the change marker.

Labels in this routine are annotated OPN050..OPN060 in the disassembly; GETTOP is at $FE27 and SETTOP at $FE2D.

## Source Code
```asm
                                ; SET UP BUFFER POINTERS (DBE=DBS)
                                ;
.,F45C AD 9B 02 LDA $029B       OPN050 LDA RIDBE
.,F45F 8D 9C 02 STA $029C              STA RIDBS
.,F462 AD 9E 02 LDA $029E              LDA RODBE
.,F465 8D 9D 02 STA $029D              STA RODBS
                                ;
                                ; ALLOCATE BUFFERS
                                ;
.,F468 20 27 FE JSR $FE27       OPN055 JSR GETTOP      ;GET MEMSIZ
.,F46B A5 F8    LDA $F8                LDA RIBUF+1     ;IN ALLOCATION...
.,F46D D0 05    BNE $F474              BNE OPN060      ;ALREADY
.,F46F 88       DEY                    DEY             ;THERE GOES 256 BYTES
.,F470 84 F8    STY $F8                STY RIBUF+1
.,F472 86 F7    STX $F7                STX RIBUF
.,F474 A5 FA    LDA $FA         OPN060 LDA ROBUF+1     ;OUT ALLOCATION...
.,F476 D0 05    BNE $F47D              BNE MEMTCF      ;ALREAY
.,F478 88       DEY                    DEY             ;THERE GOES 256 BYTES
.,F479 84 FA    STY $FA                STY ROBUF+1
.,F47B 86 F9    STX $F9                STX ROBUF
.,F47D 38       SEC             MEMTCF SEC             ;SIGNAL TOP OF MEMORY CHANGE
.,F47E A9 F0    LDA #$F0               LDA #$F0
.,F480 4C 2D FE JMP $FE2D              JMP SETTOP      ;TOP CHANGED
                                ;
```

## References
- "cln232_cleanup_and_port_setup" — expands on CLN232 used earlier in OPN232 to initialize port/NMI state before buffer allocation

## Labels
- RIDBE
- RIDBS
- RODBE
- RODBS
- RIBUF
- ROBUF
