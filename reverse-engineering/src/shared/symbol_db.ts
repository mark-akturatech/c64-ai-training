// ============================================================================
// Symbol Database — known C64 symbols with banking-aware lookups
//
// Complete coverage of C64 address space from "Mapping the Commodore 64":
// - All zero page ($00-$FF) with standard PRG names + fallback
// - All VIC-II, SID, CIA1, CIA2 registers
// - KERNAL jump table + ALL internal routines
// - ALL BASIC ROM routines (commands, math, string, I/O)
// - System area vectors and I/O dispatch ($0200-$03FF)
// - Range-based lookup for color RAM, BASIC/KERNAL ROM gaps
// Banking-aware: only returns ROM/IO symbols when the relevant bank is mapped.
// ============================================================================

import type { SymbolEntry, SymbolDBInterface, BankingSnapshot } from "../types.js";

// ── Address Range definition ──────────────────────────────────────
export interface AddressRange {
  start: number;
  end: number; // inclusive
  baseName: string;
  category: SymbolEntry["category"];
  description: string;
  chip?: string;
}

export interface RangeLookupResult {
  baseName: string;
  baseAddress: number;
  offset: number;
  category: SymbolEntry["category"];
}

// ── KERNAL Jump Table ($FF81-$FFF3) ─────────────────────────────
// These are the official KERNAL API entry points.
// Only valid when KERNAL ROM is mapped (bit 1 of $01 = 1).
const KERNAL_JUMP_TABLE: SymbolEntry[] = [
  { address: 0xFF81, name: "CINT", category: "kernal", description: "Initialize screen editor", chip: "KERNAL" },
  { address: 0xFF84, name: "IOINIT", category: "kernal", description: "Initialize I/O devices", chip: "KERNAL" },
  { address: 0xFF87, name: "RAMTAS", category: "kernal", description: "RAM test and set pointer", chip: "KERNAL" },
  { address: 0xFF8A, name: "RESTOR", category: "kernal", description: "Restore default I/O vectors", chip: "KERNAL" },
  { address: 0xFF8D, name: "VECTOR", category: "kernal", description: "Manage RAM vectors", chip: "KERNAL" },
  { address: 0xFF90, name: "SETMSG", category: "kernal", description: "Set KERNAL message control", chip: "KERNAL" },
  { address: 0xFF93, name: "SECOND", category: "kernal", description: "Send secondary address after LISTEN", chip: "KERNAL" },
  { address: 0xFF96, name: "TKSA", category: "kernal", description: "Send secondary address after TALK", chip: "KERNAL" },
  { address: 0xFF99, name: "MEMTOP", category: "kernal", description: "Set/read top of memory", chip: "KERNAL" },
  { address: 0xFF9C, name: "MEMBOT", category: "kernal", description: "Set/read bottom of memory", chip: "KERNAL" },
  { address: 0xFF9F, name: "SCNKEY", category: "kernal", description: "Scan keyboard", chip: "KERNAL" },
  { address: 0xFFA2, name: "SETTMO", category: "kernal", description: "Set IEEE timeout", chip: "KERNAL" },
  { address: 0xFFA5, name: "ACPTR", category: "kernal", description: "Handshake serial byte in", chip: "KERNAL" },
  { address: 0xFFA8, name: "CIOUT", category: "kernal", description: "Handshake serial byte out", chip: "KERNAL" },
  { address: 0xFFAB, name: "UNTLK", category: "kernal", description: "Command serial bus UNTALK", chip: "KERNAL" },
  { address: 0xFFAE, name: "UNLSN", category: "kernal", description: "Command serial bus UNLISTEN", chip: "KERNAL" },
  { address: 0xFFB1, name: "LISTEN", category: "kernal", description: "Command serial bus LISTEN", chip: "KERNAL" },
  { address: 0xFFB4, name: "TALK", category: "kernal", description: "Command serial bus TALK", chip: "KERNAL" },
  { address: 0xFFB7, name: "READST", category: "kernal", description: "Read I/O status word", chip: "KERNAL" },
  { address: 0xFFBA, name: "SETLFS", category: "kernal", description: "Set logical file parameters", chip: "KERNAL" },
  { address: 0xFFBD, name: "SETNAM", category: "kernal", description: "Set filename", chip: "KERNAL" },
  { address: 0xFFC0, name: "OPEN", category: "kernal", description: "Open logical file", chip: "KERNAL" },
  { address: 0xFFC3, name: "CLOSE", category: "kernal", description: "Close logical file", chip: "KERNAL" },
  { address: 0xFFC6, name: "CHKIN", category: "kernal", description: "Set input channel", chip: "KERNAL" },
  { address: 0xFFC9, name: "CHKOUT", category: "kernal", description: "Set output channel", chip: "KERNAL" },
  { address: 0xFFCC, name: "CLRCHN", category: "kernal", description: "Restore default channels", chip: "KERNAL" },
  { address: 0xFFCF, name: "CHRIN", category: "kernal", description: "Input character from channel", chip: "KERNAL" },
  { address: 0xFFD2, name: "CHROUT", category: "kernal", description: "Output character to channel", chip: "KERNAL" },
  { address: 0xFFD5, name: "LOAD", category: "kernal", description: "Load RAM from device", chip: "KERNAL" },
  { address: 0xFFD8, name: "SAVE", category: "kernal", description: "Save RAM to device", chip: "KERNAL" },
  { address: 0xFFDB, name: "SETTIM", category: "kernal", description: "Set real-time clock", chip: "KERNAL" },
  { address: 0xFFDE, name: "RDTIM", category: "kernal", description: "Read real-time clock", chip: "KERNAL" },
  { address: 0xFFE1, name: "STOP", category: "kernal", description: "Check STOP key", chip: "KERNAL" },
  { address: 0xFFE4, name: "GETIN", category: "kernal", description: "Get character from keyboard buffer", chip: "KERNAL" },
  { address: 0xFFE7, name: "CLALL", category: "kernal", description: "Close all files", chip: "KERNAL" },
  { address: 0xFFEA, name: "UDTIM", category: "kernal", description: "Update real-time clock", chip: "KERNAL" },
  { address: 0xFFED, name: "SCREEN", category: "kernal", description: "Return screen organization", chip: "KERNAL" },
  { address: 0xFFF0, name: "PLOT", category: "kernal", description: "Set/read cursor position", chip: "KERNAL" },
  { address: 0xFFF3, name: "IOBASE", category: "kernal", description: "Return I/O base address", chip: "KERNAL" },
];

