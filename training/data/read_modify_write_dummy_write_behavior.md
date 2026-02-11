# NMOS 6510 — Read-Modify-Write (R‑M‑W) Dummy-Write Behaviour

**Summary:** Describes NMOS 6510 R‑M‑W behaviour: R‑M‑W instructions (INC/DEC/ASL/LSR/ROL/ROR and variants) perform a read of the effective address, execute an unmodified dummy write of the original value, then write the modified value; shows I/O and ROM-under-ROM (ghostbyte) exploitation examples ($D404, $D020).

**R‑M‑W Dummy‑Write Behaviour and Examples**

R‑M‑W instructions on the NMOS 6510 (absolute and other addressing modes that access memory) perform three memory accesses to the same effective address:

1. Read the address.
2. Perform a dummy write which writes back the unmodified value that was just read.
3. Perform the final write of the modified value.

The dummy write occurs between the read and the final write and is a real write cycle on the bus — so memory‑mapped I/O and bus/tri‑state behaviour during that cycle can be observed or exploited.

Implications and examples from the source:

- **I/O One‑Cycle Apart:** A sequence that performs an explicit STA to a device register followed immediately by an R‑M‑W on the same address causes two writes one machine cycle apart:

  - Example (assembly):


  - Used by Fred Gray in a music routine to toggle the gate bit in the SID control register — the R‑M‑W produces a dummy write then the modified write, allowing effects on SID when combined with a prior STA.

- **Simple VIC Exploit (Grey Dots):** `INC $D020` can be used to create pixel artifacts (grey dots) because $D020 is the VIC border colour register and the dummy write interacts with the VIC bus timing.

- **Ghostbyte Under ROM:** When the CPU reads from ROM, it sees ROM data; when it writes to an address mapped to ROM, the write "falls through" to the RAM beneath (the underlying RAM is actually written). With an R‑M‑W instruction executed where the ROM is visible on the bus, the read will read ROM, the dummy write will write back the ROM byte (one value) into the underlying RAM, then the final write will write the modified value (a second, different value) one cycle later. This enables two writes to the same RAM byte spaced one cycle apart where neither written value necessarily equals the original RAM value.

  - **Limitations:** What you can write in the dummy cycle is limited by the ROM byte that was read (only the ROM byte’s possible values at that address); the possible second (final) values depend on that ROM value and the specific R‑M‑W instruction used. The source lists sample possibilities for a few ROM addresses and instructions.

## Source Code

    ```asm
    LDA #$40
    STA $D404
    INC $D404
    ```


```asm
; Example: toggle SID gate bit via R-M-W sequence
LDA #$40
STA $D404
INC $D404

; Example: create grey-dot artifacts by R-M-W on VIC border register
INC $D020
```

```text
; Timing diagram for absolute R-M-W instructions (e.g., INC $1234)
; Cycle | Address Bus | Data Bus | R/W | Description
; ------|-------------|----------|-----|------------------------------
; 1     | PC          | Opcode   | R   | Fetch opcode
; 2     | PC+1        | Addr Low | R   | Fetch low byte of address
; 3     | PC+2        | Addr High| R   | Fetch high byte of address
; 4     | Addr        | Old Data | R   | Read from effective address
; 5     | Addr        | Old Data | W   | Dummy write of old data
; 6     | Addr        | New Data | W   | Write modified data
```

```text
; Ghostbyte possibilities (source table — binary shown with leading % for readability)

; ROM address  | First Cycle (dummy write) | Second Cycle results per instruction
;              |                           | INC        DEC        ASL        ROL        LSR        ROR
; $B9FF = $A0  | %10100000                 | %10100001  %10011111  %01000000  %01000000  %01010000  %11010000
; $BFFF = $E0  | %11100000                 | %11100001  %11011111  %11000000  %11000000  %01110000  %11110000
; $F9FF = $D2  | %11010010                 | %11010011  %11010001  %10100100  %10100100  %01101001  %11101001
```
([zxe.io](https://zxe.io/depot/documents/technical/NMOS%206510%20Unintended%20Opcodes%20-%20No%20More%20Secrets%20v0.99%20%282024-12-24%29%28groepaz%29%28en%29%5B%21%5D.pdf?utm_source=openai))
(Note: The source uses % to mark binary. The table above is reproduced verbatim from the source.)

## Key Registers

- **$D404** - SID - Voice 1 control register (register writable/mapped SID control; R‑M‑W affects gate bit etc.)
- **$D020** - VIC-II - Border color register (R‑M‑W on this register can create pixel/grey-dot artifacts)

## References

- "ghostbyte_under_rom" — expanded techniques using R‑M‑W dummy writes to affect ROM/underlying RAM (ghostbyte)
- "start_reu_transfer_with_rmw" — using R‑M‑W dummy write to start REU transfers

## Mnemonics
- INC
- DEC
- ASL
- LSR
- ROL
- ROR
