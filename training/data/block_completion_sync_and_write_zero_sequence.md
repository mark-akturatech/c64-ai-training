# KERNAL cassette write sequence: WRNC/WREND/WRTZ/WRTS ($FC57-$FC91)

**Summary:** Disassembly of the KERNAL cassette write entry sequence at $FC57–$FC91, showing zero-page variables ($BE FSBLK, $A7 SHCNL, $AB SHCNH, $A5 CNTDN, $B6 PRP), subroutine calls (BSIV, TNOF, WRT1, NEWCH, RD300), and the SEI/CLI + BSIV pattern used to switch IRQ vectors for writing zeros/data.

## Sequence overview
This code implements the tail of a cassette write block and the transition into writing sync pulses and the next header/data write. Key actions in order:
- DEC $BE (FSBLK) — decrement remaining block count; if it reaches zero call TNOF to turn off the cassette motor.
- Initialize low-sync counter SHCNL ($A7) to 80 ($50) and load X with 8, then SEI and JSR BSIV to switch IRQ vectors to the "write zeros" handler.
- Enter WRTZ loop: load #$78 (120) and JSR WRT1 (writes leading zero pulses). Each pass decrements SHCNL; when SHCNL reaches zero, JSR NEWCH to clear counters and then DEC SHCNH ($AB).
- If SHCNH underflows (becomes negative), set up vector for data writing: LDX #$0A; JSR BSIV; CLI; INC SHCNH to clear it.
- Check FSBLK again; if zero, branch to system restore (STKY). Otherwise JSR RD300 (read next data to write), set CNTDN ($A5) and PRP ($B6) to $09, and jump back to WRTS to start writing header/data bytes.

Notes on control flow and side-effects:
- SEI/CLI pair bracket the BSIV call: interrupt disable is used while BSIV changes the IRQ vectors.
- BSIV is called twice with different X values (first with X=#$08 to select the "write zeros" handler, then X=#$0A to select the data write handler).
- SHCNL ($A7) is used as a low-sync pulse counter; SHCNH ($AB) is a high-sync counter (treated as signed for BPL/BNE tests).
- CNTDN ($A5) is set to 9 before header writes; PRP ($B6) is cleared (used as end-of-block flag).

## Source Code
```asm
                                ;
.,FC57 C6 BE    DEC $BE         WRNC   DEC FSBLK       ;CHECK FOR END
.,FC59 D0 03    BNE $FC5E       BNE    WREND           ;...BLOCK ONLY
.,FC5B 20 CA FC JSR $FCCA       JSR    TNOF            ;...WRITE, SO TURN OFF MOTOR
.,FC5E A9 50    LDA #$50        WREND  LDA #80         ;PUT 80 CASSETTE SYNCS AT END
.,FC60 85 A7    STA $A7         STA    SHCNL
.,FC62 A2 08    LDX #$08        LDX    #8
.,FC64 78       SEI             SEI
.,FC65 20 BD FC JSR $FCBD       JSR    BSIV            ;SET VECTOR TO WRITE ZEROS
.,FC68 D0 EA    BNE $FC54       BNE    WRTBK           ;JMP
                                ;
.,FC6A A9 78    LDA #$78        WRTZ   LDA #120        ;WRITE LEADING ZEROS FOR SYNC
.,FC6C 20 AF FB JSR $FBAF       JSR    WRT1
.,FC6F D0 E3    BNE $FC54       BNE    WRTBK
.,FC71 C6 A7    DEC $A7         DEC    SHCNL           ;CHECK IF DONE WITH LOW SYNC...
.,FC73 D0 DF    BNE $FC54       BNE    WRTBK           ;...NO
.,FC75 20 97 FB JSR $FB97       JSR    NEWCH           ;...YES CLEAR UP COUNTERS
.,FC78 C6 AB    DEC $AB         DEC    SHCNH           ;CHECK IF DONE WITH SYNC...
.,FC7A 10 D8    BPL $FC54       BPL    WRTBK           ;...NO
.,FC7C A2 0A    LDX #$0A        LDX    #10             ;...YES SO SET VECTOR FOR DATA
.,FC7E 20 BD FC JSR $FCBD       JSR    BSIV
.,FC81 58       CLI             CLI
.,FC82 E6 AB    INC $AB         INC    SHCNH           ;ZERO SHCNH
.,FC84 A5 BE    LDA $BE         LDA    FSBLK           ;IF DONE THEN...
.,FC86 F0 30    BEQ $FCB8       BEQ    STKY            ;...GOTO SYSTEM RESTORE
.,FC88 20 8E FB JSR $FB8E       JSR    RD300
.,FC8B A2 09    LDX #$09        LDX    #9              ;SET UP FOR HEADER COUNT
.,FC8D 86 A5    STX $A5         STX    CNTDN
.,FC8F 86 B6    STX $B6         STX    PRP             ;CLEAR ENDOF BLOCK FLAG
.,FC91 D0 83    BNE $FC16       BNE    WRTS            ;JMP
```

## Key Registers
- $00A7 - Zero Page - SHCNL (low sync pulse counter)
- $00AB - Zero Page - SHCNH (high sync pulse counter)
- $00BE - Zero Page - FSBLK (block counter)
- $00A5 - Zero Page - CNTDN (header/data countdown)
- $00B6 - Zero Page - PRP (end-of-block flag)

## References
- "bsiv_change_irq_vectors" — expands on uses BSIV to set IRQ vectors for zero/data writing
- "turn_off_cassette_motor_tnof" — expands on calls TNOF to shut the motor after the final block
- "interrupt_restore_and_vic_keyboard_restore_tnif_tniq" — expands on eventual system state restore after write completes