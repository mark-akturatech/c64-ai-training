# NMOS 6510: SHX/SHY sync tricks (use of &{H+1} masking and RDY dropoff)

**Summary:** Shows how SHX/SHY (& opcode family, SHY = $9C) behavior with &{H+1} masking and RDY-induced CPU pauses can be used to create a stable horizontal-cycle synchronization point for raster effects; includes opcode details, instabilities (RDY drop on 4th cycle, page-cross behavior), examples and replacement-equivalent instruction sequences.

## Raster-beam sync technique (using &{H+1} masking and RDY)
When an SHX/SHY instruction is executed while the CPU observes a change in the high-byte+1 mask (&{H+1}), the value written to memory will be the source register masked by that (&{H+1}). If that mask is present the stored value can be small (example below: $01); if the mask is absent the full register value is written (example: $B5). By detecting which value was written you can determine the exact horizontal cycle where the mask dropped or where an RDY-induced CPU pause occurred.

Practically: arrange a tight SHX/SHY write loop that writes a value dependent on (&{H+1}) into e.g. $A0. If the badline / RDY pause forces the CPU to drop off on the 4th SHX cycle, the different write result identifies that cycle — giving a known alignment and therefore a deterministic position for the loop’s end. This removes cycle variance caused by conditional RDY/CHIP behavior and yields a stable synchronization point for raster effects.

## SHY (opcode $9C) — behavior and instabilities
- Opcode: $9C
- Mnemonic: SHY abs,X
- Size: 3 bytes
- Cycles: 5
- Operation (functional): {addr} = Y & {H+1} — AND Y register with the high byte of the target address + 1, then store result to memory.
- Instabilities / important implementation details:
  - The value written is ANDed with &{H+1}, except when the RDY line goes low during the 4th cycle (RDY-induced dropoff). In that case the masking does not occur and the full Y value may be written.
  - If adding X to the target address causes a page boundary crossing, the high byte of the target address is incremented (as with normal addressing) and that incremented high byte is then used for the AND with Y.
  - The instruction may therefore behave like a normal STY/STX/STA in certain addresses or RDY conditions (see STY example below).
- Note: The SHY opcode itself does not use the stack (the example "equivalent" sequence uses stack operations to preserve flags/accu when emulating).

## Source Code
```asm
; Example: SHY $7700,X
; bytes: 9C 00 77
; Assembler notation:
SHY $7700,X

; Equivalent instruction sequence (emulation using stack and explicit AND):
; PHP
; PHA
; TYA
; AND #$78
; STA $7700,X
; PLA
; PLP
; ; -- This sequence preserves flags/accumulator around a normal STA with the high byte+1 mask emulated.
; Note: the SHY opcode itself would not use the stack.

; Example illustrating the sync loop behavior described:
; (Informal summary from source)
; If &{H+1} is present when executing SHX, the value stored to $A0 will be $01 (since H+1=$01 and X=$B5).
; When &{H+1} does not occur, the full value $B5 is written to $A0.
; That $A0 value is read in the next loop iteration to detect the condition and end the loop (writing $B5 sets the N flag, ending the loop).
; When a badline pauses the CPU on the 4th SHX cycle, $B5 is written to $A0; the cycle where this happens is therefore known,
; and consequently the cycle position off the loop’s end is known.

; Example: STY behavior at $FE00
; Using $FE00 as address, the high byte is $FE, high byte+1 = $FF -> ANDing with $FF is a no-op, so SHY becomes STY:
SHY $FE00,X  ; effectively equivalent to STY $FE00,X in this address case

; Test/program filenames referenced in source (not embedded code):
; CPU/asap/cpu_shx.prg
; Lorenz-2.15/shyax.prg
; CPU/shxy/shyx2.prg
; CPU/shxy/shyx3.prg
; CPU/shxy/shyx4.prg
; CPU/shxy/shyx1.prg
; CPU/shxy/shyx5.prg
```

## References
- "shx_opcode" — expands on instabilities that enable the sync trick

## Mnemonics
- SHY
- SHX
