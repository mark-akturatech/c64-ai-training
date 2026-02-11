# KERNAL: Editor input patch, PANIC/NMI handling, VIC init, and keyboard-queue pop (E591–E5C9)

**Summary:** Patch to editor input flow (FINPUT/FINDST) to avoid A$ issues, NMI/PANIC entry that resets default I/O ($009A/$0099) and re-initializes VIC-II registers ($D000-$D02E), and a routine to remove a character from the keyboard queue ($0277/$0278). Contains FINPUT same-line check, PANIC/INITV and queue-shift logic.

## Overview / Behavior

- FINPUT same-line patch (at $E591–$E598)
  - Compares X against the stored LSXP ($C9). If equal, it returns (RTS) to the send path (avoiding a problematic A$ case described in comments). If not equal, it jumps to FINDST to handle wrap/other-line logic.
  - Purpose: avoid the "INPUT 'XXXXXXX-40-XXXXX';A$" problem by ensuring input continuation on the same line is handled correctly.

- PANIC / NMI entry (at $E59A–$E5B3)
  - NMI entry point JSRs PANIC ($E5A0), then jumps to NXTD (home cursor handler) at $E566.
  - PANIC:
    - Sets default I/O device variables: DFLTO ($009A) := #$03 and DFLTN ($0099) := #$00 — resetting KERNAL default I/O selection.
    - Calls INITV to initialize VIC-II registers.
  - INITV:
    - Loads X with #$2F (47 decimal) and, in a loop, copies a table of VIC values from ROM ($ECB8+X) into $CFFF+X (which maps to the VIC register range $D000–$D02E when X runs 0..$2F).
    - Decrements X until the full range is written, then RTS.
  - Effect: restores screen/VIC state and safe I/O defaults after a panic/NMI.

- Keyboard-queue remove (at $E5B4–$E5C9)
  - LP2 / LP1 sequence shifts the contents of the keyboard queue down by one byte:
    - Loads Y from KEYD ($0277), then reads KEYD+1+$X and writes it into KEYD+$X in a loop, incrementing X until X == NDX ($C6).
    - Decrements NDX and returns with interrupts enabled (CLI) and carry clear (CLC) for normal return.
  - Purpose: pop a character from the keyboard buffer and adjust the queue count/index.

- Other notes:
  - The VIC initialization writes to $CFFF+X where X = $00..$2F; addresses written therefore span $CFFF..$D02E (practically targeting $D000..$D02E as VIC-II registers).
  - Variables used: LSXP ($C9), NDX ($C6), KEYD ($0277/$0278), DFLTO ($009A), DFLTN ($0099).

## Source Code
```asm
.,E591 E4 C9    CPX $C9         FINPUT CPX LSXP        ;CHECK IF ON SAME LINE
.,E593 F0 03    BEQ $E598              BEQ FINPUX      ;YES..RETURN TO SEND
.,E595 4C ED E6 JMP $E6ED              JMP FINDST      ;CHECK IF WE WRAPPED DOWN...
.,E598 60       RTS             FINPUX RTS
.,E599 EA       NOP                    NOP             ;KEEP THE SPACE THE SAME...
                                ;PANIC NMI ENTRY
                                ;
.,E59A 20 A0 E5 JSR $E5A0       VPAN   JSR PANIC       ;FIX VIC SCREEN
.,E59D 4C 66 E5 JMP $E566       JMP    NXTD            ;HOME CURSOR
.,E5A0 A9 03    LDA #$03        PANIC  LDA #3          ;RESET DEFAULT I/O
.,E5A2 85 9A    STA $9A         STA    DFLTO
.,E5A4 A9 00    LDA #$00        LDA    #0
.,E5A6 85 99    STA $99         STA    DFLTN
                                ;INIT VIC
                                ;
.,E5A8 A2 2F    LDX #$2F        INITV  LDX #47         ;LOAD ALL VIC REGS ***
.,E5AA BD B8 EC LDA $ECB8,X     PX4    LDA TVIC-1,X
.,E5AD 9D FF CF STA $CFFF,X            STA VICREG-1,X
.,E5B0 CA       DEX             DEX
.,E5B1 D0 F7    BNE $E5AA       BNE    PX4
.,E5B3 60       RTS             RTS
                                ;
                                ;REMOVE CHARACTER FROM QUEUE
                                ;
.,E5B4 AC 77 02 LDY $0277       LP2    LDY KEYD
.,E5B7 A2 00    LDX #$00        LDX    #0
.,E5B9 BD 78 02 LDA $0278,X     LP1    LDA KEYD+1,X
.,E5BC 9D 77 02 STA $0277,X     STA    KEYD,X
.,E5BF E8       INX             INX
.,E5C0 E4 C6    CPX $C6         CPX    NDX
.,E5C2 D0 F5    BNE $E5B9       BNE    LP1
.,E5C4 C6 C6    DEC $C6         DEC    NDX
.,E5C6 98       TYA             TYA
.,E5C7 58       CLI             CLI
.,E5C8 18       CLC             CLC                    ;GOOD RETURN
.,E5C9 60       RTS             RTS
```

## Key Registers
- $D000-$D02E - VIC-II - VIC registers (INITV writes values covering this range via $CFFF+X)
- $009A - KERNAL variable - DFLTO (default output device)
- $0099 - KERNAL variable - DFLTN (default device number)
- $0277-$0278 - Keyboard buffer / KEYD (queue start and data area referenced in LP2/LP1)
- $C6 - KERNAL variable - NDX (keyboard queue index/count)
- $C9 - KERNAL variable - LSXP (line/X position marker used by FINPUT)

## References
- "editor_initialize_and_home" — expands on PANIC and STUPT interplay during initialization

## Labels
- FINPUT
- PANIC
- INITV
- KEYD
- NDX
- LSXP
- DFLTO
- DFLTN
