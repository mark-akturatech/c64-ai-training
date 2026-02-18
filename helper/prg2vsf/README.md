# prg2vsf

Converts a C64 `.prg` file to a VICE `.vsf` snapshot file that can be loaded directly in VICE.

## How It Works

The tool takes a pre-saved VICE snapshot (`.vsf_template.vsf`) of a fully booted C64 sitting at the READY prompt, and patches it:

1. **Finds the C64MEM module** in the VSF binary — this contains the 64KB RAM image
2. **Writes the PRG payload** into RAM at the correct load address
3. **Handles entry point** based on program type:
   - **BASIC SYS programs** (load at `$0801`): Stuffs `RUN` + RETURN into the C64 keyboard buffer (`$C6`/`$0277`). When VICE resumes, BASIC reads the buffer and executes the program naturally — proper stack, BASIC pointers, everything intact.
   - **Non-BASIC programs** (`--pc` specified): Sets the MAINCPU PC register directly in the snapshot.

Everything else in the snapshot (SID, VIC-II, CIAs, KERNAL state, zero page) stays exactly as VICE saved it.

## Usage

```bash
cd helper/prg2vsf

# BASIC program (auto-detects SYS stub, auto-runs)
npx tsx src/index.ts input.prg -o output.vsf

# Game/demo with specific entry point
npx tsx src/index.ts input.prg --pc 0x6100 -o output.vsf

# Full 64KB RAM dump (no 2-byte PRG header)
npx tsx src/index.ts ramdump.bin --full-ram --pc 0x6100 -o output.vsf
```

## Entry Point Detection

1. `--pc` override (if given) — sets MAINCPU PC directly
2. BASIC SYS stub parsing (if load address is `$0801`) — auto-RUN via keyboard buffer
3. Load address fallback — sets MAINCPU PC directly

## VSF Binary Format (VICE 3.10, snapshot version 2.0)

The VSF file has a 37-byte header followed by sequential modules. Each module has a 22-byte header:

```
[16 bytes name, null-padded] [1 byte major] [1 byte minor] [4 bytes total size LE]
```

Key modules:

| Module | Purpose | Notes |
|--------|---------|-------|
| **C64MEM** | 64KB RAM | 4-byte prefix + 65536 bytes RAM + 15-byte suffix |
| **MAINCPU** | CPU state (v1.4) | PC at data offset +12/+13 (little-endian) |
| SID | Sound chip | Preserved from template |
| VIC-II | Graphics chip | Preserved from template |

**Critical lesson**: The C64MEM prefix is exactly **4 bytes** (processor port state), NOT `dataSize - 65536` (which gives 19 and is wrong — there's a 15-byte suffix). Getting this wrong shifts all RAM writes by 15 bytes, corrupting zero page pointers and making BASIC unable to find the loaded program.

## Template

The `.vsf_template.vsf` file is a VICE 3.10 (`x64sc`) snapshot of a fully booted C64 at the READY prompt.

**The output VSF will only load in the same VICE version used to create the template.** The current template was saved with `x64sc` VICE 3.10 — output snapshots must be loaded in VICE 3.10.

**To regenerate (or update for a new VICE version):**
1. Open VICE (`x64sc`)
2. Wait for the READY prompt
3. Snapshot > Save snapshot image
4. Copy the saved `.vsf` file over `.vsf_template.vsf`

The snapshot contains fully initialized hardware state (SID, VIC-II, CIAs, KERNAL vectors, etc.) so the tool doesn't need to set any of that up.
