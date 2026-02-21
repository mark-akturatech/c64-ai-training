# Verify: Standalone Byte-Comparison Tool for C64 Reverse Engineering

## Context

When reverse engineering a C64 binary — whether via the automated pipeline (static-analysis → builder) or by hand — you need to verify that your KickAssembler source produces byte-identical output to the original.

**Verify is a standalone tool.** It doesn't depend on the builder or the RE pipeline. Anyone writing KickAssembler source for a C64 program can use it to check their work.

```
original.prg ──────────────┐
                            ├── verify → PASS / FAIL report
your_source.asm → kickass ──┘
```

**Related plans:**
- [static-analysis.md](docs/static-analysis.md) — produces `blocks.json` (optional input to verify for junk filtering)
- [builder.md](docs/builder.md) — produces `.asm` files from `blocks.json`
- [reverse-engineering-pipeline.md](docs/reverse-engineering-pipeline.md) — enriches `blocks.json` with AI analysis

---

## What it does

1. **Compile** a KickAssembler source file (`kickass main.asm`)
2. **Compare** the compiled `.prg` bytes against an original binary
3. **Skip junk blocks** — if `blocks.json` is provided, skip blocks marked `junk: true`
4. **Report** per-block PASS/FAIL with first mismatch address + overall result

---

## CLI

```
npx tsx src/index.ts output/main.asm --original game.prg                       # compile + compare all bytes
npx tsx src/index.ts output/main.asm --original game.prg --blocks blocks.json  # skip junk blocks
npx tsx src/index.ts compiled.prg --original game.prg                          # compare two PRGs directly
npx tsx src/index.ts compiled.prg --original game.prg --blocks blocks.json     # PRG comparison with junk skipping
```

When given a `.asm` file, verify runs `kickass` first and uses the compiled `.prg` output. When given a `.prg` file, it compares directly.

---

## Junk handling

Blocks with `junk: true` in `blocks.json` are skipped during comparison. These are padding/fill regions that don't affect program behavior — the builder may omit them entirely, so byte mismatches in junk ranges are expected and fine.

Without `--blocks`, verify compares **every byte** in the loaded range. This is the mode for hand-written reverse engineering projects where there's no blocks.json.

---

## Project Structure

```
verify/
  package.json          # name: "c64-verify", type: "module", deps: @c64/shared, tsx, vitest
  tsconfig.json         # ES2022, ESNext, bundler resolution
  src/
    index.ts            # CLI entry point: parse args, orchestrate
    compiler.ts         # Run kickass, capture output, parse errors, locate compiled .prg
    comparator.ts       # Byte-compare two PRGs, iterate by block or raw ranges
    reporter.ts         # Format results: JSON, human-readable summary
    types.ts            # VerificationReport, ComparisonResult
```

---

## Core Logic

### `compiler.ts`

- Run `kickass <file>.asm` as a child process
- Capture stdout/stderr
- Parse KickAssembler error output to extract line numbers and messages
- Locate the compiled `.prg` (same directory, same name + `.prg`)
- Return success + prg path, or failure + parsed errors

### `comparator.ts`

- Load both PRG files, strip 2-byte load address headers
- Verify load addresses match (warn if different)
- If `blocks.json` provided:
  - Iterate blocks sorted by address
  - Skip blocks where `junk: true`
  - For each non-junk block: compare byte range, record PASS/FAIL + first mismatch
  - Track verified vs skipped byte counts
- If no `blocks.json`:
  - Compare all bytes in the overlapping loaded range
  - Report first N mismatches with addresses

### `reporter.ts`

Human-readable summary to stderr, JSON to stdout:

```
Verify: output.prg vs original.prg
  Load address: $0801
  Total bytes: 26622
  Verified: 25100 (94.3%)
  Skipped (junk): 1522 (5.7%)

  sub_0810: $0810-$0850 PASS
  dat_2000: $2000-$2200 PASS
  dat_3000: $3000-$3040 FAIL @ $3012 (expected $A9, got $00)

  Result: FAIL (1 block failed)
```

### Output JSON

```json
{
  "overall": "PASS",
  "loadAddress": "0x0801",
  "totalBytes": 26622,
  "verifiedBytes": 25100,
  "skippedBytes": 1522,
  "matchedBytes": 25100,
  "mismatchedBytes": 0,
  "blocks": [
    { "id": "sub_0810", "start": "0x0810", "end": "0x0850", "status": "PASS" },
    { "id": "dat_2000", "start": "0x2000", "end": "0x2200", "status": "PASS" },
    { "id": "dat_3000", "start": "0x3000", "end": "0x3040", "status": "FAIL", "firstMismatch": "0x3012" }
  ]
}
```

---

## Implementation Order

1. `types.ts` — VerificationReport, ComparisonResult interfaces
2. `compiler.ts` — kickass wrapper with error parsing
3. `comparator.ts` — byte comparison with block-aware junk skipping
4. `reporter.ts` — human + JSON output
5. `index.ts` — CLI, wire everything together
6. Test: `test/spriteintro.prg → analyze → build → verify`

---

## End-to-End Test

```bash
# Full pipeline test
cd static-analysis && npx tsx src/index.ts ../test/spriteintro.prg -o ../test/spriteintro-blocks.json
cd ../builder && npx tsx src/index.ts ../test/spriteintro-blocks.json --binary ../test/spriteintro.prg -o ../test/spriteintro-output/
cd ../verify && npx tsx src/index.ts ../test/spriteintro-output/main.asm --original ../test/spriteintro.prg --blocks ../test/spriteintro-blocks.json

# Hand-written RE project test (no blocks.json needed)
cd ../verify && npx tsx src/index.ts my-reverse-engineered/main.asm --original original-game.prg
```

## Key Files
- [@c64/shared](shared/) — Block type with `junk` field (shared with static-analysis and builder)
- [builder.md](docs/builder.md) — produces the .asm files verify checks
- [static-analysis/ARCHITECTURE.md](static-analysis/ARCHITECTURE.md) — blocks.json format reference
