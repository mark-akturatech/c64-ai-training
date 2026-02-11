# OPEN/CLOSE parameter parser (BASIC ROM $E219-$E254)

**Summary:** Parses OPEN/CLOSE arguments in Commodore 64 BASIC: clears filename buffer ($FFBD), scans and fetches a byte parameter (logical file number via $B79E), saves logical/device into zero page $49/$4A, sets defaults (X=#$01 cassette, Y=#$00 command), calls KERNAL $FFBA to set logical/first/second addresses, handles optional ",byte" device/file parameters, compares device number to screen (CPX #$03) and adjusts command (DEY) for screen vs device, and uses helpers $E206/$E200/$E20E for end/colon checks and comma-byte scanning.

## Description
This BASIC ROM fragment implements the parameter parsing common to OPEN and CLOSE statements. Sequence and effects:

- Clear filename state:
  - LDA #$00 then JSR $FFBD clears the filename length and buffer used by OPEN.
- Read first meaningful token:
  - JSR $E211 scans for a valid byte or triggers a syntax error/warm start if missing.
- Fetch logical file number:
  - JSR $B79E returns the byte parameter (logical file number) in X; that value is stored to zero page $49 (STX $49).
  - TXA copies X into A when needed for later KERNAL setups.
- Set defaults for device and command:
  - LDX #$01 sets default device to 1 (cassette).
  - LDY #$00 sets default command to 0.
- Call KERNAL $FFBA repeatedly:
  - JSR $FFBA is invoked to "set logical, first and second addresses" (prepare KERNAL/file vectors). The routine is called after each parameter stage, so current A/X/Y are used to update the KERNAL/BASIC open/close state multiple times as parameters are parsed.
- Early exit checks:
  - JSR $E206 checks for end-of-token (EOT) or a colon ":" and will exit the parser if appropriate.
- Scan and get next byte parameter(s):
  - JSR $E200 scans for and obtains the next byte, otherwise triggers syntax error/warm start. The returned device number is saved into $4A (STX $4A).
  - After saving device number, command is cleared (LDY #$00).
- Screen-device special-case:
  - CPX #$03 followed by BCC tests device number against 3 (screen device code). If X < 3, branch leaves Y unchanged; otherwise DEY decrements Y. This converts device numbers for the screen (affects the command value used for OPEN/CLOSE).
- Continue filling registers for KERNAL calls:
  - TXA/TAY/LDX/LDA sequence copies command/device/logical into A/X/Y as needed, then JSR $FFBA again to update addresses.
- Optional comma-byte parameter:
  - JSR $E20E scans specifically for ",byte" (optional additional parameter); if missing it triggers syntax error/warm start.
- Helpers used repeatedly:
  - $E206: exit if [EOT] or ":" (used to allow early termination)
  - $E200: scan and get byte, syntax-error/warm-start on failure
  - $E20E: scan for optional comma-and-byte
- Final state:
  - Logical file number saved in $49, device number saved in $4A, command in Y (possibly adjusted), and A/X/Y prepared for the KERNAL OPEN/CLOSE call performed by the callers (perform_open_and_close).

This parser is a compact, stepwise scanner that interleaves parameter fetching, KERNAL vector updates ($FFBA), and syntax checks so that the OPEN/CLOSE entry points can rely on prepared logical/device/command values.

## Source Code
```asm
.,E219 A9 00    LDA #$00        clear the filename length
.,E21B 20 BD FF JSR $FFBD       clear the filename
.,E21E 20 11 E2 JSR $E211       scan for valid byte, else do syntax error then warm start
.,E221 20 9E B7 JSR $B79E       get byte parameter, logical file number
.,E224 86 49    STX $49         save logical file number
.,E226 8A       TXA             copy logical file number to A
.,E227 A2 01    LDX #$01        set default device number, cassette
.,E229 A0 00    LDY #$00        set default command
.,E22B 20 BA FF JSR $FFBA       set logical, first and second addresses
.,E22E 20 06 E2 JSR $E206       exit function if [EOT] or ":"
.,E231 20 00 E2 JSR $E200       scan and get byte, else do syntax error then warm start
.,E234 86 4A    STX $4A         save device number
.,E236 A0 00    LDY #$00        clear command
.,E238 A5 49    LDA $49         get logical file number
.,E23A E0 03    CPX #$03        compare device number with screen
.,E23C 90 01    BCC $E23F       branch if less than screen
.,E23E 88       DEY             else decrement command
.,E23F 20 BA FF JSR $FFBA       set logical, first and second addresses
.,E242 20 06 E2 JSR $E206       exit function if [EOT] or ":"
.,E245 20 00 E2 JSR $E200       scan and get byte, else do syntax error then warm start
.,E248 8A       TXA             copy command to A
.,E249 A8       TAY             copy command to Y
.,E24A A6 4A    LDX $4A         get device number
.,E24C A5 49    LDA $49         get logical file number
.,E24E 20 BA FF JSR $FFBA       set logical, first and second addresses
.,E251 20 06 E2 JSR $E206       exit function if [EOT] or ":"
.,E254 20 0E E2 JSR $E20E       scan for ",byte", else do syntax error then warm start
```

## Key Registers
- $0049 - RAM - BASIC temp: saved logical file number
- $004A - RAM - BASIC temp: saved device number
- $E219-$E254 - ROM (BASIC) - OPEN/CLOSE parameter parser (entry and steps)
- $B79E - ROM - get byte parameter routine (used to read logical file number)
- $E200 - ROM - scan and get byte (syntax-error/warm-start on failure)
- $E206 - ROM - exit if [EOT] or ":" (early exit helper)
- $E20E - ROM - scan for optional ",byte"
- $FFBA - KERNAL - set logical, first and second addresses (called repeatedly to update KERNAL/BASIC file vectors)

## References
- "perform_open_and_close" — expands on OPEN/CLOSE entry points that call this parser to obtain their arguments
- "scan_comma_and_valid_byte" — expands on comma-and-byte scanning used to parse optional fields

## Labels
- SETLFS
