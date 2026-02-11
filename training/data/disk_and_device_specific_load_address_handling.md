# KERNAL $F533-$F5A8 — Alternate device branch and device-specific load-address handling

**Summary:** Code at $F533 implements the KERNAL alternate-device path (device validation/setup) and device-specific load-address extraction/relocation using indirect indexed loads (($B2),Y), SBC/ADC arithmetic, and stores into zero-page variables ($C3/$C4, $AE/$AF, $C1/$C2). Calls post-setup routines $F5D2 and $F84A.

## Description
This KERNAL fragment is taken when the initial device test branches into the alternate device branch (entry at $F533). It performs a sequence of device validation and setup JSRs, then follows a device-specific path to obtain or compute the load address from header/buffer bytes pointed to by the zero-page pointer at $B2.

High-level behavior:
- Several device-validation/setup JSRs are executed (examples in the listing: $F7D0, $F817, $F5AF, $F7EA, $F72C). Conditional branches after those calls determine whether the routine continues or returns to the main path.
- For the device-specific load-address path, the code reads header bytes via indirect indexed addressing LDA ($B2),Y into $C3/$C4 (saved copy of the original load-address word).
- It then computes an adjusted load address into $AE/$AF using a subtract-then-add sequence:
  - Read the word at offsets +3/+4 from the same pointer and subtract the word at offsets +1/+2 to form a difference (low byte -> X, high byte -> Y).
  - Add that difference to the original word (stored in $C3/$C4) using ADC with proper carry handling, storing the result in $AE/$AF.
  - This sequence yields AE/AF equal to the word at offsets +3/+4 (i.e., AE/AF = word(ptr+3)), but does so via SBC/ADC to propagate borrows/carries correctly across the two-byte arithmetic.
- The original word read into $C3/$C4 is preserved into $C1/$C2 before post-setup calls.
- After constructing AE/AF and saving originals, the routine calls post-setup handlers JSR $F5D2 and JSR $F84A and then continues (listing ends at $F5A8).

Behavioral notes:
- Indirect indexed loads use the zero-page pointer at $B2 (LDA ($B2),Y).
- The code branches based on device-type/state tests (CPX, BEQ/BCS/BCC) before entering the load-address extraction; only certain device types follow the path that performs the two-word arithmetic.
- $C3/$C4 are used as temporary storage (saved to $C1/$C2 afterward). $AE/$AF receive the computed/relocated load address.
- Post-setup JSRs ($F5D2, $F84A) are invoked immediately after building AE/AF.

## Source Code
```asm
.,F533 4A       LSR
.,F534 B0 03    BCS $F539
.,F536 4C 13 F7 JMP $F713
.,F539 20 D0 F7 JSR $F7D0
.,F53C B0 03    BCS $F541
.,F53E 4C 13 F7 JMP $F713
.,F541 20 17 F8 JSR $F817
.,F544 B0 68    BCS $F5AE
.,F546 20 AF F5 JSR $F5AF
.,F549 A5 B7    LDA $B7
.,F54B F0 09    BEQ $F556
.,F54D 20 EA F7 JSR $F7EA
.,F550 90 0B    BCC $F55D
.,F552 F0 5A    BEQ $F5AE
.,F554 B0 DA    BCS $F530
.,F556 20 2C F7 JSR $F72C
.,F559 F0 53    BEQ $F5AE
.,F55B B0 D3    BCS $F530
.,F55D A5 90    LDA $90
.,F55F 29 10    AND #$10
.,F561 38       SEC
.,F562 D0 4A    BNE $F5AE
.,F564 E0 01    CPX #$01
.,F566 F0 11    BEQ $F579
.,F568 E0 03    CPX #$03
.,F56A D0 DD    BNE $F549
.,F56C A0 01    LDY #$01
.,F56E B1 B2    LDA ($B2),Y
.,F570 85 C3    STA $C3
.,F572 C8       INY
.,F573 B1 B2    LDA ($B2),Y
.,F575 85 C4    STA $C4
.,F577 B0 04    BCS $F57D
.,F579 A5 B9    LDA $B9
.,F57B D0 EF    BNE $F56C
.,F57D A0 03    LDY #$03
.,F57F B1 B2    LDA ($B2),Y
.,F581 A0 01    LDY #$01
.,F583 F1 B2    SBC ($B2),Y
.,F585 AA       TAX
.,F586 A0 04    LDY #$04
.,F588 B1 B2    LDA ($B2),Y
.,F58A A0 02    LDY #$02
.,F58C F1 B2    SBC ($B2),Y
.,F58E A8       TAY
.,F58F 18       CLC
.,F590 8A       TXA
.,F591 65 C3    ADC $C3
.,F593 85 AE    STA $AE
.,F595 98       TYA
.,F596 65 C4    ADC $C4
.,F598 85 AF    STA $AF
.,F59A A5 C3    LDA $C3
.,F59C 85 C1    STA $C1
.,F59E A5 C4    LDA $C4
.,F5A0 85 C2    STA $C2
.,F5A2 20 D2 F5 JSR $F5D2
.,F5A5 20 4A F8 JSR $F84A
.:F5A8 24       .BYTE $24
```

## Key Registers
- $B2 - Zero Page - Indirect pointer low byte for buffer/header (used as ($B2),Y)
- $B7 - Zero Page - device/test flag read by LDA $B7 (device-dependent)
- $B9 - Zero Page - device/test flag checked later (LDA $B9)
- $90 - Zero Page - status/flags (AND #$10 test)
- $C3-$C4 - Zero Page - temporary: low/high bytes read from header (saved original word)
- $C1-$C2 - Zero Page - preserved copy of original $C3/$C4
- $AE-$AF - Zero Page - computed/adjusted load address (result stored here)

## References
- "serial_bus_load_tape_rs232_receive_loop" — Main serial/tape receive loop, TALK/UNTALK, ACPTR receive and verify/store logic