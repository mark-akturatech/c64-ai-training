# Zero Page ($0000-$00FF) — Overview

**Summary:** Zero Page ($0000-$00FF) is the 6502 zero page memory region used by the C64 for fast zero-page addressing, the BASIC interpreter's workspace, and system/OS temporary storage. This chunk defines the address range and primary purpose; detailed per-offset mappings are in related chunks.

**Zero Page Purpose and Range**
The Zero Page on the Commodore 64 occupies addresses $0000 through $00FF. It is the 6502's zero-page addressing area (one-byte operand addressing), which the CPU accesses with shorter, faster instructions compared to absolute addressing. On the C64, the zero page is used primarily for:

- The BASIC interpreter's workspace and temporary variables.
- System/OS transient variables and temporary buffers used by Kernal and BASIC routines.
- CPU-optimized data accessed with zero-page addressing modes.

This chunk provides the high-level definition and purpose only. For the processor port, startup defaults, tokenization buffers, and a full per-offset mapping of zero-page use by BASIC and the OS, see the referenced expansions.

## Key Registers
- $0000-$00FF - Zero Page - 6502 zero-page workspace used by BASIC interpreter and system (fast addressing)

## References
- "zero_page_processor_port_and_defaults" — expands on processor port and startup defaults  
- "zero_page_buffers_and_tokenization" — expands on tokenization and byte buffers
