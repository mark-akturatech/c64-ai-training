# Increment real-time jiffy clock and sample keyboard (CIA1)

**Summary:** Increments the three-byte jiffy clock in zero page ($A2 low, $A1 mid, $A0 high), subtracts the per-day constant $4F1A01 using SEC/SBC to detect day-wrap, and samples CIA1 ports ($DC00/$DC01) to read keyboard row/column state and store the STOP-key column index at $91. Registers: $A0-$A2, $91, $DC00-$DC01, SEC/SBC/BCC flow.

## Description

This routine performs two tasks:

1) Jiffy (real-time) clock increment and day-wrap detection
- X is cleared.
- Low jiffy byte ($A2) is incremented; if it rolls over the mid ($A1) is incremented; likewise for the high byte ($A0).
- To detect a full day, the code subtracts the constant $4F1A01 (low, mid, high) from the current 3-byte jiffy value using SEC then SBC sequences:
  - SEC sets carry so SBC performs A - M - (1 - C). After the three SBCs, the carry flag indicates whether the jiffy value was >= $4F1A01 (no borrow) or < $4F1A01 (borrow).
  - BCC (branch if carry clear) is used to skip the reset when the current jiffies are less than the day's constant; otherwise, the three jiffy bytes are cleared to zero using STX (X is zero).
- Source comment notes an off-by-one bug: the routine tests against $4F1A01 rather than $4F1A00, so the reset happens one jiffy late (gives an extra jiffy/day).

2) Keyboard sample via CIA1 ($DC00/$DC01)
- The routine samples CIA1 Port B ($DC01, keyboard row lines) in a stability loop: it reads $DC01 into A, then compares it to a fresh read of $DC01 and repeats until two consecutive reads match.
- The stable sample is transferred to X (TAX).
- If the sample has the sign bit set (BMI taken), it branches toward storing A into $91 (stop-key column) and returns.
- If not, it sets X to #$BD and writes that pattern to CIA1 Port A ($DC00) to drive keyboard columns, then re-samples $DC01 in a stability loop (LDX/CPX with repeated memory reads).
- After the stable re-sample, the routine restores $DC00 from A (STA $DC00), increments X, and conditionally returns or stores the originally sampled A into $91. The net effect is to derive and save a column index/state for the STOP key into zero page $91.
- The code uses short busy-wait/stability loops around memory-mapped CIA reads to avoid sampling transient values while the CIA register is updating.

**[Note: Source may contain an error — off-by-one reset threshold uses $4F1A01 instead of $4F1A00 (as the source comment points out).]**

## Source Code
```asm
                                *** increment the real time clock
.,F69B A2 00    LDX #$00        clear X
.,F69D E6 A2    INC $A2         increment the jiffy clock low byte
.,F69F D0 06    BNE $F6A7       if no rollover ??
.,F6A1 E6 A1    INC $A1         increment the jiffy clock mid byte
.,F6A3 D0 02    BNE $F6A7       branch if no rollover
.,F6A5 E6 A0    INC $A0         increment the jiffy clock high byte
                                now subtract a days worth of jiffies from current count
                                and remember only the Cb result
.,F6A7 38       SEC             set carry for subtract
.,F6A8 A5 A2    LDA $A2         get the jiffy clock low byte
.,F6AA E9 01    SBC #$01        subtract $4F1A01 low byte
.,F6AC A5 A1    LDA $A1         get the jiffy clock mid byte
.,F6AE E9 1A    SBC #$1A        subtract $4F1A01 mid byte
.,F6B0 A5 A0    LDA $A0         get the jiffy clock high byte
.,F6B2 E9 4F    SBC #$4F        subtract $4F1A01 high byte
.,F6B4 90 06    BCC $F6BC       if less than $4F1A01 jiffies skip the clock reset
                                else ..
.,F6B6 86 A0    STX $A0         clear the jiffy clock high byte
.,F6B8 86 A1    STX $A1         clear the jiffy clock mid byte
.,F6BA 86 A2    STX $A2         clear the jiffy clock low byte
                                this is wrong, there are $4F1A00 jiffies in a day so
                                the reset to zero should occur when the value reaches
                                $4F1A00 and not $4F1A01. this would give an extra jiffy
                                every day and a possible TI value of 24:00:00
.,F6BC AD 01 DC LDA $DC01       read VIA 1 DRB, keyboard row port
.,F6BF CD 01 DC CMP $DC01       compare it with itself
.,F6C2 D0 F8    BNE $F6BC       loop if changing
.,F6C4 AA       TAX             
.,F6C5 30 13    BMI $F6DA       
.,F6C7 A2 BD    LDX #$BD        set c6
.,F6C9 8E 00 DC STX $DC00       save VIA 1 DRA, keyboard column drive
.,F6CC AE 01 DC LDX $DC01       read VIA 1 DRB, keyboard row port
.,F6CF EC 01 DC CPX $DC01       compare it with itself
.,F6D2 D0 F8    BNE $F6CC       loop if changing
.,F6D4 8D 00 DC STA $DC00       save VIA 1 DRA, keyboard column drive
.,F6D7 E8       INX             
.,F6D8 D0 02    BNE $F6DC       
.,F6DA 85 91    STA $91         save the stop key column
.,F6DC 60       RTS             
```

## Key Registers
- $A0-$A2 - Zero page - jiffy clock bytes (A0 = high, A1 = mid, A2 = low)
- $0091 - Zero page - stored STOP-key column/index
- $DC00-$DC0F - CIA1 (6526/6520) - Port A ($DC00) used to drive keyboard columns (DRA), Port B ($DC01) used to read keyboard rows (DRB); other CIA1 registers reside in this range

## References
- "read_and_set_real_time_clock" — expands on read/set helpers for the jiffy clock bytes
- "scan_stop_key_and_handle_stop" — expands on uses the stored keyboard column value to determine STOP key presses

## Labels
- A0
- A1
- A2
- 0091
- DC00
- DC01
