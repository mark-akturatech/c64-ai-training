# C64 RAM Map: ILOAD / ISAVE Vectors ($0330-$0333)

**Summary:** $0330-$0333 are two 16-bit little-endian Kernal vectors holding the addresses of the Kernal LOAD and SAVE routines (KERNAL $F49E / $F5DD). These RAM vectors can be read or patched to redirect LOAD/SAVE behavior.

## Description
- $0330-$0331 (ILOAD) — 16-bit vector pointing to the Kernal LOAD routine. Current value: $F49E (decimal 62622).
- $0332-$0333 (ISAVE) — 16-bit vector pointing to the Kernal SAVE routine. Current value: $F5DD (decimal 62941).

Vectors are stored little-endian (low byte at the low address, high byte at the high address). Programs and machine-code utilities that perform LOAD and SAVE operations (or that want to intercept them) consult or patch these vectors to call the Kernal routines indirectly. Changing these bytes redirects code that uses these vectors to the new addresses.

## Source Code
```asm
*=$0330
.word $F49E  ; $0330-$0331 ILOAD -> Kernal LOAD routine (KERNAL $F49E / 62622)
.word $F5DD  ; $0332-$0333 ISAVE -> Kernal SAVE routine (KERNAL $F5DD / 62941)
```

```text
Memory dump:
$0330: 9E F4  DD F5
        ^^^^  ^^^^
        ILOAD LOW/HIGH   ISAVE LOW/HIGH
```

## Key Registers
- $0330-$0331 - Kernal - ILOAD: Vector to Kernal LOAD routine (low byte/high byte)
- $0332-$0333 - Kernal - ISAVE: Vector to Kernal SAVE routine (low byte/high byte)

## References
- "kernal_indirect_vectors_overview" — expands on LOAD/SAVE as vectored Kernal routines

## Labels
- ILOAD
- ISAVE
