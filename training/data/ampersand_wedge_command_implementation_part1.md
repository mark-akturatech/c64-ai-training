# Wedge command intercept at $0308 (ampersand example)

**Summary:** Demonstrates installing a BASIC wedge via the vector at $0308/$0309 to intercept BASIC input, peeking the next character through TXTPTR (indirect ($007A),Y), using CHRGET ($0073) and CHROUT ($FFD2) to consume the ampersand and print ten asterisks, and chaining back to the normal BASIC interpreter via an indirect jump (JMP ($03A0)).

## Behavior and implementation notes
- The wedge vector at $0308/$0309 is redirected to custom code. The original address from $0308/$0309 is copied to an indirect pointer (example uses $03A0/$03A1) so normal BASIC can be invoked when the wedge does not handle a command.
- When the vector is invoked, TXTPTR is positioned immediately before the next BASIC token/character. The wedge must preserve TXTPTR positioning when passing control back to BASIC.
- Code peeks the character after the current TXTPTR using indirect indexed addressing:
  - LDY #$01 followed by LDA ($007A),Y reads the byte one past the TXTPTR address (TXTPTR is the two-byte pointer at $007A/$007B).
  - If the character is not the ampersand (#$26), the wedge chains to BASIC using the stored original vector (JMP ($03A0)).
  - If it is an ampersand, CHRGET ($0073) is called to advance TXTPTR so that the ampersand is consumed, then CHROUT ($FFD2) is used repeatedly to print ten asterisks and a final carriage return, after which control is returned to BASIC.
- The example uses JSR $FFD2 (KERNAL CHROUT) to output characters and JSR $0073 (BASIC CHRGET) to advance the BASIC input pointer.

## Source Code
```asm
; wedge intercept example (starts at $033C)
        .A 033C LDY #$01
        .A 033E LDA ($7A),Y       ; peek next char via TXTPTR ($007A)
        .A 0340 CMP #$26         ; compare to '&'
        .A 0342 BEQ $0347
        .A 0344 JMP ($03A0)      ; chain to original BASIC via indirect vector

        .A 0347 JSR $0073        ; CHRGET - advance pointer (now at ampersand)
        .A 034A LDY #$00
        .A 034C LDA #$2A         ; '*'
        .A 034E JSR $FFD2        ; CHROUT - output character
        .A 0351 INY
        .A 0352 CPY #$0A
        .A 0354 BCC $034E
        .A 0356 LDA #$0D         ; CR
        .A 0358 JSR $FFD2
        .A 035B JMP $0344        ; return to chaining path (JMP ($03A0))
```

## Key Registers
- $0308-$0309 - BASIC wedge vector (intercept entry vector where custom code is installed)
- $03A0-$03A1 - Indirect pointer used in example to store original BASIC vector (JMP ($03A0) chains back)
- $007A-$007B - TXTPTR (BASIC input pointer), used with indirect indexed addressing LDA ($007A),Y
- $0073 - BASIC CHRGET (advance BASIC input pointer)
- $FFD2 - KERNAL CHROUT (character output routine used to print characters)

## References
- "ampersand_wedge_command_installation" — expands on code to install wedge vector and enable via SYS
- "kernal_chrout_and_charget" — expands on use of $FFD2 (CHROUT) and $0073 (CHRGET) in wedge

## Labels
- CHRGET
- CHROUT
- TXTPTR
