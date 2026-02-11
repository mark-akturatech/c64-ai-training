# KERNAL: VECTOR ($FF8D / 65421)

**Summary:** KERNAL routine VECTOR at $FF8D (65421) manages RAM system vectors; with Carry set (SEC) it reads current RAM vectors into a list pointed to by X/Y, with Carry clear (CLC) it writes a user list from X/Y back into the system RAM vectors. Registers used: X, Y (pointer); affected: A, X, Y; stack required: 2.

**Description**
Purpose: Manage all system vector jump addresses stored in RAM.

Call address: $FF8D (hex) / 65421 (dec).

Communication registers: X, Y point to a 2-byte-per-vector list in memory (little-endian addresses).

Operation:
- If the processor Carry flag is set (SEC) when JSR $FF8D is executed, VECTOR copies the current contents of the RAM vectors into the user list pointed to by X (low byte) and Y (high byte).
- If the Carry flag is clear (CLC) when JSR $FF8D is executed, VECTOR copies the addresses from the user list (pointed by X/Y) into the system RAM vectors, replacing them.
- The RAM vector table layout is as follows:

  | Address | Vector Name | Description |
  |---------|-------------|-------------|
  | $0314-$0315 | CINV | Hardware IRQ Interrupt Vector |
  | $0316-$0317 | CBINV | BRK Instruction Interrupt Vector |
  | $0318-$0319 | NMINV | Non-Maskable Interrupt Vector |
  | $031A-$031B | IOPEN | KERNAL OPEN Routine Vector |
  | $031C-$031D | ICLOSE | KERNAL CLOSE Routine Vector |
  | $031E-$031F | ICHKIN | KERNAL CHKIN Routine Vector |
  | $0320-$0321 | ICKOUT | KERNAL CHKOUT Routine Vector |
  | $0322-$0323 | ICLRCH | KERNAL CLRCHN Routine Vector |
  | $0324-$0325 | IBASIN | KERNAL CHRIN Routine Vector |
  | $0326-$0327 | IBSOUT | KERNAL CHROUT Routine Vector |
  | $0328-$0329 | ISTOP | KERNAL STOP Routine Vector |
  | $032A-$032B | IGETIN | KERNAL GETIN Routine Vector |
  | $032C-$032D | ICLALL | KERNAL CLALL Routine Vector |
  | $032E-$032F | USRCMD | User-Defined Vector |
  | $0330-$0331 | ILOAD | KERNAL LOAD Routine Vector |
  | $0332-$0333 | ISAVE | KERNAL SAVE Routine Vector |

  Each vector consists of a 2-byte address (little-endian format) pointing to the corresponding routine.

Usage notes and cautions:
- Recommended workflow: first read the entire vector table into a safe area in RAM (SEC + JSR VECTOR), modify only the desired vector entries in your user area, then write the entire table back (CLC + JSR VECTOR). Partial or incorrect writes can leave the system inoperative.
- Preparatory routines: none required.
- Error returns: none documented.
- Stack requirements: 2 (routine is called with JSR).
- Registers affected: A, X, Y (caller should preserve any needed registers).

How to use (step-by-step):
- READ system RAM vectors into user area:
  1) SEC
  2) Load X/Y with the low/high bytes of the destination address for the vector list
  3) JSR $FF8D
- LOAD system RAM vectors from user area:
  1) CLC
  2) Load X/Y with the low/high bytes of the source address containing the vector list
  3) JSR $FF8D

Example intent: change the input routine by reading the current vectors, modifying the appropriate vector entry in the user list, then writing the modified list back into the system vectors.

## Source Code
```asm
; CHANGE THE INPUT ROUTINES TO NEW SYSTEM
    LDX #<USER
    LDY #>USER
    SEC
    JSR $FF8D      ; READ OLD VECTORS
    LDA #<MYINP    ; CHANGE INPUT (low byte)
    STA USER+10
    LDA #>MYINP    ; CHANGE INPUT (high byte)
    STA USER+11
    LDX #<USER
    LDY #>USER
    CLC
    JSR $FF8D      ; ALTER SYSTEM
    ...
USER *=*+26
```

## Key Registers
- $FF8D - KERNAL - VECTOR (Manage RAM system vectors; SEC reads vectors into list at X/Y, CLC writes list at X/Y into system vectors)

## References
- "restor_kernal_routine" — restores default system vectors

## Labels
- VECTOR
- CINV
- CBINV
- NMINV
- IOPEN
- IGETIN
