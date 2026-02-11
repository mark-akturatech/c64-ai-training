# Drive header/gap detection and write-sync timing loop (drive ROM)

**Summary:** Assembly sequence that finds the disk drive header/gap and synchronizes the write window using the 6502 overflow flag (V) as a timing input; uses loops with BVC/CLV/DEX/BNE and writes drive registers at $1C03, $1C0C, and $1C01.

**Description**
This routine searches the drive header/gap by counting a small number of V-flag events (used here as a hardware timing/status bit). It initializes X as a small counter, then waits for the V (overflow) flag to become set; when V is set, execution continues, CLV clears the flag, X is decremented, and BNE loops until the expected number of gap/header bytes have been skipped. After the gap-scan, it programs drive registers ($1C03, $1C0C, $1C01) and performs a second, identical loop (WRITESYNC) to align the write window.

Behavioral summary:
- `LDX #$08` — set counter to 8 header/gap bytes to skip.
- WAITGAP loop:
  - `BVC WAITGAP` — branch while V==0 (keep waiting until V is set).
  - `CLV` — clear V once the set condition is observed.
  - `DEX / BNE WAITGAP` — decrement X and repeat until X==0.
- After WAITGAP, the code loads/stores several drive control bytes:
  - `STA $1C03` — stores a value (from earlier LDA) into drive register $1C03.
  - Modify $1C0C: read, mask low 5 bits, set high bits with `ORA #$C0`, write back.
  - `STA $1C01` — write #$FF (or the value in A) to $1C01 to set drive state.
- Prepare for write synchronization:
  - `LDX #$05` and `CLV`, then WRITESYNC loop repeats the same V-flag-driven counting to position the write window before enabling writes.

(V = processor overflow flag, used here as a hardware timing/status input)

## Source Code
```asm
310  ; 

320  LDX  #$08 
330  WAITGAP  BVC  WAITGAP 
340  CLV 
350  DEX 
360  BNE  WAITGAP 
370  ; 

380  LDA  #$FF 
390  STA  $1C03 
400  LDA  $1C0C 
410  AND  #$1F 
420  ORA  #$C0 
430  STA  $1C0C 
440  LDA  #$FF 
450  LDX  #$05 
460  STA  $1C01 
470  CLV 
480  WRITESYNC  BVC  WRITESYNC 
490  CLV 
500  DEX 
510  BNE  WRITESYNC 
520  ; 
```

## Key Registers
- **$1C01**: Control register for drive operation modes.
- **$1C03**: Register related to drive data handling.
- **$1C0C**: Register controlling drive status and configuration.

## References
- "initialization_and_gcr_conversion" — expands on GCR conversion and checksum increment
- "drive_register_setup_and_write_sync" — expands on register setup and issuing write-sync once header is aligned