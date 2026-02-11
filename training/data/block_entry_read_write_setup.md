# KERNAL Tape Read/Write Entry Points (RBLK / TRD / WBLK / TWRT)

**Summary:** Disassembly of KERNAL cassette entry points at $F841–$F873 covering RBLK (read header), TRD (read load), WBLK (write header) and TWRT/TWRT2/TWRT3 (write load) — shows flag clears (RDFLG, SNSW1, CMP0, PTR1/PTR2, DPSW), prompts via CSTE1/CSTE2, SEI usage, SHCNH/SHCNH setup, and IRQ/vector selection (LDX #$0E for read, LDX #$08 for write) before jumping to the main TAPE/WRTZ handlers.

## Overview
This chunk documents the KERNAL cassette entry points used to initiate tape read and write operations. It shows the initial status/version clearing for header reads, prompt calls to the user message routines (CSTE1/CSTE2), stop-key handling (BCS to TWRT3/STOP3), disabling interrupts with SEI, clearing of internal cassette-related flags, setting of timing/handshake variables (SHCNH), and selecting the IRQ/vector target by loading X with either #$0E (read) or #$08 (write) before branching to the shared TAPE entry or WRTZ handler.

## Read flow (RBLK / TRD)
- RBLK ($F841): prepares for reading a header block — clears STATUS ($90) and VERCK ($93), then JSR LDAD1.
- TRD ($F84A): JSR CSTE1 to prompt "PRESS PLAY" (see CSTE1), checks STOP (BCS TWRT3), disables maskable IRQs with SEI, and clears multiple cassette state flags:
  - RDFLG ($AA), SNSW1 ($B4), CMP0 ($B0), PTR1 ($9E), PTR2 ($9F), DPSW ($9C).
- TRD continues by loading A with #$90 (used for CA1 IRQ/read-line enable in context) and sets X = #$0E to point the IRQ/vector to the read handler, then branches to the shared TAPE entry.

## Write flow (WBLK / TWRT / TWRT2 / TWRT3)
- WBLK ($F864): calls LDAD1 (same as RBLK header path) to prepare write header.
- TWRT ($F867): LDA #$14 stores into SHCNH ($AB) — this configures the inter-block short timing for writes.
- TWRT2 ($F86B): JSR CSTE2 to prompt "PRESS PLAY & RECORD" (see CSTE2), then checks the STOP key (BCS TWRT3 / STOP3).
- On continue, SEI is executed; LDA #$82 loads a value enabling T2 IRQs and write-timing behavior; LDX #$08 sets the vector to WRTZ (write-timer/handler).
- TWRT3 handles the STOP-key branch; the sequence then hands control over to the common tape operation entry which uses the selected vector.

## Source Code
```asm
                                ;READ HEADER BLOCK ENTRY
                                ;
.,F841 A9 00    LDA #$00        RBLK   LDA #0
.,F843 85 90    STA $90         STA    STATUS
.,F845 85 93    STA $93         STA    VERCK
.,F847 20 D7 F7 JSR $F7D7       JSR    LDAD1
                                ;READ LOAD BLOCK ENTRY
                                ;
.,F84A 20 17 F8 JSR $F817       TRD    JSR CSTE1       ;SAY 'PRESS PLAY'
.,F84D B0 1F    BCS $F86E       BCS    TWRT3           ;STOP KEY PRESSED
.,F84F 78       SEI             SEI
.,F850 A9 00    LDA #$00        LDA    #0              ;CLEAR FLAGS...
.,F852 85 AA    STA $AA         STA    RDFLG
.,F854 85 B4    STA $B4         STA    SNSW1
.,F856 85 B0    STA $B0         STA    CMP0
.,F858 85 9E    STA $9E         STA    PTR1
.,F85A 85 9F    STA $9F         STA    PTR2
.,F85C 85 9C    STA $9C         STA    DPSW
.,F85E A9 90    LDA #$90        LDA    #$90            ;ENABLE FOR CA1 IRQ...READ LINE
.,F860 A2 0E    LDX #$0E        LDX    #14             ;POINT IRQ VECTOR TO READ
.,F862 D0 11    BNE $F875       BNE    TAPE            ;JMP
                                ;WRITE HEADER BLOCK ENTRY
                                ;
.,F864 20 D7 F7 JSR $F7D7       WBLK   JSR LDAD1
                                ;
                                ;WRITE LOAD BLOCK ENTRY
                                ;
.,F867 A9 14    LDA #$14        TWRT   LDA #20         ;BETWEEN BLOCK SHORTS
.,F869 85 AB    STA $AB         STA    SHCNH
.,F86B 20 38 F8 JSR $F838       TWRT2  JSR CSTE2       ;SAY 'PRESS PLAY & RECORD'
.,F86E B0 6C    BCS $F8DC       TWRT3  BCS STOP3       ;STOP KEY PRESSED
.,F870 78       SEI             SEI
.,F871 A9 82    LDA #$82        LDA    #$82            ;ENABLE T2 IRQS...WRITE TIME
.,F873 A2 08    LDX #$08        LDX    #8              ;VECTOR IRQ TO WRTZ
                                ;START TAPE OPERATION ENTRY POINT
                                ;
```

## References
- "press_play_prompt_and_debounce" — expands on Uses CSTE1 to prompt before reads
- "tape_operation_timer_and_irq_setup" — expands on Transfers flow to TAPE entry to configure timers and IRQs for cassette operation

## Labels
- RBLK
- TRD
- WBLK
- TWRT
- TWRT2
- TWRT3
