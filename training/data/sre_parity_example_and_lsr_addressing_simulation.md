# NMOS 6510 — SRE examples: parity via repeated SRE and LSR-like addressing with SRE

**Summary:** Two SRE (undocumented NMOS 6502/6510 opcode) examples: (1) compute parity of a byte in A by storing it and executing SRE eight times then AND #$01 (A=0/Z=1 for even parity; A=1/Z=0 for odd parity); (2) simulate LSR addressing modes not provided by the official LSR using SRE abs,Y, (zp),Y, and (zp,X) (note: A and N/Z are affected by SRE's EOR side-effect).

## Compute parity of a byte
Compute parity (even/odd number of set bits) of the value in A by writing A to memory and executing SRE on that memory location eight times to fold bits into A, then mask with AND #$01 to leave the parity bit in A and the Z flag reflecting even parity.

Behavior summary (from the example):
- Store A to a temporary memory location.
- Execute SRE on that memory location eight times.
- AND #$01 leaves parity in A (A=0 and Z=1 for even parity; A=1 and Z=0 for odd parity).

(Zero is considered even parity.)

## Simulate extra LSR addressing modes using SRE
When clobbering A and the flags is acceptable, SRE can be used to emulate LSR with addressing modes that the official LSR instruction lacks (because SRE performs the memory LSR plus an EOR with A). This yields the same logical effect on memory as LSR with the specified addressing mode, with the caveat that A and N/Z will be changed by the EOR side-effect.

Notes from the example:
- 0 is shifted into the MSB of the memory operand (i.e., logical right shift).
- Use SRE with the desired addressing mode: absolute,Y; (zp),Y; (zp,X).
- A is altered (EOR with the shifted memory).
- N and Z flags reflect the EOR result, not pure LSR.

## Source Code
```asm
; Example: compute the parity of a byte
; byte is in A
    STA temp
    SRE temp
    SRE temp
    SRE temp
    SRE temp
    SRE temp
    SRE temp
    SRE temp
    AND #$01
; A=0 and flag Z=1 if even parity
; A=1 and flag Z=0 if odd parity

; Example: simulate extra addressing modes for LSR
; If you can afford clobbering A and the flags (or even use the final value), SRE turns into LSR and
; makes some addressing modes available that do not exist for regular LSR:
; 0 is shifted into the MSB
    SRE abs, y
; like LSR abs, y
    SRE (zp), y
; like LSR (zp), y
    SRE (zp, x)
; like LSR (zp, x)
; A was changed as with additional EOR
; N,Z were set as with additional EOR
```

## References
- "sre_opcode_and_addressing_modes" — Behavior and effects of SRE that make these examples possible
- "sre_8bit_one_of_eight_counter_example" — Related example of using SRE for bit-mask rotation in graphics

## Mnemonics
- SRE
- LSE
