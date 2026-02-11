# RS-232 bit handling / VIA-2 (CIA 2) timer setup

**Summary:** Reads CIA 2 Data Register B ($DD01) to sample the RS-232 Rx bit, saves the bit to $A7, adjusts CIA 2 Timer B ($DD06/$DD07) using stored timing words ($0299/$029A or nonstandard $0295/$0296), starts Timer B single-shot via Control Register B ($DD0F), updates the RS‑232 interrupt enable byte at $02A1 (written into CIA 2 ICR $DD0D), and then jumps to the higher-level RS232 handler at $EF59.

## Description
This chunk contains the low-level RS-232 bit clocking and reception entry used by the ROM RS-232 handler. Two closely related entry paths exist:

1. Standard path (.,FED6-.,FF04)
   - Read CIA 2 Data Register B ($DD01) and mask LSB (AND #$01) to obtain the incoming RS-232 data bit; store the bit in $A7.
   - Compute and write a new Timer B value to CIA 2 ($DD06/$DD07): read the current Timer B low byte, subtract $1C, then add the low byte from the stored timing word at $0299; store result to $DD06. Then read current Timer B high byte, ADC the high byte from $029A (propagating carry from the low-byte operation), and store result to $DD07. Effectively: new TimerB = old TimerB - $1C + timing_word($0299/$029A).
   - Start Timer B single-shot by writing #$11 to Control Register B ($DD0F).
   - Load the RAM byte $02A1 (RS-232 interrupt enable byte) and store it into the CIA 2 Interrupt Control Register ($DD0D).
   - Write #$FF to both Timer B bytes ($DD06/$DD07) (immediate writes present before branching).
   - Jump to higher-level RS-232 handler at $EF59.

2. Nonstandard-timing path (.,FF07-.,FF2D + helper .,FF2E-.,FF40)
   - Load a timing word from $0295/$0296 and write it directly to CIA 2 Timer B low/high ($DD06/$DD07).
   - Start Timer B single-shot by writing #$11 to $DD0F.
   - EOR the RAM byte $02A1 with #$12 and store the result back to $02A1 (toggle/mask update for RS-232 interrupt byte).
   - As in the standard path, write #$FF to $DD06/$DD07, then store $0298 into $A8 and RTS.
   - A small helper at $FF2E-$FF40 performs a rotate/add sequence involving $0296 and adds #$C8 to produce updated timing bytes written to $0299/$029A (used by the standard path). The helper uses X/A/Y to compute and store the adjusted timing word.

Notes:
- The code labels CIA 2 as "VIA 2" in comments; the hardware addresses used are $DD00-$DD0F (CIA 2).
- $A7 holds the last received RS-232 bit (LSB).
- Timing words: the standard path uses $0299/$029A; the alternate path uses $0295/$0296 directly. The helper at $FF2E adjusts or computes the $0299/$029A pair (via ROL/ADC/STA) — the exact input context for that helper (initial A value) depends on the caller.
- After scheduling the next bit period and starting Timer B, control transfers to $EF59 which implements the higher-level RS-232 state machine / processing.

## Source Code
```asm
.,FED6 AD 01 DD LDA $DD01       read VIA 2 DRB, RS232 port
.,FED9 29 01    AND #$01        mask 0000 000x, RS232 Rx DATA
.,FEDB 85 A7    STA $A7         save the RS232 received data bit
.,FEDD AD 06 DD LDA $DD06       get VIA 2 timer B low byte
.,FEE0 E9 1C    SBC #$1C        
.,FEE2 6D 99 02 ADC $0299       
.,FEE5 8D 06 DD STA $DD06       save VIA 2 timer B low byte
.,FEE8 AD 07 DD LDA $DD07       get VIA 2 timer B high byte
.,FEEB 6D 9A 02 ADC $029A       
.,FEEE 8D 07 DD STA $DD07       save VIA 2 timer B high byte
.,FEF1 A9 11    LDA #$11        set timer B single shot, start timer B
.,FEF3 8D 0F DD STA $DD0F       save VIA 2 CRB
.,FEF6 AD A1 02 LDA $02A1       get the RS-232 interrupt enable byte
.,FEF9 8D 0D DD STA $DD0D       save VIA 2 ICR
.,FEFC A9 FF    LDA #$FF        
.,FEFE 8D 06 DD STA $DD06       save VIA 2 timer B low byte
.,FF01 8D 07 DD STA $DD07       save VIA 2 timer B high byte
.,FF04 4C 59 EF JMP $EF59       
.,FF07 AD 95 02 LDA $0295       nonstandard bit timing low byte
.,FF0A 8D 06 DD STA $DD06       save VIA 2 timer B low byte
.,FF0D AD 96 02 LDA $0296       nonstandard bit timing high byte
.,FF10 8D 07 DD STA $DD07       save VIA 2 timer B high byte
.,FF13 A9 11    LDA #$11        set timer B single shot, start timer B
.,FF15 8D 0F DD STA $DD0F       save VIA 2 CRB
.,FF18 A9 12    LDA #$12        
.,FF1A 4D A1 02 EOR $02A1       EOR with the RS-232 interrupt enable byte
.,FF1D 8D A1 02 STA $02A1       save the RS-232 interrupt enable byte
.,FF20 A9 FF    LDA #$FF        
.,FF22 8D 06 DD STA $DD06       save VIA 2 timer B low byte
.,FF25 8D 07 DD STA $DD07       save VIA 2 timer B high byte
.,FF28 AE 98 02 LDX $0298       
.,FF2B 86 A8    STX $A8         
.,FF2D 60       RTS             

                                *** ??
.,FF2E AA       TAX             
.,FF2F AD 96 02 LDA $0296       nonstandard bit timing high byte
.,FF32 2A       ROL             
.,FF33 A8       TAY             
.,FF34 8A       TXA             
.,FF35 69 C8    ADC #$C8        
.,FF37 8D 99 02 STA $0299       
.,FF3A 98       TYA             
.,FF3B 69 00    ADC #$00        add any carry
.,FF3D 8D 9A 02 STA $029A       
.,FF40 60       RTS             
```

## Key Registers
- $DD00-$DD0F - CIA 2 (6526) - Data Register B ($DD01), Timer B low/high ($DD06/$DD07), Interrupt Control Register ($DD0D), Control Register B ($DD0F)
- $0295-$0296 - System RAM - nonstandard bit timing word (low/high) used by FF07 path
- $0298 - System RAM - timing index / temporary value (saved to $A8)
- $0299-$029A - System RAM - standard bit timing word (low/high) added to Timer B
- $02A1 - System RAM - RS-232 interrupt enable byte (written into CIA 2 ICR)
- $A7 - System RAM - stored RS-232 received data bit (LSB)
- $A8 - System RAM - temporary storage for X

## References
- "baud_rate_tables_ntsc" — expands on baud word table used to compute timer values
- "nmi_handler" — expands on NMI RS232 handling paths and callers