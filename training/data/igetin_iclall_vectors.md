# C64 RAM Map: $032A-$032D — IGETIN / ICLALL vectors

**Summary:** RAM vectors $032A-$032D hold the Kernal indirect vectors IGETIN and ICLALL (little-endian 16-bit addresses). By default, IGETIN points to GETIN at $F13E (61758), and ICLALL points to CLALL at $F32F (62255).

**Description**
- **$032A-$032B (IGETIN):** 16-bit little-endian vector containing the address of the Kernal GETIN routine. GETIN supplies the next byte from the current input device (keyboard/console or redirected device).
- **$032C-$032D (ICLALL):** 16-bit little-endian vector containing the address of the Kernal CLALL routine. CLALL closes all open files and resets the I/O channels to their default states. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_5/page_281.html?utm_source=openai))
- Vectors are stored low byte then high byte (little-endian). To redirect a vector, write the low and high bytes of the replacement routine's address into the two vector bytes and restore the original when finished.
- The listed "current" targets are the stock Kernal routine addresses at the time of this mapping: IGETIN → $F13E (decimal 61758), ICLALL → $F32F (decimal 62255).
- Changing these vectors is a common technique to intercept or extend Kernal input/clear behavior; do not forget to preserve and restore original vector values to maintain system stability.

## Source Code
```text
Vector address map (little-endian):
$032A-$032B  IGETIN  -> $F13E  (GETIN)  ; stored bytes: $3E $F1
$032C-$032D  ICLALL  -> $F32F  (CLALL)  ; stored bytes: $2F $F3

Decimal addresses (for reference):
$F13E = 61758
$F32F = 62255
```

```asm
; Example: install a custom GETIN at $C000 (example address)
        .org $032A
IGETIN: .word $F13E    ; original vector (low/high) - shown for reference

        ; to redirect:
        lda #<($C000)   ; low byte of new routine
        sta $032A
        lda #>($C000)   ; high byte of new routine
        sta $032B

        ; to restore original shown above, write $3E,$F1 back into $032A/$032B
```

## Key Registers
- $032A-$032D - RAM - Kernal indirect vectors: IGETIN (GETIN) and ICLALL (CLALL)

## References
- "kernal_indirect_vectors_overview" — expands on I/O and console input vectors

## Labels
- IGETIN
- ICLALL
