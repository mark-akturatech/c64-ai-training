# $D405 — ATDCY1 — Voice 1 Attack/Decay Register (SID)

**Summary:** $D405 is the SID (6581/8580) Voice 1 Attack/Decay register (ATDCY1); bits 4-7 select the attack index (0–15) and bits 0-3 select the decay index (0–15). The register value is formed as (ATTACK*16)+DECAY and written to $D405 to set the ADSR times for voice 1.

## Description
Bits 4–7: attack index (0–15). Bits 0–3: decay index (0–15). Each index maps to a predefined time (milliseconds/seconds) for that phase; the full timing tables are given in the Source Code section. To program the envelope, compute REGISTER VALUE = (ATTACK * 16) + DECAY and write that byte to $D405. The envelope is triggered by the Gate bit in the voice 1 control register (VCREG1) (see referenced overview).

## Source Code
```text
$D405        ATDCY1       Voice 1 Attack/Decay Register

Bit layout:
  7 6 5 4 3 2 1 0
 [ A A A A D D D D ]
 Bits 4-7 = Attack index (0-15)
 Bits 0-3 = Decay  index (0-15)

Attack index -> duration (index : time)
 0 = 2 milliseconds        8 = 100 milliseconds
 1 = 8 milliseconds        9 = 250 milliseconds
 2 = 16 milliseconds      10 = 500 milliseconds
 3 = 24 milliseconds      11 = 800 milliseconds
 4 = 38 milliseconds      12 = 1 second
 5 = 56 milliseconds      13 = 3 seconds
 6 = 68 milliseconds      14 = 5 seconds
 7 = 80 milliseconds      15 = 8 seconds

Decay index -> duration (index : time)
 0 = 6 milliseconds        8 = 300 milliseconds
 1 = 24 milliseconds       9 = 750 milliseconds
 2 = 48 milliseconds      10 = 1.5 seconds
 3 = 72 milliseconds      11 = 2.4 seconds
 4 = 114 milliseconds     12 = 3 seconds
 5 = 168 milliseconds     13 = 9 seconds
 6 = 204 milliseconds     14 = 15 seconds
 7 = 240 milliseconds     15 = 24 seconds

Register calculation:
 REGISTER VALUE = (ATTACK * 16) + DECAY
 Example: Attack=3, Decay=5 -> VALUE = (3*16)+5 = 53 (0x35)
```

## Key Registers
- $D405 - SID - Voice 1 Attack/Decay Register (ATDCY1): bits 4-7 Attack index, bits 0-3 Decay index

## References
- "voice1_envelope_adrs_overview" — expands on how to trigger ADSR via VCREG1 Gate bit

## Labels
- ATDCY1
