# CHRD (CHR$) — create one-byte temporary string descriptor

**Summary:** CHRD (assembly label CHRD, $B6EC / 46828) implements the BASIC CHR$ operator: it creates a one-byte string descriptor on the temporary string stack and sets a pointer to that temporary string. Searchable terms: CHR$, temporary string stack, descriptor, $B6EC, FRESTR, FRETMS.

**Description**
CHRD is the machine-routine entry for BASIC's CHR$ function. It:

- Creates a descriptor on the temporary string stack for a one-byte string whose value is supplied by the CHR$ argument.
- Sets (returns) a pointer to that temporary one-byte string descriptor so BASIC can use the string value.

These temporary descriptors are managed by the BASIC string runtime; when they are discarded they are cleared by the FRESTR/FRETMS routines (see reference).

**Calling Convention**
The CHRD routine at $B6EC is called with the following parameters:

- **Input:**
  - **A register:** Contains the ASCII code (0–255) of the character to be converted into a string.

- **Output:**
  - **X register:** Low byte of the pointer to the temporary string descriptor.
  - **Y register:** High byte of the pointer to the temporary string descriptor.

The temporary string descriptor is structured as follows:

- **Offset 0–1:** Pointer to the string data (2 bytes).
- **Offset 2:** Length of the string (1 byte).

The string data itself is stored immediately following the descriptor in memory.

## Source Code
```assembly
; CHRD routine at $B6EC
CHRD:
    PHA                 ; Save A register on stack
    JSR FRESTR          ; Free temporary strings
    PLA                 ; Restore A register
    JSR FRETMS          ; Allocate temporary string space
    STA (PTR1),Y        ; Store character in allocated space
    LDA #1
    STA LEN             ; Set string length to 1
    JMP SETSTR          ; Set up string descriptor
```

## Key Registers
- **A register:** ASCII code of the character to be converted.
- **X register:** Low byte of the pointer to the temporary string descriptor.
- **Y register:** High byte of the pointer to the temporary string descriptor.

## References
- "frestr_discard_temporary_string" — expands on how temporary descriptors created by CHR$ are cleared by FRESTR/FRETMS when discarded.

## Labels
- CHRD
