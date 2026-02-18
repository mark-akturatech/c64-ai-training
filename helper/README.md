# Helper Scripts

## prg2vsf.py

Converts a C64 `.prg` file to a VICE `.vsf` snapshot file.

**Status: BROKEN** — snapshots load but programs don't run correctly. Needs investigation into proper VICE 3.x snapshot state setup (CPU port, SID module, hardware register state).

```bash
python3 helper/prg2vsf.py input.prg [-o output.vsf] [--pc 0x0810]
python3 helper/prg2vsf.py input.prg --full-ram [--pc 0xXXXX]
```
