# KERNAL ROM: Dipole-Half Handler and Byte Assembly (RADK / RADBK)

**Summary:** Handler that detects dipole halves and assembles bits into a byte, using SNSW1 ($B4) to detect byte starts, checking timer1 IRQ state via KIKA26 ($02A3) and STUPID ($02A4), updating PCNTR ($A3), parity (PRTY $9B), and shifting bits into MYCH ($BF). Detects consecutive equal halves (SRER), counts zero dipoles (REZ $A9) to detect block sync (SYNO $96), calls STT1 ($F8E2) for dipole timeouts, and returns via PREND (JMP $FEBC) when a full byte+parity is ready.

## Routine Description
This KERNAL routine is a low-level serial/dipole input handler that runs when a dipole (magnetic/optical read) edge is detected. It performs these steps:

- Early exit: Reads SNSW1 ($B4). If clear, returns immediately (RADBK -> PREND).
- Timer1 IRQ gating: Reads KIKA26 ($02A3) and checks bit0 to see if Timer1 IRQ fired for the current half; if not set, returns (RADKX/RADBK). Reads STUPID ($02A4) to detect an old T1 IRQ; if that flag indicates no valid new IRQ, exit.
- First-half marker: When a valid Timer1 IRQ is present, clears FIRT ($A4) (marks first half) and clears STUPID ($02A4).
- Byte/bit state: Loads PCNTR ($A3) to determine whether this dipole half is a data bit or parity bit:
  - If PCNTR >= 0 (BPL), handle as DATA (RAD4).
  - If PCNTR < 0 (BMI), handle as PARITY (JRAD2).
