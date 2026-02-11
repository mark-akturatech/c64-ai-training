# KERNAL ROM: STOP-Key Check and TIMB Warm-Start (NMI entry $FE5E-$FE6F)

**Summary:** KERNAL ROM sequence that checks the STOP key during NMI/BRK entry (JSR $F6BC, JSR $FFE1), branches if not pressed, and — when STOP/BRK is detected — performs the TIMB warm-start sequence (JSR $FD15 RESTOR, JSR $FDA3 IOINIT, JSR $E518 CINT) then JMPs through the BASIC warm-start vector ($A002).

## Description
This ROM fragment is part of the NMI/BRK entry path. At label NNMI19 ($FE5E) it calls two routines that together detect the STOP key; if the STOP key is not pressed the code branches (BNE) to the next NMI handling path. If STOP (or BRK handling path TIMB) is taken, the KERNAL performs a system warm-start for BASIC:

- JSR $F6BC (UD60) — preliminary STOP-key test (called UD60 in the disassembly).
- JSR $FFE1 (STOP) — secondary STOP-key test; BNE after this means "no STOP" and execution continues to normal NMI/RS232 handling.
- If STOP is detected, execution falls through to the TIMB label (BRK warm-start):
  - JSR $FD15 (RESTOR) — restore system indirect vectors and internal state used by BASIC/IO.
  - JSR $FDA3 (IOINIT) — initialize/restore I/O for BASIC.
  - JSR $E518 (CINT) — restore the screen and character I/O state for BASIC.
  - JMP ($A002) — indirect JMP using the two-byte vector at $A002 to perform a BASIC warm-start (warm start vector).

This code is the canonical KERNAL path for converting a BRK/STOP request into a BASIC warm-start via the TIMB sequence. If the STOP key is not present, control flow continues to other NMI handling (e.g., RS232/NMI preparations handled in following code).

## Source Code
```asm
; CHECK FOR STOP KEY DOWN
NNMI19
.,FE5E 20 BC F6 JSR $F6BC              ; JSR UD60        ; NO .Y
.,FE61 20 E1 FF JSR $FFE1              ; JSR STOP        ; NO .Y
.,FE64 D0 0C    BNE $FE72              ; BNE NNMI20      ; NO STOP KEY...TEST FOR RS232

; TIMB - WHERE SYSTEM GOES ON A BRK INSTRUCTION
.,FE66 20 15 FD JSR $FD15       TIMB   ; JSR RESTOR      ; RESTORE SYSTEM INDIRECTS
.,FE69 20 A3 FD JSR $FDA3              ; JSR IOINIT      ; RESTORE I/O FOR BASIC
.,FE6C 20 18 E5 JSR $E518              ; JSR CINT        ; RESTORE SCREEN FOR BASIC
.,FE6F 6C 02 A0 JMP ($A002)            ; JMP ($A002)     ; ...NO, SO BASIC WARM START
```

## Key Registers
- $FE5E-$FE6F - KERNAL ROM - NMI/BRK handling and TIMB warm-start sequence (STOP-key check and BASIC warm-start)
- $F6BC - KERNAL ROM - UD60: preliminary STOP-key test (called by NNMI19)
- $FFE1 - KERNAL ROM - STOP: STOP-key test/handler
- $FD15 - KERNAL ROM - RESTOR: restore system indirects
- $FDA3 - KERNAL ROM - IOINIT: restore/initialize BASIC I/O
- $E518 - KERNAL ROM - CINT: restore screen/character I/O state for BASIC
- $A002 - KERNAL vector - BASIC warm-start vector (JMP ($A002) is used to enter BASIC warm start)

## References
- "rs232_nmi_entry_and_rom_check" — expands previous NMI entry and ROM presence check
- "nmi_prepare_and_t1_transmit" — expands next section: disable NMIs until ready and handle T1/T2/FLAG

## Labels
- UD60
- STOP
- RESTOR
- IOINIT
- CINT
