# Monitor .A assemble command — step-by-step example at $033C

**Summary:** Example of using the monitor ".A" assemble command to place LDA #$48, JSR $FFD2, BRK into memory starting at $033C; shows monitor feedback (question mark on error), the resulting object bytes ($A9,$48,$20,$D2,$FF,$00) and advice to view assembled bytes with the ".M" display.

## Example / Behavior
Assemble at absolute address $033C using the monitor extension's .A command. The monitor accepts a line such as

  .A 033C  LDA #$48

and will either:
- print a single question mark (?) indicating an assembly error; if the question mark appears immediately after the "A" the monitor does not recognize the .A assembler command (load a different monitor or configure the current one), or
- translate the mnemonic(s) to object code and place the bytes into memory starting at the given address. After assembling a line it typically prints a new prompt pre-filled with the next assembly address to save typing (for example, after assembling a 2-byte instruction at $033C it will prefill ".A 033E").

In this example the sequence assembled is:
- .A 033C  LDA #$48  → assembles to $A9 $48 at $033C-$033D
- .A 033E  JSR $FFD2 → assembles to $20 $D2 $FF at $033E-$0340 (JSR is little-endian)
- .A 0341  BRK      → assembles to $00 at $0341

After assembling the BRK, the monitor shows .A 0342 (next address). Press RETURN on an empty .A prompt to finish.

To verify the object bytes are in memory, use the monitor memory display command (commonly ".M 033C" or similar depending on the monitor) to view the assembled bytes.

## Source Code
```asm
.A 033C  LDA #$48
; monitor stores: $033C = $A9, $033D = $48
.A 033E  JSR $FFD2
; monitor stores: $033E = $20, $033F = $D2, $0340 = $FF
.A 0341  BRK
; monitor stores: $0341 = $00
.A 0342
; (press RETURN on empty .A line to finish)
```

Memory/object bytes map (addresses and bytes):
```text
$033C: A9 48 20 D2 FF 00
        |  |  \  \  \
        |  |   \  \  BRK ($00) at $0341
        |  |    \  JSR operand high ($FF) at $0340
        |  |     JSR operand low  ($D2) at $033F
        |   LDA immediate value ($48) at $033D
        LDA immediate opcode ($A9) at $033C
```

Example monitor verification command (monitor-dependent):
```asm
.M 033C    ; display bytes starting at $033C (use your monitor's memory display)
```

## References
- "monitor_assembler_extensions_nonsymbolic" — expands on context for the .A assembler command
- "display_memory_and_object_bytes" — expands on viewing the assembled bytes in memory with .M
