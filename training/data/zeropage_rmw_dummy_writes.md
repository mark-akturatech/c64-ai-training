# NMOS 6510 — Read‑Modify‑Write (R‑M‑W) instruction timing (absolute,X / absolute,Y examples)

**Summary:** R‑M‑W instruction timing for NMOS 6510, detailing per‑cycle sequences for various addressing modes, including zero page, absolute,X, and absolute,Y. This includes opcode fetch, address byte fetches, dummy fetches, reading old data, dummy writes of old data, and final writes of new data. Searchable terms: R‑M‑W, dummy write, dummy fetch, absolute,X, absolute,Y, zero page, NMOS 6510.

**R‑M‑W timing behaviour (concise)**

R‑M‑W instructions perform an opcode fetch, fetch the address bytes, then execute a sequence at the effective address that includes: a dummy fetch (which may occur before the high byte is corrected for page crossing), reading the old data, performing a dummy write of the unmodified old data (the CPU writes the original value back), and finally writing the modified/new data. The dummy fetch and dummy write timing depend on the addressing mode and whether an index causes a page crossing; on NMOS 6510, the dummy fetch for abs,X occurs before the high byte is corrected.

## Source Code

```text
Zero Page (R‑M‑W)

ASL zp
DEC zp
INC zp
LSR zp
ROL zp
ROR zp
DCP zp
ISC zp
RLA zp
RRA zp
SLO zp
SRE zp

Cycle  Addr (PC or EA)  Operation
1      PC               Opcode fetch                         R
2      PC+1             Zero Page address                    R
3      EA               Old Data                             R
4      EA               Old Data                             W
5      EA               New Data                             W

(*1) Unmodified original data is written back to memory
```

```text
Absolute Y Indexed (R‑M‑W)

DCP abs, y
ISC abs, y
RRA abs, y
RLA abs, y
SLO abs, y

Cycle  Addr (PC or EA)  Operation
1      PC               Opcode fetch                         R
2      PC+1             Absolute address low                 R
3      PC+2             Absolute address high                R
4      <AAH, AAL + Y>   Dummy fetch from target address
                        before high byte was corrected       R
5      AA + Y           Old Data                             R
6      AA + Y           Old Data                             W
7      AA + Y           New Data                             W

(*1) Dummy fetch from target address before the high byte was incremented
(*2) Unmodified data is written back to the target address
```

```text
Absolute X Indexed (R‑M‑W)

ASL abs, x
DEC abs, x
INC abs, x
LSR abs, x
ROL abs, x
ROR abs, x
DCP abs, x
ISC abs, x
RRA abs, x
RLA abs, x
SLO abs, x
SRE abs, x

Cycle  Addr (PC or EA)  Operation
1      PC               Opcode fetch                         R
2      PC+1             Absolute address low                 R
3      PC+2             Absolute address high                R
4      <AAH, AAL + X>   Dummy fetch from target address
                        before high byte was corrected       R
5      AA + X           Old Data                             R
6      AA + X           Old Data                             W
7      AA + X           New Data                             W

(*1) Dummy fetch from target address before the high byte was incremented
(*2) Unmodified data is written back to the target address
```

## References

- "read_modify_write_dummy_write_behavior" — expands on general R‑M‑W behaviour and dummy‑write consequences (cross‑chunk reference).

## Mnemonics
- ASL
- DEC
- INC
- LSR
- ROL
- ROR
- DCP
- ISC
- RLA
- RRA
- SLO
- SRE
