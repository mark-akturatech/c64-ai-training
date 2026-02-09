# MACHINE — End of ROM Routine Listing and KERNAL Vectors ($FB97–$FFFA)

**Summary:** This section provides a detailed index of ROM routines and KERNAL vector endpoints, encompassing tape operations (write, transition, header, motor control), character setup, IRQ/NMI/BRK/RESET entry points, vector initialization, timer enablement, file and memory management, RS-232 I/O hooks, and the final ROM jump table and hardware vectors ($FFFA–$FFFF).

**Routine Map (Addresses and Brief Purpose):**

Below is a concise listing of ROM routine entry addresses with their corresponding labels and brief descriptions:

- **$FB97** — New character setup
- **$FBA6** — Send transition to tape
- **$FBC7** — Write data to tape
- **$FBCD** — IRQ entry point
- **$FC57** — Write tape header
- **$FC93** — Restore normal IRQ
- **$FCB8** — Set IRQ vector
- **$FCCA** — Kill tape motor
- **$FCD1** — Check R/W pointer
- **$FCDB** — Bump R/W pointer
- **$FCE2** — Power reset entry
- **$FD02** — Check 8-ROM
- **$FD10** — 8-ROM mask
- **$FD15** — KERNAL reset
- **$FD1A** — KERNAL move
- **$FD30** — Vectors
- **$FD50** — Initialize system constants
- **$FD9B** — IRQ vectors
- **$FDA3** — Initialize I/O
- **$FDDD** — Enable timer
- **$FDF9** — Save filename data
- **$FE00** — Save file details
- **$FE07** — Get status
- **$FE18** — Flag status
- **$FE1C** — Set status
- **$FE21** — Set timeout
- **$FE25** — Read/set top of memory
- **$FE27** — Read top of memory
- **$FE2D** — Set top of memory
- **$FE34** — Read/set bottom of memory
- **$FE43** — NMI entry
- **$FE66** — Warm start
- **$FEB6** — Reset IRQ and exit
- **$FEBC** — Interrupt exit
- **$FEC2** — RS-232 timing table
- **$FED6** — NMI RS-232 in
- **$FF07** — NMI RS-232 out
- **$FF43** — Fake IRQ
- **$FF48** — IRQ entry
- **$FF81** — Jumbo jump table
- **$FFFA** — Hardware vectors (final vector area)

**Notes:**

- Routine names are taken verbatim from the ROM listing. Descriptive names indicate intended roles (e.g., tape motor control, character setup, vector initialization), but full implementation details are not present in this chunk.
- Several entries form groups:
  - Tape subsystem: $FBA6, $FBC7, $FC57, $FCCA
  - IRQ/NMI/vector handling: $FBCD, $FC93, $FCB8, $FD30, $FD9B, $FE43, $FF48, $FF43
  - Reset/startup: $FCE2, $FD15, $FD50, $FDA3, $FE66
  - File/memory management: $FDF9, $FE00, $FE25–$FE34
  - RS-232 hooks/tables: $FEC2, $FED6, $FF07

**Vectors and Final ROM Area:**

- The listing culminates in the ROM jump table and hardware vectors housed at the top of the ROM image. The 6502 CPU vectors reside in the high page of memory:
  - $FFFA/$FFFB — NMI vector (low/high)
  - $FFFC/$FFFD — RESET vector (low/high)
  - $FFFE/$FFFF — IRQ/BRK vector (low/high)
- The ROM jump table (not expanded here) begins near $FF81 and leads into the hardware vectors at $FFFA.

## Source Code

Below are the disassembled machine code listings for routines $FB97 through $FF81, along with relevant tables and vectors.
