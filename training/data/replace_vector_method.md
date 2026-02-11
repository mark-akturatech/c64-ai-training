# Replace or augment BASIC/KERNAL routines via the RAM vector table (page 3)

**Summary:** Use the RAM vector table on page 3 (zero-page vectors) to replace or augment BASIC or KERNAL input/output routines; each vector is a 2‑byte little‑endian address. Change vectors via the KERNAL VECTOR routine (preferred) or by POKEing the low/high bytes directly; user routines should JMP to the saved original vector if they intend to run the system routine, or end with RTS to return to BASIC.

**Description**
- The C64 exposes many BASIC and I/O entry points as 2‑byte vectors in RAM on page 3 (the zero‑page/vector page). Each vector contains a low byte followed by a high byte (little‑endian) which the operating system uses as the routine address.
- To replace or augment any of these routines, you prepare a user routine in memory and change the vector so it points to your code.
- The KERNAL VECTOR routine is the recommended, reliable method to alter vectors (it handles writes safely). Alternatively, an individual vector may be changed by POKEing the low and high bytes directly into the vector table.
- If the user routine should defer to the original system behavior after performing its work, it must jump (JMP) to the address previously contained in the vector (the saved two‑byte address). If the user routine should return control directly to BASIC, it should finish with RTS.
- When modifying vectors:
  - Preserve the original vector bytes (low and high) before overwriting so you can call or restore them later.
  - Remember vectors are little‑endian: store or PEEK the low byte first, then the high byte.
  - Use the KERNAL VECTOR routine when available for atomic/safe updates (avoids race conditions or partial updates).
- Typical workflow (high level): save old vector (2 bytes) → install new vector pointing to user routine → user routine runs on invocation → user routine JMPs to saved original vector (if you want original behavior) or RTS to return to BASIC.

**Page 3 Vector Table**
The following table lists the vectors available in the RAM vector table on page 3, including their addresses and corresponding KERNAL routines:

| Address | Vector Name | Description |
|---------|-------------|-------------|
| $0314-$0315 | CINV | Vector: Hardware Interrupt |
| $0316-$0317 | CBINV | Vector: BRK Instruction Interrupt |
| $0318-$0319 | NMINV | Vector: Non-Maskable Interrupt |
| $031A-$031B | IOPEN | KERNAL OPEN Routine Vector |
| $031C-$031D | ICLOSE | KERNAL CLOSE Routine Vector |
| $031E-$031F | ICHKIN | KERNAL CHKIN Routine |
| $0320-$0321 | ICKOUT | KERNAL CHKOUT Routine |
| $0322-$0323 | ICLRCH | KERNAL CLRCHN Routine Vector |
| $0324-$0325 | IBASIN | KERNAL CHRIN Routine |
| $0326-$0327 | IBSOUT | KERNAL CHROUT Routine |
| $0328-$0329 | ISTOP | KERNAL STOP Routine Vector |
| $032A-$032B | IGETIN | KERNAL GETIN Routine |
| $032C-$032D | ICLALL | KERNAL CLALL Routine Vector |
| $032E-$032F | USRCMD | User-Defined Vector |
| $0330-$0331 | ILOAD | KERNAL LOAD Routine |
| $0332-$0333 | ISAVE | KERNAL SAVE Routine Vector |

Each vector consists of a 2-byte address (low byte followed by high byte) pointing to the corresponding routine.

**KERNAL VECTOR Routine**
The KERNAL VECTOR routine allows for reading or setting the RAM vectors safely.

**Usage:**
- To read the current RAM vectors into a user-defined table:
  1. Set the carry flag.
  2. Load the X and Y registers with the address of the user-defined table.
  3. Call the VECTOR routine.
- To set the RAM vectors from a user-defined table:
  1. Clear the carry flag.
  2. Load the X and Y registers with the address of the user-defined table.
  3. Call the VECTOR routine.

**Example:**
In this example, the existing vectors are saved into `USER_TABLE`, the input routine vector is modified to point to `MY_INPUT_ROUTINE`, and the updated vectors are written back.

For more details, refer to the KERNAL API documentation.

## Source Code

```assembly
; Change the input routine to a new system
LDX #<USER_TABLE
LDY #>USER_TABLE
SEC
JSR VECTOR      ; Read old vectors into USER_TABLE
LDA #<MY_INPUT_ROUTINE
STA USER_TABLE + 10
LDA #>MY_INPUT_ROUTINE
STA USER_TABLE + 11
LDX #<USER_TABLE
LDY #>USER_TABLE
CLC
JSR VECTOR      ; Set new vectors from USER_TABLE
...
USER_TABLE .RES 26
```


## References
- "vector_kernal_routine" — expands on the VECTOR routine used to read/alter the vector table safely.

## Labels
- VECTOR
- CINV
- CBINV
- NMINV
- IOPEN
- ICLOSE
- ICHKIN
- ICKOUT
- ICLRCH
- IBASIN
- IBSOUT
- ISTOP
- IGETIN
- ICLALL
- USRCMD
- ILOAD
- ISAVE
