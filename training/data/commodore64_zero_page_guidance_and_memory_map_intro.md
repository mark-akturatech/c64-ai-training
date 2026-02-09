# Commodore 64 — Zero Page Guidance and Vector Locations

**Summary:** Zero-page layout guidance for the C64: available zero-page bytes ($00FC-$00FF), common work-area ranges ($0022-$002A, $004E-$0053), key low memory registers ($0000-$0001), KERNAL vector area ($0314-$0331 for OPEN/CLOSE/IO vectors), and CPU interrupt vectors (NMI/RESET/IRQ at $FFFA-$FFFF). Notes on areas BASIC uses for pointers and SYS register save locations are indicated; consult continuation for full ROM/device maps.

**Zero page usage and recommended areas**
- The C64 zero page ($0000-$00FF) contains CPU port registers, system and BASIC pointers, temporary work buffers, and areas that must be avoided by machine code that expects BASIC/KERNAL compatibility.
- Commonly available/free bytes (safe for short-lived scratch use when you control system state):
  - $00FC-$00FF — often listed as available on many conventions (4 bytes at top of zero page). Use with caution if other code or ROM extensions assume contents.
- Commonly-used but sometimes-usable work areas (historical conventions; may be clobbered by some programs):
  - $0022-$002A — small work area used by some toolkits and utilities as scratch/storage.
  - $004E-$0053 — larger small-block work area used by utilities and demos.
- Do not assume any zero-page address is universally safe — many commercially distributed programs and extensions reserve/expect specific zero-page bytes. Always check the target system's resident software.

**Important low-memory registers and structures (overview)**
- $0000/$0001 — 6510 on-chip I/O port: data-direction register ($0000) and port data ($0001). These control the C64 memory map banking lines (ROM/RAM/char ROM/IO select) and other hardware lines; do not overwrite without restoring, or the effective memory map will change.
- BASIC zero-page pointers and SYS register save slots — BASIC reserves multiple zero-page addresses for workspace and to save machine state when executing SYS and other operations (exact addresses vary by BASIC/KERNAL version). Overwriting these will break BASIC programs.
- KERNAL vector area — a block of vectors in low ROM that KERNAL routines use (OPEN/CLOSE/IO vectors are grouped near $0314-$0331). Patching KERNAL vectors is a common technique, but altering the underlying RAM/ROM contents or clobbering these pointers in RAM will affect I/O routing.
- CPU interrupt vectors — the 6502 vectors for NMI, RESET and IRQ/BRK reside at the top of memory and must not be modified unless you intend to change interrupt/vector behavior.

**Practical guidance for machine code authors**
- Preserve $0001 (CPU port) state across your routines that run in general-purpose C64 systems; save and restore it if you need to change memory banking.
- If writing code intended to be loaded into an already-running BASIC/KERNAL environment, avoid assuming the whole zero page is free — use the documented "available" bytes only after verifying resident software.
- For longer-lived patches (e.g., interrupt hooks, I/O redirection), use the proper vector locations and document your changes so other software can detect and restore them.
- When in doubt, allocate a small RAM buffer outside zero page (page 1 or high RAM) for scratch, or provide a detection/self-relocation routine.

## Source Code
```text
Reference list of addresses and short notes (for retrieval; not exhaustive)

$0000   - 6510 DDR (data direction register for CPU port)
$0001   - 6510 Port (CPU port / memory configuration bits)
$0022-$002A - Zero-page work area (commonly used scratch area)
$004E-$0053 - Zero-page work area (commonly used scratch area)
$00FC-$00FF - Top-of-zero-page suggested available bytes (4 bytes)
$0314-$0331 - KERNAL vectored entries (OPEN/CLOSE/IO vectors block; kernel ROM vectors point here)
$FFFA-$FFFB - NMI vector (CPU)
$FFFC-$FFFD - RESET vector (CPU)
$FFFE-$FFFF - IRQ/BRK vector (CPU)
```

## Key Registers
- $0000-$0001 - CPU (6510) - on-chip data-direction register and processor port (memory banking / I/O control)
- $0022-$002A - Zero Page - common work area (scratch)
- $004E-$0053 - Zero Page - common work area (scratch)
- $00FC-$00FF - Zero Page - commonly listed as available bytes on many systems
- $0314-$0331 - KERNAL ROM/RAM vectors - OPEN/CLOSE/IO vector block (KERNAL routines)
- $FFFA-$FFFF - CPU vectors - NMI/RESET/IRQ-BRK vectors

## Incomplete
- Missing: Exact addresses of BASIC zero-page pointers (BASIC pointer map not listed here).
- Missing: Precise SYS register save locations (which zero-page bytes BASIC uses to save registers).
- Missing: Full label-to-address mapping for each vector within $0314-$0331 (individual KERNAL vector names and offsets).
- Missing: Any bit-level layout for $0001 (memory configuration bits) in this chunk — consult detailed CPU/C64 documentation for bit definitions.

## References
- "commodore64_memory_map_part2" — continuation covering ROM and device areas (expanded C64 memory map)