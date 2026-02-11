# SYNO ($0096)

**Summary:** SYNO at $0096 (decimal 150) is a KERNAL/zero-page system variable used in cassette/tape I/O; it holds the cassette block synchronization number for tracking block synchronization during tape operations.

## Description
SYNO is a single-byte system variable located at address $0096 (decimal 150). Its purpose is to store the cassette block synchronization number used by tape I/O routines to track synchronization between blocks on the tape. It is referenced by cassette read/write and verification routines (see related LOAD/VERIFY handling).

## Key Registers
- $0096 - KERNAL variable (zero page) - Cassette Block Synchronization Number (SYNO)

## References
- "svxt_tape_read_timing_constant_0x92" — expands on tape timing constant related to tape block reads  
- "verck_load_verify_flag_0x93" — covers LOAD/VERIFY operations that use cassette synchronization

## Labels
- SYNO
