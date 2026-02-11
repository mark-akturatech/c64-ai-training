# RS232 Rx NMI handler and bit-processing loop (C64 ROM)

**Summary:** NMI handler for RS-232 receive on C64 ROM: checks start-bit flag ($A9), decrements receiver bit count ($A8), assembles incoming bits into shift registers ($A7 -> $AA), updates receiver parity ($AB), programs VIA2 ICR ($DD0D), and updates the RS-232 interrupt-enable byte ($02A1). Also disables Timer B while awaiting the next bit.

**Description**
This ROM chunk implements the NMI-driven receive-bit processing for the RS-232 routine:

- **Entry:** Load the "start bit check" flag from $A9 (`LDX $A9`). If the start-bit-check indicates no start bit (`BNE $EF90`), the handler branches to the no-start-bit path at $EF90.
- **Bit counting:** `DEC $A8` decrements the receiver bit count; if it reaches zero (`BEQ $EF97`), the code will add the completed byte to the Rx buffer at $EF97.
- **Bit assembly path:**
  - Load the current received-bit latch from $A7 (`LDA $A7`).
  - Update parity by EOR with $AB and store back into $AB (`LDA/EOR/STA` sequence).
  - Shift $A7 right (`LSR $A7`) so its bit moves into carry, then `ROR $AA` to rotate carry into the assembled-byte shift register ($AA). This accumulates received bits (`LSR` then `ROR`).
- **Alternate branch (`BMI $EF70`):** An alternate handling path checks the bit value (`LDA $A7 / BEQ $EFDB`), and if nonzero reads a pseudo-6551 control byte at $0293, shifts that byte (`ASL`) to put a stop-bit flag into carry, and adjusts $A8 with `ADC` after loading `#$01` — this path is used for stop-bit handling/flagging.
- **After processing a bit (setup for next bit):**
  - Re-enable FLAG interrupts by loading `#$90` into A and writing it to VIA2 ICR ($DD0D).
  - OR A with the RS-232 interrupt-enable byte at $02A1 and store it back ($02A1). This programs interrupts for the next RS-232 event.
  - Store A into $A9 to set the start-bit-check flag (set to indicate no start-bit received).
  - Load `#$02` into A to disable Timer B interrupt (`LDA #$02`).
  - Jump to $EF3B to commit VIA2 ICR and return to the main handler path.
- **Parity register:** $AB is used as the running parity accumulator for the incoming byte.

**Control-flow notes:**
- Several branches jump to nearby labels ($EF3B, $EF90, $EF97, $EFDB) which are part of the surrounding RS-232 receive implementation; this chunk focuses on per-bit assembly and reprogramming VIA2 for the next bit.
- The code manipulates VIA2 ICR and an in-memory RS-232 interrupt mask byte ($02A1) to control the next interrupt source (FLAG vs. Timer B).

## Source Code
```asm
                                *** RS232 Rx NMI
.,EF59 A6 A9    LDX $A9         ; get start bit check flag
.,EF5B D0 33    BNE $EF90       ; if no start bit received, go to no-start-bit handler
.,EF5D C6 A8    DEC $A8         ; decrement receiver bit count
.,EF5F F0 36    BEQ $EF97       ; if the byte is complete, go add it to the buffer
.,EF61 30 0D    BMI $EF70       ; if negative, handle stop bit
.,EF63 A5 A7    LDA $A7         ; get the RS232 received data bit
.,EF65 45 AB    EOR $AB         ; EOR with the receiver parity bit
.,EF67 85 AB    STA $AB         ; save the receiver parity bit
.,EF69 46 A7    LSR $A7         ; shift the RS232 received data bit
.,EF6B 66 AA    ROR $AA         ; rotate into the assembled-byte shift register
.,EF6D 60       RTS             ; return
.,EF6E C6 A8    DEC $A8         ; decrement receiver bit count
.,EF70 A5 A7    LDA $A7         ; get the RS232 received data bit
.,EF72 F0 67    BEQ $EFDB       ; if zero, handle stop bit
.,EF74 AD 93 02 LDA $0293       ; get pseudo 6551 control register
.,EF77 0A       ASL             ; shift the stop bit flag to carry
.,EF78 A9 01    LDA #$01        ; load 1
.,EF7A 65 A8    ADC $A8         ; add receiver bit count
.,EF7C D0 EF    BNE $EF6D       ; branch always to return

                                *** setup to receive an RS232 bit
.,EF7E A9 90    LDA #$90        ; enable FLAG interrupt
.,EF80 8D 0D DD STA $DD0D       ; save VIA 2 ICR
.,EF83 0D A1 02 ORA $02A1       ; OR with the RS-232 interrupt enable byte
.,EF86 8D A1 02 STA $02A1       ; save the RS-232 interrupt enable byte
.,EF89 85 A9    STA $A9         ; set start bit check flag, set no start bit received
.,EF8B A9 02    LDA #$02        ; disable timer B interrupt
.,EF8D 4C 3B EF JMP $EF3B       ; set VIA 2 ICR from A and return
```

## Key Registers
- **$A7** - RAM - RS-232 received-bit latch (shifted by LSR, source of new bit)
- **$AA** - RAM - RS-232 assembled-byte shift register (accumulates bits via ROR)
- **$A8** - RAM - Receiver bit count (decremented each received bit)
- **$A9** - RAM - Start-bit-check flag (set/cleared to indicate start-bit state)
- **$AB** - RAM - Receiver parity accumulator (EOR'd with incoming bits)
- **$0293** - RAM - Pseudo 6551 control register (used for stop-bit flag testing)
- **$02A1** - RAM - RS-232 interrupt-enable byte (ORed and written to enable interrupts)
- **$DD00-$DD0F** - VIA 2 - VIA2 register block (includes $DD0D: ICR, used here to set FLAG interrupt)

## References
- **$EF3B** - Set VIA 2 ICR from A and return
- **$EF90** - No RS-232 start bit received handler
- **$EF97** - Received a whole byte, add it to the buffer
- **$EFDB** - Handle stop bit

## Labels
- A7
- AA
- A8
- A9
- AB
- 0293
- 02A1
- DD0D