- Parity handling: On parity path:
  - Set up a long timeout (LDX #$A6) and call STT1 ($F8E2) to arm timeout for parity window.
  - Check parity accumulator PRTY ($9B). If parity is odd (BNE), jump to SRER to set error.
  - If parity OK, jump to PREND (RADBK) to restore registers and RTI.
- Data path adjustments: Uses SVXT ($92) and CMP0 ($B0) as a small software servo adjustment:
  - If SVXT == 0, no adjustment.
  - If SVXT negative (BMI), increment CMP0 (longer base time).
  - Else decrement CMP0 (shorter base time).
  - Clears SVXT afterward.
- Consecutive-halves detection:
  - Compares DATA ($D7) with X (last dipole value) — if equal, a consecutive-half condition exists.
  - If the accumulated TXA (previous value) is nonzero (ones), jump to SRER (error). If zero, it's consecutive zeros: increment/inspect REZ ($A9).
  - If REZ is negative/below threshold, return without further processing.
  - If REZ reaches 16, set SYNO ($96) to flag inter-block sync and return.
- Normal data bit processing (RAD4):
  - Move last-read data into A (TXA).
  - Update parity by EOR with PRTY ($9B).
  - Re-check SNSW1 ($B4) — if not set, abort and return.
  - Decrement PCNTR ($A3). If PCNTR < 0, branch to RADP (parity handling).
  - Shift DATA ($D7) right (LSR $D7) and ROR MYCH ($BF) to shift incoming bit into MYCH buffer.
  - Arm another timeout (LDX #$DA; JSR STT1) for the next dipole.
  - Jump to PREND (JMP $FEBC) to restore registers and return to caller.

Errors and flags:
- SRER: Set when parity fails or consecutive ones detected.
- REZ: Counts consecutive zero dipoles; used to detect SYNO (16 zeros) — identifies inter-block gap.
- FIRT: First-half dipole flag cleared on valid T1 IRQ to mark detection.
- STUPID / KIKA26: Timer1 IRQ state flags used to correlate dipole halves with Timer1 captures.
- PRTY: Parity accumulator toggled per bit with EOR; checked once per parity half.

Calls and returns:
- Calls STT1 ($F8E2) to set timeouts for dipole windows (different LDX values for short/long).
- Returns via PREND (JMP $FEBC) which restores registers and executes RTI.

Registers/variables referenced (RAM locations and routine names are preserved as in source):
- SNSW1 ($B4) — dipole/byte-start sense
- KIKA26 ($02A3) — Timer1 IRQ capture/flag (bit0 tested)
- STUPID ($02A4) — old Timer1 IRQ flag
- FIRT ($A4) — first-half indicator (cleared on detection)
- PCNTR ($A3) — bit/byte position counter
- PRTY ($9B) — parity accumulator (EOR per bit)
- SVXT ($92), CMP0 ($B0) — software servo adjustment variables
- DATA ($D7) — last-read dipole value / shift source
- MYCH ($BF) — assembly buffer for incoming character (bits shifted in via ROR)
- REZ ($A9) — zero-dipole counter
- SYNO ($96) — block synchronisation flag
- STT1 (JSR $F8E2) — timeout/interval setup routine
- PREND (JMP $FEBC) — restore & RTI

## Source Code
```asm
.,F9AC A5 B4    LDA $B4         RDBK   LDA SNSW1       ;IF NO BYTE START...
.,F9AE F0 22    BEQ $F9D2       BEQ    RADBK           ;...THEN RETURN
.,F9B0 AD A3 02 LDA $02A3       LDA    KIKA26          ;CHECK TO SEE IF TIMER1 IRQD US...
.,F9B3 29 01    AND #$01        AND    #$01
.,F9B5 D0 05    BNE $F9BC       BNE    RADKX           ;...YES
.,F9B7 AD A4 02 LDA $02A4       LDA    STUPID          ;CHECK FOR OLD T1IRQ
.,F9BA D0 16    BNE $F9D2       BNE    RADBK           ;NO...SO EXIT
                                ;
.,F9BC A9 00    LDA #$00        RADKX  LDA #0          ;...YES, SET DIPOLE FLAG FOR FIRST HALF
.,F9BE 85 A4    STA $A4         STA    FIRT
.,F9C0 8D A4 02 STA $02A4       STA    STUPID          ;SET T1IRQ FLAG
.,F9C3 A5 A3    LDA $A3         LDA    PCNTR           ;CHECK WHERE WE ARE IN BYTE...
.,F9C5 10 30    BPL $F9F7       BPL    RAD4            ;...DOING DATA
.,F9C7 30 BF    BMI $F988       BMI    JRAD2           ;...PROCESS PARITY
.,F9C9 A2 A6    LDX #$A6        RADP   LDX #166        ;SET UP FOR LONGLONG TIMEOUT
.,F9CB 20 E2 F8 JSR $F8E2       JSR    STT1
.,F9CE A5 9B    LDA $9B         LDA    PRTY            ;IF PARITY NOT EVEN...
.,F9D0 D0 B9    BNE $F98B       BNE    SRER            ;...THEN GO SET ERROR
.,F9D2 4C BC FE JMP $FEBC       RADBK  JMP PREND       ;GO RESTORE REGS AND RTI
.,F9D5 A5 92    LDA $92         RAD3   LDA SVXT        ;ADJUST THE SOFTWARE SERVO (CMP0)
.,F9D7 F0 07    BEQ $F9E0       BEQ    ROUT1           ;NO ADJUST
.,F9D9 30 03    BMI $F9DE       BMI    ROUT2           ;ADJUST FOR MORE BASE TIME
.,F9DB C6 B0    DEC $B0         DEC    CMP0            ;ADJUST FOR LESS BASE TIME
.:F9DD 2C       .BYTE $2C       .BYT   $2C             ;SKIP TWO BYTES
.,F9DE E6 B0    INC $B0         ROUT2  INC CMP0
.,F9E0 A9 00    LDA #$00        ROUT1  LDA #0          ;CLEAR DIFFERENCE VALUE
.,F9E2 85 92    STA $92         STA    SVXT
                                ;CHECK FOR CONSECUTIVE LIKE VALUES IN DIPOLE...
.,F9E4 E4 D7    CPX $D7         CPX    DATA
.,F9E6 D0 0F    BNE $F9F7       BNE    RAD4            ;...NO, GO PROCESS INFO
.,F9E8 8A       TXA             TXA                    ;...YES SO CHECK THE VALUES...
.,F9E9 D0 A0    BNE $F98B       BNE    SRER            ;IF THEY WERE ONES THEN  ERROR
                                ; CONSECUTIVE ZEROS
.,F9EB A5 A9    LDA $A9         LDA    REZ             ;...CHECK HOW MANY ZEROS HAVE HAPPENED
.,F9ED 30 BD    BMI $F9AC       BMI    RDBK            ;...IF MANY DON'T CHECK
.,F9EF C9 10    CMP #$10        CMP    #16             ;... DO WE HAVE 16 YET?...
.,F9F1 90 B9    BCC $F9AC       BCC    RDBK            ;....NO SO CONTINUE
.,F9F3 85 96    STA $96         STA    SYNO            ;....YES SO FLAG SYNO (BETWEEN BLOCKS)
.,F9F5 B0 B5    BCS $F9AC       BCS    RDBK            ;JMP
.,F9F7 8A       TXA             RAD4   TXA             ;MOVE READ DATA TO .A
.,F9F8 45 9B    EOR $9B         EOR    PRTY            ;CALCULATE PARITY
.,F9FA 85 9B    STA $9B         STA    PRTY
.,F9FC A5 B4    LDA $B4         LDA    SNSW1           ;REAL DATA?...
.,F9FE F0 D2    BEQ $F9D2       BEQ    RADBK           ;...NO SO FORGET BY EXITING
.,FA00 C6 A3    DEC $A3         DEC    PCNTR           ;DEC BIT COUNT
.,FA02 30 C5    BMI $F9C9       BMI    RADP            ;IF MINUS THEN  TIME FOR PARITY
.,FA04 46 D7    LSR $D7         LSR    DATA            ;SHIFT BIT FROM DATA...
.,FA06 66 BF    ROR $BF         ROR    MYCH            ;...INTO BYTE STORAGE (MYCH) BUFFER
.,FA08 A2 DA    LDX #$DA        LDX    #218            ;SET UP FOR NEXT DIPOLE
.,FA0A 20 E2 F8 JSR $F8E2       JSR    STT1
.,FA0D 4C BC FE JMP $FEBC       JMP    PREND           ;RESTORE REGS AND RTI
```

## References
- "read_timer_capture_and_noise_reject" — expands on continued timing capture and noise rejection after initial timing capture
- "long_pulse_handler_rad2" — expands on jumps to RAD2 when a long/long pulse is detected
- "finish_byte_and_newchar_call" — expands on behavior when a byte is complete and routine jumps to PREND to restore registers and return

## Labels
- SNSW1
- PCNTR
- PRTY
- MYCH
- REZ
- SYNO
- STT1
- PREND