// ── KERNAL Internal Routines ($E000-$FF80) ──────────────────────
// Internal implementations and subroutines from "Mapping the Commodore 64".
// K_ prefix used where the name conflicts with the jump table entry.
const KERNAL_INTERNAL: SymbolEntry[] = [
  // Math routines (BASIC math functions living in KERNAL ROM space)
  { address: 0xE043, name: "POLY1", category: "kernal", description: "Polynomial evaluation 1", chip: "KERNAL" },
  { address: 0xE059, name: "POLY2", category: "kernal", description: "Polynomial evaluation 2", chip: "KERNAL" },
  { address: 0xE08D, name: "RMULC", category: "kernal", description: "RND multiplication constant", chip: "KERNAL" },
  { address: 0xE092, name: "RADDC", category: "kernal", description: "RND addition constant", chip: "KERNAL" },
  { address: 0xE097, name: "RND", category: "kernal", description: "BASIC RND function", chip: "KERNAL" },
  // BASIC command handlers (BASIC commands whose code is in KERNAL space)
  { address: 0xE12A, name: "SYS", category: "kernal", description: "BASIC SYS command", chip: "KERNAL" },
  { address: 0xE156, name: "BSAVE", category: "kernal", description: "BASIC SAVE command handler", chip: "KERNAL" },
  { address: 0xE165, name: "BVERIFY", category: "kernal", description: "BASIC VERIFY command handler", chip: "KERNAL" },
  { address: 0xE168, name: "BLOAD", category: "kernal", description: "BASIC LOAD command handler", chip: "KERNAL" },
  { address: 0xE1BE, name: "BOPEN", category: "kernal", description: "BASIC OPEN command handler", chip: "KERNAL" },
  { address: 0xE1C7, name: "BCLOSE", category: "kernal", description: "BASIC CLOSE command handler", chip: "KERNAL" },
  // Trig/math functions
  { address: 0xE264, name: "COS", category: "kernal", description: "BASIC COS function", chip: "KERNAL" },
  { address: 0xE268, name: "SIN", category: "kernal", description: "BASIC SIN function", chip: "KERNAL" },
  { address: 0xE2B4, name: "TAN", category: "kernal", description: "BASIC TAN function", chip: "KERNAL" },
  { address: 0xE2E0, name: "PI2", category: "kernal", description: "Constant: pi/2", chip: "KERNAL" },
  { address: 0xE2E5, name: "TWOPI", category: "kernal", description: "Constant: 2*pi", chip: "KERNAL" },
  { address: 0xE2EA, name: "FR4", category: "kernal", description: "Constant: 1/4", chip: "KERNAL" },
  { address: 0xE2EF, name: "SINCON", category: "kernal", description: "SIN coefficients table", chip: "KERNAL" },
  { address: 0xE30E, name: "ATN", category: "kernal", description: "BASIC ATN function", chip: "KERNAL" },
  { address: 0xE33E, name: "ATNCON", category: "kernal", description: "ATN coefficients table", chip: "KERNAL" },
  // System initialization
  { address: 0xE3A2, name: "INITAT", category: "kernal", description: "Initialize and print BASIC startup", chip: "KERNAL" },
  { address: 0xE3BF, name: "INIT", category: "kernal", description: "System initialization entry", chip: "KERNAL" },
  { address: 0xE460, name: "WORDS", category: "kernal", description: "BASIC startup message text", chip: "KERNAL" },
  // Screen editor (KERNAL implementations of jump table routines)
  { address: 0xE500, name: "K_IOBASE", category: "kernal", description: "IOBASE implementation", chip: "KERNAL" },
  { address: 0xE505, name: "K_SCREEN", category: "kernal", description: "SCREEN implementation", chip: "KERNAL" },
  { address: 0xE50A, name: "K_PLOT", category: "kernal", description: "PLOT implementation", chip: "KERNAL" },
  { address: 0xE544, name: "SCINIT", category: "kernal", description: "Initialize VIC and clear screen", chip: "KERNAL" },
  { address: 0xE566, name: "CLRSCR", category: "kernal", description: "Clear screen (without VIC init)", chip: "KERNAL" },
  { address: 0xE5B4, name: "LP2", category: "kernal", description: "Screen line address calculation", chip: "KERNAL" },
  // IRQ/NMI handlers
  { address: 0xEA31, name: "KERNAL_IRQ", category: "kernal", description: "KERNAL IRQ handler entry", chip: "KERNAL" },
  { address: 0xEA81, name: "KERNAL_IRQ_RET", category: "kernal", description: "KERNAL IRQ return (scan keyboard, update clock)", chip: "KERNAL" },
  { address: 0xEA87, name: "K_SCNKEY", category: "kernal", description: "SCNKEY implementation (scan keyboard matrix)", chip: "KERNAL" },
  // Serial bus routines
  { address: 0xED09, name: "K_TALK", category: "kernal", description: "TALK implementation", chip: "KERNAL" },
  { address: 0xED0C, name: "K_LISTEN", category: "kernal", description: "LISTEN implementation", chip: "KERNAL" },
  { address: 0xEDB9, name: "K_SECOND", category: "kernal", description: "SECOND implementation", chip: "KERNAL" },
  { address: 0xEDC7, name: "K_TKSA", category: "kernal", description: "TKSA implementation", chip: "KERNAL" },
  { address: 0xEDDD, name: "K_CIOUT", category: "kernal", description: "CIOUT implementation", chip: "KERNAL" },
  { address: 0xEDEF, name: "K_UNTLK", category: "kernal", description: "UNTLK implementation", chip: "KERNAL" },
  { address: 0xEDFE, name: "K_UNLSN", category: "kernal", description: "UNLSN implementation", chip: "KERNAL" },
  { address: 0xEE13, name: "K_ACPTR", category: "kernal", description: "ACPTR implementation", chip: "KERNAL" },
  // File I/O implementations
  { address: 0xF13E, name: "K_GETIN", category: "kernal", description: "GETIN implementation", chip: "KERNAL" },
  { address: 0xF157, name: "K_CHRIN", category: "kernal", description: "CHRIN implementation", chip: "KERNAL" },
  { address: 0xF1CA, name: "K_CHROUT", category: "kernal", description: "CHROUT implementation", chip: "KERNAL" },
  { address: 0xF20E, name: "K_CHKIN", category: "kernal", description: "CHKIN implementation", chip: "KERNAL" },
  { address: 0xF250, name: "K_CHKOUT", category: "kernal", description: "CHKOUT implementation", chip: "KERNAL" },
  { address: 0xF291, name: "K_CLOSE", category: "kernal", description: "CLOSE implementation", chip: "KERNAL" },
  { address: 0xF32F, name: "K_CLALL", category: "kernal", description: "CLALL implementation", chip: "KERNAL" },
  { address: 0xF333, name: "K_CLRCHN", category: "kernal", description: "CLRCHN implementation", chip: "KERNAL" },
  { address: 0xF34A, name: "K_OPEN", category: "kernal", description: "OPEN implementation", chip: "KERNAL" },
  { address: 0xF49E, name: "K_LOAD", category: "kernal", description: "LOAD implementation", chip: "KERNAL" },
  { address: 0xF5DD, name: "K_SAVE", category: "kernal", description: "SAVE implementation", chip: "KERNAL" },
  // System timers
  { address: 0xF69B, name: "K_UDTIM", category: "kernal", description: "UDTIM implementation (update jiffy clock)", chip: "KERNAL" },
  { address: 0xF6DD, name: "K_RDTIM", category: "kernal", description: "RDTIM implementation", chip: "KERNAL" },
  { address: 0xF6E4, name: "K_SETTIM", category: "kernal", description: "SETTIM implementation", chip: "KERNAL" },
  { address: 0xF6ED, name: "K_STOP", category: "kernal", description: "STOP implementation (check RUN/STOP key)", chip: "KERNAL" },
  // System reset and initialization
  { address: 0xFCE2, name: "RESET", category: "kernal", description: "System reset routine", chip: "KERNAL" },
  { address: 0xFD15, name: "K_RESTOR", category: "kernal", description: "RESTOR implementation (set default vectors)", chip: "KERNAL" },
  { address: 0xFD1A, name: "K_VECTOR", category: "kernal", description: "VECTOR implementation (manage RAM vectors)", chip: "KERNAL" },
  { address: 0xFD50, name: "K_RAMTAS", category: "kernal", description: "RAMTAS implementation (RAM test)", chip: "KERNAL" },
  { address: 0xFDA3, name: "K_IOINIT", category: "kernal", description: "IOINIT implementation (I/O init)", chip: "KERNAL" },
  { address: 0xFDF9, name: "K_SETNAM", category: "kernal", description: "SETNAM implementation", chip: "KERNAL" },
  { address: 0xFE00, name: "K_SETLFS", category: "kernal", description: "SETLFS implementation", chip: "KERNAL" },
  { address: 0xFE07, name: "K_READST", category: "kernal", description: "READST implementation", chip: "KERNAL" },
  { address: 0xFE18, name: "K_SETMSG", category: "kernal", description: "SETMSG implementation", chip: "KERNAL" },
  { address: 0xFE25, name: "K_MEMTOP", category: "kernal", description: "MEMTOP implementation", chip: "KERNAL" },
  { address: 0xFE34, name: "K_MEMBOT", category: "kernal", description: "MEMBOT implementation", chip: "KERNAL" },
  { address: 0xFE43, name: "NMI_ENTRY", category: "kernal", description: "NMI entry point", chip: "KERNAL" },
  { address: 0xFE66, name: "KERNAL_NMI", category: "kernal", description: "KERNAL NMI handler", chip: "KERNAL" },
  { address: 0xFF5B, name: "K_CINT", category: "kernal", description: "CINT implementation (screen editor init)", chip: "KERNAL" },
];

