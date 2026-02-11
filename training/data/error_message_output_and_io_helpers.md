# KERNAL: Error/message output and I/O helper block (F72C–F7D0)

**Summary:** KERNAL routine that preserves VERCK ($0093), queries/decides on extended error/message output using indirect indexed addressing (($00B2),Y), tests status with BIT $009D, prints message fragments via CHROUT ($FFD2) and assembles parameter bytes into a buffer pointed at by $00B2; calls helper routines $F841, $F12F, $FFD2, $F7D0, $F7D7 and others.

## Description
This code sequence handles conditional printing of error messages and building of parameterized message buffers for I/O. Key behaviors and flow:

- It preserves the current VERCK value (zero page $0093) by pushing A to the stack, JSR $F841 (a helper that can set flags), then restoring A and writing it back to $0093.
  - The BCS $F769 after that JSR implies $F841 returns with the carry set to indicate an early exit/no further processing.
- It reads the first byte of a string/buffer pointed to by the indirect pointer ($00B2),Y (with Y=0) and compares that byte to constants #$05, #$01, #$03, #$04 to decide further action. If none match it loops back to re-run the preservation sequence.
  - The use of ($00B2),Y indicates $00B2/$00B3 hold a 16-bit pointer to a message or command descriptor.
- TAX is used to move the matching byte into X for later use.
- BIT $009D checks a status byte; the routine continues printing only if bit7 of $009D is set (BIT sets N from bit7; BPL skips if N=0).
- When bit7 is set the code:
  - Sets Y = #$63 and calls $F12F (likely a buffer/format preparer).
  - Then sets Y = #$05 and enters a loop reading bytes from ($00B2),Y and calling CHROUT ($FFD2) to output characters; it prints bytes at offsets $05..$14 (CPY #$15 stops after 0x10 bytes).
  - After sending that fragment it calls $E4E0 (another helper; likely finishes line or device-specific handling).
- The routine then clears carry and adjusts Y/stack before returning (DEY; RTS) when no further processing is required.
- At $F76A onward the code:
  - Stores A into $009E and calls $F7D0 (another helper whose return affects flow via BCC).
  - If not BCC, the routine saves several zero page registers ($C2,$C1,$AF,$AE) by pushing them to the stack, prepares to write into the buffer pointed to by ($00B2),Y:
    - Loads Y = #$BF, writes a space (#$20) into successive bytes of the buffer using STA ($00B2),Y with DEY/BNE to step downwards from $BF.
    - Then stores $9E, $C1, $C2, $AE, $AF sequentially into the buffer via STA ($00B2),Y with INY between stores to increment the destination pointer.
    - Saves the final Y into $009F, then clears $009E and uses $009E/$009F as counters/indexes compared against $00B7 to copy additional bytes from ($00BB),Y into the destination buffer (STA ($00B2),Y).
  - Calls $F7D7 (another helper), sets $AB = #$69, calls $F86B, and then restores the previously pushed zero-page registers from the stack (PLA/TAY/STA sequences) before returning.
- The block ends with LDX $00B2 (at $F7D0 onward) — probably preparing the pointer for the next routines.

Technical notes:
- Indirect indexed addressing (($00B2),Y) is used both to read message descriptors and to write into an output buffer.
- CHROUT ($FFD2) is invoked to output characters one at a time.
- Status tests depend on bit 7 of $009D (BIT $009D / BPL). The code prints a fixed-length fragment (16 bytes) starting at offset $05 when that flag is set.
- Several helper subroutines are called: $F841 (pre-check/preserver), $F12F (buffer/format helper), $FFD2 (CHROUT), $E4E0 (post-print helper), $F7D0/$F7D7 (buffer/serialize helpers), $F86B (device/message finalizer).
- The routine serializes specific zero-page registers ($9E/$9F as indices, $C1/$C2 and $AE/$AF as parameter bytes) into the buffer.

