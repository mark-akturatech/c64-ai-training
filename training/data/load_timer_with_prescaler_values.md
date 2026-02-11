# Load CIA Timer with Prescaler Values from RS-232 Baud Table ($FF1A)

**Summary:** ROM routine at $FF1A (decimal 65306) that loads CIA2 Timer B with prescaler values from the RS‑232 baud‑rate lookup table. Searchable terms: $FF1A, 65306, CIA2, RS-232, baud rate lookup table, prescaler.

**Description**

The routine at address $FF1A configures CIA2 Timer B for RS‑232 communication by loading prescaler values corresponding to the selected baud rate. It reads the prescaler values from a baud‑rate lookup table and sets the timer accordingly.

The routine operates as follows:

1. Reads the baud rate factor from memory locations $0295 and $0296.
2. Stores these values into the CIA2 Timer B low and high byte registers at $DD06 and $DD07.
3. Sets the Timer B control register at $DD0F to start the timer in one-shot mode.
4. Updates the RS‑232 enable register at $02A1.
5. Sets the Timer B latch registers at $DD06 and $DD07 to $FF.
6. Copies the value from $0298 to $00A8.

The routine uses the following memory locations:

- **$0295-$0296 (M51AJB):** Baud rate factor.
- **$0298 (BITNUM):** Number of bits left to send.
- **$02A1 (ENABL):** RS‑232 enables.
- **$00A8 (BITCI):** Receiver bit count in.

The RS‑232 baud‑rate lookup table for NTSC systems is located at $FEC2, and for PAL systems at $E4EC. These tables contain prescaler values for standard baud rates. ([cx16.dk](https://cx16.dk/mapping_c64.html?utm_source=openai))

The routine does not disable or enable interrupts and does not modify other flags or registers beyond those mentioned.

## Source Code

```assembly
FF1A   A9 12      LDA #$12
FF1C   4D A1 02   EOR $02A1
FF1F   8D A1 02   STA $02A1
FF22   A9 FF      LDA #$FF
FF24   8D 06 DD   STA $DD06
FF27   8D 07 DD   STA $DD07
FF2A   AE 98 02   LDX $0298
FF2D   86 A8      STX $A8
FF2F   60         RTS
```

## Key Registers

- **$DD06 (CIA2 Timer B Low Byte):** Timer B low byte.
- **$DD07 (CIA2 Timer B High Byte):** Timer B high byte.
- **$DD0F (CIA2 Timer B Control):** Timer B control register.

## References

- ([cx16.dk](https://cx16.dk/mapping_c64.html?utm_source=openai))
- ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_6/page_358.html?utm_source=openai))
- ([cbmitapages.it](https://www.cbmitapages.it/c64/c64rom.htm?utm_source=openai))

## Labels
- M51AJB
- BITNUM
- ENABL
- BITCI
