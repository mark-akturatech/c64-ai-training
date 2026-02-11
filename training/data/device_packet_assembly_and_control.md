# KERNAL: Packet assembly / control flow (FBC8–FC09)

**Summary:** KERNAL control logic for assembling device/serial packets in the FBC8–FC09 range. Operations include SEC/ROR on zero-page bitfield $B6, conditional JSR calls to $FBB1/$FBAD/$FBA6, increments of $A8/$A9, toggling low bits in $A4 and $BD, and final JMP to $FEBC.

## Overview
This code fragment implements a small state machine used during device/serial packet assembly and its side-effects. Key actions:

- Rotate right of zero-page byte $B6 (SEC / ROR $B6) and branch on bit7 of the result (BMI).
- Conditional paths depending on zero-page counters/flags in $A8 and $A9; increments of those counters.
- Calls to routines at $FBB1, $FBAD and $FBA6 (JSR instructions) are made with specific call-time register values and their return zero flag (Z) controls flow.
- Toggle operations on LSBs of $A4 and $BD (EOR #$01 / STA) and an update to $9B using AND/ EOR result. These implement simple bit flips and an update of another status byte.
- All failure/early-exit paths jump to central exit at $FEBC (JMP $FEBC). One successful path jumps to $FC57.

This fragment is a control and branching hub — it does not itself contain data transfer loops or pointer setup (see referenced chunks for pointer/status setup and transfer loop/interrupt handling).

## Control flow and condition details
Step-by-step behavior (addresses as in the listing):

- FBC8: SEC — set carry for ROR.
- FBC9: ROR $B6 — rotate right through carry into zero-page byte $B6.
- FBCB: BMI $FC09 — if bit7 of $B6 is set after the rotate, branch to $FC09 (which JMPs $FEBC).
- FBCD..FBCF: LDA $A8; BNE $FBE3 — if $A8 ≠ 0 branch to the $A9 handling path starting at FBE3.
- FBD1..FBD5: If $A8 == 0, set A=#$10 and X=#01 then JSR $FBB1 — prepares registers and calls $FBB1.
- FBD8: D0 2F (BNE $FC09) — if $FBB1 returned Z=0, branch to $FC09 (exit).
- FBDA..FBDC: INC $A8 — increment $A8 and continue.
- FBDC..FBDE: LDA $B6; BPL $FC09 — if $B6 >= 0 (bit7 clear) branch to exit; otherwise continue to $FC57.
- FBE0: JMP $FC57 — jump to the $FC57 continuation (success path).
- FBE3..FBE5: LDA $A9; BNE $FBF0 — if $A9 ≠ 0 go to $FBF0 path.
- FBE7..FBEA: JSR $FBAD; D0 1D — call $FBAD; if returned Z=0 branch to exit.
- FBEC..FBEE: INC $A9; D0 19 — increment $A9; if result ≠ 0 branch to exit (so only zero after increment continues).
- FBF0..FBF3: JSR $FBA6; D0 14 — call $FBA6; if returned Z=0 branch to exit.
- FBF5..FBF9: LDA $A4; EOR #$01; STA $A4 — toggle bit0 of $A4.
- FBFB: BEQ $FC0C — if result of the LDA (post-toggle) is zero branch to $FC0C (falls through to BD handling when non-zero).
- FBFD..FC01: LDA $BD; EOR #$01; STA $BD — toggle bit0 of $BD.
- FC03..FC07: AND #$01; EOR $9B; STA $9B — AND $BD with #$01, XOR that bit into $9B and store (updates $9B based on toggled LSB).
- FC09: JMP $FEBC — central exit/jump.

Notes:
- The sequence uses the returned Z flag from the called subroutines ($FBB1, $FBAD, $FBA6) to decide whether to abort and jump to $FEBC.
- The rotate of $B6 combined with the BPL/BMI checks gate whether the routine proceeds to the success path ($FC57) or aborts ($FEBC).
- The toggle/update sequence on $A4/$BD/$9B modifies local state and uses BEQ to choose a nearby branch ($FC0C) vs continue.

## Source Code
```asm
.,FBC8 38       SEC
.,FBC9 66 B6    ROR $B6
.,FBCB 30 3C    BMI $FC09
.,FBCD A5 A8    LDA $A8
.,FBCF D0 12    BNE $FBE3
.,FBD1 A9 10    LDA #$10
.,FBD3 A2 01    LDX #$01
.,FBD5 20 B1 FB JSR $FBB1
.,FBD8 D0 2F    BNE $FC09
.,FBDA E6 A8    INC $A8
.,FBDC A5 B6    LDA $B6
.,FBDE 10 29    BPL $FC09
.,FBE0 4C 57 FC JMP $FC57
.,FBE3 A5 A9    LDA $A9
.,FBE5 D0 09    BNE $FBF0
.,FBE7 20 AD FB JSR $FBAD
.,FBEA D0 1D    BNE $FC09
.,FBEC E6 A9    INC $A9
.,FBEE D0 19    BNE $FC09
.,FBF0 20 A6 FB JSR $FBA6
.,FBF3 D0 14    BNE $FC09
.,FBF5 A5 A4    LDA $A4
.,FBF7 49 01    EOR #$01
.,FBF9 85 A4    STA $A4
.,FBFB F0 0F    BEQ $FC0C
.,FBFD A5 BD    LDA $BD
.,FBFF 49 01    EOR #$01
.,FC01 85 BD    STA $BD
.,FC03 29 01    AND #$01
.,FC05 45 9B    EOR $9B
.,FC07 85 9B    STA $9B
.,FC09 4C BC FE JMP $FEBC
```

## Key Registers
- $B6 - Zero page - rotated bitfield/flag (ROR used, bit7 tested)
- $A8 - Zero page - counter/flag (tested, incremented)
- $A9 - Zero page - counter/flag (tested, incremented)
- $A4 - Zero page - flag byte (LSB toggled via EOR #$01)
- $BD - Zero page - flag byte (LSB toggled via EOR #$01)
- $9B - Zero page - status byte updated via EOR with ($BD AND #$01)

## References
- "setup_dc_pointers_and_status_flag" — expands on reads/writes flags and pointer bytes set up earlier
- "transfer_loop_and_interrupt_masking" — expands on integration with the transfer loop and interrupt handling