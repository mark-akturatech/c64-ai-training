# Loader Setup — Part 1 (IRQ-based tape loader)

**Summary:** Hardware and vector setup for a C64 tape IRQ loader: disables interrupts (SEI), switches memory via $01, programs CIA#1 (Timer A latch $DC04/$DC05 and Interrupt Control Register $DC0D), clears the CIA interrupt latch, writes the IRQ vector at $FFFE/$FFFF to $0351, zeroes zero-page variables $02/$03, then jumps to Part 2.

## Description
This code fragment prepares the C64 hardware and CPU for an IRQ-driven cassette (FLAG line) loader:

- SEI (02A7) — disable maskable interrupts before changing vectors and device state.
- Memory port ($01) — LDA #$05 / STA $01 selects ROM at $A000 (bit 0) and enables I/O devices (bit 2) by writing $05 to the processor port.
- CIA#1 Interrupt Control ($DC0D) — STA $DC0D with A=#\$1F clears the interrupt mask for Timer A/B, TOD alarm, serial, and FLAG (bits 0–4). The code then reads $DC0D to clear any latched interrupt flags (the register is clear-on-read).
- CIA#1 Timer A latch ($DC04/$DC05) — Timer A latch is written low then high: $7C into $DC04 (low byte) and $04 into $DC05 (high byte), producing a 16-bit timer reload $047C.
  - **[Note: Source may contain an error — an earlier textual note mentioned $027C, but the code writes $7C/$04 (i.e., $047C).]**
- CIA#1 Interrupt Control ($DC0D) enable — LDA #$90 / STA $DC0D sets ICR with bit7=1 (set operation) and bit4=1 (FLAG). This enables only the FLAG-line interrupt (connected to the Cassette Read line); the IRQ triggers on negative edges.
  - Write semantics: in the 6526 CIA ICR, bit7 is the set/clear flag for the written bits (bit7=1 to set the mask bits specified).
- IRQ vector ($FFFE/$FFFF) — the code stores $51 at $FFFE and $03 at $FFFF to point the maskable interrupt vector to $0351 (the loader ISR).
- Zero-page initialization — $02 and $03 are zeroed (loop_break variable and shift buffer used later).
- Final control — a NOP followed by JMP $02E5 transfers execution to Loader Setup Part 2.

## Source Code
```asm
; ********************************************
; * Loader Setup-Part 1                      *
; * Description: Hardware setup instructions *
; ********************************************
02A7  78             SEI            ; Disable interrupts, since we are about to
                                    ; change the vector table at $FFFA-$FFFF, whose
                                    ; vectors point to 2 Interrupt Service Routines.

02A8  A9 05          LDA #$05       ; Select ROM at $A000       (bit 0)
02AA  85 01          STA $01        ; and switch in I/O devices (bit 2).

02AC  A9 1F          LDA #$1F       ; CIA #1 Interrupt Control Register reset:
02AE  8D 0D DC       STA $DC0D      ;  disable Timer A interrupt               (bit 0)
                                    ;  disable Timer B interrupt               (bit 1)
                                    ;  disable TOD clock alarm interrupt       (bit 2)
                                    ;  disable serial shift register interrupt (bit 3)
                                    ;  disable FLAG line interrupt             (bit 4)

02B1  AD 0D DC       LDA $DC0D      ; Clear Interrupt Latch to prevent servicing
                                    ; interrupt requests not requested by our program.
                                    ; This register is clear-on-read.

02B4  A9 7C          LDA #$7C       ; CIA #1 Timer A Latch value setup.
02B6  8D 04 DC       STA $DC04
02B9  A9 04          LDA #$04
02BB  8D 05 DC       STA $DC05      ; (Threshold=$027C clock cycles)

02BE  A9 90          LDA #$90       ; CIA #1 Interrupt Control Register setup:
02C0  8D 0D DC       STA $DC0D      ;  enable just FLAG line interrupt (bit 4) (1)

; (1) This FLAG line is connected to the Cassette Read line of the Cassette Port.
;     The interrupt triggers on negative edges.

02C3  A9 51          LDA #$51       ; Maskable Interrupt Request Vector setup:
02C5  8D FE FF       STA $FFFE      ;  make this vector point to our IRQ handler (ISR)
02C8  A9 03          LDA #$03       ;  located at $0351, so that the only active
02CA  8D FF FF       STA $FFFF      ;  Interrupt (FLAG line) will cause its execution
                                    ;  on request.

02CD  A9 00          LDA #$00       ; Initialization of:
02CF  85 02          STA $02        ;  loop_break variable (see later)
02D1  85 03          STA $03        ;  buffer where to build a byte, pulse by pulse.

02D3  EA             NOP

02D4  4C E5 02       JMP $02E5      ; Jump to Part 2
; ********************************************
; * Loader Setup-Part 1.END                  *
; ********************************************
```

## Key Registers
- $0001 - Processor port - memory configuration (written $05 to select ROM at $A000 and enable I/O)
- $0002-$0003 - Zero page - loop_break and pulse buffer (initialized to $00)
- $DC00-$DC0F - CIA#1 (6526) - Timer A latch at $DC04/$DC05; Interrupt Control Register at $DC0D (clear-on-read; write bit7=1 to set mask bits)
- $FFFE-$FFFF - System interrupt vectors - IRQ vector written low/high to point at $0351

## References
- "irq_loader_setup_part2_disassembly" — continues hardware setup (NMI vector, CIA#2 timers)
- "irq_isr" — disassembly/description of the IRQ service routine at $0351