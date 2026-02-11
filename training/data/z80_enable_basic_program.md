# TOK64 — BASIC loader to enable Z‑80 card and disable 6510 IRQs

**Summary:** BASIC loader that copies Z‑80 machine code into C64 RAM at $1000 (mapped to Z‑80 $0000), disables 6510 IRQs via CIA1 ICR ($DC0D) with POKE 56333, enables the Z‑80 card via $DE00 (POKE 56832,0), and later re‑enables the 6510 IRQs (POKE 56333,129). Contains DATA blocks with Z‑80 opcodes and a jump to $0000.

## Program overview
This tokenized BASIC listing (tok64) stores a block of Z‑80 machine code in C64 RAM at address $1000 (decimal 4096). The Z‑80 card in this setup sees that C64 $1000 page as Z‑80 address $0000 (translation noted in cross references). After copying the DATA bytes, the program disables the 6510 IRQ sources, enables the Z‑80 card, and finally restores the 6510 IRQs when the Z‑80 run is complete.

Key steps:
- Read a byte from the DATA stream as a size (first DATA value) then copy that many bytes into C64 memory starting at decimal 4096 ($1000).
- Disable 6510 IRQs by writing 127 to decimal 56333 (C64 $DC0D — CIA1 Interrupt Control Register).
- Enable the Z‑80 card by writing 0 to decimal 56832 (C64 $DE00 — expansion port control used here as card enable).
- When Z‑80 activity is complete, write 129 to decimal 56333 to re‑enable selected 6510 IRQs.

Semantics note (standard CIA ICR behavior): writing the ICR with bit7=0 clears (disables) the indicated interrupt bits; writing with bit7=1 sets (enables) the indicated interrupt bits. Here 127 (0x7F) clears IRQ bits, 129 (0x81) sets/reenables IRQ(s).

## Data layout and Z‑80 contents
- First DATA item (line 1010 in the listing) is the byte count (18).
- The DATA block beginning at BASIC line 1110 contains a short "turn on" sequence for the Z‑80 card (three bytes of 0x00 in this example — card requires an initial delay at Z‑80 $0000).
- Lines 1210–1220 contain Z‑80 task code (example: 33,02,245 equals LD HL, $F502; 52 = INC (HL) / or INC HL depending on exact opcode interpretation in the example context).
- Lines 1310–1340 contain a short self‑turnoff / I/O write sequence and finally a JMP $0000 (195,00,00 = JP $0000) so the Z‑80 jumps to address $0000 after execution.

Do not duplicate code in prose — full BASIC listing and DATA blocks are in the Source Code section.

## Source Code
```basic
10 rem this program is to be used with the z80 card
20 rem it first stores z80 data at $1000 (Z80=$0000)
30 rem then it turns off 6510 irq's and enables
40 rem the z80 card. the z80 card must be turned off
50 rem to reenable the 6510 system.
100 rem store z80 data
110 read b: rem get size of z80 code to be moved
120 for i=4096 to 4096+b-1:rem move code
130 read a:poke i,a
140 next i
200 rem run z80 code
210 poke 56333,127: rem turn of 6510 irq's
220 poke 56832,00 : rem turn on z80 card
230 poke 56333,129: rem turn on 6510 irq's when z80 done
240 end
1000 rem z80 machine language code data section
1010 data 18 : rem size of data to be passed
1100 rem z80 turn on code
1110 data 00,00,00 : rem our z80 card requires turn on time at $0000
1200 rem z80 task data here
1210 data 33,02,245: rem ld hl,nn (location on screen)
1220 data 52 : rem inc hl (increment that location)
1300 rem z80 self-turn off data here
1310 data 62,01 : rem ld a,n
1320 data 50,00,206 : rem ld (nn),a :i/o location
1330 data 00,00,00  : rem nop, nop, nop
1340 data 195,00,00 : rem jmp $0000
```

## Key Registers
- $DC00-$DC0F - CIA1 - system I/O and interrupts (Interrupt Control Register at $DC0D used by this program: POKE 56333,... to clear/set IRQs)
- $DE00 - Expansion port I/O - Z‑80 card enable/control (used here with POKE 56832,0 to enable card)
- $1000 - RAM page (C64) - target address where Z‑80 code is stored (C64 $1000 maps to Z‑80 $0000 per translation)

## References
- "expansion_port_signal_descriptions" — Relies on bus control and DMA/IRQ behavior of the expansion bus  
- "z80_memory_address_translation" — The program stores Z‑80 code at C64 address $1000 which maps to Z‑80 $0000 per the translation table