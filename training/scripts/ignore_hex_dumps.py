#!/usr/bin/env python3
"""One-shot script to mark OCR'd hex dump chunks as ignored in Inside_Commodore_DOS split config
and remove their output files from training/data/ and training/split/."""

import json
from pathlib import Path

CONFIG = Path(__file__).parent.parent / "split_config" / "Inside_Commodore_DOS.json"
DATA_DIR = Path(__file__).parent.parent / "data"
SPLIT_DIR = Path(__file__).parent.parent / "split"

GARBAGE_CHUNKS = {
    "ascii_block_C8_D0_transport",
    "ascii_block_D8_E0_callable",
    "ascii_block_F0_F8_trailing",
    "bam_entries_10_13_zone",
    "bam_entries_12_zone_and_garbled_rows",
    "bam_table_zone_1f_entries",
    "bam_transition_11_00_entries",
    "block_table_and_labeled_tables",
    "continued_marker_and_ascii_small_fragments",
    "data_block_pointers_10_1f",
    "data_block_pointers_20_2f",
    "data_block_pointers_30_3f",
    "data_block_pointers_40_4f",
    "data_block_pointers_50_5f",
    "data_block_pointers_60_6f",
    "data_block_pointers_70_7f",
    "dir_block_chain_dump_20_block",
    "dir_block_chain_dump_24_block",
    "dir_block_chain_dump_29_block",
    "dir_block_chain_dump_42_block",
    "dir_block_chain_dump_98_block_trailer",
    "dir_block_chain_dump_a7_block",
    "dir_block_chain_dump_b2_block",
    "dir_block_dump_hex_ascii_middle_blocks",
    "dir_block_dump_tail_blocks_00_08_10_18",
    "dir_first_block_hex_dump_bytes_0_31",
    "dir_first_block_hex_dump_bytes_32_63",
    "dir_first_block_hex_dump_bytes_64_95",
    "dir_first_block_hex_dump_bytes_96_127",
    "dir_sector_hex_ascii_dump_offset_20",
    "dir_sector_hex_ascii_dump_offset_28",
    "dir_sector_hex_ascii_dump_offset_30",
    "dir_sector_hex_ascii_dump_offset_38",
    "dir_sector_hex_ascii_dump_offset_40",
    "dir_sector_hex_ascii_dump_offset_48",
    "dir_sector_hex_ascii_dump_offset_50",
    "dir_sector_hex_ascii_dump_offset_58",
    "dir_sector_hex_ascii_dump_offset_60",
    "directory_block_04_dump_part1_bytes_00_1F",
    "directory_block_04_dump_part2_bytes_20_3F",
    "directory_block_04_dump_part3_bytes_40_5F",
    "directory_block_04_dump_part4_bytes_60_7F",
    "directory_block_04_dump_part5_bytes_80_9F",
    "directory_block_04_dump_part6_bytes_A0_BF",
    "directory_block_04_dump_part7_bytes_C0_FF",
    "directory_entry_00-18_first_directory_entry",
    "directory_entry_20-38_second_directory_entry",
    "directory_entry_40-60_third_directory_entry",
    "dump_offset_00_ascii_magfile",
    "dump_offset_08_title_line",
    "dump_offset_10_title_continue",
    "dump_offset_18_compute_agazin",
    "dump_offset_20_agazin_issue_partial",
    "dump_offset_28_issue",
    "dump_offset_30_age0",
    "dump_offset_38_comment",
    "file_entry_c-6_wedge_#4",
    "file_entry_cdf_#6",
    "file_entry_dis_addr_change_#8",
    "file_entry_dos_#5",
    "file_entry_part_tw_#2",
    "file_entry_pri_#7",
    "file_entry_vic_#3",
    "file_pointer_and_small_name_fragments",
    "hex_dump_initial_zero_padding",
    "hex_dump_offsets_00_0f",
    "hex_dump_offsets_10_17",
    "hex_dump_offsets_18_1f",
    "hex_dump_offsets_20_27",
    "hex_dump_offsets_28_2f",
    "hex_dump_offsets_30_37",
    "hex_dump_offsets_38_3f",
    "hex_dump_offsets_40_47",
    "hex_dump_offsets_48_4f",
    "hex_dump_offsets_50_57",
    "label_80_pointers",
    "label_88_pointers",
    "label_90_pointers",
    "label_98_pointers",
    "label_ao_pointers",
    "label_as_pointers",
    "label_b8_pointers",
    "label_bo_pointers",
    "label_c8_pointers",
    "label_co_pointers",
    "label_do_pointers",
    "label_ds_pointers",
    "label_e8_pointers",
    "label_eo_pointers",
    "label_f8_pointers",
    "label_fo_pointers",
    "long_zero_padding_initial_run",
    "marker_sequence_eo_e8_fo_f8",
    "mixed_marker_block_including_r_star_rfc_anomaly",
    "offset_80_row_raw_bytes",
    "offset_88_row_raw_bytes",
    "offset_90_row_raw_bytes",
    "offset_98_row_raw_bytes",
    "offset_a0_row_raw_bytes",
    "offset_a8_row_raw_bytes",
    "offset_b0_row_raw_bytes",
    "offset_b8_row_raw_bytes",
    "offset_c0_block",
    "offset_c8_block",
    "offset_d0_block",
    "offset_d8_block",
    "offset_e0_block",
    "offset_e8_block",
    "offset_f0_block",
    "offset_f8_block_and_final_note",
    "offsets_00_08_10_18_hex_ascii_dump",
    "offsets_20_28_30_38_hex_ascii_dump",
    "offsets_40_48_50_58_hex_ascii_dump",
    "offsets_60_68_70_78_hex_ascii_dump",
    "padding_and_ascii_artifacts_block2",
    "padding_and_marker_pairs_block1",
    "periodic_nn_UU_uo_marker_cycle",
    "pre_trace_sector_dump_tail",
    "raw_block_dump_b0_b8",
    "raw_block_dump_c0_c8",
    "raw_block_dump_header_and_a0_a8",
    "relative_file_directory_entry_dump_part2",
    "remaining_data_and_trailer",
    "sector_06_16_dump_offsets_78_98",
    "sector_06_16_dump_offsets_98_b8",
    "sector_06_16_offset_38_end",
    "sector_06_16_offsets_00_07",
    "sector_06_16_offsets_08_17",
    "sector_06_16_offsets_18_27",
    "sector_06_16_offsets_28_2f",
    "sector_06_16_offsets_30_37",
    "sector_80_directory_dump",
    "sector_90_dump_padding",
    "sector_b8_dump",
    "sector_bo_dump",
    "sector_co_dump",
    "sector_do_dump",
    "sector_dump_column_15_and_leading_ascii_noise",
    "sector_dump_column_16_pointer_table_entries",
    "sector_dump_column_17_continued_entries",
    "sector_dump_final_zero_padding_and_trailer_byte",
    "sector_dump_header_and_initial_nonzero_bytes",
    "sector_dump_marker_codes_and_small_patterns",
    "sector_dump_zero_padding_and_a8_bo_block",
    "sector_end_marker_block_eo_e8_fo_f8",
    "sector_eo_dump",
    "sector_fo_dump",
    "sector_offset_C0_and_transition_to_text",
    "sector_offsets_A8_B0_B8",
    "sector_padding_byte_sequence_dump",
    "sequential_file_dot_filler_block",
    "sequential_file_trailer_zeroes_and_summary",
    "sequential_start_block_dump_part1",
    "sequential_start_block_dump_part2",
    "sequential_start_block_dump_part3",
    "sequential_start_block_dump_part4",
    "side_sector_0_pointer_table_18_20",
    "side_sector_0_pointer_table_20_28",
    "side_sector_0_pointer_table_28_38",
    "side_sector_0_pointer_table_38_40",
    "side_sector_0_pointer_table_40_48",
    "side_sector_0_pointer_table_48_50",
    "side_sector_0_pointer_table_50_58",
    "side_sector_0_pointer_table_58_60",
    "side_sector_0_pointer_table_60_68",
    "side_sector_0_pointer_table_68_70",
    "track06_sector16_offsets_40_47",
    "track06_sector16_offsets_48_57",
    "track06_sector16_offsets_58_67",
    "track06_sector16_offsets_68_70",
    "track12_sector19_side1_c0_row",
    "track12_sector19_side1_c8_row",
    "track12_sector19_side1_d0_row",
    "track12_sector19_side1_d8_row",
    "track12_sector19_side1_e0_row",
    "track12_sector19_side1_e8_row",
    "track12_sector19_side1_f0_row",
    "track12_sector19_side1_f8_row",
    "track12_sector19_side1_header_and_offset_00",
    "track12_sector19_side1_offset_08",
    "track12_sector19_side1_offset_10",
    "track12_sector19_side1_offset_18_labelled_is",
    "track12_sector19_side1_offset_20",
    "track12_sector19_side1_offset_28",
    "track12_sector19_side1_offset_30",
    "track12_sector19_side1_offset_38",
    "track12_sector19_side1_offset_40_row",
    "track12_sector19_side1_offset_48_row",
    "track12_sector19_side1_offset_50_row",
    "track12_sector19_side1_offset_58_row",
    "track12_sector19_side1_offset_60_row",
    "track12_sector19_side1_offset_63_row",
    "track12_sector19_side1_offset_70_row",
    "track12_sector19_side1_offset_78_row",
    "track17_sector03_offset_0x40_null_padding",
    "track17_sector03_offset_0x48_null_padding",
    "track17_sector03_offset_0x50_null_padding",
    "track17_sector03_offset_0x58_null_padding",
    "track17_sector03_offset_0x60_null_padding",
    "track17_sector03_offset_0x68_null_padding",
    "track17_sector03_offset_0x70_null_padding",
    "track17_sector03_offset_0x78_null_padding",
    "track17_sector03_offset_0x80_null_padding",
    "track17_sector03_offset_0x88_null_padding",
    "track17_sector03_offset_0x90_null_padding",
    "track17_sector11_entry_08_sound",
    "track17_sector11_entry_10_alien",
    "track17_sector11_entry_18_sound",
    "track17_sector11_entry_20_bomb",
    "track17_sector11_entry_28_cl_entry",
    "track17_sector11_entry_30_ap_sound",
    "track17_sector11_entry_38_gunfi",
    "track17_sector11_entry_40_re_sound",
    "track17_sector11_entry_48_pong",
    "track17_sector11_entry_50_sound",
    "track17_sector11_entry_58_raygun_s",
    "track17_sector11_entry_60_sound_s",
    "track17_sector11_entry_68_iren_spr",
    "track17_sector11_entry_70_boot",
    "track17_sector11_entry_78_supermo",
    "track17_sector11_entry_80_n64_v1",
    "track17_sector11_entry_88_tsprites",
    "track17_sector11_header_and_entry_00_yank",
    "track17_sector14_ascii_text_segment_30_40",
    "track17_sector14_block_18_20",
    "track17_sector14_continuation_dot_sequences_68_70",
    "track17_sector14_header_and_initial_bytes",
    "track17_sector14_null_padding_and_footer_78_90",
    "track17_sector14_numeric_and_punctuation_segment_48_60",
    "track19_sector15_side3_hex_table_continuation",
    "track19_sector15_side3_hex_table_end_and_trailer",
    "track19_sector15_side3_hex_table_start",
    "trailing_zero_block_with_sparse_markers",
    "trailing_zero_padding",
}


