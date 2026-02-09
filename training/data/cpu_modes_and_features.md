# ca65 CPU modes and supported instruction sets (6502, 6502X, C64DTV, 65SC02, 65C02, W65C02, 65CE02, 4510, 45GS02, HuC6280, M740, 65816)

**Summary:** Describes ca65 --cpu modes and accepted mnemonics for NMOS and CMOS 6502-family cores (6502X undocumented opcodes, C64DTV differences, 65SC02/65C02/W65C02/65CE02, 4510, 45GS02/MEGA65, HuC6280, M740, 65816). Includes lists of undocumented mnemonics (ALR, ANC, ARR, LAX, LAS, RLA, RRA, SLO, SRE, etc.), 65816 aliases and MVN/MVP argument forms.

## Overview
ca65 supports multiple CPU modes selectable with --cpu. Modes accept different official and undocumented mnemonics depending on the microcontroller variant (NMOS 6502 undocumented ops, CMOS extensions, Rockwell/WDC extensions, Hudson, Mitsubishi, 65816). This document lists which extra mnemonics are accepted per mode and notes specific syntax differences (4510 long branches and (d,S),Y notation, 65816 MVN/MVP addressing forms). Detailed opcode semantics and opcode-generation details are provided in the Source Code section (these are treated as reference payload).

## 6502X mode
6502X is an extension of standard 6502 mode that accepts several undocumented NMOS 6502 opcodes with assembler mnemonics. There are no official mnemonics for these undocumented ops; ca65 provides accepted names to assemble them. See Source Code for the full mnemonic list and brief semantic summaries.

## C64DTV (DTV) mode
C64DTV is based on the 6510 core but adds some official new instructions and omits/supports only a subset of undocumented NMOS opcodes. DTV adds BRA, SAC, and SIR opcodes (see Source Code). A reduced set of undocumented mnemonics is accepted by ca65 in this mode — see Source Code for the exact list.

## 65SC02 / 65C02 / W65C02 / 65CE02 modes
- 65SC02 mode: supports the regular 6502 instruction set plus the original CMOS instructions.
- 65C02 mode: supports CMOS instructions plus Rockwell bit-manipulation extensions (as present on some Rockwell chips).
- W65C02 mode: supports Rockwell extensions and adds WDC-specific instructions wai and stp.
- 65CE02 mode: accepts all 65CE02 instructions and Rockwell extensions.

These modes accept additional addressing modes and instructions that are not present on NMOS 6502; ca65 implements the corresponding mnemonics.

## 4510 (Commodore C65 / C64DX) mode
The 4510 core (C65/C64DX) is a modified 65CE02/4502 with support for 20-bit addressing (1 MB). ca65 supports these differences:
- LDA (d,SP),Y can also be written LDA (d,S),Y (matches 65816 notation).
- Long branches: branch instructions may use 16-bit offsets when prefixed with "L" (e.g., LBNE for a 16-bit BNE). This long-branch prefix is assembler-specific.

For more hardware details see external C65 resources (link in References).

## 45GS02 (MEGA65) mode
45GS02 extends the 4510 with 32-bit addressing and introduces a 32-bit pseudo-register Q (composed of A, X, Y, Z). ca65 accepts the 45GS02 instruction set extensions for targeting MEGA65 cores.

## HuC6280 mode
HuC6280 (Hudson) is a superset of 65C02 used on the PC Engine. ca65 accepts HuC6280-mode mnemonics and extensions.

## M740 mode
M740 (Mitsubishi) is a 6502 superset and subset of 65SC02 with additional instructions used in embedded controllers. ca65 accepts the M740 instruction set extensions supported by the assembler.

## 65816 mode
ca65 accepts official 65816 mnemonics plus several aliases:
- CPA = CMP
- DEA = DEC A
- INA = INC A
- SWA = XBA
- TAD = TCD
- TAS = TCS
- TDA = TDC
- TSA = TSC

MVN / MVP instructions accept two argument forms: either two bank bytes prefixed with # (e.g., mvn #^src, #^dst) or two 24-bit far addresses whose high bytes determine banks (e.g., mvn src, dst). See Source Code for example forms.

## Compatibility notes
- Undocumented NMOS opcodes have no official mnemonics; ca65 provides assembler names (6502X). Behavior and opcodes vary across real NMOS chips — use with caution.
- DTV mode both adds official opcodes and restricts/changes which undocumented ops are accepted.
- 4510 and 45GS02 introduce wider addressing and alternate notations; branch behavior differs when using long-branch prefix.
- See referenced chunks for command-line and smart-mode specifics (operand-size handling for 65816).

## Source Code
```asm
; 6502X undocumented mnemonics accepted by ca65 (semantic summaries)
ALR: A:=(A and #{imm})/2;
ANC: A:= A and #{imm}; Generates opcode $0B.
ANE: A:= (A or CONST) and X and #{imm};
ARR: A:=(A and #{imm})/2;
AXS: X:=A and X-#{imm};
DCP: {addr}:={addr}-1; A-{addr};
ISC: {addr}:={addr}+1; A:=A-{addr};
JAM:            ; CPU lock/jam (illegal)
LAS: A,X,S:={addr} and S;
LAX: A,X:={addr};
NOP: #{imm}; zp; zp,x; abs; abs,x
RLA: {addr}:={addr} rol; A:=A and {addr};
RRA: {addr}:={addr} ror; A:=A adc {addr};
SAX: {addr}:=A and X;
SHA: {addr}:=A and X and {addr hi +1};
SHX: {addr}:=X and {addr hi +1};
SHY: {addr}:=Y and {addr hi +1};
SLO: {addr}:={addr}*2; A:=A or {addr};
SRE: {addr}:={addr}/2; A:=A xor {addr};
TAS: {addr}:=A and X and {addr hi +1}; SP:=A and X;

; C64DTV-specific added instructions (official DTV opcodes)
bra {rel}      ; Generates opcode $12.
sac #{imm}    ; Generates opcode $32.
sir #{imm}    ; Generates opcode $42.

; C64DTV accepted undocumented instructions (subset)
ALR: A:=(A and #{imm})/2;
ANC: A:=A and #{imm}; Generates opcode $0B.
ARR: A:=(A and #{imm})/2;
AXS: X:=A and X-#{imm};
LAS: A,X,S:={addr} and S;
LAX: A,X:={addr};
NOP: #{imm}; zp; zp,x; abs; abs,x
RLA: {addr}:={addr} rol; A:=A and {addr};
RRA: {addr}:={addr} ror; A:=A adc {addr};
SHX: {addr}:=X and {addr hi +1};
SHY: {addr}:=Y and {addr hi +1};

; 65816 MVN/MVP argument forms
; bank-byte form (immediate bank numbers)
    mvn     #^src, #^dst       ; bank of src to bank of dst
    mvp     #$12, #$78         ; bank $12 to $78

; far-address form (two 24-bit addresses; high bytes supply banks)
    mvn     src, dst           ; bank of src to bank of dst (src/src+?)
    mvp     $123456, $789ABC   ; bank $12 to $78

; Miscellaneous assembler hints (from source)
; also see long_jsr_jmp_rts .SMART .A8 .A16 .I8 .I16
```

## Key Registers
- (None) — this chunk documents CPU modes and mnemonics, not hardware registers.

## References
- "detailed_command_line_options" — expands on --cpu option and supported CPU types
- "smart_mode_and_65816_specifics" — expands on smart mode and 65816 operand-size handling
- "C65_system_and_4510_info" — external resources about the Commodore C65/4510 (e.g., zimmers.net C65 archive)