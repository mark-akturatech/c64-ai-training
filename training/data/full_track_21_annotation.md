# Full Track 21 Error Source (annotation)

**Summary:** Annotation of a routine that traces KERNAL FORMT ($FAC7) and uses WRTNUM ($FDC3) and sync-mark writer ($FDA3) to produce a full-track-21 error; explains why a JSR to $FE00 is required to re-enable read mode and why the code exits via LDA #$01 / JMP $F969.

**Explanation**
This routine reuses (borrows from) the KERNAL FORMT entry at $FAC7. Before formatting a track, the FDC first erases it by writing sync marks (writer routine referenced at $FDA3). An RTS returned immediately from $FAC7 was observed to produce a track containing 20 error marks; therefore, the routine must trace FORMT past its entry point.

WRTNUM at $FDC3 is the KERNAL subroutine that writes a sequence of bytes (either sync or non-sync). By supplying six bytes to WRTNUM, you control the number of bytes it writes and thus can craft the desired pattern that creates the "full track 21" error condition.

After performing the writes, a JSR to $FE00 is required to re-enable read mode on the drive; without this call, the write head remains enabled and continues to erase data. The source shows the code setting the FDC error code to OK with LDA #$01 and then jumping to the KERNAL error handler at $F969 to exit.

## Source Code
```assembly
; Example code to call WRTNUM with six bytes
LDA #<data_address  ; Low byte of data address
LDX #>data_address  ; High byte of data address
LDY #6              ; Number of bytes to write
JSR $FDC3           ; Call WRTNUM

; Re-enable read mode
JSR $FE00

; Set FDC error code to OK and exit
LDA #$01
JMP $F969
```

## Key Registers
- $FAC7 - KERNAL ROM - FORMT (format track entry traced)
- $FDC3 - KERNAL ROM - WRTNUM (write sync/non-sync bytes)
- $FDA3 - KERNAL ROM - sync-mark write / erase-before-format routine
- $F969 - KERNAL ROM - error handler (target of JMP after LDA #$01)
- $FE00 - KERNAL ROM - Routine to re-enable read mode

## References
- "full_track_21_source" — expands on implementation details and ROM entry points used

## Labels
- FORMT
- WRTNUM
