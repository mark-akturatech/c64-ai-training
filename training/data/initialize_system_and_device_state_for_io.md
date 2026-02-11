# KERNAL I/O initialization & device helper ($F838–$F8E1)

**Summary:** KERNAL helper routine (entry $F838) that sequences multiple JSRs ($F82E,$F7D7,$F817,$F0A4,$FCBD,$FB97,$F8D0), manipulates I/O/CIA/VIC-II registers ($DC0D-$DC0F, $D011), masks/clears interrupts (SEI/CLI), initializes zero-page KERNAL workspace ($02A2,$029F,$02A0,$90,$93,$AA,$B4,$B0,$9E,$9F,$9C,$AB,$BE,$C0,$01) and performs stacked return; prepares the system for subsequent file/device operations.

## Description
This routine performs a multi-step KERNAL initialization and device-preparation sequence:

- Entrypoint at $F838 calls other KERNAL helpers (first JSR $F82E). It branches/loops on their results (BEQ/BNE/BCS), establishing whether to proceed or return.
- Disables interrupts (SEI) for critical register modifications, then clears or initializes several zero-page KERNAL workspace bytes ($90,$93,$AA,$B4,$B0,$9E,$9F,$9C,$AB,$BE,$C0).
- Performs a short nested delay loop using LDX/LDY with DEY/DEX to wait a determinable time before re-enabling interrupts (CLI).
- Modifies CIA1 registers ($DC0D,$DC0E,$DC0F): loads $DC0E, ORA #$19, stores to $DC0F, then masks the accumulator with #$91 and stores the result into zero page $02A2 (used as a saved/masked device-control value).
- Adjusts VIC-II control ($D011) by clearing bits with AND #$EF and storing back to $D011 (disables/selects specific VIC-II control bits — see $D011 for exact bit meanings).
- Saves values from $0314/$0315 into zero page $029F/$02A0 (KERNAL runtime saved state used later to detect changes).
- Calls system/device setup JSRs ($F0A4, $FCBD, $FB97) and writes $02 into $BE (device selector/flag).
- Trims processor port bits in $01 (LDA $01 AND #$1F STA $01) to restrict memory/mapping bits before proceeding.
- Calls $F8D0 which itself JSRs $FFE1; after that it conditionally calls $FC93 and uses PLA/PLA to restore two stack bytes before exiting.
- Final behavior: if saved $02A0 equals $0315, the routine jumps/returns appropriately; otherwise it runs the device-ready helper and completes with RTS at $F8E1.

No high-level assumptions are made about what devices are being prepared; the routine supplies generic initialization, masking, workspace setup, and synchronization required before file/device operations.

## Source Code
```asm
.,F838 20 2E F8 JSR $F82E
.,F83B F0 F9    BEQ $F836
.,F83D A0 2E    LDY #$2E
.,F83F D0 DD    BNE $F81E
.,F841 A9 00    LDA #$00
.,F843 85 90    STA $90
.,F845 85 93    STA $93
.,F847 20 D7 F7 JSR $F7D7
.,F84A 20 17 F8 JSR $F817
.,F84D B0 1F    BCS $F86E
.,F84F 78       SEI
.,F850 A9 00    LDA #$00
.,F852 85 AA    STA $AA
.,F854 85 B4    STA $B4
.,F856 85 B0    STA $B0
.,F858 85 9E    STA $9E
.,F85A 85 9F    STA $9F
.,F85C 85 9C    STA $9C
.,F85E A9 90    LDA #$90
.,F860 A2 0E    LDX #$0E
.,F862 D0 11    BNE $F875
.,F864 20 D7 F7 JSR $F7D7
.,F867 A9 14    LDA #$14
.,F869 85 AB    STA $AB
.,F86B 20 38 F8 JSR $F838
.,F86E B0 6C    BCS $F8DC
.,F870 78       SEI
.,F871 A9 82    LDA #$82
.,F873 A2 08    LDX #$08
.,F875 A0 7F    LDY #$7F
.,F877 8C 0D DC STY $DC0D
.,F87A 8D 0D DC STA $DC0D
.,F87D AD 0E DC LDA $DC0E
.,F880 09 19    ORA #$19
.,F882 8D 0F DC STA $DC0F
.,F885 29 91    AND #$91
.,F887 8D A2 02 STA $02A2
.,F88A 20 A4 F0 JSR $F0A4
.,F88D AD 11 D0 LDA $D011
.,F890 29 EF    AND #$EF
.,F892 8D 11 D0 STA $D011
.,F895 AD 14 03 LDA $0314
.,F898 8D 9F 02 STA $029F
.,F89B AD 15 03 LDA $0315
.,F89E 8D A0 02 STA $02A0
.,F8A1 20 BD FC JSR $FCBD
.,F8A4 A9 02    LDA #$02
.,F8A6 85 BE    STA $BE
.,F8A8 20 97 FB JSR $FB97
.,F8AB A5 01    LDA $01
.,F8AD 29 1F    AND #$1F
.,F8AF 85 01    STA $01
.,F8B1 85 C0    STA $C0
.,F8B3 A2 FF    LDX #$FF
.,F8B5 A0 FF    LDY #$FF
.,F8B7 88       DEY
.,F8B8 D0 FD    BNE $F8B7
.,F8BA CA       DEX
.,F8BB D0 F8    BNE $F8B5
.,F8BD 58       CLI
.,F8BE AD A0 02 LDA $02A0
.,F8C1 CD 15 03 CMP $0315
.,F8C4 18       CLC
.,F8C5 F0 15    BEQ $F8DC
.,F8C7 20 D0 F8 JSR $F8D0
.,F8CA 20 BC F6 JSR $F6BC
.,F8CD 4C BE F8 JMP $F8BE
.,F8D0 20 E1 FF JSR $FFE1
.,F8D3 18       CLC
.,F8D4 D0 0B    BNE $F8E1
.,F8D6 20 93 FC JSR $FC93
.,F8D9 38       SEC
.,F8DA 68       PLA
.,F8DB 68       PLA
.,F8DC A9 00    LDA #$00
.,F8DE 8D A0 02 STA $02A0
.,F8E1 60       RTS
```

## Key Registers
- $D000-$D02E - VIC-II - control/status registers (contains $D011 modified here; $D011 controls raster/graphics flags)
- $DC00-$DC0F - CIA 1 - timer/port registers (code reads/writes $DC0D,$DC0E,$DC0F)
- $0001 - Processor port - memory/config port (masked with AND #$1F)
- $0002-$00FF (Zero Page / KERNAL workspace) — specific zero-page/KERNAL variables written/read:
  - $0090 - Zero Page/KERNAL workspace (cleared)
  - $0093 - Zero Page/KERNAL workspace (cleared)
  - $009C - Zero Page/KERNAL workspace (cleared)
  - $009E - Zero Page/KERNAL workspace (cleared)
  - $009F - Zero Page/KERNAL workspace (cleared)
  - $00A0 - Zero Page/KERNAL workspace (saved $0315)
  - $00A2 - Zero Page - saved/masked device-control value (stores masked CIA result)
  - $00AA - Zero Page/KERNAL workspace (cleared)
  - $00AB - Zero Page/KERNAL workspace (set to #$14)
  - $00B0 - Zero Page/KERNAL workspace (cleared)
  - $00B4 - Zero Page/KERNAL workspace (cleared)
  - $00BE - Zero Page/KERNAL workspace (set to #$02)
  - $00C0 - Zero Page/KERNAL workspace (set/copied)
  - $029F - KERNAL extended workspace (saved $0314)
  - $02A0 - KERNAL extended workspace (saved $0315)
  - $02A2 - KERNAL extended workspace (masked value stored from CIA operations)

## References
- "wait_for_device_ready_and_handle_flags" — expands on the same device-ready check & flag handling
- "compute_tape_or_disk_offsets_and_dispatch" — expands on follow-up address/offset computations and dispatch routines