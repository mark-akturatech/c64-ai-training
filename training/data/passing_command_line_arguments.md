# Kick Assembler — Passing command-line string values (cmdLineVars)

**Summary:** Shows Kick Assembler ":" command-line notation (e.g. :x=27 :sound=true :title="Beta 2") and accessing values via the cmdLineVars hashtable (.print, .var, .get(...).asNumber(), .asBoolean()). Includes a short Kick Assembler code example.

## Command-line variables (cmdLineVars)
Kick Assembler accepts name=value parameters on the java command line using a leading colon: :name=value. These are collected into the cmdLineVars hashtable (Kick Assembler script API) and can be read from assembler scripts.

- Command-line example:
  - java -jar KickAss.jar mySource.asm :x=27 :sound=true :title="Beta 2"
- Retrieval examples in script:
  - .print "version =" + cmdLineVars.get("version")
  - .var x = cmdLineVars.get("x").asNumber()
  - .var sound = cmdLineVars.get("sound").asBoolean()
- Notes:
  - Values are provided as strings in the hashtable and may be converted with .asNumber() or .asBoolean() where available.
  - Use quotes on the command line to pass values containing spaces (e.g. :title="Beta 2").

## Source Code
```asm
.print "version =" + cmdLineVars.get("version")
.var x = cmdLineVars.get("x").asNumber();
.var sound = cmdLineVars.get("sound").asBoolean();

ldx #0
!loop:
.for (var i=0; i<4; i++) {
    lda colorRam+i*$100,x
    sta $d800+i*$100,x
}
inx
bne !loop
jmp *
*=$0c00;
*=$1c00; colorRam:
*=$2000;

.fill picture.getScreenRamSize(), picture.getScreenRam(i)
```

## References
- "kickass_cmdline_vars" — command-line variable parsing and cmdLineVars usage (if present elsewhere)