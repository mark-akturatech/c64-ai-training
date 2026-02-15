# Query Qdrant Knowledge Base

You have access to a comprehensive C64/6502 knowledge base via Qdrant vector search. This contains 30+ reference books (chip datasheets, programmer's reference, KickAssembler manual, ROM disassembly, etc.) split into concept-focused chunks, plus 70+ documented assembly code examples.

## Search Modes

Parse the first word of `$ARGUMENTS` to detect mode. If it starts with `--shallow` or `--deep`, strip that flag and use the rest as the query. If no flag is present, use **auto** mode.

| Mode | When to use | Behavior |
|------|------------|----------|
| **`--shallow`** | Automated refactoring, batch lookups, quick register checks — when you need a fact, not an education | Single query, `--limit 4`. If top result scores > 0.5, read it and answer immediately. No TodoWrite, no reference chasing, no self-check. If top result scores < 0.5, silently escalate to **auto**. |
| **`--deep`** | User explicitly wants thorough research on a topic | Full 6-step protocol below with TodoWrite tracking, reference following, self-check gate, hard stops. Uses `--limit 8`. |
| **auto** (default) | Normal interactive questions | Start with `--limit 8`. Read results. If the question is narrow (single register, single instruction, specific fact) AND the top result scores > 0.5 and directly answers it — give a concise answer without TodoWrite or reference chasing. If the question is broad, results are mixed, or you're not confident — escalate to the full deep protocol. Use your judgement. |

---

## Shallow Mode

Run the query and answer:

```bash
uv run query/scripts/query_qdrant.py --limit 4 "<query>"
```

- If top result score > 0.5: read it, extract the answer, respond concisely. Done.
- If top result score < 0.5: escalate to auto mode (re-query with `--limit 8` and follow the full protocol below).
- Keep the answer brief and factual — register values, bit meanings, a short code snippet if relevant. No preamble.

---

## Deep / Auto Mode (full protocol)

For **deep** mode, always follow all steps. For **auto** mode, follow all steps unless you determined above that a short answer suffices.

**Use the TodoWrite tool** to track your research. Create todos for each phase (initial query, reading results, following references, follow-up queries, self-check). Mark each done as you go — this gives the user visibility into your research progress.

### Step 1: Run the initial query

```bash
uv run query/scripts/query_qdrant.py --limit 8 "<query>"
```

The script automatically:
- Converts between number bases ($hex, %binary, decimal) so queries match regardless of representation
- Enriches queries with C64 memory map context (e.g. $D418 -> SID Filter/Volume)
- Uses hybrid search: register keyword filtering + semantic vector search for address-containing queries
- For pure natural language queries, uses semantic search

### Step 2: Absorb the results — two result types

Results come in two types that serve different purposes:

#### Documentation chunks (`type=documentation`)
These are reference material from chip datasheets, programmer's guides, manuals, etc. They contain:
- Register bit-level descriptions, timing values, cycle counts
- Technique explanations and theory
- Memory maps and hardware architecture
- Key Registers metadata listing which addresses the chunk covers
- Some docs also contain a `## Source Code` section with assembly listings (ROM disassembly, library routines, etc.) — this code is stored in the payload but excluded from the search embedding, so it won't clutter search results. **Read the source code** when present — it contains the actual implementation.

Use these to understand **what** registers do, **how** hardware works, and **why** certain approaches are used.

#### Code examples (`type=example`)
These contain **full working assembly source code** in the document payload, along with structured metadata:
- `## Summary` — what the example demonstrates
- `## Key Registers` — which hardware registers it uses
- `## Techniques` — what programming techniques it demonstrates
- `## Hardware` — which chip(s) it targets
- `## Source Code` — the complete, commented, compilable assembly

**Read the source code carefully.** Examples show how registers and techniques work together in practice. When the user needs implementation guidance, show the actual code — don't paraphrase assembly.

**Study what the code does.** If the example uses registers or techniques you don't fully understand from the initial results, run follow-up queries to fill in the gaps. For instance, if a raster interrupt example writes `$7F` to `$DC0D` and you don't have a result explaining CIA interrupt control, query for that:

```bash
uv run query/scripts/query_qdrant.py --limit 4 "$DC0D CIA interrupt control"
```

Read ALL returned results, not just the top one. Lower-ranked results often contain complementary information — result 1 might be the register reference, result 4 a code example showing practical usage, result 6 a related technique.

### Step 3: Follow references for completeness

Check the **`references`** at the bottom of each result. These are curated cross-links to related chunks. If any reference looks relevant to answering the question fully, run a follow-up query:

```bash
uv run query/scripts/query_qdrant.py --limit 4 "<topic from the reference description>"
```

Common cases where following references matters:
- A register doc references a chunk about "filter routing" — follow it if the user asked about filters
- An overview chunk references detailed per-register docs — follow for bit-level detail
- A technique doc references example code — follow to get working implementation

Do NOT follow references that are tangential to the user's actual question. Be selective.

### Step 4: Run additional queries if the picture is incomplete

If after reading results + following references you still lack information to answer fully, run additional queries with different terms. The knowledge base uses specific C64 terminology — try:

- **Register addresses**: `$D020`, `$D418`, `$DC0D` — triggers keyword-filtered search, very precise
- **Chip names**: `VIC-II`, `SID 6581`, `CIA 6526`
- **Technique names**: `sprite multiplexing`, `raster interrupt`, `smooth scrolling`
- **Instruction mnemonics**: `LDA STA indirect indexed`
- **Decimal addresses**: `53280` (auto-converted to $D020)

Scenarios that should trigger additional queries:
- An example uses a register but no documentation result explains its bit layout — query the register address directly
- A documentation chunk describes a technique but no example shows it in action — query the technique name
- The user asked a broad question (e.g. "how does SID sound work") and results cover only one aspect — query the missing subtopics (envelopes, waveforms, filter, etc.)

### Step 5: Self-check — STOP and verify before answering

**Before writing your answer, ask yourself these questions honestly:**

1. **Can I explain every register address I'm about to mention?** If you're going to say "write $81 to $D404", do you know what register $D404 is, what each bit does, and why $81? If not — search for it.
2. **Can I explain every line of code I'm about to show?** If an example uses `ASL $D019` and you're not sure why, that's a gap. Query it.
3. **Am I guessing anything?** If ANY part of your answer relies on general knowledge rather than what the knowledge base returned, that's a red flag. Either search for it or explicitly tell the user "the knowledge base doesn't cover X specifically".
4. **Did I find both documentation AND a working example?** If only one type came back and the other would clearly help the user, run one more query targeted at the missing type.

**Hard stops — do NOT answer if:**
- The initial query returned no results with score > 0.35 — tell the user the knowledge base didn't have good matches and suggest alternative search terms they could try
- You cannot confidently explain the core concept the user asked about — say what you did find and what's missing, don't fill the gaps with guesses
- The only results are tangentially related (e.g. user asked about sprite multiplexing but only got generic sprite position docs) — run at least 2 more targeted queries before giving up

**If you hit a hard stop**, tell the user clearly: what you searched for, what came back (or didn't), and suggest specific alternative queries they could try. This is much more useful than a half-accurate answer.

### Step 6: Synthesise and answer

Once you have gathered enough information AND passed the self-check, present a clear, authoritative answer:

1. **Answer the question directly** — lead with the key facts, register values, or technique explanation
2. **Include specific details** — register addresses, bit meanings, timing values, cycle counts. The knowledge base has this level of detail; use it
3. **Show code when relevant** — if example results contain source code that demonstrates the concept, include the relevant portions (not the entire file unless it's short). Annotate key lines if the comments don't already explain them
4. **Note caveats and gotchas** — the knowledge base documents common pitfalls (e.g. "must acknowledge VIC-II interrupt by writing to $D019", "CIA interrupts must be disabled before setting up raster IRQ"). Include these
5. **Mention related topics briefly** — if the results reveal related techniques the user might want to explore, mention them in a sentence (e.g. "For more advanced filter effects, you can also use OSC3 for modulation — see $D41B")

Do NOT:
- Dump raw search output at the user
- Say "according to the search results" — just present the knowledge as facts
- Guess or hallucinate details not found in results — if the knowledge base doesn't cover it, say so
- Pad the answer with generic information you already know — prefer the specific, accurate details from the knowledge base even if you have general knowledge of the topic
