# OPEN RS232 (KERNAL, $F409)

**Summary:** RS232-specific OPEN sequence in the C64 KERNAL that calls the RS232 init helper ($F483), copies up to 4 filename bytes into RAM ($0293-$0298), selects baud/parameter table entries via table lookups ($FEC0/$FEC1 or $E4EA/$E4EB) and stores RS232 parameters ($0295-$029B) and state bytes ($00F7-$00FA). Finishes by jumping to MEMTOP/_ROBOF update ($FE2D).

## Description
This routine implements the device-open path when the device is an RS232 device. Sequence summary (control-flow, no duplicated listing):

- Calls the RS232 initialization helper at $F483.
- Stores Y into $0297 (part of the RS232 parameter/workspace).
- Copies up to four bytes from the filename pointer referenced by ($BB),Y into the RAM buffer starting at $0293; loop controlled by CPY/#$04.
- Calls $EF4A and saves X into $0298.
- Tests the low nibble of $0293 (AND #$0F). If zero, skips parameter-table lookup.
- If the low nibble is non-zero:
  - ASL + TAX is used to form an index into a pair of lookup tables.
  - Branch on $02A6: if $02A6 == 0 load Y/A from tables at $FEC1/$FEC0 (ROM); otherwise use tables at $E4EB/$E4EA.
  - Stores Y into $0296 and A into $0295 (parameter bytes).
- Calls $FF2E with A shifted (ASL) — this is part of the parameter conversion/lookup sequence.
- Reads $0294, shifts right (LSR) and uses branch/JSR to $F00D if carry set (further device-specific setup).
- Copies selected parameter bytes ($029B→$029C, $029E→$029D).
- Calls $FE27 (KERNAL subroutine).
- Loads/stores RS232 state bytes in zero page ($00F8/$00F7 and $00FA/$00F9) with conditional adjustments (DEY if accumulator zero).
- Sets the carry (SEC), loads A = #$F0 and jumps to $FE2D to update MEMTOP/_ROBOF and return to OPEN flow.

The routine uses the following addressing and operations: indirect-indexed string copy via LDA ($BB),Y; CPY/BEQ/BNE loop control; bit-wise masking (AND #$0F); shifting (ASL, LSR); indexing into tables (LDY/LDA with X index); and multiple JSR/STA/LDY transfers to write the RS232 parameter workspace.

## Source Code
```asm
.,F409 20 83 F4 JSR $F483
.,F40C 8C 97 02 STY $0297
.,F40F C4 B7    CPY $B7
.,F411 F0 0A    BEQ $F41D
.,F413 B1 BB    LDA ($BB),Y
.,F415 99 93 02 STA $0293,Y
.,F418 C8       INY
.,F419 C0 04    CPY #$04
.,F41B D0 F2    BNE $F40F
.,F41D 20 4A EF JSR $EF4A
.,F420 8E 98 02 STX $0298
.,F423 AD 93 02 LDA $0293
.,F426 29 0F    AND #$0F
.,F428 F0 1C    BEQ $F446
.,F42A 0A       ASL
.,F42B AA       TAX
.,F42C AD A6 02 LDA $02A6
.,F42F D0 09    BNE $F43A
.,F431 BC C1 FE LDY $FEC1,X
.,F434 BD C0 FE LDA $FEC0,X
.,F437 4C 40 F4 JMP $F440
.,F43A BC EB E4 LDY $E4EB,X
.,F43D BD EA E4 LDA $E4EA,X
.,F440 8C 96 02 STY $0296
.,F443 8D 95 02 STA $0295
.,F446 AD 95 02 LDA $0295
.,F449 0A       ASL
.,F44A 20 2E FF JSR $FF2E
.,F44D AD 94 02 LDA $0294
.,F450 4A       LSR
.,F451 90 09    BCC $F45C
.,F453 AD 01 DD LDA $DD01
.,F456 0A       ASL
.,F457 B0 03    BCS $F45C
.,F459 20 0D F0 JSR $F00D
.,F45C AD 9B 02 LDA $029B
.,F45F 8D 9C 02 STA $029C
.,F462 AD 9E 02 LDA $029E
.,F465 8D 9D 02 STA $029D
.,F468 20 27 FE JSR $FE27
.,F46B A5 F8    LDA $F8
.,F46D D0 05    BNE $F474
.,F46F 88       DEY
.,F470 84 F8    STY $F8
.,F472 86 F7    STX $F7
.,F474 A5 FA    LDA $FA
.,F476 D0 05    BNE $F47D
.,F478 88       DEY
.,F479 84 FA    STY $FA
.,F47B 86 F9    STX $F9
.,F47D 38       SEC
.,F47E A9 F0    LDA #$F0
.,F480 4C 2D FE JMP $FE2D
.,F483 A9 7F    LDA #$7F
.,F485 8D 0D DD STA $DD0D
.,F488 A9 06    LDA #$06
.,F48A 8D 03 DD STA $DD03
.,F48D 8D 01 DD STA $DD01
.,F490 A9 04    LDA #$04
.,F492 0D 00 DD ORA $DD00
.,F495 8D 00 DD STA $DD00
.,F498 A0 00    LDY #$00
.,F49A 8C A1 02 STY $02A1
.,F49D 60       RTS
```

## Key Registers
- $0293-$029E - RAM - RS232 filename bytes and parameter workspace (copies from filename, stores parameter bytes $0295..$0296, etc.)
- $02A1 - RAM - workspace set to 0 by this routine
- $02A6 - RAM - flag used to select parameter/baud tables
- $00F7-$00FA - RAM (zero page) - RS232 state bytes ($F7,$F8,$F9,$FA accessed/stored)
- $DD00-$DD0F - CIA 2 - serial/timer/handshake registers (routine writes $DD00,$DD01,$DD03,$DD0D)
- $F483 - KERNAL ROM - RS232 initialization helper (entry called at start)
- $FEC0-$FEC1 - KERNAL ROM - parameter/baud lookup table (used when $02A6 == 0)
- $E4EA-$E4EB - ROM area - alternate parameter/baud lookup table (used when $02A6 != 0)
- $FF2E - KERNAL ROM - parameter conversion/lookup subroutine (called with A shifted)
- $FE27 - KERNAL ROM - subroutine called before final state update
- $FE2D - KERNAL ROM - MEMTOP/_ROBOF update (jump target to finish OPEN)

## References
- "open_file_part1" — expands on called-from OPEN when device is RS232
- "rs232_init_helper" — expands on initialization code at $F483 used here