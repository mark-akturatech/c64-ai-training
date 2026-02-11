# CIA 6526 — Data Direction Registers DDRA ($02) and DDRB ($03)

**Summary:** DDRA/DDRB (offsets $02/$03) are the CIA 6526 read/write Data Direction Registers that set each I/O pin as input (0) or output (1). Addresses: CIA1 $DC02/$DC03 and CIA2 $DD02/$DD03; defaults and bit-direction layouts noted.

## Data Direction Registers (DDRA/DDRB) - Offsets $02/$03
Read/Write. Each bit controls the direction of the corresponding port pin:
- 0 = pin is INPUT
- 1 = pin is OUTPUT

Bit layout: bit 0 → PA0/PB0 ... bit 7 → PA7/PB7.

Defaults:
- CIA1: DDRA = $FF (all outputs), DDRB = $00 (all inputs)
- CIA2: DDRA = $3F (bits 0–5 outputs, bits 6–7 inputs), DDRB = $00 (all inputs)

Interaction with port data registers:
- DDRA/DDRB select whether the PRA/PRB data registers drive pins or sample external signals. When a DDx bit = 1, the corresponding PRx write drives the pin; when DDx bit = 0, the pin is an input and PRx reads return the external pin state (or the sampled input state).

## Key Registers
- $DC02 - CIA1 - DDRA (Data Direction Register A) — R/W; 0=input, 1=output
- $DC03 - CIA1 - DDRB (Data Direction Register B) — R/W; 0=input, 1=output
- $DD02 - CIA2 - DDRA (Data Direction Register A) — R/W; 0=input, 1=output
- $DD03 - CIA2 - DDRB (Data Direction Register B) — R/W; 0=input, 1=output

## References
- "port_a_data_register_pra" — expands on PRA behavior and how DDRA controls PRA pin direction
- "port_b_data_register_prb" — expands on PRB behavior and how DDRB controls PRB pin direction

## Labels
- DDRA
- DDRB