// ── BASIC ROM Entry Points ($A000-$BFFF) ────────────────────────
// All routines from "Mapping the Commodore 64".
// Only valid when BASIC ROM is mapped (bit 0 of $01 = 1).
const BASIC_ENTRIES: SymbolEntry[] = [
  // BASIC startup and tables
  { address: 0xA000, name: "BASIC_COLD", category: "basic", description: "BASIC cold start entry", chip: "BASIC" },
  { address: 0xA002, name: "BASIC_WARM", category: "basic", description: "BASIC warm start entry", chip: "BASIC" },
  { address: 0xA00C, name: "STMDSP", category: "basic", description: "BASIC statement dispatch table", chip: "BASIC" },
  { address: 0xA052, name: "FUNDSP", category: "basic", description: "BASIC function dispatch table", chip: "BASIC" },
  { address: 0xA080, name: "OPTAB", category: "basic", description: "BASIC operator dispatch table", chip: "BASIC" },
  { address: 0xA09E, name: "RESLST", category: "basic", description: "BASIC reserved word list", chip: "BASIC" },
  { address: 0xA19E, name: "ERRTAB", category: "basic", description: "BASIC error message table", chip: "BASIC" },
  // Stack and memory management
  { address: 0xA38A, name: "FNDFOR", category: "basic", description: "Find FOR on stack", chip: "BASIC" },
  { address: 0xA3B8, name: "BLTU", category: "basic", description: "Move memory block up", chip: "BASIC" },
  { address: 0xA3FB, name: "GETSTK", category: "basic", description: "Check stack depth", chip: "BASIC" },
  { address: 0xA408, name: "REASON", category: "basic", description: "Check memory overlap", chip: "BASIC" },
  { address: 0xA435, name: "OMERR", category: "basic", description: "Out of memory error", chip: "BASIC" },
  { address: 0xA437, name: "ERROR", category: "basic", description: "BASIC error handler", chip: "BASIC" },
  { address: 0xA474, name: "READY", category: "basic", description: "Print READY prompt", chip: "BASIC" },
  { address: 0xA480, name: "MAIN", category: "basic", description: "BASIC main input loop", chip: "BASIC" },
  { address: 0xA49C, name: "MAIN1", category: "basic", description: "BASIC main loop (crunch+execute)", chip: "BASIC" },
  { address: 0xA533, name: "LINKPRG", category: "basic", description: "Relink BASIC program lines", chip: "BASIC" },
  { address: 0xA560, name: "INLIN", category: "basic", description: "Input a line to buffer", chip: "BASIC" },
  { address: 0xA579, name: "CRUNCH", category: "basic", description: "Tokenize BASIC text", chip: "BASIC" },
  { address: 0xA613, name: "FINDLN", category: "basic", description: "Find BASIC line by number", chip: "BASIC" },
  // BASIC commands
  { address: 0xA642, name: "SCRTCH", category: "basic", description: "BASIC NEW command", chip: "BASIC" },
  { address: 0xA65E, name: "CLEAR", category: "basic", description: "BASIC CLR command", chip: "BASIC" },
  { address: 0xA68E, name: "RUNC", category: "basic", description: "Reset BASIC text pointer for RUN", chip: "BASIC" },
  { address: 0xA69C, name: "LIST", category: "basic", description: "BASIC LIST command", chip: "BASIC" },
  { address: 0xA717, name: "QPLOP", category: "basic", description: "List BASIC token to screen", chip: "BASIC" },
  { address: 0xA742, name: "FOR", category: "basic", description: "BASIC FOR command", chip: "BASIC" },
  { address: 0xA7AE, name: "NEWSTT", category: "basic", description: "Execute next BASIC statement", chip: "BASIC" },
  { address: 0xA7E4, name: "GONE", category: "basic", description: "Execute BASIC token", chip: "BASIC" },
  { address: 0xA81D, name: "BRESTOR", category: "basic", description: "BASIC RESTORE command", chip: "BASIC" },
  { address: 0xA831, name: "BEND", category: "basic", description: "BASIC END command", chip: "BASIC" },
  { address: 0xA857, name: "CONT", category: "basic", description: "BASIC CONT command", chip: "BASIC" },
  { address: 0xA871, name: "RUN", category: "basic", description: "BASIC RUN command", chip: "BASIC" },
  { address: 0xA883, name: "GOSUB", category: "basic", description: "BASIC GOSUB command", chip: "BASIC" },
  { address: 0xA8A0, name: "GOTO", category: "basic", description: "BASIC GOTO command", chip: "BASIC" },
  { address: 0xA8D2, name: "RETURN", category: "basic", description: "BASIC RETURN command", chip: "BASIC" },
  { address: 0xA8F8, name: "DATA", category: "basic", description: "BASIC DATA command", chip: "BASIC" },
  { address: 0xA906, name: "DATAN", category: "basic", description: "Scan to next DATA statement", chip: "BASIC" },
  { address: 0xA928, name: "IF", category: "basic", description: "BASIC IF command", chip: "BASIC" },
  { address: 0xA93B, name: "REM", category: "basic", description: "BASIC REM command", chip: "BASIC" },
  { address: 0xA94B, name: "ONGOTO", category: "basic", description: "BASIC ON..GOTO/GOSUB command", chip: "BASIC" },
  { address: 0xA96B, name: "LINGET", category: "basic", description: "Get line number from text", chip: "BASIC" },
  { address: 0xA9A5, name: "LET", category: "basic", description: "BASIC LET command (variable assignment)", chip: "BASIC" },
  { address: 0xAA80, name: "PRINTN", category: "basic", description: "BASIC PRINT# command", chip: "BASIC" },
  { address: 0xAA86, name: "CMD", category: "basic", description: "BASIC CMD command", chip: "BASIC" },
  { address: 0xAAA0, name: "PRINT", category: "basic", description: "BASIC PRINT command", chip: "BASIC" },
  { address: 0xAB1E, name: "STROUT", category: "basic", description: "Print string from pointer", chip: "BASIC" },
  { address: 0xAB4D, name: "DOAGIN", category: "basic", description: "Retry input after error", chip: "BASIC" },
  { address: 0xAB7B, name: "GET", category: "basic", description: "BASIC GET command", chip: "BASIC" },
  { address: 0xABA5, name: "INPUTN", category: "basic", description: "BASIC INPUT# command", chip: "BASIC" },
  { address: 0xABBF, name: "INPUT", category: "basic", description: "BASIC INPUT command", chip: "BASIC" },
  { address: 0xAC06, name: "READ", category: "basic", description: "BASIC READ command", chip: "BASIC" },
  { address: 0xACFC, name: "EXIGNT", category: "basic", description: "Exit INPUT/GET/READ", chip: "BASIC" },
  { address: 0xAD1E, name: "NEXT", category: "basic", description: "BASIC NEXT command", chip: "BASIC" },
  // Expression evaluation
  { address: 0xAD8A, name: "FRMNUM", category: "basic", description: "Evaluate numeric expression", chip: "BASIC" },
  { address: 0xAD9E, name: "FRMEVAL", category: "basic", description: "Evaluate expression", chip: "BASIC" },
  { address: 0xAE83, name: "EVAL", category: "basic", description: "Evaluate single term", chip: "BASIC" },
  { address: 0xAEA8, name: "PIVAL", category: "basic", description: "Constant: pi", chip: "BASIC" },
  { address: 0xAEF1, name: "PARCHK", category: "basic", description: "Check for parentheses", chip: "BASIC" },
  { address: 0xAEF7, name: "CHKCLS", category: "basic", description: "Check for closing paren", chip: "BASIC" },
  { address: 0xAEFA, name: "CHKOPN", category: "basic", description: "Check for opening paren", chip: "BASIC" },
  { address: 0xAEFF, name: "CHKCOM", category: "basic", description: "Check for comma", chip: "BASIC" },
  { address: 0xAF08, name: "SNERR", category: "basic", description: "Syntax error", chip: "BASIC" },
  { address: 0xAF2B, name: "ISVAR", category: "basic", description: "Evaluate variable reference", chip: "BASIC" },
  { address: 0xAFA7, name: "ISFUN", category: "basic", description: "Evaluate function call", chip: "BASIC" },
  // Operators
  { address: 0xAFE6, name: "OROP", category: "basic", description: "BASIC OR operator", chip: "BASIC" },
  { address: 0xAFE9, name: "ANDOP", category: "basic", description: "BASIC AND operator", chip: "BASIC" },
  { address: 0xB016, name: "DORE1", category: "basic", description: "Comparison operator evaluation", chip: "BASIC" },
  // Variables and arrays
  { address: 0xB08B, name: "PTRGET", category: "basic", description: "Get pointer to variable", chip: "BASIC" },
  { address: 0xB11D, name: "NOTFNS", category: "basic", description: "Create new variable", chip: "BASIC" },
  { address: 0xB185, name: "FINPTR", category: "basic", description: "Find pointer to variable", chip: "BASIC" },
  { address: 0xB194, name: "ARYGET", category: "basic", description: "Get array element", chip: "BASIC" },
  { address: 0xB1A5, name: "N32768", category: "basic", description: "Constant: -32768 (integer min)", chip: "BASIC" },
  { address: 0xB1B2, name: "INTIDX", category: "basic", description: "Convert FAC to integer index", chip: "BASIC" },
  { address: 0xB1BF, name: "AYINT", category: "basic", description: "Convert FAC to integer in A/Y", chip: "BASIC" },
  { address: 0xB1D1, name: "ISARY", category: "basic", description: "Find or create array", chip: "BASIC" },
  { address: 0xB245, name: "BSERR", category: "basic", description: "Bad subscript error", chip: "BASIC" },
  { address: 0xB248, name: "FCERR", category: "basic", description: "Illegal quantity error", chip: "BASIC" },
  { address: 0xB34C, name: "UMULT", category: "basic", description: "Unsigned integer multiply", chip: "BASIC" },
  // BASIC functions
  { address: 0xB37D, name: "FRE", category: "basic", description: "BASIC FRE function", chip: "BASIC" },
  { address: 0xB391, name: "GIVAYF", category: "basic", description: "Convert integer to float in FAC", chip: "BASIC" },
  { address: 0xB39E, name: "POS", category: "basic", description: "BASIC POS function", chip: "BASIC" },
  { address: 0xB3A6, name: "ERRDIR", category: "basic", description: "Check for direct mode (error if so)", chip: "BASIC" },
  { address: 0xB3B3, name: "DEF", category: "basic", description: "BASIC DEF FN command", chip: "BASIC" },
  { address: 0xB3E1, name: "GETFNM", category: "basic", description: "Get FN name", chip: "BASIC" },
  { address: 0xB3F4, name: "FNDOER", category: "basic", description: "Evaluate FN expression", chip: "BASIC" },
  // String functions
  { address: 0xB465, name: "STRD", category: "basic", description: "BASIC STR$ function", chip: "BASIC" },
  { address: 0xB487, name: "STRLIT", category: "basic", description: "Scan and set up string", chip: "BASIC" },
  { address: 0xB4F4, name: "GETSPA", category: "basic", description: "Allocate space for string", chip: "BASIC" },
  { address: 0xB526, name: "GARBAG", category: "basic", description: "Garbage collection", chip: "BASIC" },
  { address: 0xB63D, name: "CAT", category: "basic", description: "String concatenation", chip: "BASIC" },
  { address: 0xB67A, name: "MOVINS", category: "basic", description: "Move string to reserved area", chip: "BASIC" },
  { address: 0xB6A3, name: "FRESTR", category: "basic", description: "Free temporary string", chip: "BASIC" },
  { address: 0xB6DB, name: "FRETMS", category: "basic", description: "Free temporary string (if temp)", chip: "BASIC" },
  { address: 0xB6EC, name: "CHRD", category: "basic", description: "BASIC CHR$ function", chip: "BASIC" },
  { address: 0xB700, name: "LEFTD", category: "basic", description: "BASIC LEFT$ function", chip: "BASIC" },
  { address: 0xB72C, name: "RIGHTD", category: "basic", description: "BASIC RIGHT$ function", chip: "BASIC" },
  { address: 0xB737, name: "MIDD", category: "basic", description: "BASIC MID$ function", chip: "BASIC" },
  { address: 0xB761, name: "PREAM", category: "basic", description: "String function parameter setup", chip: "BASIC" },
  { address: 0xB77C, name: "LEN", category: "basic", description: "BASIC LEN function", chip: "BASIC" },
  { address: 0xB78B, name: "ASC", category: "basic", description: "BASIC ASC function", chip: "BASIC" },
  { address: 0xB79B, name: "GETBYTC", category: "basic", description: "Get byte parameter and check comma", chip: "BASIC" },
  { address: 0xB7AD, name: "VAL", category: "basic", description: "BASIC VAL function", chip: "BASIC" },
  // Number conversion and I/O
  { address: 0xB7EB, name: "GETNUM", category: "basic", description: "Get parameters for POKE/WAIT", chip: "BASIC" },
  { address: 0xB7F7, name: "GETADR", category: "basic", description: "Convert FAC to address in LINNUM", chip: "BASIC" },
  { address: 0xB80D, name: "PEEK", category: "basic", description: "BASIC PEEK function", chip: "BASIC" },
  { address: 0xB824, name: "POKE", category: "basic", description: "BASIC POKE command", chip: "BASIC" },
  { address: 0xB82D, name: "FUWAIT", category: "basic", description: "BASIC WAIT command", chip: "BASIC" },
  // Floating point math
  { address: 0xB849, name: "FADDH", category: "basic", description: "Add 0.5 to FAC", chip: "BASIC" },
  { address: 0xB850, name: "FSUB", category: "basic", description: "Floating point subtract (memory - FAC)", chip: "BASIC" },
  { address: 0xB853, name: "FSUBT", category: "basic", description: "Floating point subtract (ARG - FAC)", chip: "BASIC" },
  { address: 0xB867, name: "FADD", category: "basic", description: "Floating point add (memory + FAC)", chip: "BASIC" },
  { address: 0xB86A, name: "FADDT", category: "basic", description: "Floating point add (ARG + FAC)", chip: "BASIC" },
  { address: 0xB8A7, name: "FADD4", category: "basic", description: "Floating point add (low-order byte)", chip: "BASIC" },
  { address: 0xB8FE, name: "NORMAL", category: "basic", description: "Normalize FAC", chip: "BASIC" },
  { address: 0xB947, name: "NEGFAC", category: "basic", description: "Negate FAC", chip: "BASIC" },
  { address: 0xB97E, name: "OVERR", category: "basic", description: "Overflow error", chip: "BASIC" },
  { address: 0xB983, name: "MULSHF", category: "basic", description: "Multiply shift subroutine", chip: "BASIC" },
  { address: 0xB9BC, name: "FONE", category: "basic", description: "Constant: 1.0", chip: "BASIC" },
  { address: 0xB9C1, name: "LOGCN2", category: "basic", description: "LOG coefficients table", chip: "BASIC" },
  { address: 0xB9EA, name: "LOG", category: "basic", description: "BASIC LOG function", chip: "BASIC" },
  { address: 0xBA28, name: "FMULT", category: "basic", description: "Floating point multiply (memory * FAC)", chip: "BASIC" },
  { address: 0xBA59, name: "MLTPLY", category: "basic", description: "Floating point multiply subroutine", chip: "BASIC" },
  { address: 0xBA8C, name: "CONUPK", category: "basic", description: "Unpack memory to ARG", chip: "BASIC" },
  { address: 0xBAB7, name: "MULDIV", category: "basic", description: "Test sign for multiply/divide", chip: "BASIC" },
  { address: 0xBAD4, name: "MLDVEX", category: "basic", description: "Multiply/divide exit", chip: "BASIC" },
  { address: 0xBAE2, name: "MUL10", category: "basic", description: "Multiply FAC by 10", chip: "BASIC" },
  { address: 0xBAF9, name: "TENC", category: "basic", description: "Constant: 10.0", chip: "BASIC" },
  { address: 0xBAFE, name: "DIV10", category: "basic", description: "Divide FAC by 10", chip: "BASIC" },
  { address: 0xBB0F, name: "FDIV", category: "basic", description: "Floating point divide (memory / FAC)", chip: "BASIC" },
  { address: 0xBB12, name: "FDIVT", category: "basic", description: "Floating point divide (ARG / FAC)", chip: "BASIC" },
  // FAC/ARG move operations
  { address: 0xBBA2, name: "MOVFM", category: "basic", description: "Move memory to FAC", chip: "BASIC" },
  { address: 0xBBC7, name: "MOV2F", category: "basic", description: "Move FAC to memory (A/Y pointer)", chip: "BASIC" },
  { address: 0xBBFC, name: "MOVFA", category: "basic", description: "Move ARG to FAC", chip: "BASIC" },
  { address: 0xBC0C, name: "MOVAF", category: "basic", description: "Move FAC to ARG", chip: "BASIC" },
  { address: 0xBC0F, name: "MOVEF", category: "basic", description: "Move FAC to ARG (round)", chip: "BASIC" },
  { address: 0xBC1B, name: "ROUND", category: "basic", description: "Round FAC", chip: "BASIC" },
  { address: 0xBC2B, name: "SIGN", category: "basic", description: "Get sign of FAC", chip: "BASIC" },
  { address: 0xBC39, name: "SGN", category: "basic", description: "BASIC SGN function", chip: "BASIC" },
  { address: 0xBC58, name: "ABS", category: "basic", description: "BASIC ABS function", chip: "BASIC" },
  { address: 0xBC5B, name: "FCOMP", category: "basic", description: "Compare FAC with memory", chip: "BASIC" },
  { address: 0xBC9B, name: "QINT", category: "basic", description: "Convert FAC to 4-byte integer", chip: "BASIC" },
  { address: 0xBCCC, name: "INT", category: "basic", description: "BASIC INT function", chip: "BASIC" },
  // Number I/O
  { address: 0xBCF3, name: "FIN", category: "basic", description: "Convert ASCII string to FAC", chip: "BASIC" },
  { address: 0xBD7E, name: "FINLOG", category: "basic", description: "Add A to FAC as new digit", chip: "BASIC" },
  { address: 0xBDB3, name: "NO999", category: "basic", description: "Limit check for number input", chip: "BASIC" },
  { address: 0xBDC0, name: "INPRT", category: "basic", description: "Print 'IN' and line number", chip: "BASIC" },
  { address: 0xBDCD, name: "LINPRT", category: "basic", description: "Print integer from A/X", chip: "BASIC" },
  { address: 0xBDDD, name: "FOUT", category: "basic", description: "Convert FAC to ASCII string", chip: "BASIC" },
  { address: 0xBF11, name: "FHALF", category: "basic", description: "Constant: 0.5", chip: "BASIC" },
  { address: 0xBF1C, name: "FOUTBL", category: "basic", description: "Output digits table", chip: "BASIC" },
  { address: 0xBF3A, name: "FDCEND", category: "basic", description: "End of number output", chip: "BASIC" },
  // Power and exponent
  { address: 0xBF71, name: "SQR", category: "basic", description: "BASIC SQR function", chip: "BASIC" },
  { address: 0xBF7B, name: "FPWRT", category: "basic", description: "BASIC power (^) operator", chip: "BASIC" },
  { address: 0xBFB4, name: "NEGOP", category: "basic", description: "Negate FAC (unary minus)", chip: "BASIC" },
  { address: 0xBFBF, name: "EXPCON", category: "basic", description: "EXP coefficients table", chip: "BASIC" },
  { address: 0xBFED, name: "EXP", category: "basic", description: "BASIC EXP function", chip: "BASIC" },
  // DIM (extracted from ranges)
  { address: 0xB08B, name: "DIM", category: "basic", description: "BASIC DIM command", chip: "BASIC" },
];

