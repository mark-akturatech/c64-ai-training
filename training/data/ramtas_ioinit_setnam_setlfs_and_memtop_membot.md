# RAMTAS, RAM Pointers, Timing & Tape-Related Kernal Routines

**Summary:** This document details the Kernal routines RAMTAS ($FD50), IOINIT ($FDA3), MEMTOP ($FE25), MEMBOT ($FE34), SETNAM/SETLFS, and timing/keyscan routines UDTIM ($FFEA), RDTIM ($FFDE), SETTIM ($FFDB), STOP ($FFE1). It also covers jiffy clock locations ($A0–$A2), zero-page RAM pointer locations ($0281–$0288), tape-related behavior (tape buffer pointer, cassette messages), and IRQ vectors at $FD9B.

**RAMTAS and Memory Pointers**

- **RAMTAS ($FD50, decimal 64848):** This Kernal routine initializes memory and sets up pointers during system startup.
  - Clears memory pages:
    - Page 0: Addresses $0002–$00FF.
    - Page 2: Addresses $0200–$02FF.
    - Page 3: Addresses $0300–$03FF.
  - Sets the tape buffer pointer to $033C.
  - Performs a non-destructive RAM test starting from $0400 to determine the top-of-RAM address.
    - Stores the top-of-RAM address in $0283–$0284.
  - Sets the bottom-of-RAM pointer ($0281–$0282) to $0800.
  - Sets the screen memory/bank pointer at $0288 (HIBASE) to 4, indicating screen memory starts at $0400.

- **MEMTOP ($FE25) and MEMBOT ($FE34):** These Kernal routines read or set the top and bottom RAM pointers. They use the processor registers: values are read into or written from the .X and .Y registers, with the Carry flag signaling set versus read operations, following the Kernal calling convention.

**IRQ Vectors and IOINIT**

- **IRQ Vector Table at $FD9B:** The Kernal contains a table of IRQ vectors at $FD9B (decimal 64923). This table lists vectors used for cassette write/read and the normal keyscan IRQ.

- **IOINIT ($FDA3, decimal 64931):** This routine initializes the CIA chips and the SID chip:
  - Turns off the SID volume by writing $00 to the volume control register at $D418.
  - Configures CIA#1 Timer A to generate the 1/60 second timing used by the Kernal:
    - Sets the Timer A latch to $4E20 (20000 decimal) by writing $20 to $DC04 and $4E to $DC05.
    - Starts Timer A in continuous mode by writing $11 to the control register at $DC0E.
    - Enables Timer A interrupts by writing $01 to the interrupt control register at $DC0D.

**SETNAM and SETLFS (Filename / File Parameters)**

- **SETNAM ($FDF9) and SETLFS ($FE00):** These documented Kernal routines are used as follows:
  - **SETNAM:** Sets filename parameters (pointer and length).
  - **SETLFS:** Sets the logical file number, device number, and secondary address for subsequent file operations.

**Jiffy Clock, UDTIM, RDTIM, SETTIM, STOP**

- **Software Jiffy Clock:**
  - Stored as three bytes at addresses $00A0–$00A2.
  - Order: $A0 = most significant byte, $A1 = middle byte, $A2 = least significant byte.

- **UDTIM (Update Time) — Kernal routine at $FFEA (decimal 65514):**
  - Typically called by the IRQ handler every 1/60 second.
  - Increments the 3-byte jiffy clock, rolling back to zero after a 24-hour count.
  - Scans the keyboard row containing the STOP key and stores its current value at $0091. This value is later checked by the STOP routine.

- **RDTIM (Read Time) — Kernal routine at $FFDE (decimal 65502):**
  - Reads the jiffy clock into registers:
    - Y ← $A0 (MSB), X ← $A1, A ← $A2 (LSB).

- **SETTIM (Set Time) — Kernal routine at $FFDB (decimal 65499):**
  - Writes A/X/Y back into $A2/$A1/$A0 respectively.
  - Interrupts are disabled during the store to avoid race conditions.

- **STOP — Kernal routine at $FFE1 (decimal 65505):**
  - Vectored through RAM location $0328.
  - Tests whether the STOP key was pressed during the last UDTIM call. If pressed:
    - Sets the Zero flag to indicate STOP.
    - Calls CLRCHN to restore keyboard/screen devices.
    - Empties the keyboard queue.

**I/O Error Handling**

- **Kernal I/O Error Subroutine Behavior:**
  - Calls CLRCHN to restore default I/O devices.
  - If bit 6 of the flag at $009D is set:
    - Prints "I/O ERROR" and the error number.
    - Sets the Carry flag.
    - Returns the error number in the Accumulator.
  - Note: BASIC does not use Kernal text error messages, but machine monitors or other programs might.

**Tape / Cassette Routines and Messages**

- **Kernal Tape Routines:**
  - Several routines are referenced with addresses and names provided:
    - **Get Next Tape File Header:** Reads tape blocks until a file header is found and prints "FOUND" plus the first 16 filename characters.
    - **Write Tape File Header Block:** Writes a file header block to tape.
    - **Put Pointer to Tape Buffer in .X and .Y:** Sets the .X and .Y registers to point to the tape buffer.
    - **Set I/O Area Start/End Pointers to Tape Buffer Start/End:** Configures the I/O area pointers for tape operations.
    - **Search Tape for a Filename:** Searches the tape for a specific filename.
    - **Test Cassette Buttons:** Checks the state of cassette buttons; prints "PRESS PLAY ON TAPE" if no button is pressed and waits (or until the STOP key is pressed). If a button is pressed, prints "OK".

- **Cassette Message Printing Routine:**
  - Entered after the test for direct mode; these messages cannot be suppressed by changing the flag at $009D.
  - A documented note suggests a manual trick: temporarily set HIBASE at $0288 to 160 and then back to 4 to redirect output to ROM for harmless printing.

## Source Code

```assembly
; RAMTAS Routine at $FD50
FD50   A2 00      LDX #$00        ; Initialize X register to 0
FD52   8E 02 00   STX $0002       ; Clear memory at $0002
FD55   8E 03 00   STX $0003       ; Clear memory at $0003
FD58   8E 04 00   STX $0004       ; Clear memory at $0004
; ... (continues clearing memory)
FD9A   60         RTS             ; Return from subroutine

; IRQ Vector Table at $FD9B
FD9B   31 EA      .WORD $EA31     ; Normal IRQ handler
FD9D   93 FD      .WORD $FD93     ; Cassette read IRQ handler
FD9F   94 FD      .WORD $FD94     ; Cassette write IRQ handler
```

## Key Registers

- **$0281–$0282:** Bottom-of-RAM pointer (set to $0800 by RAMTAS).
- **$0283–$0284:** Top-of-RAM pointer (determined by RAMTAS after non-destructive RAM test).
- **$0288:** HIBASE / screen pointer (set to 4 by RAMTAS).
- **$00A0–$00A2:** Software jiffy clock (MSB at $A0, mid at $A1, LSB at $A2).
- **$009

## Labels
- RAMTAS
- IOINIT
- MEMTOP
- MEMBOT
- SETNAM
- SETLFS
- UDTIM
- RDTIM
- SETTIM
- STOP
