# MACHINE — Project overview and BASIC driver (Commodore 64)

**Summary:** Describes placing a machine language (ML) program after the end-of-BASIC area on the Commodore 64, using a BASIC driver that INPUTs a numeric variable V% and calls the ML routine with SYS. Includes the BASIC listing (lines 100–150) and notes about estimating the BASIC end and replacing the SYS placeholder.

**Project overview**
This project places a machine language program immediately after the end-of-BASIC area so it can be invoked from BASIC via SYS. The BASIC driver initializes a numeric variable V% (used as the input/output value), loops five times, asks the user for VALUE (stored in V%), calls the ML routine with SYS <address>, then prints the result (ML is expected to multiply V% by ten and return the result in V%).

Notes and constraints:
- You must determine the BASIC program's size (end-of-BASIC) on the target machine to choose a safe ML start address; this location varies by machine.
- Run NEW before saving or loading ML to clear BASIC and free memory for ML placement.
- Replace the SYS ++++ placeholder with the decimal SYS address of the ML entry point (the exact address depends on where you place the ML after end-of-BASIC).
- The ML routine itself (not included here) must read/write the BASIC numeric variable V% (or otherwise communicate via agreed memory locations) and return control to BASIC so PRINT "TIMES TEN =" shows the updated V%.

## Source Code
```basic
100 V%=0
110 FOR J=1 TO 5
120 INPUT "VALUE";V%
130 SYS ++++
140 PRINT "TIMES TEN =";V%
150 NEXT J
```

## Key Registers
- **Start of BASIC Program:** $0801 (2049)
- **End of BASIC RAM:** $A000 (40960)
- **Start of Variables:** $2D/$2E (45/46)
- **Start of Arrays:** $2F/$30 (47/48)
- **End of Arrays:** $31/$32 (49/50)
- **String Storage Area Start:** $33/$34 (51/52)
- **Top of BASIC Memory:** $37/$38 (55/56)

## References
- "estimating_ml_location_and_sys_setup" — expands on how to choose the ML start address and change the SYS line  
- "saving_basic_and_preparing_to_write_machine_code" — expands on options for developing BASIC and ML parts separately