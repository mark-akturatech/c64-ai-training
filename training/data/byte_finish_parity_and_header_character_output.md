# Fully Commented C64 KERNAL ROM Disassembly: WRT2/WRT3/WRT4/WRTS ($FC0C-$FC54)

**Summary:** Disassembly and annotated explanation of the KERNAL routines at $FC0C-$FC54 implementing bit-level write sequencing (LSR OCHAR), bit counter handling (PCNTR $A3), header counter logic (CNTDN $A5), block-check character (BCC/DATA $D7) updates, parity injection (PRTY $9B), and exits to PREND ($FEBC). Contains JSRs to NEWCH ($FB97), CMPSTE ($FCD1) and INCSAL ($FCDB).

## Operation
This code handles sending the next bit of an output character, updates bit/byte counters, performs header-character generation, updates the block-check character (BCC/DATA), fetches next data characters from the source address (SAL), and finally injects parity and exits.

Sequence summary (by labeled routine names used in comments):
- WRT2 ($FC0C): Shift next bit out
  - LSR OCHAR ($BD) — advance to next bit in the current output character.
  - DEC PCNTR ($A3) — decrement the bit counter.
  - LDA PCNTR; BEQ WRT4 ($FC4E) — if 8 bits have been sent, branch to parity handling (WRT4).
  - BPL WRT3 ($FC09) — if the sign bit indicates bits remain, branch to the routine that sends the rest of the bits (WRT3).

- WRTS ($FC16): After bit handling
  - JSR NEWCH ($FB97) — helper to clean up counters and prepare for next bit/char.
  - CLI — re-enable interrupts to allow nesting.
  - LDA CNTDN ($A5); BEQ WRT6 ($FC30) — if CNTDN is zero, skip header-writing logic.

- Header-writing loop (WRTS1..WRT61)
  - Clear DATA/BCC: LDX #$00; STX DATA ($D7).
  - DEC CNTDN ($A5) — decrement header counter; intended to output header characters (9..0).
  - LDX FSBLK ($BE); CPX #2 — check if this is the first block header.
  - If FSBLK == 2, ORA #$80 to mark first-block header (sets high bit).
  - STA OCHAR ($BD) — store the header character into the output character and fall through to WRT3 to send it.

- WRT6 ($FC30): Block completion and BCC write
  - JSR CMPSTE ($FCD1) — compare start:end pointers to determine end-of-block.
  - BCC WRT7 ($FC3F) — if comparison indicates not done, continue normal fetch path.
  - BNE WRTL3 ($FBC8) — if equal (carry clear but zero clear), go mark end (branch to end-mark routine).
  - INC SAH ($AD) — increment source-address high byte when end marker processed.
  - LDA DATA ($D7); STA OCHAR ($BD) — place current BCC into output character for transmission.
  - BCS WRT3 ($FC09) — branch to WRT3 to send the BCC if carry set.

- WRT7 ($FC3F): Normal data fetch path
  - LDY #$00; LDA (SAL),Y — fetch next character from source-address pointer SAL (zero page pair at $AC/$AD).
  - STA OCHAR ($BD) — store fetched byte into OCHAR for bit-wise output.
  - EOR DATA ($D7); STA DATA ($D7) — update the BCC with the fetched byte.
  - JSR INCSAL ($FCDB) — increment the source-address pointer (SAL).
  - BNE WRT3 ($FC09) — branch always (code layout ensures this path re-enters bit-send routine).

- WRT4 ($FC4E): Parity injection and exit
  - LDA PRTY ($9B); EOR #$01 — flip parity bit as required.
  - STA OCHAR ($BD) — store parity into OCHAR to be sent as next bit.
  - JMP PREND ($FEBC) — restore registers and RTI/exit (PREND handles return/RTI).

Notes:
- Salient zero-page variables and their roles: OCHAR ($BD) holds the byte being shifted out; PCNTR ($A3) is the remaining-bit counter; CNTDN ($A5) controls header-character emission; DATA ($D7) holds the running BCC; FSBLK ($BE) flags first-block header handling; SAL pointer pair at $AC/$AD points to source data; SAH ($AD) used to increment source high byte when needed; PRTY ($9B) holds parity to inject at end of byte.
- JSRs referenced: NEWCH ($FB97) — cleans counters; CMPSTE ($FCD1) — compares start/end; INCSAL ($FCDB) — increments the SAL pointer; PREND ($FEBC) — restore registers and RTI.
- Flow decisions use status flags set by operations (LSR, DEC, CMP, EOR etc.) to branch between header generation, normal data fetch, BCC emission and parity injection.

