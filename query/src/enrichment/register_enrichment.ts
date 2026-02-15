/**
 * Register mnemonic enrichment plugin.
 *
 * Scans query text for known VIC-II/SID/CIA register mnemonic names
 * and adds them as filter tags for Qdrant keyword search.
 */

import type { EnrichmentPlugin, EnrichmentInput, EnrichmentResult } from "./types.js";

/** Address-to-mnemonic mapping for all C64 I/O registers */
const ADDRESS_TO_MNEMONIC: ReadonlyMap<number, string> = new Map([
  // VIC-II ($D000-$D02E)
  [0xd000, "SP0X"],
  [0xd001, "SP0Y"],
  [0xd002, "SP1X"],
  [0xd003, "SP1Y"],
  [0xd004, "SP2X"],
  [0xd005, "SP2Y"],
  [0xd006, "SP3X"],
  [0xd007, "SP3Y"],
  [0xd008, "SP4X"],
  [0xd009, "SP4Y"],
  [0xd00a, "SP5X"],
  [0xd00b, "SP5Y"],
  [0xd00c, "SP6X"],
  [0xd00d, "SP6Y"],
  [0xd00e, "SP7X"],
  [0xd00f, "SP7Y"],
  [0xd010, "MSIGX"],
  [0xd011, "SCROLY"],
  [0xd012, "RASTER"],
  [0xd013, "LPENX"],
  [0xd014, "LPENY"],
  [0xd015, "SPENA"],
  [0xd016, "SCROLX"],
  [0xd017, "YXPAND"],
  [0xd018, "VMCSB"],
  [0xd019, "VICIRQ"],
  [0xd01a, "IRQMASK"],
  [0xd01b, "SPBGPR"],
  [0xd01c, "SPMC"],
  [0xd01d, "XXPAND"],
  [0xd01e, "SPSPCL"],
  [0xd01f, "SPBGCL"],
  [0xd020, "EXTCOL"],
  [0xd021, "BGCOL0"],
  [0xd022, "BGCOL1"],
  [0xd023, "BGCOL2"],
  [0xd024, "BGCOL3"],
  [0xd025, "SPMC0"],
  [0xd026, "SPMC1"],
  [0xd027, "SP0COL"],
  [0xd028, "SP1COL"],
  [0xd029, "SP2COL"],
  [0xd02a, "SP3COL"],
  [0xd02b, "SP4COL"],
  [0xd02c, "SP5COL"],
  [0xd02d, "SP6COL"],
  [0xd02e, "SP7COL"],
  // SID ($D400-$D41C)
  [0xd400, "FRELO1"],
  [0xd401, "FREHI1"],
  [0xd402, "PWLO1"],
  [0xd403, "PWHI1"],
  [0xd404, "VCREG1"],
  [0xd405, "ATDCY1"],
  [0xd406, "SUREL1"],
  [0xd407, "FRELO2"],
  [0xd408, "FREHI2"],
  [0xd409, "PWLO2"],
  [0xd40a, "PWHI2"],
  [0xd40b, "VCREG2"],
  [0xd40c, "ATDCY2"],
  [0xd40d, "SUREL2"],
  [0xd40e, "FRELO3"],
  [0xd40f, "FREHI3"],
  [0xd410, "PWLO3"],
  [0xd411, "PWHI3"],
  [0xd412, "VCREG3"],
  [0xd413, "ATDCY3"],
  [0xd414, "SUREL3"],
  [0xd415, "CUTLO"],
  [0xd416, "CUTHI"],
  [0xd417, "RESON"],
  [0xd418, "SIGVOL"],
  [0xd419, "POTX"],
  [0xd41a, "POTY"],
  [0xd41b, "RANDOM"],
  [0xd41c, "ENV3"],
  // CIA 1 ($DC00-$DC0F)
  [0xdc00, "CIAPRA"],
  [0xdc01, "CIAPRB"],
  [0xdc02, "CIDDRA"],
  [0xdc03, "CIDDRB"],
  [0xdc04, "TIMALO"],
  [0xdc05, "TIMAHI"],
  [0xdc06, "TIMBLO"],
  [0xdc07, "TIMBHI"],
  [0xdc08, "TODTEN"],
  [0xdc09, "TODSEC"],
  [0xdc0a, "TODMIN"],
  [0xdc0b, "TODHRS"],
  [0xdc0c, "CIASDR"],
  [0xdc0d, "CIAICR"],
  [0xdc0e, "CIACRA"],
  [0xdc0f, "CIACRB"],
  // CIA 2 ($DD00-$DD0F)
  [0xdd00, "CI2PRA"],
  [0xdd01, "CI2PRB"],
  [0xdd02, "C2DDRA"],
  [0xdd03, "C2DDRB"],
  [0xdd04, "TI2ALO"],
  [0xdd05, "TI2AHI"],
  [0xdd06, "TI2BLO"],
  [0xdd07, "TI2BHI"],
  [0xdd08, "TO2TEN"],
  [0xdd09, "TO2SEC"],
  [0xdd0a, "TO2MIN"],
  [0xdd0b, "TO2HRS"],
  [0xdd0c, "CI2SDR"],
  [0xdd0d, "CI2ICR"],
  [0xdd0e, "CI2CRA"],
  [0xdd0f, "CI2CRB"],
]);

/** Flat set of all register mnemonic names for word matching in query text */
const REGISTER_MNEMONICS: ReadonlySet<string> = new Set(
  ADDRESS_TO_MNEMONIC.values(),
);

export class RegisterEnrichment implements EnrichmentPlugin {
  name = "register";

  enrich(input: EnrichmentInput): EnrichmentResult {
    const filterTags: string[] = [];

    const words = input.query.match(/\b[A-Za-z][A-Za-z0-9_]{1,7}\b/g) || [];
    for (const word of words) {
      const upper = word.toUpperCase();
      if (REGISTER_MNEMONICS.has(upper)) {
        filterTags.push(upper);
      }
    }

    return { additionalContext: [], filterTags };
  }
}