// ── Hardware Registers ──────────────────────────────────────────
// These are only valid when I/O is mapped (bit 2 of $01 = 1)
const HARDWARE_REGISTERS: SymbolEntry[] = [
  // VIC-II ($D000-$D02E) — complete register set
  { address: 0xD000, name: "SP0X", category: "hardware", description: "Sprite 0 X position", chip: "VIC-II" },
  { address: 0xD001, name: "SP0Y", category: "hardware", description: "Sprite 0 Y position", chip: "VIC-II" },
  { address: 0xD002, name: "SP1X", category: "hardware", description: "Sprite 1 X position", chip: "VIC-II" },
  { address: 0xD003, name: "SP1Y", category: "hardware", description: "Sprite 1 Y position", chip: "VIC-II" },
  { address: 0xD004, name: "SP2X", category: "hardware", description: "Sprite 2 X position", chip: "VIC-II" },
  { address: 0xD005, name: "SP2Y", category: "hardware", description: "Sprite 2 Y position", chip: "VIC-II" },
  { address: 0xD006, name: "SP3X", category: "hardware", description: "Sprite 3 X position", chip: "VIC-II" },
  { address: 0xD007, name: "SP3Y", category: "hardware", description: "Sprite 3 Y position", chip: "VIC-II" },
  { address: 0xD008, name: "SP4X", category: "hardware", description: "Sprite 4 X position", chip: "VIC-II" },
  { address: 0xD009, name: "SP4Y", category: "hardware", description: "Sprite 4 Y position", chip: "VIC-II" },
  { address: 0xD00A, name: "SP5X", category: "hardware", description: "Sprite 5 X position", chip: "VIC-II" },
  { address: 0xD00B, name: "SP5Y", category: "hardware", description: "Sprite 5 Y position", chip: "VIC-II" },
  { address: 0xD00C, name: "SP6X", category: "hardware", description: "Sprite 6 X position", chip: "VIC-II" },
  { address: 0xD00D, name: "SP6Y", category: "hardware", description: "Sprite 6 Y position", chip: "VIC-II" },
  { address: 0xD00E, name: "SP7X", category: "hardware", description: "Sprite 7 X position", chip: "VIC-II" },
  { address: 0xD00F, name: "SP7Y", category: "hardware", description: "Sprite 7 Y position", chip: "VIC-II" },
  { address: 0xD010, name: "MSIGX", category: "hardware", description: "Sprites 0-7 X MSB", chip: "VIC-II" },
  { address: 0xD011, name: "SCROLY", category: "hardware", description: "VIC control register (Y scroll, screen height, bitmap mode, extended color, raster bit 8)", chip: "VIC-II" },
  { address: 0xD012, name: "RASTER", category: "hardware", description: "Raster counter", chip: "VIC-II" },
  { address: 0xD013, name: "LPENX", category: "hardware", description: "Light pen X position", chip: "VIC-II" },
  { address: 0xD014, name: "LPENY", category: "hardware", description: "Light pen Y position", chip: "VIC-II" },
  { address: 0xD015, name: "SPENA", category: "hardware", description: "Sprite enable register", chip: "VIC-II" },
  { address: 0xD016, name: "SCROLX", category: "hardware", description: "VIC control register (X scroll, screen width, multicolor)", chip: "VIC-II" },
  { address: 0xD017, name: "YXPAND", category: "hardware", description: "Sprite Y expand", chip: "VIC-II" },
  { address: 0xD018, name: "VMCSB", category: "hardware", description: "VIC memory control (screen/charset base)", chip: "VIC-II" },
  { address: 0xD019, name: "VICIRQ", category: "hardware", description: "VIC interrupt register", chip: "VIC-II" },
  { address: 0xD01A, name: "IRQMSK", category: "hardware", description: "VIC IRQ mask register", chip: "VIC-II" },
  { address: 0xD01B, name: "SPBGPR", category: "hardware", description: "Sprite-background priority", chip: "VIC-II" },
  { address: 0xD01C, name: "SPMC", category: "hardware", description: "Sprite multicolor mode", chip: "VIC-II" },
  { address: 0xD01D, name: "XXPAND", category: "hardware", description: "Sprite X expand", chip: "VIC-II" },
  { address: 0xD01E, name: "SPSPCL", category: "hardware", description: "Sprite-sprite collision (read-only, cleared on read)", chip: "VIC-II" },
  { address: 0xD01F, name: "SPBGCL", category: "hardware", description: "Sprite-background collision (read-only, cleared on read)", chip: "VIC-II" },
  { address: 0xD020, name: "EXTCOL", category: "hardware", description: "Border color", chip: "VIC-II" },
  { address: 0xD021, name: "BGCOL0", category: "hardware", description: "Background color 0", chip: "VIC-II" },
  { address: 0xD022, name: "BGCOL1", category: "hardware", description: "Background color 1", chip: "VIC-II" },
  { address: 0xD023, name: "BGCOL2", category: "hardware", description: "Background color 2", chip: "VIC-II" },
  { address: 0xD024, name: "BGCOL3", category: "hardware", description: "Background color 3", chip: "VIC-II" },
  { address: 0xD025, name: "SPMC0", category: "hardware", description: "Sprite multicolor 0", chip: "VIC-II" },
  { address: 0xD026, name: "SPMC1", category: "hardware", description: "Sprite multicolor 1", chip: "VIC-II" },
  { address: 0xD027, name: "SP0COL", category: "hardware", description: "Sprite 0 color", chip: "VIC-II" },
  { address: 0xD028, name: "SP1COL", category: "hardware", description: "Sprite 1 color", chip: "VIC-II" },
  { address: 0xD029, name: "SP2COL", category: "hardware", description: "Sprite 2 color", chip: "VIC-II" },
  { address: 0xD02A, name: "SP3COL", category: "hardware", description: "Sprite 3 color", chip: "VIC-II" },
  { address: 0xD02B, name: "SP4COL", category: "hardware", description: "Sprite 4 color", chip: "VIC-II" },
  { address: 0xD02C, name: "SP5COL", category: "hardware", description: "Sprite 5 color", chip: "VIC-II" },
  { address: 0xD02D, name: "SP6COL", category: "hardware", description: "Sprite 6 color", chip: "VIC-II" },
  { address: 0xD02E, name: "SP7COL", category: "hardware", description: "Sprite 7 color", chip: "VIC-II" },

  // SID ($D400-$D41C) — complete register set
  { address: 0xD400, name: "FRELO1", category: "hardware", description: "Voice 1 frequency low", chip: "SID" },
  { address: 0xD401, name: "FREHI1", category: "hardware", description: "Voice 1 frequency high", chip: "SID" },
  { address: 0xD402, name: "PWLO1", category: "hardware", description: "Voice 1 pulse width low", chip: "SID" },
  { address: 0xD403, name: "PWHI1", category: "hardware", description: "Voice 1 pulse width high", chip: "SID" },
  { address: 0xD404, name: "VCREG1", category: "hardware", description: "Voice 1 control register", chip: "SID" },
  { address: 0xD405, name: "ATDCY1", category: "hardware", description: "Voice 1 attack/decay", chip: "SID" },
  { address: 0xD406, name: "SUREL1", category: "hardware", description: "Voice 1 sustain/release", chip: "SID" },
  { address: 0xD407, name: "FRELO2", category: "hardware", description: "Voice 2 frequency low", chip: "SID" },
  { address: 0xD408, name: "FREHI2", category: "hardware", description: "Voice 2 frequency high", chip: "SID" },
  { address: 0xD409, name: "PWLO2", category: "hardware", description: "Voice 2 pulse width low", chip: "SID" },
  { address: 0xD40A, name: "PWHI2", category: "hardware", description: "Voice 2 pulse width high", chip: "SID" },
  { address: 0xD40B, name: "VCREG2", category: "hardware", description: "Voice 2 control register", chip: "SID" },
  { address: 0xD40C, name: "ATDCY2", category: "hardware", description: "Voice 2 attack/decay", chip: "SID" },
  { address: 0xD40D, name: "SUREL2", category: "hardware", description: "Voice 2 sustain/release", chip: "SID" },
  { address: 0xD40E, name: "FRELO3", category: "hardware", description: "Voice 3 frequency low", chip: "SID" },
  { address: 0xD40F, name: "FREHI3", category: "hardware", description: "Voice 3 frequency high", chip: "SID" },
  { address: 0xD410, name: "PWLO3", category: "hardware", description: "Voice 3 pulse width low", chip: "SID" },
  { address: 0xD411, name: "PWHI3", category: "hardware", description: "Voice 3 pulse width high", chip: "SID" },
  { address: 0xD412, name: "VCREG3", category: "hardware", description: "Voice 3 control register", chip: "SID" },
  { address: 0xD413, name: "ATDCY3", category: "hardware", description: "Voice 3 attack/decay", chip: "SID" },
  { address: 0xD414, name: "SUREL3", category: "hardware", description: "Voice 3 sustain/release", chip: "SID" },
  { address: 0xD415, name: "CUTLO", category: "hardware", description: "Filter cutoff low (bits 0-2)", chip: "SID" },
  { address: 0xD416, name: "CUTHI", category: "hardware", description: "Filter cutoff high", chip: "SID" },
  { address: 0xD417, name: "RESON", category: "hardware", description: "Filter resonance/routing", chip: "SID" },
  { address: 0xD418, name: "SIGVOL", category: "hardware", description: "Filter mode/volume", chip: "SID" },
  { address: 0xD419, name: "POTX", category: "hardware", description: "Paddle X value (read-only)", chip: "SID" },
  { address: 0xD41A, name: "POTY", category: "hardware", description: "Paddle Y value (read-only)", chip: "SID" },
  { address: 0xD41B, name: "RANDOM", category: "hardware", description: "Voice 3 oscillator output (read-only, random)", chip: "SID" },
  { address: 0xD41C, name: "ENV3", category: "hardware", description: "Voice 3 envelope output (read-only)", chip: "SID" },

  // CIA1 ($DC00-$DC0F) — complete register set
  { address: 0xDC00, name: "CIAPRA", category: "hardware", description: "CIA1 port A (keyboard columns, joystick 2)", chip: "CIA1" },
  { address: 0xDC01, name: "CIAPRB", category: "hardware", description: "CIA1 port B (keyboard rows, joystick 1)", chip: "CIA1" },
  { address: 0xDC02, name: "CIDDRA", category: "hardware", description: "CIA1 port A data direction", chip: "CIA1" },
  { address: 0xDC03, name: "CIDDRB", category: "hardware", description: "CIA1 port B data direction", chip: "CIA1" },
  { address: 0xDC04, name: "TIMALO", category: "hardware", description: "CIA1 timer A low", chip: "CIA1" },
  { address: 0xDC05, name: "TIMAHI", category: "hardware", description: "CIA1 timer A high", chip: "CIA1" },
  { address: 0xDC06, name: "TIMBLO", category: "hardware", description: "CIA1 timer B low", chip: "CIA1" },
  { address: 0xDC07, name: "TIMBHI", category: "hardware", description: "CIA1 timer B high", chip: "CIA1" },
  { address: 0xDC08, name: "TODTEN", category: "hardware", description: "CIA1 time-of-day 10ths seconds", chip: "CIA1" },
  { address: 0xDC09, name: "TODSEC", category: "hardware", description: "CIA1 time-of-day seconds", chip: "CIA1" },
  { address: 0xDC0A, name: "TODMIN", category: "hardware", description: "CIA1 time-of-day minutes", chip: "CIA1" },
  { address: 0xDC0B, name: "TODHRS", category: "hardware", description: "CIA1 time-of-day hours", chip: "CIA1" },
  { address: 0xDC0C, name: "CIASDR", category: "hardware", description: "CIA1 serial data register", chip: "CIA1" },
  { address: 0xDC0D, name: "CIAICR", category: "hardware", description: "CIA1 interrupt control register", chip: "CIA1" },
  { address: 0xDC0E, name: "CIACRA", category: "hardware", description: "CIA1 control register A", chip: "CIA1" },
  { address: 0xDC0F, name: "CIACRB", category: "hardware", description: "CIA1 control register B", chip: "CIA1" },

  // CIA2 ($DD00-$DD0F) — complete register set
  { address: 0xDD00, name: "CI2PRA", category: "hardware", description: "CIA2 port A (VIC bank select, serial bus)", chip: "CIA2" },
  { address: 0xDD01, name: "CI2PRB", category: "hardware", description: "CIA2 port B (user port)", chip: "CIA2" },
  { address: 0xDD02, name: "C2DDRA", category: "hardware", description: "CIA2 port A data direction", chip: "CIA2" },
  { address: 0xDD03, name: "C2DDRB", category: "hardware", description: "CIA2 port B data direction", chip: "CIA2" },
  { address: 0xDD04, name: "TI2ALO", category: "hardware", description: "CIA2 timer A low", chip: "CIA2" },
  { address: 0xDD05, name: "TI2AHI", category: "hardware", description: "CIA2 timer A high", chip: "CIA2" },
  { address: 0xDD06, name: "TI2BLO", category: "hardware", description: "CIA2 timer B low", chip: "CIA2" },
  { address: 0xDD07, name: "TI2BHI", category: "hardware", description: "CIA2 timer B high", chip: "CIA2" },
  { address: 0xDD08, name: "TO2TEN", category: "hardware", description: "CIA2 time-of-day 10ths seconds", chip: "CIA2" },
  { address: 0xDD09, name: "TO2SEC", category: "hardware", description: "CIA2 time-of-day seconds", chip: "CIA2" },
  { address: 0xDD0A, name: "TO2MIN", category: "hardware", description: "CIA2 time-of-day minutes", chip: "CIA2" },
  { address: 0xDD0B, name: "TO2HRS", category: "hardware", description: "CIA2 time-of-day hours", chip: "CIA2" },
  { address: 0xDD0C, name: "CI2SDR", category: "hardware", description: "CIA2 serial data register", chip: "CIA2" },
  { address: 0xDD0D, name: "CI2ICR", category: "hardware", description: "CIA2 interrupt control register", chip: "CIA2" },
  { address: 0xDD0E, name: "CI2CRA", category: "hardware", description: "CIA2 control register A", chip: "CIA2" },
  { address: 0xDD0F, name: "CI2CRB", category: "hardware", description: "CIA2 control register B", chip: "CIA2" },
];

