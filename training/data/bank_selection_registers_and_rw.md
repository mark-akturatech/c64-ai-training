# VIC-II Memory Banking and CIA-2 Bank Selection ($DD00, $DD02)

**Summary:** CIA-2 registers $DD00 and $DD02 control VIC-II memory bank selection (bank bits in $DD00 bits 0-1). Always use read-modify-write (RMW) to change $DD00 to avoid clobbering serial-bus and other CIA functions (do not use a bare STA).

## Bank selection and safety requirements
The two least-significant bits of CIA-2 Port A ($DD00) select the VIC-II memory bank. The corresponding Data Direction Register ($DD02) has those two bits set as outputs by default so the VIC bank lines are driven.

$DD00 also multiplexes serial-bus and other CIA functions. Writing a full value with STA to $DD00 can clear or change those other functions and may produce a nonfunctional system (black screen). Therefore always perform a read-modify-write sequence that clears only bits 0-1, then ORs in the desired bank pattern.

Minimal RMW sequence (assembly or BASIC) preserves all non-bank bits while changing the bank lines.

## Source Code
```asm
; 6502 assembly - safe RMW to change bank bits (bits 0-1)
    LDA $DD00
    AND #%11111100    ; clear bits 0-1
    ORA #%000000xx    ; set desired bank bits (replace xx with 00/01/10/11)
    STA $DD00
```

```basic
REM BASIC - ensure DDR bits 0-1 are outputs, then set bank
POKE 56578, PEEK(56578) OR 3         : REM $DD02 = 56578, set bits 0-1 as outputs
POKE 56576, (PEEK(56576) AND 252) OR x : REM $DD00 = 56576, x = 0..3 bank pattern
```

```text
Register map (reference)
$DD00 / 56576 - CIA-2 Port A (Data Port)
  bit 0: Bank select bit 0
  bit 1: Bank select bit 1
  bit 2-7: Serial bus / other CIA functions (do not overwrite)

$DD02 / 56578 - CIA-2 Port A Data Direction Register (DDR)
  bit 0: DDR for Port A bit 0 (bank0)  - default = output
  bit 1: DDR for Port A bit 1 (bank1)  - default = output
  bit 2-7: DDR for other Port A bits
```

## Key Registers
- $DD00 - CIA-2 - Data Port A (VIC bank select in bits 0-1; other bits control serial bus and other CIA functions)
- $DD02 - CIA-2 - Data Direction Register Port A (bits 0-1 set as outputs by default for VIC bank lines)

## References
- "vic_bank_overview" — which bits select the bank
- "basic_example_switch_bank2" — BASIC example for switching banks

## Labels
- DD00
- DD02
