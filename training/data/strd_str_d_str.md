# STRD (STR$) entry: header and brief description

**Summary:** STRD at $B465 — implementation entry for STR$ (stringify numeric parameter). Validates that the parameter is a number, then calls the floating-point-to-ASCII conversion routine and the routines that create pointers to the resulting string constant. Related to string-literal pointer setup and string-space allocation routines.

**Description**

Assembly label/entry: $B465 (decimal 46181) — mnemonic STRD — "Perform STR$".

Behavior (as documented):

- **Validation:** STR$ first checks the supplied parameter to ensure it is a numeric value. If the parameter is not numeric, a `?TYPE MISMATCH ERROR` is generated. This validation is performed by calling the routine at $AD8D (`CHKNUM`), which verifies the type of the argument. ([pagetable.com](https://www.pagetable.com/c64ref/c64disasm/?utm_source=openai))

- **Conversion:** Upon successful validation, STR$ calls the floating-point-to-ASCII conversion routine located at $BDDF (`FOUTC`). This routine converts the floating-point value in the Floating Point Accumulator (FAC) to its ASCII string representation. ([pagetable.com](https://www.pagetable.com/c64ref/c64disasm/?utm_source=openai))

- **String Descriptor Setup:** After conversion, STR$ sets up the string descriptor for the resulting string. It assigns the string's length and pointer to the descriptor, allowing BASIC to reference the string. The descriptor is stored in the temporary descriptor area (`DSCTMP`) at $61-$63. ([pagetable.com](https://www.pagetable.com/c64ref/c64disasm/?utm_source=openai))

- **String Space Allocation:** STR$ allocates space for the new string by calling the routine at $B4F4 (`GETSPA`). This routine reserves space in the string heap for the string's characters. If necessary, it may trigger garbage collection by calling the routine at $B526 (`GARBAG`) to free up space. ([pagetable.com](https://www.pagetable.com/c64ref/c64disasm/?utm_source=openai))

- **Garbage Collection Interaction:** If the string heap lacks sufficient space, `GETSPA` invokes `GARBAG` to perform garbage collection, reclaiming unused string space. This ensures that the new string can be stored without memory issues. ([pagetable.com](https://www.pagetable.com/c64ref/c64disasm/?utm_source=openai))

## Source Code

```assembly
; STR$ function implementation at $B465

B465   20 8D AD   JSR $AD8D      ; Call CHKNUM to validate numeric parameter
B468   A0 00      LDY #$00       ; Initialize Y register to 0
B46A   20 DF BD   JSR $BDDF      ; Call FOUTC to convert FAC to ASCII
B46D   68         PLA            ; Discard return address from stack
B46E   68         PLA            ; Discard return address from stack
B46F   A9 FF      LDA #$FF       ; Load A with $FF (low byte of string pointer)
B471   A0 00      LDY #$00       ; Load Y with $00 (high byte of string pointer)
B473   F0 12      BEQ $B487      ; Branch always to STRLIT
```

## Key Registers

- **FAC (Floating Point Accumulator):** Holds the numeric value to be converted.
- **$61-$63:** Temporary string descriptor storing the length and pointer to the resulting string.
- **$64-$65:** Pointer to the original string descriptor.

## References

- "strlit_scan_and_setup" — expands on string literal pointer setup called when creating string constants
- "getspa_allocate_string_space" — expands on allocation routine STR$ may rely on for storing strings

## Labels
- STRD
- DSCTMP
