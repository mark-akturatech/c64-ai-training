# Turbo-Tape Loader (minimal)

## Summary
This is a timing-critical TurboTape loader that distinguishes short vs long tape pulses by combining CIA#2 one-shot timer thresholds with direct sampling of the tape FLAG via CIA#1. The code configures CIA#2 Timer A ($DD04/$DD05) as a threshold and uses the CIA#2 interrupt/status register ($DD0D) after restarting the one-shot ($DD0E) to decide a bit’s value; the result is shifted into the carry and assembled with a canary-shift byte technique. Memory banking is controlled via the CPU port ($01) and momentarily toggled (DEC/INC) to map RAM under $D000 for direct (zp3),Y writes. Optional compile-time flags enable border FX, XOR checksum, BASIC autostart, and user prompts.

## Key Registers
- $0001 - CPU port - controls memory banking and tape motor; initialized (sta $01 = $1D) to enable tape motor and keep ROMs, DEC/INC $01 used to temporarily bank out I/O so STA (zp3),Y can write into memory under $D000.
- $D011 - VIC-II control - ROR/ROL used to blank/unblank the screen by rotating bit 4 (screen enable) in/out of carry.
- $D020 - VIC-II border color - written for visual feedback (FX) and incremented on checksum error to flash the border.
- $DC0D - CIA #1 interrupt/flag register (CIA1) - polled with BIT (using A=$10) to sample the tape FLAG/edge line (bit 4 tested) and busy-wait for pulse arrival.
- $DD04 - CIA #2 Timer A low byte - set to $FE to define the short/long pulse threshold (low byte of Timer A).
- $DD05 - CIA #2 Timer A high byte - initialized (sty $dd05 = 0) as part of threshold setup.
- $DD0D - CIA #2 interrupt/flag register (CIA2) - read immediately after a pulse to inspect the timer result; its LSB is shifted into carry to indicate pulse length (carry=1 => short, carry=0 => long as used by this code).
- $DD0E - CIA #2 Control Register A (CRA) - written with $19 to restart Timer A as a one-shot and force a load (used to time the arriving pulse).

## Techniques
- CIA one-shot threshold discrimination: configure Timer A low/high ($DD04/$DD05) and restart it ($DD0E) on each pulse to classify pulse length by reading $DD0D.
- Edge polling with CIA#1 flag: busy-wait on the tape input/FLAG via BIT $DC0D (A = $10) to detect pulse edges precisely.
- Canary-shift byte assembly: seed a bytebuffer with a single 1 and shift in 8 bits (ROL) until the canary exits, detecting byte completion without an explicit bit counter.
- Indirect indexed stores (STA (zp3),Y): write incoming bytes directly to load destination using zero-page pointer (zp3) with Y offset.
- Bank switching trick: use DEC/INC on $01 to temporarily map RAM under I/O ($D000) so the loader can write to memory area normally hidden by I/O/ROM.
- One-shot restart preservation: use PHA/PLA to preserve the read $DD0D value across the write to $DD0E so the exact timer/status byte can be used for feedback and bit extraction.
- Bit harvesting into carry: LSR of the pulled $DD0D places the LSB into carry for immediate use by bit-assembling code.
- Pilot/countdown synchronization: detect repeated pilot byte ($02) and then a descending countdown (9..1) before reading header/data.
- Optional XOR checksum: running XOR accumulator updated per byte and compared to incoming checksum byte for validation.
- Screen blank/unblank via rotate: ROR/ROL $D011 used instead of read-modify-write to flip the raster/graphics enable bit atomically.

## Hardware
VIC-II (video), CIA #1, CIA #2, CPU port ($0001), KERNAL/BASIC ROM vectors and routines

