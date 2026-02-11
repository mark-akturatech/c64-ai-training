# LOAD / VERIFY handling (ROM $E165–$E194)

**Summary:** Handles LOAD vs VERIFY selection (zero page $0A), calls BASIC parameter parser ($E1D4) to obtain device/filename and start address bytes ($2B/$2C), invokes KERNAL LOAD ($FFD5), then checks I/O status via $FFB7 and masks bit $10 for tape read error; prints the "OK" string (pointer set to $A364) when appropriate.

**Operation**
This ROM fragment implements the shared tail of the LOAD and VERIFY flow used by BASIC:

- **Verify entry:** The code sets a verify flag (`LDA #$01`) before falling into the shared routine. The instruction at $E167 is `BIT $00A9`, which is a no-operation (NOP) due to the BIT instruction's behavior with immediate operands. This effectively skips the next instruction, aligning the code flow for the VERIFY operation.
- **Load entry:** Clears the verify flag (`LDA #$00`) and stores it at zero page $0A to indicate LOAD.
- **Shared parameter parsing:** `JSR $E1D4` — calls the BASIC routine that parses LOAD/SAVE parameters (device, filename, addresses). After return, the start address for the transfer is read from zero page $2B (low) and $2C (high).
- **KERNAL transfer:** `JSR $FFD5` — performs the actual device transfer (KERNAL load routine). On carry set (`BCS`), execution branches to BASIC I/O error handling at $E1D1.
- **Post-transfer decision:**
  - If $0A == 0 (LOAD), branch to load end at $E195 (skip VERIFY-specific checks).
  - If VERIFY path ($0A != 0), the code sets `X = #$1C` and calls $FFB7. The code then ANDs A with #$10 and branches to $E19E if the masked result is non-zero.
- **OK printing:** If the I/O status indicates success and the interpreter is not running inside a program (checked by comparing zero page $7A with #$02), the code builds a pointer (`A=#$64`, `Y=#$A3` → address $A364) and jumps to $AB1E to print a null-terminated string (the "OK" message). Finally, `RTS`.

**Note:** The inline comment at $E185 ("branch if no read error") conflicts with the code: `AND #$10` followed by `BNE` will branch when bit $10 is set (result non-zero). This suggests a read error is present when branching occurs.

## Source Code
```asm
                                *** perform VERIFY
.,E165 A9 01    LDA #$01        ; flag verify
.,E167 2C A9 00 BIT $00A9       ; NOP (skips next instruction)
                                *** perform LOAD
.,E16A A9 00    LDA #$00        ; flag load
.,E16C 85 0A    STA $0A         ; set load/verify flag
.,E16E 20 D4 E1 JSR $E1D4       ; get parameters for LOAD/SAVE
.,E171 A5 0A    LDA $0A         ; get load/verify flag
.,E173 A6 2B    LDX $2B         ; get start of memory low byte
.,E175 A4 2C    LDY $2C         ; get start of memory high byte
.,E177 20 D5 FF JSR $FFD5       ; load RAM from a device
.,E17A B0 57    BCS $E1D1       ; if error, go handle BASIC I/O error
.,E17C A5 0A    LDA $0A         ; get load/verify flag
.,E17E F0 17    BEQ $E197       ; branch if load
.,E180 A2 1C    LDX #$1C        ; error $1C, verify error
.,E182 20 B7 FF JSR $FFB7       ; read I/O status word
.,E185 29 10    AND #$10        ; mask for tape read error
.,E187 D0 17    BNE $E1A0       ; branch if read error
.,E189 A5 7A    LDA $7A         ; get the BASIC execute pointer low byte
.,E18B C9 02    CMP #$02        
.,E18D F0 07    BEQ $E196       ; if inside program, skip "OK" prompt
.,E18F A9 64    LDA #$64        ; set "OK" pointer low byte
.,E191 A0 A3    LDY #$A3        ; set "OK" pointer high byte
.,E193 4C 1E AB JMP $AB1E       ; print null-terminated string
.,E196 60       RTS             
```

## Key Registers
- **$000A** - Zero Page - load/verify flag (STA $0A stores 0=LOAD, 1=VERIFY)
- **$002B-$002C** - Zero Page - start address low/high for transfer (set by parameter parser)
- **$007A** - Zero Page - BASIC execute pointer low byte (checked against #$02)
- **$E1D4** - BASIC ROM - parameter parser for LOAD/SAVE (device, filename, addresses)
- **$FFD5** - KERNAL - LOAD routine (reads data into RAM from device)
- **$FFB7** - KERNAL - read I/O status word (status returned in A; masked with #$10 in this code)

## References
- "get_params_for_load_save" — parameter parsing routine for LOAD/SAVE (device, filename, start/end addresses)
- "ready_return_and_warm_start" — LOAD may flow into READY/return or error handling paths that rebuild BASIC state