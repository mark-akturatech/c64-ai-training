# KERNAL transfer loop (FC0C–FCB7) — interrupt-masked I/O transfer controller

**Summary:** KERNAL high-level transfer loop that masks/unmasks interrupts (PHP/SEI/PLP), toggles VIC-II control bits ($D011), calls helper routines ($FCBD, $FCCA, $FDDD, $FC93), updates transfer state bytes ($BD,$BE,$D7,$A5,$A3,$AB,$A7, etc.), and loops until completion or error. Touches VIC-II ($D011) and CIA1 ($DC0D) during timed/interrupt-controlled device transfers.

## Transfer loop behavior and control flow

This block implements a higher-level I/O transfer loop used by the KERNAL to progress device packet transfers while coordinating with system interrupts and timing helpers. It repeatedly updates per-transfer state bytes, tests for completion or error conditions, and invokes timing/handshake subroutines; the loop uses flag/interrupt masking to ensure atomic changes to hardware-related state.

Key flow points and behaviors:
- Top-of-loop housekeeping:
  - LSR $BD shifts a state byte (flags/bitfield).
  - DEC $A3 / LDA $A3 tests a counter ($A3) and branches to $FC4E when it reaches zero (transfer-completion handling).
  - If the result is negative (BPL fails), code branches to $FC09 (loop/exit path handled outside this snippet).

- Interrupt-safe segments:
  - Calls to lower-level helper $FB97 followed by CLI occur on one control path: the code briefly ensures interrupts are enabled after that helper returns.
  - Around longer timed operations the code intentionally disables interrupts: at $FC93–$FC98 it does PHP / SEI and then forces a change to $D011 (VIC-II) via ORA #$10 / STA $D011, protecting the sequence with a saved flags byte and a later PLP at $FCB6 to restore the processor status. This creates a critical section for hardware register changes and subsequent timing calls.

