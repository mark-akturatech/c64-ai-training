#!/usr/bin/env python3
"""
Split C64 training documents into logical sections.
"""

import os
import re

TRAINING_DIR = "/home/mark/Development/6502/6502 training"
SPLIT_DIR = "/home/mark/Development/6502/6502 training/split"

def split_mapping_c64():
    """Split mapping-c64.txt by memory regions."""
    with open(f"{TRAINING_DIR}/mapping-c64.txt", 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    # Define split points by line patterns and output filenames
    # Patterns use flexible whitespace to match variations like ":: Chapter 4 ::" vs "::Chapter 4::"
    sections = [
        # (start_pattern, end_pattern, filename, description)
        (r'::\s*Chapter\s*1\s*::', r'::\s*Chapter\s*2\s*::', 'map_00_zero_page.txt', 'Zero Page $00-$FF'),
        (r'::\s*Chapter\s*2\s*::', r'::\s*Chapter\s*3\s*::', 'map_01_stack_page.txt', 'Stack Page $100-$1FF'),
        (r'::\s*Chapter\s*3\s*::', r'::\s*Chapter\s*4\s*::', 'map_02_basic_kernal_storage.txt', 'BASIC and Kernal Working Storage $200-$3FF'),
        (r'::\s*Chapter\s*4\s*::', r'::\s*Chapter\s*5', 'map_03_screen_memory.txt', 'Screen Memory and BASIC Program $400-$9FFF'),
        (r'::\s*Chapter\s*5', r'::\s*Chapter\s*6\s*::', 'map_04_basic_rom.txt', 'BASIC ROM $A000-$BFFF'),
        (r'::\s*Chapter\s*6\s*::', r'53248-53294', 'map_05_io_overview.txt', 'I/O Area Overview $D000-$DFFF'),
        (r'53248-53294', r'54272-54273', 'map_06_vic2_registers.txt', 'VIC-II Video Chip $D000-$D3FF'),
        (r'54272-54273', r'55296-56319', 'map_07_sid_registers.txt', 'SID Sound Chip $D400-$D7FF'),
        (r'55296-56319', r'56320-56335', 'map_08_color_ram.txt', 'Color RAM $D800-$DBFF'),
        (r'56320-56335', r'56576-56577', 'map_09_cia1.txt', 'CIA #1 Keyboard/Joystick $DC00-$DCFF'),
        (r'56576-56577', r'::\s*Chapter\s*7', 'map_10_cia2.txt', 'CIA #2 Serial/VIC Bank $DD00-$DDFF'),
        (r'::\s*Chapter\s*7', r'::\s*Appendix', 'map_11_kernal_rom.txt', 'Kernal ROM $E000-$FFFF'),
        (r'::\s*Appendix\s*C\s*::', r'::\s*Appendix\s*D\s*::', 'map_12_screen_location_table.txt', 'Screen Location Table'),
        (r'::\s*Appendix\s*D\s*::', r'::\s*Appendix\s*E\s*::', 'map_13_color_memory_table.txt', 'Color Memory Table'),
        (r'::\s*Appendix\s*H\s*::', r'Index\s*\(By Memory', 'map_14_keycodes.txt', 'Commodore 64 Keycodes'),
    ]

    for start_pat, end_pat, filename, desc in sections:
        try:
            start_match = re.search(start_pat, content, re.MULTILINE | re.IGNORECASE)
            end_match = re.search(end_pat, content, re.MULTILINE | re.IGNORECASE)

            if start_match and end_match:
                section = content[start_match.start():end_match.start()]
                # Add header
                section = f"# {desc}\n# Source: Mapping the Commodore 64\n\n{section}"

                with open(f"{SPLIT_DIR}/{filename}", 'w') as f:
                    f.write(section)
                print(f"Created {filename} ({len(section)} bytes)")
            elif start_match:
                # Take to end of file
                section = content[start_match.start():]
                section = f"# {desc}\n# Source: Mapping the Commodore 64\n\n{section}"
                with open(f"{SPLIT_DIR}/{filename}", 'w') as f:
                    f.write(section)
                print(f"Created {filename} ({len(section)} bytes) [to end]")
            else:
                print(f"Could not find section for {filename} (start: {start_pat})")
        except Exception as e:
            print(f"Error processing {filename}: {e}")


def split_rom_disassembly():
    """Split c64_rom_disassembly.txt by ROM sections - include all lines with context."""
    with open(f"{TRAINING_DIR}/c64_rom_disassembly.txt", 'r', encoding='utf-8', errors='replace') as f:
        lines = f.readlines()

    def get_section_name(addr):
        addr_int = int(addr, 16)
        if 0xA000 <= addr_int < 0xB000:
            return 'rom_basic_a000_afff.txt'
        elif 0xB000 <= addr_int < 0xC000:
            return 'rom_basic_b000_bfff.txt'
        elif 0xE000 <= addr_int < 0xE800:
            return 'rom_kernal_e000_e7ff.txt'
        elif 0xE800 <= addr_int < 0xF000:
            return 'rom_kernal_e800_efff.txt'
        elif 0xF000 <= addr_int < 0xF800:
            return 'rom_kernal_f000_f7ff.txt'
        elif 0xF800 <= addr_int <= 0xFFFF:
            return 'rom_kernal_f800_ffff.txt'
        return None

    collected = {}
    current_section = None
    pending_comments = []

    for line in lines:
        # Look for address pattern - format is .:A000 or .,A000
        match = re.match(r'\.[,:]:?([0-9a-fA-F]{4})', line)
        if match:
            addr = match.group(1)
            section_name = get_section_name(addr)
            if section_name:
                current_section = section_name
                if section_name not in collected:
                    collected[section_name] = []
                # Add any pending comments
                collected[section_name].extend(pending_comments)
                pending_comments = []
                collected[section_name].append(line)
            else:
                current_section = None
        elif current_section:
            # This is a comment or continuation for current section
            collected[current_section].append(line)
        elif line.strip().startswith('*') or line.strip() == '' or line.startswith(' '):
            # Save comments that might belong to next section
            pending_comments.append(line)
        else:
            pending_comments = []  # Reset if not a comment

    for name, section_lines in collected.items():
        section = ''.join(section_lines)
        desc = name.replace('.txt', '').replace('_', ' ').upper()
        section = f"# {desc}\n# Source: C64 ROM Disassembly\n\n{section}"
        with open(f"{SPLIT_DIR}/{name}", 'w') as f:
            f.write(section)
        print(f"Created {name} ({len(section)} bytes, {len(section_lines)} lines)")


def split_64doc():
    """Split 64doc.txt - copy whole file as it's a technical reference without clear sections."""
    with open(f"{TRAINING_DIR}/64doc.txt", 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    # The 64doc file doesn't have clear section headers, so copy it as-is
    # smart_split.py will handle chunking it into smaller pieces
    filename = "64doc.txt"
    with open(f"{SPLIT_DIR}/{filename}", 'w') as f:
        f.write(f"# NMOS 65xx/85xx Technical Documentation\n# Source: 64doc.txt\n\n{content}")
    print(f"Created {filename} ({len(content)} bytes)")


def split_6502_instructions():
    """Split 6502 instructions.txt - just copy whole file, it's reference material."""
    with open(f"{TRAINING_DIR}/6502 instructions.txt", 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    # This is a reference file - split into chunks by size
    chunk_size = 50000
    chunks = []
    current = []
    current_size = 0

    for line in content.split('\n'):
        current.append(line)
        current_size += len(line)
        if current_size > chunk_size and line.strip() == '':
            chunks.append('\n'.join(current))
            current = []
            current_size = 0

    if current:
        chunks.append('\n'.join(current))

    for i, chunk in enumerate(chunks):
        filename = f"6502_instructions_part{i+1}.txt"
        with open(f"{SPLIT_DIR}/{filename}", 'w') as f:
            f.write(f"# 6502 Instructions Reference Part {i+1}\n\n{chunk}")
        print(f"Created {filename} ({len(chunk)} bytes)")


def split_kickassembler():
    """Split KickAssembler manual by major sections."""
    with open(f"{TRAINING_DIR}/KickAssembler_321_Manual.txt", 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    # Split into chunks by size since finding exact sections is tricky
    chunk_size = 40000
    chunks = []
    current = []
    current_size = 0

    for line in content.split('\n'):
        current.append(line)
        current_size += len(line)
        if current_size > chunk_size and line.strip() == '':
            chunks.append('\n'.join(current))
            current = []
            current_size = 0

    if current:
        chunks.append('\n'.join(current))

    for i, chunk in enumerate(chunks):
        filename = f"kickassembler_part{i+1}.txt"
        with open(f"{SPLIT_DIR}/{filename}", 'w') as f:
            f.write(f"# KickAssembler Manual Part {i+1}\n\n{chunk}")
        print(f"Created {filename} ({len(chunk)} bytes)")


def copy_small_files():
    """Copy already appropriately-sized files."""
    small_files = [
        '6502 ADDRESSING MODES.txt',
        '6502 Instructions Detail.txt',
        '6502.txt',
        'Architecture 6502.txt',
        'Generic Address Modes.txt',
        'Program Ex 01.txt',
        'Program Ex 02.txt',
        'the B flag and BRK instruction.txt',
    ]

    for filename in small_files:
        src = f"{TRAINING_DIR}/{filename}"
        # Clean up filename for dest
        dest_name = filename.replace(' ', '_').lower()
        dest = f"{SPLIT_DIR}/{dest_name}"

        if os.path.exists(src):
            with open(src, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()
            with open(dest, 'w') as f:
                f.write(content)
            print(f"Copied {filename} -> {dest_name} ({len(content)} bytes)")


if __name__ == '__main__':
    # Clean split directory first
    import shutil
    if os.path.exists(SPLIT_DIR):
        shutil.rmtree(SPLIT_DIR)
    os.makedirs(SPLIT_DIR)

    print("=== Splitting mapping-c64.txt ===")
    split_mapping_c64()

    print("\n=== Splitting c64_rom_disassembly.txt ===")
    split_rom_disassembly()

    print("\n=== Splitting 64doc.txt ===")
    split_64doc()

    print("\n=== Splitting 6502 instructions.txt ===")
    split_6502_instructions()

    print("\n=== Splitting KickAssembler manual ===")
    split_kickassembler()

    print("\n=== Copying small files ===")
    copy_small_files()

    print("\n=== Summary ===")
    files = os.listdir(SPLIT_DIR)
    total_size = sum(os.path.getsize(f"{SPLIT_DIR}/{f}") for f in files)
    print(f"Created {len(files)} files, total size: {total_size:,} bytes")