// ── Zero Page System Locations ($00-$FF) ──────────────────────────
// Standard names from "Mapping the Commodore 64".
// Addresses not listed here get fallback ZP_XX names from lookup().
const ZERO_PAGE_SYSTEM: SymbolEntry[] = [
  // CPU port
  { address: 0x00, name: "D6510", category: "zeropage", description: "6510 data direction register" },
  { address: 0x01, name: "R6510", category: "zeropage", description: "6510 CPU port (banking control)" },
  { address: 0x02, name: "ZP_02", category: "zeropage", description: "Unused (free for programs)" },
  // BASIC conversion pointers
  { address: 0x03, name: "ADRAY1", category: "zeropage", description: "Float→integer conversion pointer (lo)" },
  { address: 0x04, name: "ADRAY1_HI", category: "zeropage", description: "Float→integer conversion pointer (hi)" },
  { address: 0x05, name: "ADRAY2", category: "zeropage", description: "Integer→float conversion pointer (lo)" },
  { address: 0x06, name: "ADRAY2_HI", category: "zeropage", description: "Integer→float conversion pointer (hi)" },
  // BASIC work area
  { address: 0x07, name: "CHARONE", category: "zeropage", description: "Search character / flag byte" },
  { address: 0x08, name: "ENDCHR", category: "zeropage", description: "Flag: scan for quote at end of string" },
  { address: 0x09, name: "TRMPOS", category: "zeropage", description: "Screen column from last TAB" },
  { address: 0x0A, name: "VERCK", category: "zeropage", description: "Flag: 0=LOAD, 1=VERIFY" },
  { address: 0x0B, name: "COUNT", category: "zeropage", description: "Input buffer pointer / subscript count" },
  { address: 0x0C, name: "DIMFLG", category: "zeropage", description: "Flag: default array DIM" },
  { address: 0x0D, name: "VALTYP", category: "zeropage", description: "Data type: 0=numeric, $FF=string" },
  { address: 0x0E, name: "INTFLG", category: "zeropage", description: "Data type: 0=float, $80=integer" },
  { address: 0x0F, name: "GTEFLAG", category: "zeropage", description: "Flag: DATA scan, LIST quote, memory" },
  { address: 0x10, name: "SUBFLG", category: "zeropage", description: "Flag: subscript reference / user function" },
  { address: 0x11, name: "INPFLG", category: "zeropage", description: "Flag: $00=INPUT, $40=GET, $98=READ" },
  { address: 0x12, name: "TANSGN", category: "zeropage", description: "Flag: TAN sign / comparison result" },
  { address: 0x13, name: "CHANNL", category: "zeropage", description: "Flag: INPUT prompt" },
  { address: 0x14, name: "LINNUM", category: "zeropage", description: "Temp integer value (lo)" },
  { address: 0x15, name: "LINNUM_HI", category: "zeropage", description: "Temp integer value (hi)" },
  { address: 0x16, name: "TEMPPT", category: "zeropage", description: "Pointer to next temp string descriptor" },
  { address: 0x17, name: "LASTPT", category: "zeropage", description: "Pointer to last string address (lo)" },
  { address: 0x18, name: "LASTPT_HI", category: "zeropage", description: "Pointer to last string address (hi)" },
  { address: 0x19, name: "TEMPST", category: "zeropage", description: "Temporary string stack (9 bytes)" },
  { address: 0x22, name: "INDEX", category: "zeropage", description: "Utility pointer 1 (lo)" },
  { address: 0x23, name: "INDEX_HI", category: "zeropage", description: "Utility pointer 1 (hi)" },
  { address: 0x24, name: "INDEX2", category: "zeropage", description: "Utility pointer 2 (lo)" },
  { address: 0x25, name: "INDEX2_HI", category: "zeropage", description: "Utility pointer 2 (hi)" },
  { address: 0x26, name: "RESHO", category: "zeropage", description: "Floating point product (5 bytes)" },
  // BASIC pointers
  { address: 0x2B, name: "TXTTAB", category: "zeropage", description: "Start of BASIC text (lo)" },
  { address: 0x2C, name: "TXTTAB_HI", category: "zeropage", description: "Start of BASIC text (hi)" },
  { address: 0x2D, name: "VARTAB", category: "zeropage", description: "Start of BASIC variables (lo)" },
  { address: 0x2E, name: "VARTAB_HI", category: "zeropage", description: "Start of BASIC variables (hi)" },
  { address: 0x2F, name: "ARYTAB", category: "zeropage", description: "Start of BASIC arrays (lo)" },
  { address: 0x30, name: "ARYTAB_HI", category: "zeropage", description: "Start of BASIC arrays (hi)" },
  { address: 0x31, name: "STREND", category: "zeropage", description: "End of BASIC arrays (lo)" },
  { address: 0x32, name: "STREND_HI", category: "zeropage", description: "End of BASIC arrays (hi)" },
  { address: 0x33, name: "FRETOP", category: "zeropage", description: "Top of string storage (lo)" },
  { address: 0x34, name: "FRETOP_HI", category: "zeropage", description: "Top of string storage (hi)" },
  { address: 0x35, name: "FRESPC", category: "zeropage", description: "Utility string pointer (lo)" },
  { address: 0x36, name: "FRESPC_HI", category: "zeropage", description: "Utility string pointer (hi)" },
  { address: 0x37, name: "MEMSIZ", category: "zeropage", description: "End of BASIC memory (lo)" },
  { address: 0x38, name: "MEMSIZ_HI", category: "zeropage", description: "End of BASIC memory (hi)" },
  { address: 0x39, name: "CURLIN", category: "zeropage", description: "Current BASIC line number (lo)" },
  { address: 0x3A, name: "CURLIN_HI", category: "zeropage", description: "Current BASIC line number (hi)" },
  { address: 0x3B, name: "OLDLIN", category: "zeropage", description: "Previous BASIC line number (lo)" },
  { address: 0x3C, name: "OLDLIN_HI", category: "zeropage", description: "Previous BASIC line number (hi)" },
  { address: 0x3D, name: "OLDTXT", category: "zeropage", description: "Pointer to current BASIC statement (lo)" },
  { address: 0x3E, name: "OLDTXT_HI", category: "zeropage", description: "Pointer to current BASIC statement (hi)" },
  { address: 0x3F, name: "DATLIN", category: "zeropage", description: "Current DATA line number (lo)" },
  { address: 0x40, name: "DATLIN_HI", category: "zeropage", description: "Current DATA line number (hi)" },
  { address: 0x41, name: "DATPTR", category: "zeropage", description: "Current DATA item address (lo)" },
  { address: 0x42, name: "DATPTR_HI", category: "zeropage", description: "Current DATA item address (hi)" },
  { address: 0x43, name: "INPPTR", category: "zeropage", description: "Vector: INPUT routine (lo)" },
  { address: 0x44, name: "INPPTR_HI", category: "zeropage", description: "Vector: INPUT routine (hi)" },
  { address: 0x45, name: "VARNAM", category: "zeropage", description: "Current variable name (lo)" },
  { address: 0x46, name: "VARNAM_HI", category: "zeropage", description: "Current variable name (hi)" },
  { address: 0x47, name: "VARPNT", category: "zeropage", description: "Pointer to current variable data (lo)" },
  { address: 0x48, name: "VARPNT_HI", category: "zeropage", description: "Pointer to current variable data (hi)" },
  { address: 0x49, name: "FORPNT", category: "zeropage", description: "Pointer to saved FOR variable (lo)" },
  { address: 0x4A, name: "FORPNT_HI", category: "zeropage", description: "Pointer to saved FOR variable (hi)" },
  { address: 0x4B, name: "OPPTR", category: "zeropage", description: "Comparison operator temp (lo)" },
  { address: 0x4C, name: "OPPTR_HI", category: "zeropage", description: "Comparison operator temp (hi)" },
  { address: 0x4D, name: "OPMASK", category: "zeropage", description: "Comparison evaluation flag" },
  { address: 0x4E, name: "DEFPNT", category: "zeropage", description: "Pointer to FN definition (lo)" },
  { address: 0x4F, name: "DEFPNT_HI", category: "zeropage", description: "Pointer to FN definition (hi)" },
  { address: 0x50, name: "DSCPNT", category: "zeropage", description: "Temp string descriptor stack pointer (3 bytes)" },
  { address: 0x54, name: "JMPER", category: "zeropage", description: "JMP opcode for USR function" },
  { address: 0x55, name: "JMPER_LO", category: "zeropage", description: "USR function address (lo)" },
  { address: 0x56, name: "JMPER_HI", category: "zeropage", description: "USR function address (hi)" },
  // Floating accumulators
  { address: 0x61, name: "FAC1", category: "zeropage", description: "Floating accumulator #1 (6 bytes)" },
  { address: 0x62, name: "FACHO", category: "zeropage", description: "FAC1 mantissa (4 bytes)" },
  { address: 0x66, name: "FACSGN", category: "zeropage", description: "FAC1 sign" },
  { address: 0x67, name: "SGNFLG", category: "zeropage", description: "Sign comparison flag" },
  { address: 0x68, name: "BITS", category: "zeropage", description: "Overflow digit" },
  { address: 0x69, name: "FAC2", category: "zeropage", description: "Floating accumulator #2/ARG (6 bytes)" },
  { address: 0x6A, name: "ARGHO", category: "zeropage", description: "ARG mantissa (4 bytes)" },
  { address: 0x6E, name: "ARGSGN", category: "zeropage", description: "ARG sign" },
  { address: 0x6F, name: "ARISGN", category: "zeropage", description: "Sign comparison result (FAC1 vs FAC2)" },
  { address: 0x70, name: "FACOV", category: "zeropage", description: "FAC overflow byte" },
  { address: 0x71, name: "FBUFPT", category: "zeropage", description: "Pointer to cassette buffer (lo)" },
  { address: 0x72, name: "FBUFPT_HI", category: "zeropage", description: "Pointer to cassette buffer (hi)" },
  // CHRGET subroutine ($73-$8A)
  { address: 0x73, name: "CHRGET", category: "zeropage", description: "CHRGET subroutine (get next BASIC char)" },
  { address: 0x79, name: "CHRGOT", category: "zeropage", description: "CHRGOT entry point (get current BASIC char)" },
  { address: 0x7A, name: "TXTPTR", category: "zeropage", description: "BASIC text pointer (lo)" },
  { address: 0x7B, name: "TXTPTR_HI", category: "zeropage", description: "BASIC text pointer (hi)" },
  { address: 0x8B, name: "RNDX", category: "zeropage", description: "Floating point RNG seed (5 bytes)" },
  // ── KERNAL work area ($90-$FF) ──
  { address: 0x90, name: "STATUS", category: "zeropage", description: "KERNAL I/O status word (ST)" },
  { address: 0x91, name: "STKEY", category: "zeropage", description: "STOP key flag" },
  { address: 0x92, name: "SVXT", category: "zeropage", description: "Timing constant for tape" },
  { address: 0x93, name: "VERCKK", category: "zeropage", description: "Flag: 0=LOAD, 1=VERIFY" },
  { address: 0x94, name: "C3PO", category: "zeropage", description: "Flag: serial bus char buffered" },
  { address: 0x95, name: "BSOUR1", category: "zeropage", description: "Buffered char for serial bus" },
  { address: 0x96, name: "SYESSION", category: "zeropage", description: "Cassette sync number" },
  { address: 0x97, name: "XSAV", category: "zeropage", description: "Temp X register save" },
  { address: 0x98, name: "LDTND", category: "zeropage", description: "Number of open files / index to file table" },
  { address: 0x99, name: "DFLTN", category: "zeropage", description: "Default input device (0=keyboard)" },
  { address: 0x9A, name: "DFLTO", category: "zeropage", description: "Default output device (3=screen)" },
  { address: 0x9B, name: "PRTEFLAG", category: "zeropage", description: "Tape parity" },
  { address: 0x9C, name: "BTEFLAG", category: "zeropage", description: "Flag: tape byte received" },
  { address: 0x9D, name: "MSGFLG", category: "zeropage", description: "Flag: KERNAL message control" },
  { address: 0x9E, name: "PTR1", category: "zeropage", description: "Tape pass 1 error log" },
  { address: 0x9F, name: "PTR2", category: "zeropage", description: "Tape pass 2 error log" },
  { address: 0xA0, name: "TIME_HI", category: "zeropage", description: "Jiffy clock high byte" },
  { address: 0xA1, name: "TIME_MID", category: "zeropage", description: "Jiffy clock mid byte" },
  { address: 0xA2, name: "TIME_LO", category: "zeropage", description: "Jiffy clock low byte" },
  { address: 0xA3, name: "TSFCNT", category: "zeropage", description: "Bit counter for serial I/O" },
  { address: 0xA4, name: "TBTCNT", category: "zeropage", description: "Bit count for tape byte" },
  { address: 0xA5, name: "CNTDN", category: "zeropage", description: "Cassette sync countdown" },
  { address: 0xA6, name: "BUFPNT", category: "zeropage", description: "Pointer into cassette buffer" },
  { address: 0xA7, name: "INBIT", category: "zeropage", description: "RS-232 input bits" },
  { address: 0xA8, name: "BITCI", category: "zeropage", description: "RS-232 input bit count" },
  { address: 0xA9, name: "RINONE", category: "zeropage", description: "RS-232 flag: checking for start bit" },
  { address: 0xAA, name: "RIDATA", category: "zeropage", description: "RS-232 input byte buffer" },
  { address: 0xAB, name: "RIPRTY", category: "zeropage", description: "RS-232 input parity" },
  { address: 0xAC, name: "SAL", category: "zeropage", description: "Tape buffer / screen scroll pointer (lo)" },
  { address: 0xAD, name: "SAL_HI", category: "zeropage", description: "Tape buffer / screen scroll pointer (hi)" },
  { address: 0xAE, name: "EAL", category: "zeropage", description: "Tape end address / program end (lo)" },
  { address: 0xAF, name: "EAL_HI", category: "zeropage", description: "Tape end address / program end (hi)" },
  { address: 0xB0, name: "CMP0", category: "zeropage", description: "Tape timing constant (lo)" },
  { address: 0xB1, name: "CMP0_HI", category: "zeropage", description: "Tape timing constant (hi)" },
  { address: 0xB2, name: "TAPE1", category: "zeropage", description: "Pointer to start of tape buffer (lo)" },
  { address: 0xB3, name: "TAPE1_HI", category: "zeropage", description: "Pointer to start of tape buffer (hi)" },
  { address: 0xB4, name: "BITTS", category: "zeropage", description: "RS-232 output bit count" },
  { address: 0xB5, name: "NXTBIT", category: "zeropage", description: "RS-232 next bit to send" },
  { address: 0xB6, name: "RODATA", category: "zeropage", description: "RS-232 output byte buffer" },
  { address: 0xB7, name: "FNLEN", category: "zeropage", description: "File name length" },
  { address: 0xB8, name: "LA", category: "zeropage", description: "Logical file number" },
  { address: 0xB9, name: "SA", category: "zeropage", description: "Secondary address" },
  { address: 0xBA, name: "FA", category: "zeropage", description: "Device number" },
  { address: 0xBB, name: "FNADR", category: "zeropage", description: "Pointer to file name (lo)" },
  { address: 0xBC, name: "FNADR_HI", category: "zeropage", description: "Pointer to file name (hi)" },
  { address: 0xBD, name: "ROPRTY", category: "zeropage", description: "RS-232 output parity" },
  { address: 0xBE, name: "FSBLK", category: "zeropage", description: "Cassette read/write block count" },
  { address: 0xBF, name: "MESSION", category: "zeropage", description: "Serial word buffer" },
  { address: 0xC0, name: "CAS1", category: "zeropage", description: "Cassette motor interlock" },
  { address: 0xC1, name: "STAL", category: "zeropage", description: "I/O start address (lo)" },
  { address: 0xC2, name: "STAL_HI", category: "zeropage", description: "I/O start address (hi)" },
  { address: 0xC3, name: "MEMUSS", category: "zeropage", description: "KERNAL load/save pointer (lo)" },
  { address: 0xC4, name: "MEMUSS_HI", category: "zeropage", description: "KERNAL load/save pointer (hi)" },
  { address: 0xC5, name: "LSTX", category: "zeropage", description: "Matrix coordinate of last key pressed" },
  { address: 0xC6, name: "NDX", category: "zeropage", description: "Number of chars in keyboard buffer" },
  { address: 0xC7, name: "RVS", category: "zeropage", description: "Flag: reverse character mode" },
  { address: 0xC8, name: "INDX", category: "zeropage", description: "Pointer to end of logical line" },
  { address: 0xC9, name: "LXSP", category: "zeropage", description: "Cursor position at input start (lo)" },
  { address: 0xCA, name: "LXSP_HI", category: "zeropage", description: "Cursor position at input start (hi)" },
  { address: 0xCB, name: "SFDX", category: "zeropage", description: "Flag: current key pressed (matrix code)" },
  { address: 0xCC, name: "BLNSW", category: "zeropage", description: "Flag: cursor blink enable (0=blink)" },
  { address: 0xCD, name: "BLNCT", category: "zeropage", description: "Cursor blink countdown timer" },
  { address: 0xCE, name: "GDBLN", category: "zeropage", description: "Character under cursor" },
  { address: 0xCF, name: "BLNON", category: "zeropage", description: "Flag: cursor currently visible" },
  { address: 0xD0, name: "CRSW", category: "zeropage", description: "Flag: input from screen/keyboard" },
  { address: 0xD1, name: "PNT", category: "zeropage", description: "Pointer to current screen line (lo)" },
  { address: 0xD2, name: "PNT_HI", category: "zeropage", description: "Pointer to current screen line (hi)" },
  { address: 0xD3, name: "PNTR", category: "zeropage", description: "Cursor column on current line" },
  { address: 0xD4, name: "QTSW", category: "zeropage", description: "Flag: editor in quote mode" },
  { address: 0xD5, name: "LNMX", category: "zeropage", description: "Screen line length (39 or 79)" },
  { address: 0xD6, name: "TBLX", category: "zeropage", description: "Current cursor physical line" },
  { address: 0xD7, name: "DATA", category: "zeropage", description: "Temp data area" },
  { address: 0xD8, name: "INSRT", category: "zeropage", description: "Insert mode count" },
  { address: 0xD9, name: "LDTB1", category: "zeropage", description: "Screen line link table (high bytes, 26 entries)" },
  { address: 0xF3, name: "USER", category: "zeropage", description: "Pointer to color RAM line (lo)" },
  { address: 0xF4, name: "USER_HI", category: "zeropage", description: "Pointer to color RAM line (hi)" },
  { address: 0xF5, name: "KEYTAB", category: "zeropage", description: "Pointer to keyboard decode table (lo)" },
  { address: 0xF6, name: "KEYTAB_HI", category: "zeropage", description: "Pointer to keyboard decode table (hi)" },
  { address: 0xF7, name: "RIBUF", category: "zeropage", description: "RS-232 input buffer pointer (lo)" },
  { address: 0xF8, name: "RIBUF_HI", category: "zeropage", description: "RS-232 input buffer pointer (hi)" },
  { address: 0xF9, name: "ROBUF", category: "zeropage", description: "RS-232 output buffer pointer (lo)" },
  { address: 0xFA, name: "ROBUF_HI", category: "zeropage", description: "RS-232 output buffer pointer (hi)" },
  { address: 0xFB, name: "FREEZP", category: "zeropage", description: "Free zero page for user programs (4 bytes)" },
  { address: 0xFC, name: "FREEZP2", category: "zeropage", description: "Free zero page (commonly pointer high)" },
  { address: 0xFD, name: "FREEZP3", category: "zeropage", description: "Free zero page" },
  { address: 0xFE, name: "FREEZP4", category: "zeropage", description: "Free zero page" },
  { address: 0xFF, name: "BTEFLAG2", category: "zeropage", description: "BASIC temp / subroutine temp byte" },
];

