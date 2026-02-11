# PET/CBM — Changing the Start‑Of‑Variables (SOV) Pointer

**Summary:** This guide explains how to view and modify the BASIC Start‑Of‑Variables (SOV) pointer located at $002A/$002B on the Commodore PET/CBM computers. Adjusting this pointer is essential when integrating machine language programs to prevent BASIC from overwriting machine code. The SOV pointer is stored in little‑endian format, meaning the low byte is at $002A and the high byte at $002B.

**Changing the SOV Pointer on PET/CBM**

- **Viewing the SOV Pointer:**
  - The SOV pointer is a 16‑bit address stored in little‑endian format at zero page addresses $002A (low byte) and $002B (high byte).
  - To display the current SOV pointer, use the machine monitor's memory dump command:
    - `.M 002A 002B` — This command will display the two bytes that represent the SOV address.

- **Modifying the SOV Pointer:**
  - To relocate the SOV above a machine language program, calculate the desired starting address for BASIC variables. For example, if your machine language program occupies memory up to $04C7, you might set the SOV to $04C8.
  - Write the new SOV address to $002A/$002B in little‑endian order (low byte first):
    - `.M 002A 002B` — Displays current SOV pointer.
    - `.M 002A C8 04` — Sets SOV to $04C8 (C8 is the low byte, 04 is the high byte).
    - `.M 002A 002B` — Verify the change; it should display `002A: C8 04`.

- **Important Considerations:**
  - **Memory Allocation:** Ensure that the new SOV address does not overlap with your machine language program. Overlapping memory regions can lead to data corruption.
  - **BASIC Behavior:** Changing the SOV affects where BASIC allocates memory for variables, strings, and arrays. Incorrect settings can cause BASIC programs to malfunction or crash.
  - **Monitor Syntax Variations:** The exact syntax for monitor commands may vary depending on the PET/CBM model and ROM version. Refer to your system's documentation for precise command usage.

## Source Code
```text
; Example monitor commands (PET/CBM monitor syntax varies slightly by ROM):
; Display SOV pointer (two bytes at $002A and $002B)
.M 002A 002B
; Example output might show: 002A: C8 04   (meaning SOV = $04C8)

; Set SOV to $04C8 (low byte first)
.M 002A C8 04

; Verify change
.M 002A 002B
; Expect: 002A: C8 04
```

## Key Registers
- **SOV Pointer:**
  - **Address:** $002A (low byte), $002B (high byte)
  - **Description:** Points to the start of BASIC variable storage area.

## References
- "exercise_ch6_pet_cbm_version" — Expanded PET/CBM 'times ten' example that may require moving the SOV pointer.
- Commodore PET Memory Map — Detailed memory allocation and usage for PET/CBM systems. ([zimmers.net](https://zimmers.net/anonftp/pub/cbm/maps/index.html?utm_source=openai))
- Commodore PET User's Manual — Official documentation providing insights into system architecture and memory management.

## Labels
- SOV