def main():
    config = json.loads(CONFIG.read_text())
    splits = config["splits"]

    ignored = 0
    not_found = []
    found_names = set()

    # Mark matching chunks as ignored, merging adjacent ones
    for entry in splits:
        name = entry.get("name")
        if name and name in GARBAGE_CHUNKS:
            found_names.add(name)
            # Replace with ignore entry, keeping start/end
            start = entry["start"]
            end = entry["end"]
            entry.clear()
            entry["start"] = start
            entry["end"] = end
            entry["ignore"] = True
            entry["reason"] = "OCR'd hex/sector dump - no technical content"
            ignored += 1

    # Merge adjacent ignored entries
    merged = []
    for entry in splits:
        if (entry.get("ignore") and merged and merged[-1].get("ignore")
                and entry.get("reason") == merged[-1].get("reason")
                and entry["start"] <= merged[-1]["end"] + 2):
            merged[-1]["end"] = entry["end"]
        else:
            merged.append(entry)

    config["splits"] = merged
    CONFIG.write_text(json.dumps(config, indent=2, ensure_ascii=False) + "\n")

    print(f"Marked {ignored} chunks as ignored ({len(merged)} splits after merging, was {len(splits)})")

    # Report any names not found in the config
    not_found = GARBAGE_CHUNKS - found_names
    if not_found:
        print(f"\nWARNING: {len(not_found)} chunk names not found in config:")
        for n in sorted(not_found):
            print(f"  {n}")

    # Delete output files
    deleted_data = 0
    deleted_split = 0
    for name in sorted(found_names):
        md = DATA_DIR / f"{name}.md"
        txt = SPLIT_DIR / f"{name}.txt"
        if md.exists():
            md.unlink()
            deleted_data += 1
        if txt.exists():
            txt.unlink()
            deleted_split += 1

    print(f"Deleted {deleted_data} .md files from training/data/")
    print(f"Deleted {deleted_split} .txt files from training/split/")


if __name__ == "__main__":
    main()