// ── System Area ($0200-$03FF) ─────────────────────────────────────
const SYSTEM_AREA: SymbolEntry[] = [
  // Input buffer
  { address: 0x0200, name: "BUF", category: "system", description: "BASIC input buffer (88 bytes)" },
  // File tables
  { address: 0x0259, name: "LAT", category: "system", description: "Logical file number table (10 entries)" },
  { address: 0x0263, name: "FAT", category: "system", description: "Device number table (10 entries)" },
  { address: 0x026D, name: "SAT", category: "system", description: "Secondary address table (10 entries)" },
  // Keyboard buffer
  { address: 0x0277, name: "KEYD", category: "system", description: "Keyboard buffer (10 bytes)" },
  // Memory pointers
  { address: 0x0281, name: "MEMSTR", category: "system", description: "Start of BASIC memory (lo)" },
  { address: 0x0282, name: "MEMSTR_HI", category: "system", description: "Start of BASIC memory (hi)" },
  { address: 0x0283, name: "MEMSIZ2", category: "system", description: "Top of BASIC memory (lo)" },
  { address: 0x0284, name: "MEMSIZ2_HI", category: "system", description: "Top of BASIC memory (hi)" },
  // Screen/keyboard flags
  { address: 0x0286, name: "COLOR", category: "system", description: "Current foreground color for text" },
  { address: 0x0287, name: "GDCOL", category: "system", description: "Color under cursor" },
  { address: 0x0288, name: "HIBASE", category: "system", description: "Screen memory page ($04 = default)" },
  { address: 0x028A, name: "XMAX", category: "system", description: "Max keyboard buffer size" },
  { address: 0x028B, name: "RPTFLG", category: "system", description: "Key repeat flag ($00=off, $40=cur, $80=all)" },
  { address: 0x028C, name: "KESSION", category: "system", description: "Repeat speed counter" },
  { address: 0x028D, name: "SHFLAG", category: "system", description: "Shift key flag (1=shift, 2=commodore, 4=ctrl)" },
  { address: 0x028E, name: "LSTSHF", category: "system", description: "Last shift pattern" },
  { address: 0x028F, name: "KEYLOG", category: "system", description: "Pointer to keyboard decode logic (lo)" },
  { address: 0x0290, name: "KEYLOG_HI", category: "system", description: "Pointer to keyboard decode logic (hi)" },
  { address: 0x0291, name: "MODE", category: "system", description: "Shift key mode (0=enabled, $80=locked)" },
  { address: 0x0292, name: "AUTODN", category: "system", description: "Auto scroll down flag" },
  // RS-232
  { address: 0x0295, name: "M51AJB", category: "system", description: "RS-232 non-standard BPS (lo)" },
  { address: 0x0296, name: "M51AJB_HI", category: "system", description: "RS-232 non-standard BPS (hi)" },
  { address: 0x0299, name: "BAUDOF", category: "system", description: "RS-232 baud rate offset (lo)" },
  { address: 0x029A, name: "BAUDOF_HI", category: "system", description: "RS-232 baud rate offset (hi)" },
  { address: 0x029F, name: "IRQTMP", category: "system", description: "IRQ vector temp storage (lo)" },
  { address: 0x02A0, name: "IRQTMP_HI", category: "system", description: "IRQ vector temp storage (hi)" },
  // BASIC/KERNAL vectors ($0300-$030B)
  { address: 0x0300, name: "IERROR", category: "system", description: "BASIC error handler vector (lo)" },
  { address: 0x0301, name: "IERROR_HI", category: "system", description: "BASIC error handler vector (hi)" },
  { address: 0x0302, name: "IMAIN", category: "system", description: "BASIC main loop vector (lo)" },
  { address: 0x0303, name: "IMAIN_HI", category: "system", description: "BASIC main loop vector (hi)" },
  { address: 0x0304, name: "ICRNCH", category: "system", description: "BASIC tokenize vector (lo)" },
  { address: 0x0305, name: "ICRNCH_HI", category: "system", description: "BASIC tokenize vector (hi)" },
  { address: 0x0306, name: "IQPLOP", category: "system", description: "BASIC list tokens vector (lo)" },
  { address: 0x0307, name: "IQPLOP_HI", category: "system", description: "BASIC list tokens vector (hi)" },
  { address: 0x0308, name: "IGONE", category: "system", description: "BASIC execute token vector (lo)" },
  { address: 0x0309, name: "IGONE_HI", category: "system", description: "BASIC execute token vector (hi)" },
  { address: 0x030A, name: "IEVAL", category: "system", description: "BASIC expression evaluation vector (lo)" },
  { address: 0x030B, name: "IEVAL_HI", category: "system", description: "BASIC expression evaluation vector (hi)" },
  // Saved registers
  { address: 0x030C, name: "SAREG", category: "system", description: "Storage for .A register" },
  { address: 0x030D, name: "SXREG", category: "system", description: "Storage for .X register" },
  { address: 0x030E, name: "SYREG", category: "system", description: "Storage for .Y register" },
  { address: 0x030F, name: "SPREG", category: "system", description: "Storage for stack pointer" },
  // USR function vector
  { address: 0x0311, name: "USRADD", category: "system", description: "USR function JMP address (lo)" },
  { address: 0x0312, name: "USRADD_HI", category: "system", description: "USR function JMP address (hi)" },
];