## Source Code
```asm
.,F72C A5 93    LDA $93
.,F72E 48       PHA
.,F72F 20 41 F8 JSR $F841
.,F732 68       PLA
.,F733 85 93    STA $93
.,F735 B0 32    BCS $F769
.,F737 A0 00    LDY #$00
.,F739 B1 B2    LDA ($B2),Y
.,F73B C9 05    CMP #$05
.,F73D F0 2A    BEQ $F769
.,F73F C9 01    CMP #$01
.,F741 F0 08    BEQ $F74B
.,F743 C9 03    CMP #$03
.,F745 F0 04    BEQ $F74B
.,F747 C9 04    CMP #$04
.,F749 D0 E1    BNE $F72C
.,F74B AA       TAX
.,F74C 24 9D    BIT $9D
.,F74E 10 17    BPL $F767
.,F750 A0 63    LDY #$63
.,F752 20 2F F1 JSR $F12F
.,F755 A0 05    LDY #$05
.,F757 B1 B2    LDA ($B2),Y
.,F759 20 D2 FF JSR $FFD2
.,F75C C8       INY
.,F75D C0 15    CPY #$15
.,F75F D0 F6    BNE $F757
.,F761 A5 A1    LDA $A1
.,F763 20 E0 E4 JSR $E4E0
.,F766 EA       NOP
.,F767 18       CLC
.,F768 88       DEY
.,F769 60       RTS
.,F76A 85 9E    STA $9E
.,F76C 20 D0 F7 JSR $F7D0
.,F76F 90 5E    BCC $F7CF
.,F771 A5 C2    LDA $C2
.,F773 48       PHA
.,F774 A5 C1    LDA $C1
.,F776 48       PHA
.,F777 A5 AF    LDA $AF
.,F779 48       PHA
.,F77A A5 AE    LDA $AE
.,F77C 48       PHA
.,F77D A0 BF    LDY #$BF
.,F77F A9 20    LDA #$20
.,F781 91 B2    STA ($B2),Y
.,F783 88       DEY
.,F784 D0 FB    BNE $F781
.,F786 A5 9E    LDA $9E
.,F788 91 B2    STA ($B2),Y
.,F78A C8       INY
.,F78B A5 C1    LDA $C1
.,F78D 91 B2    STA ($B2),Y
.,F78F C8       INY
.,F790 A5 C2    LDA $C2
.,F792 91 B2    STA ($B2),Y
.,F794 C8       INY
.,F795 A5 AE    LDA $AE
.,F797 91 B2    STA ($B2),Y
.,F799 C8       INY
.,F79A A5 AF    LDA $AF
.,F79C 91 B2    STA ($B2),Y
.,F79E C8       INY
.,F79F 84 9F    STY $9F
.,F7A1 A0 00    LDY #$00
.,F7A3 84 9E    STY $9E
.,F7A5 A4 9E    LDY $9E
.,F7A7 C4 B7    CPY $B7
.,F7A9 F0 0C    BEQ $F7B7
.,F7AB B1 BB    LDA ($BB),Y
.,F7AD A4 9F    LDY $9F
.,F7AF 91 B2    STA ($B2),Y
.,F7B1 E6 9E    INC $9E
.,F7B3 E6 9F    INC $9F
.,F7B5 D0 EE    BNE $F7A5
.,F7B7 20 D7 F7 JSR $F7D7
.,F7BA A9 69    LDA #$69
.,F7BC 85 AB    STA $AB
.,F7BE 20 6B F8 JSR $F86B
.,F7C1 A8       TAY
.,F7C2 68       PLA
.,F7C3 85 AE    STA $AE
.,F7C5 68       PLA
.,F7C6 85 AF    STA $AF
.,F7C8 68       PLA
.,F7C9 85 C1    STA $C1
.,F7CB 68       PLA
.,F7CC 85 C2    STA $C2
.,F7CE 98       TYA
.,F7CF 60       RTS
.,F7D0 A6 B2    LDX $B2
```

## Key Registers
- $0093 - Zero page - VERCK (error code/VERCK preserved/restored)
- $009D - Zero page - Status byte (tested with BIT $009D; bit 7 controls extended print path)
- $00B2-$00B3 - Zero page pointer - Indirect pointer used as message/IO buffer base (( $00B2 ),Y used for read/write)
- $00BB-$00BC - Zero page pointer - Source pointer used in the copy loop (LDA ($BB),Y)
- $00A1 - Zero page - read and passed to JSR $E4E0 (usage: message/device parameter)
- $00AF - Zero page - parameter byte saved/restored and serialized into buffer
- $00AE - Zero page - parameter byte saved/restored and serialized into buffer
- $00C1 - Zero page - parameter byte saved/restored and serialized into buffer
- $00C2 - Zero page - parameter byte saved/restored and serialized into buffer
- $009E - Zero page - temporary index/counter used during buffer assembly
- $009F - Zero page - temporary index (saved Y) used during buffer assembly
- $00B7 - Zero page - length/limit compared against during copy loop
- $00AB - Zero page - set to #$69 before calling $F86B (device/message finalizer)

## References
- "output_kernal_error_messages" — expands continuation and helper code for error printing
- "send_sa" — related branches calling send_sa and serial helpers

## Labels
- VERCK
