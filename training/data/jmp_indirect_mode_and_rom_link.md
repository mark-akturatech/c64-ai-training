# JMP (indirect) and ROM vectors (JMP ($1234))

**Summary:** JMP in indirect addressing mode (JMP ($1234), opcode $6C) fetches a 16-bit target address from the supplied address (low byte first) and jumps there; ROMs often use indirect JMPs to call vectors stored in RAM so system behavior (for example interrupt handling) can be modified by changing RAM pointers ($0090 on PET/CBM; $0314 on VIC/64/PLUS/4).

## Indirect JMP mode
JMP with parentheses uses an address operand that points to a two-byte effective address (low byte at the supplied address, high byte at the next address). The CPU reads those two bytes and transfers control to the assembled 16-bit address. This lets code defer the final target address to data stored in memory rather than encoding it directly in the instruction stream.

Relocatable code benefits from relative branches; absolute-address instructions (JMP, JSR) are fixed unless the address is indirect and read from writable memory. ROM uses this property to provide indirection points (vectors) stored in RAM so ROM behavior can be altered without modifying ROM itself.

## ROM use: vectors and system behavior
ROM code contains carefully placed indirect JMPs (vector points). Instead of jumping directly, ROM jumps through RAM pointers; updating those RAM-stored addresses changes where ROM will transfer control. The best-known examples are interrupt vectors stored in RAM and referenced indirectly from ROM, making it possible to change interrupt handlers or system entry points without modifying ROM code.

The text example shows how an instruction at a ROM location can use an indirect vector in RAM to obtain its final target at runtime, enabling system-level redirection.

## Source Code
```asm
; Example from source:
; At $033C: JMP ($1234)
; Machine code bytes: 6C 34 12  (opcode $6C, low-byte $34, high-byte $12)
; Memory at $1234/$1235: $24, $68 (low, high)
; Resulting jump target: $6824

                .org $033C
JMP_INDIRECT    .byte $6C,$34,$12    ; JMP ($1234)

; Memory contents at $1234:
                .org $1234
                .byte $24,$68        ; low=$24, high=$68 -> target $6824
```

```text
  +-------+---+----------------------------------------------------------+
  |       |   |                     MEMORY                               |
  +-------+---+----------------------------------------------------------+
           ^ |            ^
           | |            |
           | `------------'
      INDIRECT
      ADDRESS

  Figure 5.6
```

## Key Registers
- $0090 - System RAM - PET/CBM interrupt vector location commonly used by ROM via indirect JMP
- $0314 - System RAM - VIC/64/PLUS/4 interrupt vector location commonly used by ROM via indirect JMP
- $1234-$1235 - System RAM - example two-byte indirect vector (low byte at $1234, high byte at $1235)
- $033C - ROM - example instruction location containing JMP ($1234) (machine code $6C $34 $12)

## References
- "using_irq_vector_and_masking_interrupts" — expands on interrupt vectors stored in RAM and used via indirect jump

## Mnemonics
- JMP