// ── IRQ/NMI/KERNAL I/O Vectors ──────────────────────────────────
const VECTOR_LOCATIONS: SymbolEntry[] = [
  // Software vectors ($0314-$0333)
  { address: 0x0314, name: "CINV", category: "system", description: "IRQ vector (low byte)" },
  { address: 0x0315, name: "CINV_HI", category: "system", description: "IRQ vector (high byte)" },
  { address: 0x0316, name: "CBINV", category: "system", description: "BRK vector (low byte)" },
  { address: 0x0317, name: "CBINV_HI", category: "system", description: "BRK vector (high byte)" },
  { address: 0x0318, name: "NMINV", category: "system", description: "NMI vector (low byte)" },
  { address: 0x0319, name: "NMINV_HI", category: "system", description: "NMI vector (high byte)" },
  // KERNAL I/O dispatch vectors (commonly intercepted by programs)
  { address: 0x031A, name: "IOPEN", category: "system", description: "KERNAL OPEN dispatch vector (lo)" },
  { address: 0x031B, name: "IOPEN_HI", category: "system", description: "KERNAL OPEN dispatch vector (hi)" },
  { address: 0x031C, name: "ICLOSE", category: "system", description: "KERNAL CLOSE dispatch vector (lo)" },
  { address: 0x031D, name: "ICLOSE_HI", category: "system", description: "KERNAL CLOSE dispatch vector (hi)" },
  { address: 0x031E, name: "ICHKIN", category: "system", description: "KERNAL CHKIN dispatch vector (lo)" },
  { address: 0x031F, name: "ICHKIN_HI", category: "system", description: "KERNAL CHKIN dispatch vector (hi)" },
  { address: 0x0320, name: "ICKOUT", category: "system", description: "KERNAL CHKOUT dispatch vector (lo)" },
  { address: 0x0321, name: "ICKOUT_HI", category: "system", description: "KERNAL CHKOUT dispatch vector (hi)" },
  { address: 0x0322, name: "ICLRCH", category: "system", description: "KERNAL CLRCHN dispatch vector (lo)" },
  { address: 0x0323, name: "ICLRCH_HI", category: "system", description: "KERNAL CLRCHN dispatch vector (hi)" },
  { address: 0x0324, name: "IBASIN", category: "system", description: "KERNAL CHRIN dispatch vector (lo)" },
  { address: 0x0325, name: "IBASIN_HI", category: "system", description: "KERNAL CHRIN dispatch vector (hi)" },
  { address: 0x0326, name: "IBSOUT", category: "system", description: "KERNAL CHROUT dispatch vector (lo)" },
  { address: 0x0327, name: "IBSOUT_HI", category: "system", description: "KERNAL CHROUT dispatch vector (hi)" },
  { address: 0x0328, name: "ISTOP", category: "system", description: "KERNAL STOP dispatch vector (lo)" },
  { address: 0x0329, name: "ISTOP_HI", category: "system", description: "KERNAL STOP dispatch vector (hi)" },
  { address: 0x032A, name: "IGETIN", category: "system", description: "KERNAL GETIN dispatch vector (lo)" },
  { address: 0x032B, name: "IGETIN_HI", category: "system", description: "KERNAL GETIN dispatch vector (hi)" },
  { address: 0x032C, name: "ICLALL", category: "system", description: "KERNAL CLALL dispatch vector (lo)" },
  { address: 0x032D, name: "ICLALL_HI", category: "system", description: "KERNAL CLALL dispatch vector (hi)" },
  { address: 0x032E, name: "USRCMD", category: "system", description: "User command dispatch vector (lo)" },
  { address: 0x032F, name: "USRCMD_HI", category: "system", description: "User command dispatch vector (hi)" },
  { address: 0x0330, name: "ILOAD", category: "system", description: "KERNAL LOAD dispatch vector (lo)" },
  { address: 0x0331, name: "ILOAD_HI", category: "system", description: "KERNAL LOAD dispatch vector (hi)" },
  { address: 0x0332, name: "ISAVE", category: "system", description: "KERNAL SAVE dispatch vector (lo)" },
  { address: 0x0333, name: "ISAVE_HI", category: "system", description: "KERNAL SAVE dispatch vector (hi)" },
  // Tape buffer
  { address: 0x033C, name: "TBUFFER", category: "system", description: "Tape I/O buffer (192 bytes)" },
  // Hardware vectors (at end of address space, always visible)
  { address: 0xFFFA, name: "NMI_VEC", category: "hardware", description: "Hardware NMI vector (lo)" },
  { address: 0xFFFB, name: "NMI_VEC_HI", category: "hardware", description: "Hardware NMI vector (hi)" },
  { address: 0xFFFC, name: "RESET_VEC", category: "hardware", description: "Hardware RESET vector (lo)" },
  { address: 0xFFFD, name: "RESET_VEC_HI", category: "hardware", description: "Hardware RESET vector (hi)" },
  { address: 0xFFFE, name: "IRQ_VEC", category: "hardware", description: "Hardware IRQ vector (lo)" },
  { address: 0xFFFF, name: "IRQ_VEC_HI", category: "hardware", description: "Hardware IRQ vector (hi)" },
];

