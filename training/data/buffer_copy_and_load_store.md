# C64 ROM: Receive-byte store/verify and buffer bookkeeping (.,FAC0-.,FB05)

**Summary:** Handles copying received RS-232 bytes into the receive buffer, verification and bookkeeping using zero-page pointers/flags ($00B5, $00BD, $00AC, $00AD, $009E, $00A7, $0093, $00B6). Calls serial-status update (JSR $FE1C) and read/write-pointer boundary check (JSR $FCD1), decrements a receiver-bit counter ($00A7), optionally compares received byte with buffer (CMP ($00AC),Y), and, when loading, writes two-byte records to $0100+X and updates index $009E.

## Behavior and flow
- Entry (.,FAC0): Test zero-page flag $00B5. If set, prepare value #$04 and JSR $FE1C (serial-status OR/update routine), then clear A and jump to $FB4A (exit path used by the status-update case).
- Pointer boundary check (.,FACE): If $00B5 was clear, JSR $FCD1 to check read/write pointer vs buffer end. FCD1 returns with Carry set when pointer >= end; the code BCCs to continue only if Carry clear (pointer < end). If pointer >= end the routine jumps to $FB48 (pointer-wrap/exit).
- Receiver-bit counter (.,FAD6): Load X from $00A7 and DEX. If the decremented counter becomes zero (BEQ $FB08) branch to the completion/alternate handling. Otherwise continue.
- Load/verify decision (.,FADB - .,FAF1): LDA $0093 reads a load/verify flag. If $0093 = 0 the code branches to .FAEB (see below). If non-zero (load/verify case used here), it sets Y=0 and compares the received RS232 byte in $00BD with the buffer byte addressed by the indirect pointer ($00AC),Y (CMP ($00AC),Y). If the compare differs (non-equal), it sets $00B6 = 1 to record mismatch.
- Post-compare / mismatch check (.,FAEB - .,FAED): The code reloads $00B6 and if $00B6 = 0 branches to $FB3A (skip storing). If $00B6 ≠ 0 execution continues to the loading/storing sequence below.
- Loading/storing new byte(s) (.,FAEF - .,FB05):
  - Load #$3D into X and compare with $009E (CPX $009E). If X < $009E branch to $FB33 (bounds case). If not, load X from $009E and perform two stores:
    - STA $0101,X ← store $00AD
    - STA $0100,X ← store $00AC
  - INX twice to advance X by 2 (two-byte record stored), STX $009E ← save updated index, then JMP $FB3A to continue finish/verify handling.
- Exit/jump targets:
  - $FB3A / $FB33 / $FB48 / $FB4A / $FB08 are continuation/exit locations used for wrap/complete/verify handling; this chunk ends with a JMP to $FB3A in the normal store path.

## Source Code
```asm
.,FAC0 A5 B5    LDA $B5
.,FAC2 F0 0A    BEQ $FACE
.,FAC4 A9 04    LDA #$04
.,FAC6 20 1C FE JSR $FE1C       OR into serial status byte
.,FAC9 A9 00    LDA #$00
.,FACB 4C 4A FB JMP $FB4A
.,FACE 20 D1 FC JSR $FCD1       check read/write pointer, return Cb = 1 if pointer >= end
.,FAD1 90 03    BCC $FAD6
.,FAD3 4C 48 FB JMP $FB48
.,FAD6 A6 A7    LDX $A7         get receiver input bit temporary storage
.,FAD8 CA       DEX
.,FAD9 F0 2D    BEQ $FB08
.,FADB A5 93    LDA $93         get load/verify flag
.,FADD F0 0C    BEQ $FAEB       if load go ??
.,FADF A0 00    LDY #$00        clear index
.,FAE1 A5 BD    LDA $BD         get RS232 parity byte
.,FAE3 D1 AC    CMP ($AC),Y
.,FAE5 F0 04    BEQ $FAEB
.,FAE7 A9 01    LDA #$01
.,FAE9 85 B6    STA $B6
.,FAEB A5 B6    LDA $B6
.,FAED F0 4B    BEQ $FB3A
.,FAEF A2 3D    LDX #$3D
.,FAF1 E4 9E    CPX $9E
.,FAF3 90 3E    BCC $FB33
.,FAF5 A6 9E    LDX $9E
.,FAF7 A5 AD    LDA $AD
.,FAF9 9D 01 01 STA $0101,X
.,FAFC A5 AC    LDA $AC
.,FAFE 9D 00 01 STA $0100,X
.,FB01 E8       INX
.,FB02 E8       INX
.,FB03 86 9E    STX $9E
.,FB05 4C 3A FB JMP $FB3A
```

## Key Registers
- $00B5 - Zero-page flag tested on entry (controls serial-status path)
- $00BD - Zero-page: received RS-232/parity/status byte (compared against buffer)
- $00AC - Zero-page pointer (indirect low) used with Y: CMP ($00AC),Y; also stored to $0100+X
- $00AD - Zero-page pointer (indirect high) stored to $0101+X
- $009E - Zero-page index into receive storage area (updated after stores)
- $00A7 - Zero-page receiver-bit temporary counter (LDX/DEX)
- $0093 - Zero-page load/verify flag (test to choose compare vs. store)
- $00B6 - Zero-page mismatch/status flag set when received ≠ buffer
- $0100 - RAM page used as destination for storing two-byte records ($0100+X)

## References
- "rs232_parity_and_startbit_handling" — expands on this section receiving control after parity/start-bit checks
- "verify_and_pointer_increment" — expands on the verify/pointer-increment logic jumped to after storing the byte

## Labels
- $00B5
- $00BD
- $00AC
- $00AD
- $009E
- $00A7
- $0093
- $00B6
