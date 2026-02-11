# Monitor usage: assemble (.a), disassemble (.d), run (.g)

**Summary:** Shows standard machine-code monitor commands used on C64 cartridge monitors (Action Replay, Final Cartridge): assemble a single instruction with the .a address mnemonic, disassemble with .d, run/jump with .g; monitors auto-increment the assembly address. Mentions typical mnemonics (LDA), example address $1000, and exception S-Mon.

## Using a Monitor
The examples and behavior described apply to most cartridge monitors (Action Replay, Final Cartridge). Some monitors differ (notably S-Mon); if you only have one of those, consult its manual.

- Assemble a single instruction at a given address:
  - Command: .a <address> <assembly text>
  - Example: .a $1000 lda #$00 — assembles LDA #$00 at $1000.
- Monitor auto-increments the assembly address:
  - After assembling one instruction the monitor displays the next assembly address (e.g. .a $1002), so you can enter the next instruction without retyping the address.
- Run/jump to an address:
  - Command: .g <address>
  - Example: .g $1000 — jumps to and begins execution at $1000.
- Disassemble memory:
  - Command: .d <address>
  - Example: .d $1000 — disassembles code starting at $1000; most monitors allow paging/scrolling through the disassembly (cursor keys).
- Monitors vary in syntax and features; the above commands are common but not universal.

## Source Code
```asm
; Assemble a single instruction at $1000
.a 1000 lda #$00

; After the monitor assembles the instruction, it typically shows:
.a 1002

; Run (jump to) the program at $1000
.g 1000

; Disassemble starting at $1000
.d 1000
```

## References
- "flashing_border_example" — entering and running small monitor programs