// ── Address Ranges ──────────────────────────────────────────────
// For addresses within these ranges that have no individual entry,
// lookupRange() returns BASE+$offset notation.
const ADDRESS_RANGES: AddressRange[] = [
  {
    start: 0x0400, end: 0x07E7,
    baseName: "SCREEN_RAM", category: "system",
    description: "Default screen RAM (1000 bytes)", chip: "VIC-II",
  },
  {
    start: 0x07F8, end: 0x07FF,
    baseName: "SPRITE_PTR", category: "system",
    description: "Sprite data pointers (8 sprites)", chip: "VIC-II",
  },
  {
    start: 0xD800, end: 0xDBE7,
    baseName: "COLOR_RAM", category: "hardware",
    description: "Color RAM (1000 nybbles)", chip: "VIC-II",
  },
  {
    start: 0xA000, end: 0xBFFF,
    baseName: "BASIC_ROM", category: "basic",
    description: "BASIC ROM",
  },
  {
    start: 0xE000, end: 0xFFF9,
    baseName: "KERNAL_ROM", category: "kernal",
    description: "KERNAL ROM",
  },
];

// ── Build lookup maps ───────────────────────────────────────────

const allSymbols = [
  ...KERNAL_JUMP_TABLE,
  ...KERNAL_INTERNAL,
  ...BASIC_ENTRIES,
  ...HARDWARE_REGISTERS,
  ...ZERO_PAGE_SYSTEM,
  ...SYSTEM_AREA,
  ...VECTOR_LOCATIONS,
];

const symbolByAddress = new Map<number, SymbolEntry>();
for (const sym of allSymbols) {
  // First entry wins (jump table before internal, etc.)
  if (!symbolByAddress.has(sym.address)) {
    symbolByAddress.set(sym.address, sym);
  }
}

const kernalAddresses = new Set([
  ...KERNAL_JUMP_TABLE.map(e => e.address),
  ...KERNAL_INTERNAL.map(e => e.address),
]);
const hardwareAddresses = new Set(HARDWARE_REGISTERS.map(e => e.address));

export class SymbolDB implements SymbolDBInterface {
  lookup(address: number): SymbolEntry | null {
    const sym = symbolByAddress.get(address);
    if (sym) return sym;

    // Fallback: generate ZP name for any unmapped zero page address
    if (address <= 0xFF) {
      return {
        address,
        name: `ZP_${address.toString(16).toUpperCase().padStart(2, "0")}`,
        category: "zeropage",
        description: "Zero page location",
      };
    }

    return null;
  }

  lookupWithBanking(address: number, banking: BankingSnapshot): SymbolEntry | null {
    const sym = symbolByAddress.get(address);

    // ZP fallback (no banking check needed for ZP)
    if (!sym && address <= 0xFF) {
      return {
        address,
        name: `ZP_${address.toString(16).toUpperCase().padStart(2, "0")}`,
        category: "zeropage",
        description: "Zero page location",
      };
    }

    if (!sym) return null;

    // KERNAL entries require KERNAL ROM to be mapped
    if (sym.category === "kernal") {
      if (banking.kernalMapped === "no") return null;
      return sym;
    }

    // BASIC entries require BASIC ROM to be mapped
    if (sym.category === "basic") {
      if (banking.basicMapped === "no") return null;
      return sym;
    }

    // Hardware registers require I/O to be mapped
    if (sym.category === "hardware" && address >= 0xD000 && address <= 0xDFFF) {
      if (banking.ioMapped === "no") return null;
      return sym;
    }

    return sym;
  }

  lookupRange(address: number): RangeLookupResult | null {
    // Only check ranges if there's no exact match
    if (symbolByAddress.has(address)) return null;

    for (const range of ADDRESS_RANGES) {
      if (address >= range.start && address <= range.end) {
        return {
          baseName: range.baseName,
          baseAddress: range.start,
          offset: address - range.start,
          category: range.category,
        };
      }
    }

    return null;
  }

  lookupRangeWithBanking(address: number, banking: BankingSnapshot): RangeLookupResult | null {
    const result = this.lookupRange(address);
    if (!result) return null;

    // Apply banking checks
    if (result.category === "kernal" && banking.kernalMapped === "no") return null;
    if (result.category === "basic" && banking.basicMapped === "no") return null;
    if (result.category === "hardware" && address >= 0xD000 && address <= 0xDFFF) {
      if (banking.ioMapped === "no") return null;
    }

    return result;
  }

  isHardwareRegister(address: number): boolean {
    return hardwareAddresses.has(address) ||
      (address >= 0xD000 && address <= 0xDFFF); // I/O range
  }

  isKernalEntry(address: number): boolean {
    return kernalAddresses.has(address);
  }

  /**
   * Resolve an instruction operand to use symbol names for AI prompts.
   * Replaces $XXXX hex addresses with known symbol names (banking-aware).
   * Examples:
   *   "$D020"     → "EXTCOL"
   *   "$05B8,X"   → "SCREEN_RAM+$1B8,X"
   *   "$FFD2"     → "CHROUT"  (when KERNAL mapped)
   *   "$FFD2"     → "ram_FFD2" (when KERNAL banked out)
   *   "$FB"       → "$FB"     (ZP left as-is — too many false positives)
   */
  resolveOperandForAI(operand: string, banking: BankingSnapshot): string {
    // Match $XXXX (4-digit hex) in operand — skip $XX (2-digit ZP)
    return operand.replace(/\$([0-9A-Fa-f]{4})/g, (_match, hexStr: string) => {
      const addr = parseInt(hexStr, 16);

      // Try exact symbol lookup (banking-aware)
      const sym = this.lookupWithBanking(addr, banking);
      if (sym && sym.category !== "zeropage") {
        return sym.name;
      }

      // Try range lookup (banking-aware) — COLOR_RAM+$offset, SCREEN_RAM+$offset, etc.
      const range = this.lookupRangeWithBanking(addr, banking);
      if (range) {
        if (range.offset === 0) return range.baseName;
        const offsetHex = range.offset.toString(16).toUpperCase();
        return `${range.baseName}+$${offsetHex}`;
      }

      // For addresses where ROM/IO is banked out, prefix with ram_
      if (addr >= 0xA000 && addr <= 0xBFFF && banking.basicMapped === "no") {
        return `ram_${hexStr.toUpperCase()}`;
      }
      if (addr >= 0xD000 && addr <= 0xDFFF && banking.ioMapped === "no") {
        return `ram_${hexStr.toUpperCase()}`;
      }
      if (addr >= 0xE000 && banking.kernalMapped === "no") {
        return `ram_${hexStr.toUpperCase()}`;
      }

      // No resolution — keep original
      return _match;
    });
  }
}
