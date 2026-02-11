# RAM test and memory-top detection (C64 ROM disassembly fragment)

**Summary:** 6502 assembly implementing the C64 RAM test and memory-top detection routine: clears zero page (except $0000/$0001) and pages $0200/$0300, sets cassette/tape buffer pointer ($B2/$B3), iterates writing and verifying patterns (0x55 and rotated patterns) through memory using an indirect pointer at $C1/$C2 to detect RAM end, then calls KERNAL $FE2D to set the top of memory and stores OS start ($0282) and screen page ($0288).

## Operation
This routine performs an automatic RAM probe to locate the end of writable RAM and install the system memory-top.

- Clear loop:
  - LDA #$00 / TAY sets A=0 and Y=0.
  - STA $0002,Y writes zero starting at $0002 (skipping $0000/$0001).
  - STA $0200,Y and STA $0300,Y also clear the full $0200 and $0300 pages using the same Y index loop. The loop increments Y until it wraps to 0, covering 256 writes per base address.

- Tape buffer initialization:
  - LDX #$3C / LDY #$03 / STX $B2 / STY $B3 sets the cassette buffer start pointer to $033C (low byte $B2 = $3C, high byte $B3 = $03).

- RAM-test pointer setup:
  - LDA #$03 / STA $C2 sets $C2 = $03 (high byte for pointer in $C1/$C2).
  - INC $C2 increments it to $04 before the test loop; the pointer pair $C1/$C2 is used as the indirect base pointer into memory being tested.

- Test loop algorithm:
  - LDA ($C1),Y loads a byte via the indirect pointer ($C1) + Y.
  - TAX saves the original byte in X (for later re-write).
  - LDA #$55 / STA ($C1),Y writes the test pattern 0x55.
  - CMP ($C1),Y verifies the written pattern; BNE to exit if the read does not match (indicates non-writable/ROM or end of RAM).
  - ROL A (rotate left the accumulator) producing a different pattern (bits rotated).
  - STA ($C1),Y and CMP ($C1),Y verify the rotated pattern; BNE to exit if mismatch.
  - TXA / STA ($C1),Y restores the original byte (from X).
  - INY / loop: increment Y to move through the page; if Y wraps (BEQ to earlier INC $C2 path) the code increments the high byte in $C2 and continues testing at the next 256-byte page.
  - If any write/verify fails, the test finishes and sets the memory top.

- Setting memory top and housekeeping:
  - LDY $C2 / CLC / JSR $FE2D calls the KERNAL routine at $FE2D to set the top of memory (uses $C1/$C2/$Y as the detected top pointer per ROM conventions).
  - Save constants:
    - LDA #$08 / STA $0282 stores $08 into $0282 (OS start high byte).
    - LDA #$04 / STA $0288 stores $04 into $0288 (screen memory page).
  - RTS returns to caller.

Behavioral notes preserved from ROM:
- The test writes and verifies two patterns (0x55 and its 1-bit rotate) to detect write/read discrepancies that mark ROM or absent RAM.
- The indirect pointer used for probing is the zero-page pointer at $C1/$C2 with Y as the index; $C2 is incremented to advance high-byte pages.
- The routine intentionally avoids touching $0000/$0001.

## Source Code
```asm
.,FD50 A9 00    LDA #$00        ; clear A
.,FD52 A8       TAY             ; clear index
.,FD53 99 02 00 STA $0002,Y     ; clear page 0, don't do $0000 or $0001
.,FD56 99 00 02 STA $0200,Y     ; clear page 2
.,FD59 99 00 03 STA $0300,Y     ; clear page 3
.,FD5C C8       INY             ; increment index
.,FD5D D0 F4    BNE $FD53       ; loop if more to do
.,FD5F A2 3C    LDX #$3C        ; set cassette buffer pointer low byte
.,FD61 A0 03    LDY #$03        ; set cassette buffer pointer high byte
.,FD63 86 B2    STX $B2         ; save tape buffer start pointer low byte
.,FD65 84 B3    STY $B3         ; save tape buffer start pointer high byte
.,FD67 A8       TAY             ; clear Y
.,FD68 A9 03    LDA #$03        ; set RAM test pointer high byte
.,FD6A 85 C2    STA $C2         ; save RAM test pointer high byte
.,FD6C E6 C2    INC $C2         ; increment RAM test pointer high byte
.,FD6E B1 C1    LDA ($C1),Y     ; load byte via pointer ($C1/$C2)+Y
.,FD70 AA       TAX             ; save original in X
.,FD71 A9 55    LDA #$55
.,FD73 91 C1    STA ($C1),Y     ; write 0x55
.,FD75 D1 C1    CMP ($C1),Y     ; verify 0x55
.,FD77 D0 0F    BNE $FD88       ; mismatch -> exit
.,FD79 2A       ROL             ; rotate accumulator -> new pattern
.,FD7A 91 C1    STA ($C1),Y     ; write rotated pattern
.,FD7C D1 C1    CMP ($C1),Y     ; verify rotated pattern
.,FD7E D0 08    BNE $FD88       ; mismatch -> exit
.,FD80 8A       TXA             ; restore original from X
.,FD81 91 C1    STA ($C1),Y     ; write original back
.,FD83 C8       INY             ; next byte (index)
.,FD84 D0 E8    BNE $FD6E       ; loop within page
.,FD86 F0 E4    BEQ $FD6C       ; wrapped -> increment high byte and continue
.,FD88 98       TYA
.,FD89 AA       TAX
.,FD8A A4 C2    LDY $C2
.,FD8C 18       CLC
.,FD8D 20 2D FE JSR $FE2D       ; set the top of memory (KERnAL)
.,FD90 A9 08    LDA #$08
.,FD92 8D 82 02 STA $0282       ; save the OS start of memory high byte
.,FD95 A9 04    LDA #$04
.,FD97 8D 88 02 STA $0288       ; save the screen memory page
.,FD9A 60       RTS              ; return
```

## Key Registers
- $0002-$0101 - Zero page area starting at $0002 written/cleared by the routine (skips $0000/$0001)
- $0200-$02FF - Page $02 cleared
- $0300-$03FF - Page $03 cleared
- $B2-$B3 - Zero page: cassette/tape buffer start pointer (set to $033C)
- $C1-$C2 - Zero page: indirect RAM-test pointer used as base for probing memory
- $0282 - System vector: OS start high byte saved ($08)
- $0288 - System: screen memory page saved ($04)
- $FE2D - KERNAL JSR target invoked to set the top of memory

## References
- "reset_hardware_startup" — expands on call during reset that locates RAM end
- "read_set_top_of_memory" — expands on writes memory top via $FE2D