- Timed/handshake helper calls and their purposes:
  - JSR $FCBD — invoked multiple times with X set to various countdown values (e.g., X=#08, #0A) immediately after SEI; used to perform a short timed delay or wait for a device condition while interrupts are disabled.
  - JSR $FCCA — called when $BE decrements to zero and also later after toggling $D011; used as another helper for timing/handshake, possibly to wait for device-ready conditions or to perform poll/ack steps.
  - JSR $FDDD — called after setting CIA1 register $DC0D; used for additional device sequencing or delay (called with interrupts disabled).
  - JSR $FCD1 and JSR $FCDB — invoked as part of data verification/transfer (FCD1 influences carry/branch outcomes; FCDB used after loading a byte via indirect indexed addressing and XORing with $D7).

- Data transfer/update operations:
  - The code uses indirect indexed addressing LDA ($AC),Y to fetch transfer bytes from a buffer and stores them into $BD (LDA ($AC),Y / STA $BD).
  - $D7 is used as a temporary/state byte: STX $D7 initializes it to 0, later it is EORed with the fetched byte and written back to $D7 (used as a running checksum or toggle state).
  - $BE and $BD appear as per-transfer counters/flags; $A5 is used as an inner-loop counter (initialized from #$09/#$0A via LDX and stored into $A5/$B6).

- Completion and error handling:
  - Several branch targets lead to $FC09 (not in this fragment) which is the main loop/return path for recurring attempts or early exits.
  - On transfer completion the code at $FC4E toggles bit 0 of $9B (EOR #$01 / STA $BD) and then jumps to $FEBC (likely KERNAL transfer-complete vector).
  - On some failure conditions the code branches to $FBC8 (error/abort handling outside this fragment) or jumps to $FEBC after setting completion flags.

- Hardware-register interactions:
  - $D011 is read/ORed with #$10 and written back while interrupts are disabled (critical section): this toggles a bit in the VIC-II control register as part of the transfer timing sequence.
  - $DC0D is written with #$7F (STA $DC0D) — a CIA1 register write performed while interrupts are disabled, followed by a JSR $FDDD; the code saves and later restores the processor status with PLP.

- Stack/flag handling:
  - PHP at $FC93 pushes the status byte, SEI follows to disable IRQs; after several operations PLP at $FCB6 restores the saved flags. This preserves and later restores the IRQ state across the critical region.

This routine interleaves software counters, indirect memory loads, hardware register writes, and helper calls to implement a robust transfer loop that waits and retries, coordinates with hardware timing, and signals completion via KERNAL vectors.

## Source Code
```asm
.,FC0C 46 BD    LSR $BD
.,FC0E C6 A3    DEC $A3
.,FC10 A5 A3    LDA $A3
.,FC12 F0 3A    BEQ $FC4E
.,FC14 10 F3    BPL $FC09
.,FC16 20 97 FB JSR $FB97
.,FC19 58       CLI
.,FC1A A5 A5    LDA $A5
.,FC1C F0 12    BEQ $FC30
.,FC1E A2 00    LDX #$00
.,FC20 86 D7    STX $D7
.,FC22 C6 A5    DEC $A5
.,FC24 A6 BE    LDX $BE
.,FC26 E0 02    CPX #$02
.,FC28 D0 02    BNE $FC2C
.,FC2A 09 80    ORA #$80
.,FC2C 85 BD    STA $BD
.,FC2E D0 D9    BNE $FC09
.,FC30 20 D1 FC JSR $FCD1
.,FC33 90 0A    BCC $FC3F
.,FC35 D0 91    BNE $FBC8
.,FC37 E6 AD    INC $AD
.,FC39 A5 D7    LDA $D7
.,FC3B 85 BD    STA $BD
.,FC3D B0 CA    BCS $FC09
.,FC3F A0 00    LDY #$00
.,FC41 B1 AC    LDA ($AC),Y
.,FC43 85 BD    STA $BD
.,FC45 45 D7    EOR $D7
.,FC47 85 D7    STA $D7
.,FC49 20 DB FC JSR $FCDB
.,FC4C D0 BB    BNE $FC09
.,FC4E A5 9B    LDA $9B
.,FC50 49 01    EOR #$01
.,FC52 85 BD    STA $BD
.,FC54 4C BC FE JMP $FEBC
.,FC57 C6 BE    DEC $BE
.,FC59 D0 03    BNE $FC5E
.,FC5B 20 CA FC JSR $FCCA
.,FC5E A9 50    LDA #$50
.,FC60 85 A7    STA $A7
.,FC62 A2 08    LDX #$08
.,FC64 78       SEI
.,FC65 20 BD FC JSR $FCBD
.,FC68 D0 EA    BNE $FC54
.,FC6A A9 78    LDA #$78
.,FC6C 20 AF FB JSR $FBAF
.,FC6F D0 E3    BNE $FC54
.,FC71 C6 A7    DEC $A7
.,FC73 D0 DF    BNE $FC54
.,FC75 20 97 FB JSR $FB97
.,FC78 C6 AB    DEC $AB
.,FC7A 10 D8    BPL $FC54
.,FC7C A2 0A    LDX #$0A
.,FC7E 20 BD FC JSR $FCBD
.,FC81 58       CLI
.,FC82 E6 AB    INC $AB
.,FC84 A5 BE    LDA $BE
.,FC86 F0 30    BEQ $FCB8
.,FC88 20 8E FB JSR $FB8E
.,FC8B A2 09    LDX #$09
.,FC8D 86 A5    STX $A5
.,FC8F 86 B6    STX $B6
.,FC91 D0 83    BNE $FC16
.,FC93 08       PHP
.,FC94 78       SEI
.,FC95 AD 11 D0 LDA $D011
.,FC98 09 10    ORA #$10
.,FC9A 8D 11 D0 STA $D011
.,FC9D 20 CA FC JSR $FCCA
.,FCA0 A9 7F    LDA #$7F
.,FCA2 8D 0D DC STA $DC0D
.,FCA5 20 DD FD JSR $FDDD
.,FCA8 AD A0 02 LDA $02A0
.,FCAB F0 09    BEQ $FCB6
.,FCAD 8D 15 03 STA $0315
.,FCB0 AD 9F 02 LDA $029F
.,FCB3 8D 14 03 STA $0314
.,FCB6 28       PLP
.,FCB7 60       RTS
```

## Key Registers
- $D011 - VIC-II - control register (written with ORA #$10 / STA $D011 in critical section)
- $DC0D - CIA1 - Interrupt Control Register (written with STA $DC0D = #$7F in this sequence)

## References
- "device_packet_assembly_and_control" — expands on uses packet control results to progress transfers
- "load_device_vectors_from_rom_table" — expands on may reload vectors as part of transfer completion

## Labels
- D011
- DC0D