## Source Code
```asm
// Turbo-tape Loader - Minimal Implementation
// by Enthusi (11/2010)
// Source: https://codebase.c64.org/doku.php?id=base:turbotape_loader_source
// License: CC Attribution-Noncommercial-Share Alike 4.0 International
//
// This is the absolute minimum required to load Turbo-tape data.
// Assembles to stack address $0100, launch via SYS 256.
// Uncomment #defines to enable optional features:
//   FX        - Visual border color feedback during bit reading
//   CHKSUM    - Checksum validation with error detection
//   BASICRUN  - Automatic BASIC program execution after loading
//   MESSAGES  - Display "PRESS PLAY ON TAPE" prompt
//   RESETMODE - Alternate checksum initialization
//
// How it works:
//   1. Enables tape motor and blanks screen
//   2. Configures CIA #2 Timer A ($DD04/$DD05) with threshold value $FE
//      to distinguish short pulses (bit 0) from long pulses (bit 1)
//   3. Synchronizes with tape signal by detecting pilot byte ($02)
//      followed by countdown sequence (9,8,7...1)
//   4. Reads header: Y-offset, end address low/high (3 bytes)
//   5. Loads data bytes into memory via (zp3),Y indirect indexed
//   6. Validates XOR checksum if enabled
//   7. Restores screen and optionally executes loaded BASIC program
//
// Key technique: get_bit reads CIA #2 interrupt register ($DD0D) to
// determine pulse length - bit 1 of that register indicates whether
// Timer B countdown expired before the pulse arrived. The threshold
// ($FE in $DD04) sets the boundary between short and long pulses.
// TurboTape format: short pulse ~211µs = '0', long pulse ~324µs = '1'

.word $0100

  zp1       = $c3
  zp2       = $c4
  BITCOUNT  = $02
  bytebuffer = $bd
  zp3       = $c1
  zp4       = $c2
  chkbyte   = $10

  *=$0100

#define FX 1
#define CHKSUM 1
#define BASICRUN 1
#define MESSAGES 1
#define RESETMODE 1

  sei
begin:

loader:
init:
#ifdef MESSAGES
  jsr $f817           // KERNAL: print PRESS PLAY ON TAPE message
  ldy #00             // Y is wasted by the KERNAL call
#endif
  lda #$1d
  sta $01             // Enable tape motor (bit 5=0), keep BASIC/KERNAL ROM
  ror $d011           // Blank screen (shift bit 4 into carry)
#ifdef CHKSUM
#ifndef RESETMODE
  sty chkbyte         // Init checksum to 0 (Y=0 from above)
#endif
#endif
  sty $dd05           // CIA #2 Timer A high byte = 0
  lda #$fe            // Timer threshold for TurboTape pulse discrimination
  sta $dd04           // CIA #2 Timer A low byte = $FE
  jsr sync            // Synchronize with tape pilot/countdown -> X=0
  stx zp3             // Store load address low = 0 (from sync's X=0)
  jsr get_byte        // Read Y-offset byte from tape header
  tay
initzp:
  jsr get_byte        // Read 3 header bytes: end address + high byte of load addr
  sta zp4,x           // Store at zp4, zp4+1, zp4+2 (X starts at 0)
  inx
  cpx #$03
  bne initzp
debug:
  jsr sync            // Re-sync before data block -> X=0
  //----------------------------------------
  // Main load loop
e_start:
load:
  jsr get_byte        // Read next data byte from tape
load1:
  dec $01             // Bank out I/O to write below $D000
  sta (zp3),y         // Store byte at destination via indirect indexed
#ifdef CHKSUM
  eor chkbyte         // Running XOR checksum
  sta chkbyte
#endif
  inc $01             // Restore I/O banking
  iny
  bne next
  inc zp4             // Increment high byte of destination pointer
next:
  cpy zp1             // Compare Y with end address low byte
  lda zp4
  sbc zp2             // Compare high byte with end address high byte
  bcc load            // Continue until destination >= end address
#ifdef CHKSUM
  jsr get_byte        // Read checksum byte from tape
  cmp chkbyte         // Compare with calculated checksum
  beq ok
    inc $d020         // Flash border on checksum error
    bvc *-3           // Infinite loop (visual error indicator)
#endif
ok:
  rol $d011           // Screen back on (restore bit 4)
  lda #$37            // Default memory config (BASIC + KERNAL + I/O)
  sta $01
#ifdef BASICRUN
  jsr $e453           // KERNAL: restore BASIC vectors
  jsr $a660           // BASIC: CLR - clear variables
  jsr $a68e           // BASIC: set CHRGET pointer
  jmp $a7ae           // BASIC: execute program (RUN)
#else
  jmp $080d           // Jump to loaded code directly (e.g. exomizer entry)
#endif

//--------------------------------------------------
// get_byte: Read one byte from tape
// Uses canary bit technique - initial 1 in bytebuffer gets shifted
// through all 8 positions into carry to signal byte complete
get_byte:
  lda #$01
  sta bytebuffer      // Init with canary bit at position 0
next_bit:
  jsr get_bit         // Read one bit (result in carry)
  rol bytebuffer      // Shift carry into bytebuffer, old MSB into carry
  bcc next_bit        // Loop until canary bit shifts out into carry
  lda bytebuffer      // Complete byte ready
  rts

//--------------------------------------------------
// get_bit: Read one bit from tape using CIA timer threshold
// CIA #2 Timer B ($DD0D bit 1) tells us if pulse was short or long
// relative to the threshold set in Timer A ($DD04/$DD05)
get_bit:
  lda #$10
bit_loop:
  bit $dc0d           // Test CIA #1 FLAG line (bit 4) - tape pulse arrived?
  beq bit_loop        // Busy-wait until negative edge detected
  lda $dd0d           // Read CIA #2 interrupt register (timer status)
  pha
  lda #$19            // Restart CIA #2 Timer A: one-shot + force load
  sta $dd0e           // Write to CIA #2 Control Register A
  pla
#ifdef FX
  sta $d020           // Visual feedback: border color from timer value
#endif
  lsr                 // Shift bit 0 (timer result) into carry
  rts                 // C=0: long pulse (bit 1), C=1: short pulse (bit 0)

e_end:

//--------------------------------------------------
// sync: Synchronize with TurboTape pilot and countdown sequence
// Pilot bytes are $02, followed by countdown 9,8,7,6,5,4,3,2,1
sync:
  jsr get_bit         // Read bits until we find pilot byte $02
  rol bytebuffer
  lda bytebuffer
  cmp #$02            // Is it the pilot byte?
  bne sync            // No - keep looking
  ldx #$09            // Expect countdown starting at 9
sync2:
  jsr get_byte
  cmp #$02            // Skip any remaining pilot bytes
  beq sync2
sync3:
  cpx bytebuffer      // Does countdown byte match expected value?
  bne sync            // Mismatch - restart sync from scratch
  jsr get_byte        // Read next countdown byte
  dex                 // Decrement expected value
  bne sync3           // Continue until countdown reaches 0
  rts                 // X=0 on exit (used by caller)
```

## Labels
- ZP1
- ZP2
- BITCOUNT
- BYTEBUFFER
- ZP3
- ZP4
- CHKBYTE
