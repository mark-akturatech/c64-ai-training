# KERNAL wrapper at $FF8A — JMP to $FD15 (restore default I/O vectors)

**Summary:** KERNAL ROM entry at $FF8A contains an absolute JMP (opcode $4C) to $FD15, invoking the routine that restores default I/O vectors used by KERNAL, BASIC, and interrupt handlers. Searchable terms: $FF8A, $FD15, JMP, $4C, KERNAL, I/O vectors.

**Description**
This ROM slot ($FF8A) is a convenience KERNAL wrapper that performs an unconditional absolute jump to the actual implementation at $FD15. The entry exists so programs can call the documented KERNAL entry point at $FF8A to restore the system's default I/O vectors (device/file vectors and interrupt vectors) without needing to know the internal location of the implementation.

- Machine instruction: absolute JMP (opcode $4C) — control does not return (JMP, not JSR).
- Purpose: restore the default values of system vectors used by KERNAL, BASIC, and interrupt handling.
- Location: ROM vector/entry in the KERNAL page (address $FF8A). The implementation resides at $FD15.

## Source Code
```asm
; *** restore default I/O vectors
; KERNAL wrapper at $FF8A that jumps to the implementation at $FD15
.,FF8A  4C 15 FD    JMP $FD15    ; restore default I/O vectors

; Implementation of restore_default_io_vectors at $FD15
.,FD15  A2 20       LDX #$20     ; Load X with the number of bytes to copy (32 bytes)
.,FD17  BD 30 FD    LDA $FD30,X  ; Load byte from ROM table at $FD30 + X
.,FD1A  9D 14 03    STA $0314,X  ; Store byte to RAM vector table at $0314 + X
.,FD1D  CA          DEX          ; Decrement X
.,FD1E  D0 F7       BNE $FD17    ; Loop until all bytes are copied
.,FD20  60          RTS          ; Return from subroutine

; ROM table containing default vector addresses at $FD30
.,FD30  4A F3       ; Vector for IOPEN at $0314
.,FD32  4D F3       ; Vector for ICLOSE at $0316
.,FD34  50 F3       ; Vector for ICHKIN at $0318
.,FD36  53 F3       ; Vector for ICHKOUT at $031A
.,FD38  56 F3       ; Vector for ICLRCH at $031C
.,FD3A  59 F3       ; Vector for IBASIN at $031E
.,FD3C  5C F3       ; Vector for IBSOUT at $0320
.,FD3E  5F F3       ; Vector for ISTOP at $0322
.,FD40  62 F3       ; Vector for IGETIN at $0324
.,FD42  65 F3       ; Vector for ICLALL at $0326
.,FD44  68 F3       ; Vector for USRCMD at $0328
.,FD46  6B F3       ; Vector for ILOAD at $032A
.,FD48  6E F3       ; Vector for ISAVE at $032C
.,FD4A  71 F3       ; Vector for IOPEN at $032E
.,FD4C  74 F3       ; Vector for ICLOSE at $0330
.,FD4E  77 F3       ; Vector for ICHKIN at $0332
```

## References
- "restore_default_io_vectors" — actual implementation at $FD15
- KERNAL API documentation: [KERNAL API | Ultimate Commodore 64 Reference](https://www.pagetable.com/c64ref/kernal/)
- Memory Map: [Memory Map | Ultimate Commodore 64 Reference](https://www.pagetable.com/c64ref/c64mem/)

## Labels
- RESTORE_DEFAULT_IO_VECTORS
