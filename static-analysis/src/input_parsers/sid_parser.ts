import type { ParsedRegion } from "../types.js";
import type { InputParser } from "./types.js";

export class SidParser implements InputParser {
  name = "sid";
  extensions = [".sid"];
  priority = 10;

  detect(data: Uint8Array, filename: string): number {
    if (data.length < 4) return 0;

    const magic = String.fromCharCode(data[0], data[1], data[2], data[3]);
    if (magic === "PSID" || magic === "RSID") return 95;

    return 0;
  }

  parse(data: Uint8Array): ParsedRegion[] {
    if (data.length < 0x7C) {
      throw new Error("SID file too small for header");
    }

    const magic = String.fromCharCode(data[0], data[1], data[2], data[3]);
    if (magic !== "PSID" && magic !== "RSID") {
      throw new Error(`Invalid SID magic: ${magic}`);
    }

    // SID header is big-endian
    const version = (data[4] << 8) | data[5];
    const dataOffset = (data[6] << 8) | data[7];
    let loadAddress = (data[8] << 8) | data[9];
    const initAddress = (data[0x0A] << 8) | data[0x0B];
    const playAddress = (data[0x0C] << 8) | data[0x0D];
    const songs = (data[0x0E] << 8) | data[0x0F];

    // If loadAddress is 0, first 2 bytes of data are little-endian load address
    const payload = data.slice(dataOffset);
    if (loadAddress === 0) {
      if (payload.length < 2) throw new Error("SID: no load address in header or data");
      loadAddress = payload[0] | (payload[1] << 8);
      const programData = payload.slice(2);
      return [{
        address: loadAddress,
        bytes: programData,
        metadata: {
          labels: new Map([
            [initAddress, "sid_init"],
            [playAddress, "sid_play"],
          ]),
          comments: new Map([
            [initAddress, `SID init (${songs} song${songs > 1 ? "s" : ""}, ${magic} v${version})`],
            [playAddress, "SID play routine — call once per frame"],
          ]),
        },
      }];
    }

    return [{
      address: loadAddress,
      bytes: payload,
      metadata: {
        labels: new Map([
          [initAddress, "sid_init"],
          [playAddress, "sid_play"],
        ]),
        comments: new Map([
          [initAddress, `SID init (${songs} song${songs > 1 ? "s" : ""}, ${magic} v${version})`],
          [playAddress, "SID play routine — call once per frame"],
        ]),
      },
    }];
  }
}
