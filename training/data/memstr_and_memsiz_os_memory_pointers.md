# MEMSTR ($0281-$0282) and MEMSIZ ($0283-$0284) — KERNAL memory-limit pointers

**Summary:** KERNAL two-byte pointers at $0281-$0284 (MEMSTR and MEMSIZ) store the OS start-of-user-RAM and top-of-user-RAM respectively. They are initialized by the RAMTAS routine ($FD50) on cold start and may be read/modified via MEMBOT ($FE34) and MEMTOP ($FE25); MEMSIZ is adjusted when the RS-232 device (device 2) is OPENed/CLOSEd.

## Description

- MEMSTR ($0281-$0282) — O.S. start of memory (two-byte pointer).
  - On power-on or cold RESET, KERNAL RAMTAS ($FD50) initializes MEMSTR to $0800 (decimal 2048) indicating the default start of user RAM used by the OS. BASIC copies/uses its own start-of-memory pointer at location 43 ($2B) thereafter.
  - MEMSTR may be read or set using the KERNAL routine MEMBOT ($FE34), or PEEK/POKEed directly from BASIC/assembly.

- MEMSIZ ($0283-$0284) — O.S. top-of-memory pointer (two-byte pointer).
  - On cold start, RAMTAS performs a nondestructive RAM test beginning at $0400 (1024) and stops when the test fails (first ROM location). Normally this yields $A000 (40960) as the first ROM byte, so MEMSIZ is set to point at that first ROM address (top of user RAM).
  - After BASIC is running, MEMSIZ is only altered automatically when the RS-232 channel (device number 2) is OPENed or CLOSed: opening allocates 512 bytes for RS-232 TX/RX buffers by lowering MEMSIZ (and BASIC's end pointer at 55 / $37) to create room; closing restores them.
  - MEMSIZ may be read or set via the KERNAL routine MEMTOP ($FE25).

- Pointer format and access notes:
  - Each pointer occupies two bytes (low byte first, then high byte — standard 6502 little-endian pointer).
  - BASIC typically does not consult MEMSTR/MEMSIZ after initialization, relying on its own pointers ($2B for start-of-memory, $37 for end-of-BASIC). OS/KERNAL services and device open/close adjust the KERNAL pointers as described.

## Source Code
```text
Pointer locations (decimal / hex):
  641-642   $281-$282   MEMSTR   (O.S. start of user RAM)       ; initialized to $0800 by RAMTAS ($FD50)
  643-644   $283-$284   MEMSIZ   (O.S. top-of-user RAM)         ; set by RAMTAS via nondestructive RAM test

KERNAL routines referenced:
  RAMTAS  = $FD50  (64848)  ; RAM test and initialization of MEMSTR/MEMSIZ on cold start
  MEMTOP  = $FE25  (65061)  ; read/set top-of-memory (MEMSIZ)
  MEMBOT  = $FE34  (65076)  ; read/set bottom-of-memory/start pointer (MEMSTR)

BASIC pointers mentioned:
  $002B (43)  - BASIC start-of-memory pointer (BASIC uses its own pointer after init)
  $0037 (55)  - BASIC end-of-memory pointer (adjusted when RS-232 device opened/closed)

RS-232 behavior:
  - Opening device 2 consumes 512 bytes total for TX/RX buffers; KERNAL lowers MEMSIZ and BASIC end pointer to reserve this space. Closing device restores pointers.
```

## Key Registers
- $0281-$0282 - KERNAL - MEMSTR: OS start-of-user-RAM pointer (two bytes, little-endian)
- $0283-$0284 - KERNAL - MEMSIZ: OS top-of-user-RAM pointer (two bytes, little-endian)

## References
- "RAMTAS" — RAM test and initializer; sets MEMSTR and MEMSIZ on cold start ($FD50)
- "MEMBOT" — read/set MEMSTR ($FE34)
- "MEMTOP" — read/set MEMSIZ ($FE25)
- "rs232_pseudo_6551_registers" — covers how opening RS-232 (device 2) causes MEMSIZ/BASIC end pointer adjustments to allocate 512-byte RS-232 buffers

## Labels
- MEMSTR
- MEMSIZ
- MEMTOP
- MEMBOT
- RAMTAS
