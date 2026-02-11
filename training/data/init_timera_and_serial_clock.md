# Setup CIA1 (VIA1) Timer A — enable interrupt, load and start timer ($DC0D / $DC0E)

**Summary:** Sequence to enable CIA1 (VIA1) Timer A interrupt and load/start Timer A by writing $81 to $DC0D (ICR) and writing a modified CRA to $DC0E, then jump to $EE8E to set the serial clock low. Searchable terms: $DC0D, $DC0E, CIA1, ICR, CRA, Timer A, JMP $EE8E.

## Description
This routine performs three actions in order:
1. Enable Timer A interrupt in CIA1 by writing #$81 to the Interrupt Control Register ($DC0D).
2. Read Control Register A ($DC0E), mask and set bits to load and start Timer A, then write the new CRA back to $DC0E.
3. Jump to $EE8E to set the serial clock line low and return.

Step-by-step behavior:
- LDA #$81 / STA $DC0D
  - Writes %10000001 ($81) into CIA1 ICR ($DC0D) to enable Timer A interrupt (source comment).
- AD  $DC0E / AND #$80 / ORA #$11 / STA $DC0E
  - Reads current CRA from $DC0E.
  - AND #$80 retains only bit7 of the existing CRA (result = existing_bit7 * 0x80).
  - ORA #$11 sets bits 0 and 4 (0x01 and 0x10), producing a final value of $80 OR $11 = $91 if bit7 was set; with the read/AND/OR sequence the written CRA will be $91 when bit7 was 1, otherwise $11|0 = $11 (but the AND forces only bit7 through before OR).
  - Writing the resulting value to $DC0E loads and starts Timer A (source comments: "load timer A, start timer A").
- JMP $EE8E
  - Branches to code that sets the serial clock output low and returns.

Calculated example:
- If CRA bit7 was 1 on read: AND #$80 -> $80; ORA #$11 -> $91; STA $DC0E writes $91.
- If CRA bit7 was 0 on read: AND #$80 -> $00; ORA #$11 -> $11; STA $DC0E writes $11.

## Source Code
```asm
.,FF6E A9 81    LDA #$81        enable timer A interrupt
.,FF70 8D 0D DC STA $DC0D       save VIA 1 ICR
.,FF73 AD 0E DC LDA $DC0E       read VIA 1 CRA
.,FF76 29 80    AND #$80        mask x000 0000, TOD clock
.,FF78 09 11    ORA #$11        mask xxx1 xxx1, load timer A, start timer A
.,FF7A 8D 0E DC STA $DC0E       save VIA 1 CRA
.,FF7D 4C 8E EE JMP $EE8E       set the serial clock out low and return
```

## Key Registers
- $DC00-$DC0F - CIA 1 (6526) - includes Timer A/B, CRA (Control Register A), ICR (Interrupt Control Register), TOD, etc.

## References
- "initialise_vic_and_screen_editor" — continues device initialization and setup steps

## Labels
- CRA
- ICR
