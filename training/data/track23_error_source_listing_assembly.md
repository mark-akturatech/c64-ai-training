# Full Track 23 Error — Drive-side 6502 assembly (23M.PAL)

**Summary:** Assembly source for a drive-side destructive routine invoked from BASIC (`OPEN`/`SYS`), origin `*= *0500`, using zero page locations `*31` and `*3A` and `JSR` calls to drive ROM vectors (`*F7AF`, `*F510`). Contains BASIC wrapper lines, assembler directives (`.OPT`, `*= *0500`), 6502 mnemonics (`LDA`, `STA`, `JSR`, `LDX`, `DEX`, `TXA`, `BVC`, `CLV`), and a partially corrupted/missing tail of the listing.

**Description:**
This chunk is the human-readable assembly listing (`23M.PAL`) corresponding to the "Full Track 23 Error" destructive routine uploaded to a Commodore drive and invoked from BASIC. It includes:
- BASIC invocation lines (`OPEN` and `SYS`).
- Assembler directives and origin statement (`.OPT P,02; *= *0500`).
- Zero-page initialization and checksum handling using zero-page addresses `*31` and `*3A`.
- Calls into drive ROM routines via absolute `JSR`s (`*F7AF` and `*F510`).
- A small loop labeled `WAITGAP` that uses `BVC`, `CLV`, `DEX` to wait for a gap (drive timing/gap detection).
- Several corrupted or truncated lines near the "FIND HEADER" portion and subsequent store/bitmask operations.

The listing appears to be the commented symbolic representation of a machine-code `DATA` block plus the drive-side routine logic. The code is useful for reconstructing the uploaded machine-code or understanding the drive routine flow, but parts of the listing are damaged or missing.

## Source Code
```asm
100 REM 23M.PAL
110 REM

120 OPEN 2,8,2,"@0:23M.B,P,W"
130 REM
140 SYS40960
150 ;

160 .OPT P,02
170 ;

180 *= *0500
190 ;

200 LDA #*04
210 STA *31
220 ;

230 LDA *3A
240 TAX
250 INX
CKSUM
260 TXA
270 STA *3A
280 ;

290 JSR *F7AF
300 JSR *F510
310 ;

320 LDX #*08

330 WAITGAP  BVC WAITGAP     ; WAIT OUT GAP
340 CLV
350 DEX
360 BNE WAITGAP

370 ; INCREMENT CHECKSUM
380 LDA *3A
390 CLC
400 ADC #*01
410 STA *3A

420 ; CONVERT TO GCR
430 LDA #*FF
440 STA *1C03
450 LDA *1C0C
460 AND #*1F
470 ORA #*C0
480 STA *1C0C
```

(Note: assembly preserved as in source; several lines are corrupted or truncated.)

## References
- "track23_error_data_bytes" — Exact machine-code bytes (`DATA` statements) that correspond to this assembly source
- "job_queue_basic_handshake_and_retry" — BASIC-side code that uploads/invokes the assembly routine on the drive
