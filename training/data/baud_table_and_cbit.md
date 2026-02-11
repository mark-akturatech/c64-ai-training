# KERNAL BAUDO table ($FEC2-$FED4) and CBIT constant

**Summary:** BAUDO is a KERNAL ROM table of 16-bit little-endian words at $FEC2-$FED4 used to compute timing for half-bit / mid-bit sampling for standard serial baud rates (50..2400). CBIT is a KERNAL constant (100 cycles) used as an adjustment approximating time to service a CB1 NMI so the next T2 hit falls near the center of the next bit.

## BAUDO table and CBIT — description
- Purpose: the BAUDO table contains precomputed 16-bit words used when setting up mid-bit sampling/timers for serial input (roughly 1e6 / baud / 2 values). The KERNAL code loads a value from BAUDO (one word per supported baud rate) and applies an adjustment (CBIT) when computing the mid-bit timer (BAUDOF).
- Storage: ten 16-bit words stored little-endian at ROM addresses $FEC2..$FED4. Each entry corresponds to a common baud rate: 50, 75, 110, 134.6, 150, 300, 600, 1200, 1800, 2400.
- CBIT: defined in the KERNAL source as CBIT = 100 (cycles). Comment in source: "CBIT - AN ADJUSTMENT TO MAKE NEXT T2 HIT NEAR CENTER OF THE NEXT BIT. APROX THE TIME TO SERVICE A CB1 NMI." The table comments show expressions like "10000-CBIT" (for 50 baud), i.e. nominal 1e6/baud/2 minus the CBIT adjustment.
- Usage: BAUDO entries are used to compute BAUDOF (the final timer value for mid-bit sampling) by combining the table word and CBIT; see related routines "t2nmi_subroutine_sample_and_timer_update" and "popen_patch_and_baudof_calculation_and_end" for the code paths that select a BAUDO entry and compute BAUDOF.
- Storage format remark: values are stored little-endian (low byte first, high byte second). The words in the ROM listing are the raw stored words; the source comments show the intended formula (nominal 1e6/baud/2 minus CBIT).
**[Note: Source may contain an error — the raw stored words shown in the listing do not match the commented expressions (e.g., bytes at $FEC2 are C1 27 but the comment says 10000-CBIT).]**

## Source Code
```asm
                                ; BAUDO TABLE CONTAINS VALUES
                                ;  FOR 1E6/BAUD RATE/2
                                ;
.:FEC2 C1 27                    BAUDO  .WOR 10000-CBIT ; 50 BAUD
.:FEC4 3E 1A                           .WOR 6667-CBIT  ;   75   BAUD
.:FEC6 C5 11                           .WOR 4545-CBIT  ;  110   BAUD
.:FEC8 74 0E                           .WOR 3715-CBIT  ;  134.6 BAUD
.:FECA ED 0C                           .WOR 3333-CBIT  ;  150   BAUD
.:FECC 45 06                           .WOR 1667-CBIT  ;  300   BAUD
.:FECE F0 02                           .WOR 833-CBIT   ;  600   BAUD
.:FED0 46 01                           .WOR 417-CBIT   ; 1200   BAUD
.:FED2 B8 00                           .WOR 278-CBIT   ; 1800   BAUD
.:FED4 71 00                           .WOR 208-CBIT   ; 2400   BAUD
                                ;
                                ; CBIT - AN ADJUSTMENT TO MAKE NEXT T2 HIT NEAR CENTER
                                ;   OF THE NEXT BIT.
                                ;   APROX THE TIME TO SERVICE A CB1 NMI
                                CBIT   =100            ;CYCLES
```

## Key Registers
- $FEC2-$FED4 - KERNAL ROM - BAUDO table (10 16-bit little-endian words used for mid-bit timing for baud rates 50,75,110,134.6,150,300,600,1200,1800,2400)

## References
- "t2nmi_subroutine_sample_and_timer_update" — expands on how BAUDOF values from BAUDO are used to compute mid-bit timer adjustments
- "popen_patch_and_baudof_calculation_and_end" — shows where POpen computes BAUDOF derived from M51AJB and CBIT

## Labels
- BAUDO
- CBIT
