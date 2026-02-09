# Checksum / Sector Pointer Comments and INC $0628

**Summary:** Comment block and single assembly operation showing handling points for CHECKSUM, SECTOR, TRACK, IDL/IDH, GAP, and the increment of the sector/tail pointer via INC $0628; related to header_creation_routine and tail_gap_and_sector_variables.

**Description**

This fragment is a commented assembly code snippet that outlines where the routine processes various disk-format fields: CHECKSUM, SECTOR, TRACK, IDL, IDH, and GAP. It includes markers for computing and incrementing the checksum, though the actual instructions for these operations are not present in this fragment. The only active instruction is `INC $0628`, which increments the value at memory location $0628, serving as the sector/tail pointer.

- **Commented Fields:** The comments list the fields in the order they are processed or referenced: CHECKSUM, SECTOR, TRACK, IDL, IDH, GAP.
- **Checksum Operations:** The comments indicate two operations: "COMPUTE CHECKSUM" and "INCREMENT CHECKSUM." These are placeholders for the actual checksum computation and incrementation code, which are not included in this fragment.
- **Sector/Tail Pointer:** The instruction `INC $0628` increments the byte at memory location $0628. This location is used as a sector/tail pointer, initialized elsewhere in the code, and is crucial for advancing sector processing.

This fragment serves as a documentation and control snippet rather than a complete implementation. The full checksum computation code and the initialization of $0628 are located in related routines.

## Source Code

```asm
;  CHECKSUM 

;  SECTOR 

;  TRACK 

;  IDL 

;  IDH 

;  GAP 

;  GAP 

;  COMPUTE  CHECKSUM 


;    INCREMENT  CHECKSUM 


710  ; 

720  INC  $0628 
```

## Key Registers

(none — $0628 is a RAM variable, not a hardware I/O register)

## References

- "header_creation_routine" — contains the checksum computation code referenced by this comment block and the increment that advances sector processing
- "tail_gap_and_sector_variables" — documents initialization and use of the sector/tail pointer that INC $0628 updates