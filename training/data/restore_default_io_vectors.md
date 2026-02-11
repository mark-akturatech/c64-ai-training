# Restore default I/O vectors / vectored I/O copy (C64 ROM disassembly)

**Summary:** Restores or copies the 31-byte KERNAL I/O vector table at $0314-$0332 by looping 31 bytes and transferring between $0314,Y and the indirect zero-page pointer ($C3),Y; uses STX $C3 / STY $C4 to supply the zero-page pointer and branches on the Carry flag (BCS) to select read vs set behavior.

## Description
This routine copies 31 bytes of the I/O vector table either to or from a target address pointed to by the zero-page pointer at $C3/$C4, using indirect,Y addressing. Behavior is selected by the Carry flag at entry:
- Carry = 1 (set): read vectors (copy from $0314+Y into the target ([$C3]) + Y).
- Carry = 0 (clear): set vectors (copy from the target ([$C3]) + Y into $0314+Y).

Flow:
- The routine initializes a pointer (LDX/LDY) that is saved into zero page $C3/$C4 and initializes Y as index (LDY #$1F) for 31 bytes (0x1F down to 0).
- Loop reads one byte (either from $0314,Y or from ($C3),Y depending on Carry) and stores it into the other location.
- DEY and BPL loop until all bytes are transferred.
- Ends with RTS.

Caveat in original code: the straightforward copy writes into the ROM vector table (STA $0314,Y). This is normally harmless on mask-ROM-based C64s but may damage flash/EEPROM-based systems. An alternate version (included below) avoids writing into ROM by directing the extra write into RAM instead; functionally identical aside from where the copy is stored.

## Source Code
```asm
.; FD15-FD2F  Restore default I/O vectors (original listing)
.,FD15 A2 30    LDX #$30        ; pointer to vector table low byte (saved to $C3)
.,FD17 A0 FD    LDY #$FD        ; pointer to vector table high byte (saved to $C4)
.,FD19 18       CLC             ; flag: clear carry = set vectors (Carry=0 => set vectors)

                                ; set/read vectored I/O from (XY), Cb = 1 to read, Cb = 0 to set
.,FD1A 86 C3    STX $C3         ; save pointer low byte into zero page pointer $C3
.,FD1C 84 C4    STY $C4         ; save pointer high byte into zero page pointer $C4
.,FD1E A0 1F    LDY #$1F        ; set byte count (31 bytes)
.,FD20 B9 14 03 LDA $0314,Y     ; read vector byte from vectors ($0314 + Y)
.,FD23 B0 02    BCS $FD27       ; branch if Carry=1 (read vectors mode)
.,FD25 B1 C3    LDA ($C3),Y     ; otherwise read vector byte from ([$C3]) + Y (indirect,Y)
.,FD27 91 C3    STA ($C3),Y     ; save byte to ([$C3]) + Y
.,FD29 99 14 03 STA $0314,Y     ; save byte to vector table ($0314 + Y) -- writes ROM in many machines
.,FD2C 88       DEY             ; decrement index
.,FD2D 10 F1    BPL $FD20       ; loop if more to do
.,FD2F 60       RTS             ; return

; Alternate version — avoids writing to ROM by redirecting the extra write to RAM copy
; (same function but does not attempt to write $0314,Y in ROM)
;
; set/read vectored I/O from (XY), Cb = 1 to read, Cb = 0 to set
; STX $C3         ; save pointer low byte
; STY $C4         ; save pointer high byte
; LDY #$1F        ; set byte count
; LDA ($C3),Y     ; read vector byte from (XY)
; BCC $FD29       ; branch if set vectors (Carry=0 => set vectors)
;
; LDA $0314,Y     ; else read vector byte from vectors
; STA ($C3),Y     ; save byte to (XY)
; STA $0314,Y     ; save byte to vector    ; NOTE: original avoids writing ROM by writing second copy to RAM instead
; DEY             ; decrement index
; BPL $FD20       ; loop if more to do
;
; RTS
```

## Key Registers
- $0314-$0332 - KERNAL - I/O vector table (31 bytes copied by this routine)
- $C3-$C4     - Zero Page - indirect pointer used with ([$C3]),Y / STA ([$C3]),Y

## References
- "kernal_vectors_list" — expands on uses of the vector table at $0314-$0332