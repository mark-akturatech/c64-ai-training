# KERNAL High-level Channel I/O (OPEN, CLOSE, CHKIN, CHKOUT, CHRIN, CHROUT)

**Summary:** KERNAL high-level channel I/O routines: OPEN, CLOSE, CHKIN, CHKOUT, CHRIN, CHROUT provide a logical-file (channel) API for IEC/CBM device I/O; the high-level API supports up to 10 simultaneous logical files.

**High-level Channel I/O**

These are the KERNAL-level logical-channel (file) routines used for device and file I/O on the Commodore 8-bit machines. Each routine operates on a logical file (channel) maintained by the KERNAL. The documented routines are:

- **OPEN** — Open a logical file (creates a logical connection to a device/file). Typically used after setting file parameters (e.g., via SETLFS/SETNAM in the low-level API).
- **CLOSE** — Close a previously opened logical file (release the logical channel and associated resources).
- **CHKIN** — Set the current input channel (select which logical file is used for subsequent input operations).
- **CHKOUT** — Set the current output channel (select which logical file is used for subsequent output operations).
- **CHRIN** — Read a single character from the current input channel.
- **CHROUT** — Write a single character to the current output channel.

Notes:

- These are high-level KERNAL entry points; they sit above the low-level primitives (e.g., SETLFS, SETNAM, and device-specific low-level calls).
- The KERNAL maintains an internal table of logical files; the high-level API supports up to 10 simultaneous logical files (channels).
- For complete use, you normally combine SETLFS/SETNAM (to select device, logical file number, and filename) with OPEN, then use CHRIN/CHROUT or the low-level read/write primitives, and finally CLOSE.
- Error reporting and status are handled by the KERNAL error mechanisms.

**KERNAL Vector Entry Addresses**

Each routine is accessible via a specific address in the KERNAL ROM:

- **OPEN**: $FFC0 (65472)
- **CLOSE**: $FFC3 (65475)
- **CHKIN**: $FFC6 (65478)
- **CHKOUT**: $FFC9 (65481)
- **CHRIN**: $FFCF (65487)
- **CHROUT**: $FFD2 (65490)

These addresses correspond to the KERNAL jump table located at the end of the addressable memory. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Kernal?utm_source=openai))

**Calling Conventions**

Each routine follows specific calling conventions regarding CPU registers:

- **OPEN**:
  - **Preparatory Routines**: SETLFS, SETNAM
  - **Input**: None (parameters set by preparatory routines)
  - **Output**: A = Status code (0 if successful)
  - **Registers Affected**: A, X, Y
  - **Stack Requirements**: None

- **CLOSE**:
  - **Input**: A = Logical file number
  - **Output**: A = Status code (0 if successful)
  - **Registers Affected**: A, X, Y
  - **Stack Requirements**: None

- **CHKIN**:
  - **Input**: X = Logical file number
  - **Output**: A = Status code (0 if successful)
  - **Registers Affected**: A, X
  - **Stack Requirements**: None

- **CHKOUT**:
  - **Input**: X = Logical file number
  - **Output**: A = Status code (0 if successful)
  - **Registers Affected**: A, X
  - **Stack Requirements**: 4+

- **CHRIN**:
  - **Input**: None
  - **Output**: A = Character read
  - **Registers Affected**: A, X, Y
  - **Stack Requirements**: None

- **CHROUT**:
  - **Input**: A = Character to output
  - **Output**: None
  - **Registers Affected**: A
  - **Stack Requirements**: 8+

([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_5/page_272.html?utm_source=openai))

**Example Assembly Calling Sequence**

The following assembly code demonstrates the use of SETLFS, SETNAM, OPEN, CHKIN, CHROUT, and CLOSE to read from a file and output its contents:


([s3.amazonaws.com](https://s3.amazonaws.com/com.c64os.resources/weblog/sd2iecdocumentation/manuals/1541-II_Users_Guide.pdf?utm_source=openai))

**Error/Status Return Values**

After a KERNAL call, the status can be checked using the **READST** routine:

- **READST**:
  - **Input**: None
  - **Output**: A = Status byte
  - **Registers Affected**: A
  - **Stack Requirements**: None

The status byte contains error codes:

- **0**: No error
- **1**: Too many files
- **2**: File open
- **3**: File not open
- **4**: File not found
- **5**: Device not present
- **6**: Not input file
- **7**: Not output file
- **8**: Missing file name
- **9**: Illegal device number

([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_5/page_272.html?utm_source=openai))

**Device-Specific Behaviors and Limitations**

- **Serial Devices**: When using serial devices, ensure that only one output channel is open at a time to prevent data from being sent to multiple devices. Use **CLRCHN** to close all channels before opening a new one. ([www1.cx16.dk](https://www1.cx16.dk/c64-kernal-routines/chrout.html?utm_source=openai))

- **Disk Drives**: When accessing disk drives, be aware of potential delays due to mechanical operations. Ensure proper error handling to manage issues like disk not present or file not found. ([s3.amazonaws.com](https://s3.amazonaws.com/com.c64os.resources/weblog/sd2iecdocumentation/manuals/1541-II_Users_Guide.pdf?utm_source=openai))

- **Printers**: When sending data to printers, ensure that the device is ready to receive data to avoid buffer overflows or data loss.

## Source Code

```assembly
; Set filename parameters
LDA #4          ; Length of filename
LDX #<FILENAME  ; Low byte of filename address
LDY #>FILENAME  ; High byte of filename address
JSR SETNAM      ; Set filename

; Set file parameters
LDA #3          ; Logical file number
LDX #8          ; Device number (8 for disk)
LDY #0          ; Secondary address
JSR SETLFS      ; Set file parameters

; Open the file
JSR OPEN
BCS ERROR       ; Branch if error (Carry set)

; Set the file as input
LDX #3          ; Logical file number
JSR CHKIN
BCS ERROR       ; Branch if error

; Read and output characters
READ_LOOP:
  JSR CHRIN     ; Read character
  BEQ DONE      ; Exit loop if end of file
  JSR CHROUT    ; Output character
  JMP READ_LOOP ; Repeat

DONE:
; Close the file
LDA #3          ; Logical file number
JSR CLOSE

; Restore default I/O channels
JSR CLRCHN

; End of program
RTS

ERROR:
; Handle error (e.g., print error message)
RTS

FILENAME:
.BYTE "TEST",0
```


## References

- "kernal_low_level_calls" — expands on low-level primitives used by high-level routines
- "assembly_examples_for_channel_io" — assembly examples showing how to use SETLFS/SETNAM/OPEN

## Labels
- OPEN
- CLOSE
- CHKIN
- CHKOUT
- CHRIN
- CHROUT
- READST
