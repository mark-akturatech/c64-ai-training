# MACHINE — Open logical file 1 and send "HI" via KERNAL output switching

**Summary:** Example shows using BASIC OPEN (logical file 1) and the KERNAL calls at $FFC9, $FFD2 and $FFCC to switch output to logical file 1, emit characters (ASCII in A), and restore output. Demonstrates that machine code sends to the logical channel and does not care which device (printer, cassette, disk, or screen) file 1 refers to.

## Example
The logical file mechanism lets a program send characters to a numbered logical channel and let the OS route them to the actual device. Open the desired device from BASIC using logical file number 1, then call the KERNAL from machine code to switch the output stream to that logical file and use the character output routine to send bytes.

BASIC examples to open logical file 1 (printer/cassette/disk/screen variants shown):
- Printer: OPEN 1,4
- Cassette: OPEN 1,1,2
- Disk: OPEN 1,8,3,"0:DEMO,S,W"
- Screen: OPEN 1,3

Machine-code sequence (high level):
1. Set X = logical file number (LDX #$01).
2. JSR $FFC9 — switch the output stream to logical file 1 (KERNAL entry; switch output).
3. For each character: place ASCII byte in A (LDA #$NN) and JSR $FFD2 to output it (KERNAL character output).
4. Send RETURN (ASCII $0D) as the final character if the device expects it (printers usually require it).
5. JSR $FFCC — restore previous output stream (KERNAL restore).
6. RTS — return to BASIC; BASIC will then CLOSE 1 per the BASIC program sequence.

Note: The machine code only uses the logical file number and the KERNAL calls; it is device-agnostic.

## Source Code
```basic
100 OPEN 1,4
110 SYS 828
120 CLOSE 1
```

```asm
.A 033C  LDX #$01
.A 033E  JSR $FFC9        ; switch output to logical file 1

.A 0341  LDA #$48         ; 'H'
.A 0343  JSR $FFD2        ; output character

.A 0346  LDA #$49         ; 'I'
.A 0348  JSR $FFD2        ; output character

.A 034B  LDA #$0D         ; RETURN (carriage return)
.A 034D  JSR $FFD2        ; output character

.A 0350  JSR $FFCC        ; restore previous output
.A 0353  RTS
```

## Key Registers
- $FFC9 - KERNAL ROM - switch output to logical file (expects X = logical file number)
- $FFD2 - KERNAL ROM - output character (expects A = character byte)
- $FFCC - KERNAL ROM - restore previous output stream (no parameters)

## References
- "input_output_kernal_calls_and_output_switching" — expands on use of CHKOUT and CHROUT

## Labels
- CHKOUT
- CHROUT
