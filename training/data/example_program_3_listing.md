# EXAMPLE PROGRAM 3 (EXAMPLE 1 MODIFIED) — COMPLETE LISTING (tok64 tokens included)

**Summary:** Complete Commodore 64 BASIC program listing with numbered lines, all DATA statements and the token directive "stop tok64"; includes the modified note start/stop numbers and is ready to be tokenized/run on a C64.

## Program Description
This chunk is a verbatim BASIC listing (Example Program 3, a modification of Example 1) including its DATA statements and the token directive "stop tok64". It preserves the original line numbers and numeric data exactly as provided. The listing uses FOR/POKE/READ/GOTO/DATA — intended to be tokenized (tok64) and RUN on a Commodore 64. No machine-code assembly or explicit memory register addresses are present in the listing itself; the DATA statements hold byte values for the program's runtime interpretation.

## Source Code
```basic
  10 forl=stos+24:pokel,0:next
  20 pokes+5,9:pokes+6,0
  30 pokes+24,15
  40 readhf,lf,dr
  50 ifhf<0thenend
  60 pokes+1,hf:pokes,lf
  70 pokes+4,17
  80 fort=1todr:next
  90 pokes+4,16:fort=1to50:next
  100 goto40
  110 data25,177,250,28,214,250
  120 data25,177,250,25,177,250
  130 data25,177,125,28,214,125
  140 data32,94,750,25,177,250
  150 data28,214,250,19,63,250
  160 data19,63,250,19,63,250
  170 data21,154,63,24,63,63
  180 data25,177,250,24,63,125
  190 data19,63,250,-1,-1,-1
stop tok64

  Now RUN the program.
```

## References
- "sawtooth_program_intro" — expands on why/how this listing was produced from Example 1
- "run_results_triangle_and_pulse" — describes audible results when this program is run and compares triangular and pulse waveforms
