# RS232 IN/OUT helpers and buffer management (RS232INOUT) — KERNAL ROM

**Summary:** Disassembly of KERNAL RS232 helper routines (BSO232, BSO100, CKI232) showing buffer handling (RODBS/RODBE, RODBUF, RIBUF), handshake and start/stop logic using CIA-2 timer and peripheral bits (D2CRA $DD0E, D2T1L $DD04, D2T1H $DD05, D2PRB $DD01), and ENABL/KERNAL variables ($02A1, $0294, $0299-$029A).

## Description
This chunk documents the KERNAL ROM routines used to send and receive RS232 data via the user port. It preserves exact control-flow and register writes from the disassembly:

- BSO232 (JSR target at $F017) is the buffered-serial OUTPUT handler:
  - Waits (hang loop) if the circular output buffer is full (compares RODBE vs RODBS).
  - Stores the byte passed in T1 into the buffer via indirect zero-page pointer (STA (ROBUF),Y).
  - If output hardware/timer is not already running, it initializes CIA-2 Timer 1 (D2T1L/D2T1H) with BAUDOF/BAUDOF+1, programs D2CRA to enable/disable the timer, calls OENABL and RSTBGN to enable output and begin transmission, and then enables the timer.
  - Uses ENABL ($02A1) as a flag to detect whether the T1 NMI (timer) is already enabled (LSR/BCS test).

- BSO100 / BSO110 / BSO120 are small helpers for setup and return:
  - BSO100 checks ENABL and exits early if timer already running.
  - BSO110 sets D2CRA to prevent false starts while programming timer registers.
  - BSO120 is a simple RTS return.

- CKI232 (at $F04D) is the buffered-serial INPUT setup entry:
  - Stores default input selector into DFLTN (zero page $0099).
  - Checks M51CDR ($0294) for "3/X line" configuration and full/half duplex (bit test).
  - If handshake is required, tests CIA-2 peripheral register D2PRB ($DD01) for DSR/RTS status and branches accordingly (handshake/turnaround logic).
  - Leaves further receive handling to BSI232/other receiver routines (see referenced chunks).

Notes:
- Buffer fullness check: CPY RODBS vs LDY RODBE+1 / BEQ hang loop at BSOBAD ($F014). The buffer pointers referenced are RODBS ($029D) read with CPY $029D and RODBE ($029E) loaded with LDY $029E then INY — typical circular buffer empty/full logic.
- The code writes CIA-2 registers directly: D2CRA ($DD0E) to enable/disable Timer 1 NMIs, D2T1L ($DD04) and D2T1H ($DD05) to load the timer count (BAUDOF and BAUDOF+1), and tests D2PRB ($DD01) for handshake lines.
- Zero-page and page-2 KERNAL variables are used:
  - RODBUF pointer in zero page ($F9) is used for indirect indexed store (STA (ROBUF),Y).
  - BAUDOF low/high values are stored at $0299/$029A (page $02).
  - Buffer start/end pointers RODBS/RODBE at $029D/$029E.
  - ENABL flag at $02A1 (page $02).
  - Default input selector DFLTN at zero page $0099.
- Several subroutines are JSR'd (OENABL, RSTBGN) which are defined elsewhere in the KERNAL.

## Source Code
```asm
; BSO232 - OUTPUT A CHAR RS232
;   DATA PASSED IN T1 FROM BSOUT
; HANG LOOP FOR BUFFER FULL

        .org $F014
BSOBAD  JSR $F028       ; JSR BSO100        ;KEEP TRYING TO START SYSTEM...

; BUFFER HANDLER

BSO232  LDY $029E       ; LDY RODBE
        INY
        CPY $029D       ; CPY RODBS         ;CHECK FOR BUFFER FULL
        BEQ $F014       ; BEQ BSOBAD        ;HANG IF SO...TRYING TO RESTART
        STY $029E       ; STY RODBE         ;INDICATE NEW START
        DEY             ; DEY
        LDA $009E       ; LDA T1            ;GET DATA...
        STA ($F9),Y     ; STA (ROBUF),Y    ;STORE DATA

; SET UP IF NECESSARY TO OUTPUT

BSO100  LDA $02A1       ; LDA ENABL         ;CHECK FOR A T1 NMI ENABLE
        LSR             ; LSR A             ;BIT 0
        BCS $F04C       ; BCS BSO120        ;RUNNING....SO EXIT

; SET UP T1 NMI'S

BSO110  LDA #$10        ; LDA #$10          ;TURN OFF TIMER TO PREVENT FALSE START...
        STA $DD0E       ; STA D2CRA
        LDA $0299       ; LDA BAUDOF        ;SET UP TIMER1
        STA $DD04       ; STA D2T1L
        LDA $029A       ; LDA BAUDOF+1
        STA $DD05       ; STA D2T1H
        LDA #$81        ; LDA #$81
        JSR $EF3B       ; JSR OENABL
        JSR $EF06       ; JSR RSTBGN       ;SET UP TO SEND (WILL STOP ON CTS OR DSR ERROR)
        LDA #$11        ; LDA #$11          ;TURN ON TIMER
        STA $DD0E       ; STA D2CRA

BSO120  RTS             ; RTS

; INPUT A FILE OVER USER PORT
;  USING RS232

CKI232  STA $0099       ; STA DFLTN         ;SET DEFAULT INPUT

        LDA $0294       ; LDA M51CDR        ;CHECK FOR 3/X LINE
        LSR             ; LSR A
        BCC $F07D       ; BCC CKI100        ;3 LINE...NO HANDSHAKE

        AND #$08        ; AND #$08          ;FULL/HALF CHECK (BYTE SHIFTED ABOVE)
        BEQ $F07D       ; BEQ CKI100        ;FULL...NO HANDSHAKE

; *TURN AROUND LOGIC
; CHECK IF DSR AND NOT RTS

        LDA #$02        ; LDA #$02          ;BIT RTS IS ON
        BIT $DD01       ; BIT D2PRB
        BPL $F00D       ; BPL CKDSRX        ;NO DSR...ERROR
        BEQ $F084       ; BEQ CKI110        ;RTS LOW...IN CORRECT MODE
```

## Key Registers
- $DD00-$DD0F - CIA-2 (D2) registers (used: $DD01 D2PRB, $DD04 D2T1L, $DD05 D2T1H, $DD0E D2CRA)
- $0299-$029A - KERNAL (page $02) - BAUDOF (timer low/high)
- $029D-$029E - KERNAL (page $02) - RODBS (buffer start), RODBE (buffer end)
- $02A1 - KERNAL (page $02) - ENABL (T1 NMI enable flag)
- $0294 - KERNAL (page $02) - M51CDR (3/X line / line-mode flags)
- $0099 - Zero page - DFLTN (default input selector)
- $00F9 - Zero page - RODBUF pointer (used with STA (ROBUF),Y indirect store)

## References
- "rs232trans_parity_and_bgn" — expands on BSO232 use of RSTBGN to start transmissions and parity/timer setup
- "rs232rcvr_overview_and_variables" — expands on BSI232 receiver, input bytes from RIBUF and related variables

## Labels
- BSO232
- CKI232
- BSO100
- ENABL
- BAUDOF