## Source Code
```asm
.; Fully commented listing for $FC0C-$FC54 (KERNAL write sequence)
.,FC0C 46 BD    LSR $BD         WRT2   LSR OCHAR       ;MOVE TO NEXT BIT
.,FC0E C6 A3    DEC $A3         DEC    PCNTR           ;DEC COUNTER FOR # OF BITS
.,FC10 A5 A3    LDA $A3         LDA    PCNTR           ;CHECK FOR 8 BITS SENT...
.,FC12 F0 3A    BEQ $FC4E       BEQ    WRT4            ;...IF YES MOVE IN PARITY
.,FC14 10 F3    BPL $FC09       BPL    WRT3            ;...ELSE SEND REST
                                ;
.,FC16 20 97 FB JSR $FB97       WRTS   JSR NEWCH       ;CLEAN UP COUNTERS
.,FC19 58       CLI             CLI                    ;ALLOW FOR INTERRUPTS TO NEST
.,FC1A A5 A5    LDA $A5         LDA    CNTDN           ;ARE WE WRITING HEADER COUNTERS?...
.,FC1C F0 12    BEQ $FC30       BEQ    WRT6            ;...NO
                                ; WRITE HEADER COUNTERS (9876543210 TO HELP WITH READ)
.,FC1E A2 00    LDX #$00        LDX    #0              ;CLEAR BCC
.,FC20 86 D7    STX $D7         STX    DATA
.,FC22 C6 A5    DEC $A5         WRTS1  DEC CNTDN
.,FC24 A6 BE    LDX $BE         LDX    FSBLK           ;CHECK FOR FIRST BLOCK HEADER
.,FC26 E0 02    CPX #$02        CPX    #2
.,FC28 D0 02    BNE $FC2C       BNE    WRT61           ;...NO
.,FC2A 09 80    ORA #$80        ORA    #$80            ;...YES MARK FIRST BLOCK HEADER
.,FC2C 85 BD    STA $BD         WRT61  STA OCHAR       ;WRITE CHARACTERS IN HEADER
.,FC2E D0 D9    BNE $FC09       BNE    WRT3
                                ;
.,FC30 20 D1 FC JSR $FCD1       WRT6   JSR CMPSTE      ;COMPARE START:END
.,FC33 90 0A    BCC $FC3F       BCC    WRT7            ;NOT DONE
.,FC35 D0 91    BNE $FBC8       BNE    WRTL3           ;GO MARK END
.,FC37 E6 AD    INC $AD         INC    SAH
.,FC39 A5 D7    LDA $D7         LDA    DATA            ;WRITE OUT BCC
.,FC3B 85 BD    STA $BD         STA    OCHAR
.,FC3D B0 CA    BCS $FC09       BCS    WRT3            ;JMP
                                ;
.,FC3F A0 00    LDY #$00        WRT7   LDY #0          ;GET NEXT CHARACTER
.,FC41 B1 AC    LDA ($AC),Y     LDA    (SAL)Y
.,FC43 85 BD    STA $BD         STA    OCHAR           ;STORE IN OUTPUT CHARACTER
.,FC45 45 D7    EOR $D7         EOR    DATA            ;UPDATE BCC
.,FC47 85 D7    STA $D7         STA    DATA
.,FC49 20 DB FC JSR $FCDB       JSR    INCSAL          ;INCREMENT FETCH ADDRESS
.,FC4C D0 BB    BNE $FC09       BNE    WRT3            ;BRANCH ALWAYS
                                ;
.,FC4E A5 9B    LDA $9B         WRT4   LDA PRTY        ;MOVE PARITY INTO OCHAR...
.,FC50 49 01    EOR #$01        EOR    #1
.,FC52 85 BD    STA $BD         STA    OCHAR           ;...TO BE WRITTEN AS NEXT BIT
.,FC54 4C BC FE JMP $FEBC       WRTBK  JMP PREND       ;RESTORE REGS AND RTI EXIT
```

## Key Registers
- $BD - Zero Page - OCHAR (output character buffer, shifted by LSR)
- $A3 - Zero Page - PCNTR (bit counter for current byte)
- $A5 - Zero Page - CNTDN (header counter for writing header digits)
- $D7 - Zero Page - DATA (running Block-Check Character / BCC)
- $BE - Zero Page - FSBLK (first-block flag used to mark header high bit)
- $AC-$AD - Zero Page pair - SAL / SAH (source-address low/high used with (SAL),Y)
- $9B - Zero Page - PRTY (parity byte/bit for end-of-byte injection)

## References
- "write_end_of_block_and_bit_processing" — expands on arrives here after per-byte bit handling
- "block_completion_sync_and_write_zero_sequence" — expands on follows to complete block and write trailing sync/zeros
- "increment_address_pointer_insal" — expands on INCSAL used to increment source address (SAL) during header/data fetch