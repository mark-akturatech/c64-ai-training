# MACHINE — Ampersand wedge installer via $0308 vector

**Summary:** Installs a BASIC "wedge" by patching the vector at $0308/$0309 to point to $033C, saving the original vector into $03A0/$03A1; installer code resides at $035E-$0374 and is invoked with SYS 862. Searchable terms: $0308, $0309, $03A0, $03A1, $033C, $035E, SYS 862, RTS, ampersand (&) wedge.

## Description
This chunk is the installer that links an ampersand (&) wedge into BASIC by replacing the two-byte vector at $0308/$0309 with the address $033C (the wedge entrypoint). The original two-byte vector is preserved at $03A0/$03A1 so it can be restored or chained.

Behavioral summary from source:
- When installed (SYS 862), BASIC will treat the ampersand (&) as a special command prefix; the interpreter will look behind '&' for the new BASIC command.
- The earlier described code (not included here) prints an asterisk ($2A) ten times followed by a RETURN ($0D), then returns control to the normal BASIC interpreter so the '&' command is recognized.
- The assembly below (at $035E) performs:
  - Read the two bytes at $0308/$0309 (the current vector).
  - Store them into $03A0/$03A1 (save old vector).
  - Store the new vector low/high ($3C/$03) into $0308/$0309 (pointing to $033C).
  - Return with RTS.

Invoke with: SYS 862 (862 decimal = $035E), which transfers execution to the installer code at $035E.

## Source Code
```asm
.A 035E  LDA $0308
.A 0361  STA $03A0
.A 0364  LDA $0309
.A 0367  STA $03A1
.A 036A  LDA #$3C
.A 036C  STA $0308
.A 036F  LDA #$03
.A 0371  STA $0309
.A 0374  RTS
```

## Key Registers
- $0308-$0309 - RAM - vector patched to point to wedge handler ($033C)
- $03A0-$03A1 - RAM - saved original vector from $0308/$0309
- $033C - RAM - wedge handler entry address (target of new vector)
- $035E-$0374 - RAM - installer code (invoke via SYS 862)

## References
- "ampersand_wedge_command_implementation_part1" — expands on the intercept/handler code that processes the '&' command