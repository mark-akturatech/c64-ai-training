# INITMS: OUTPUT POWER-UP MESSAGE

**Summary:** Outputs the Kernal startup message and computes BASIC bytes free by reading TXTTAB ($002B/$002C) and MEMSIZ ($0037/$0038), calling the memory-overlap check (JSR $A408), printing strings via JSR $AB1E, computing the difference with SEC/SBC into A/X, outputting the numeric value via JSR $BDCD, printing "BASIC BYTES FREE" at $E460, and finally jumping to $A644 (NEW).

## Operation
This routine performs the C64 power-up message and reports the number of BASIC bytes free:

- Read TXTTAB (zero-page pointer in $002B/$002C) into A (low) and Y (high). This points to the start of BASIC text storage.
- Call JSR $A408 (memory-overlap check).
- Load the address $E473 into A/Y (LDA #$73 / LDY #$E4) and JSR $AB1E to output the startup message string located at $E473 (Kernal ROM string output routine).
- Read MEMSIZ (zero-page pointer in $0037/$0038) and subtract TXTTAB to compute free BASIC bytes:
  - SEC; SBC $002B (low byte), TAX moves the result low byte into X.
  - LDA $0038; SBC $002C (high byte) leaves the high byte in A.
  - The numeric value is therefore in A (high) / X (low) for a 16-bit count.
- JSR $BDCD is used to output the 16-bit number in (A/X) (numeric output routine).
- Load pointer $E460 (LDA #$60 / LDY #$E4) and JSR $AB1E to print the "BASIC BYTES FREE" message (string at $E460).
- JMP $A644 to perform NEW and exit to BASIC.

Notes:
- The subtraction uses SEC/SBC so the A/X pair after TAX contains the 16-bit result: low in X (via TAX after the low SBC), high in A after the high SBC.
- JSR targets used: $A408 (overlap check), $AB1E (string output; expects address in A/Y), $BDCD (numeric output for A/X), $A644 (NEW).

## Source Code
```asm
                                *** INITMS: OUTPUT POWER-UP MESSAGE
                                This routine outputs the startup message. It then
                                calculates the number of BASIC bytes free by subtracting
                                the TXTTAB from MEMSIZ, and outputs this number. The
                                routine exits via NEW.
.,E422 A5 2B    LDA $2B         read TXTTAB, start of BASIC
.,E424 A4 2C    LDY $2C
.,E426 20 08 A4 JSR $A408       check for memory overlap
.,E429 A9 73    LDA #$73        $e473, startup message
.,E42B A0 E4    LDY #$E4
.,E42D 20 1E AB JSR $AB1E       output (A/Y)
.,E430 A5 37    LDA $37         MEMSIZ, highest address in BASIC
.,E432 38       SEC             prepare for subtract
.,E433 E5 2B    SBC $2B         subtract TXTTAB
.,E435 AA       TAX             move to (X)
.,E436 A5 38    LDA $38         and highbyte
.,E438 E5 2C    SBC $2C
.,E43A 20 CD BD JSR $BDCD       output number in (A/X)
.,E43D A9 60    LDA #$60        $e460
.,E43F A0 E4    LDY #$E4        pointer to 'BASIC BYTES FREE'
.,E441 20 1E AB JSR $AB1E       output (A/Y)
.,E444 4C 44 A6 JMP $A644       perform NEW
```

## Key Registers
- $002B-$002C - Kernal (Zero Page) - TXTTAB pointer (start of BASIC text area, low/high)
- $0037-$0038 - Kernal (Zero Page) - MEMSIZ pointer (highest BASIC address, low/high)
- $E460 - Kernal ROM - "BASIC BYTES FREE" message string pointer
- $E473 - Kernal ROM - startup message string pointer

## References
- "initcz_initialize_basic_ram" — expands on initialization that sets TXTTAB and MEMSIZ used in the bytes-free calculation
- "init_cold_start" — expands on cold start calls this routine to show the message before restarting BASIC

## Labels
- TXTTAB
- MEMSIZ
- NEW
