# C64 / 6502 Development Environment

Development environment for Commodore 64 assembly programming using KickAssembler and AI-assisted coding with a Qdrant knowledge base.

## Prerequisites

- Arch Linux (or compatible distro with AUR access)
- Docker
- direnv
- OpenAI API key (for Qdrant embeddings)

## Installation

### 1. Install Docker

```bash
paru -S docker
sudo systemctl enable docker.socket
sudo systemctl start docker.socket
sudo usermod -aG docker $USER
```

Log out and back in for group changes to take effect.

### 2. Install direnv

```bash
sudo pacman -S direnv
```

Add the direnv hook to your shell (e.g., for bash, add to `~/.bashrc`):
```bash
eval "$(direnv hook bash)"
```

### 3. Configure Environment

```bash
cp .envrc.example .envrc
# Edit .envrc and set your OPENAI_API_KEY
direnv allow .
```

## Creating a New C64 Project

Copy these files to your new project directory:
- `CLAUDE.md` - AI assistant instructions for C64 development
- `.mcp.json` - MCP server configuration for Qdrant
- `.envrc.example` - Environment variable template

## Usage

Compile assembly files with KickAssembler:
```bash
kickass filename.asm
```

This produces a `.prg` file that can be run in a C64 emulator (VICE, etc.).

## Adding Training Content

The knowledge base is built from training documents that are split into semantic chunks for better retrieval.

### Directory Structure

```
training/
  raw/           # Original source documents
  split_config/  # JSON configs defining how to split each file
  split/         # Generated chunks (output)
```

### Workflow

#### 1. Add Raw Document

Place your new document in `training/raw/`. Supported formats: `.txt`

#### 2. Create Split Configuration

Use the `/split-training` command to analyze the document and generate a split config:

```
/split-training my_document.txt
```

The agent will:
- Analyze the document structure
- Find logical split points (chapters, sections, topics)
- Target chunks under 4KB (up to 8KB only if content cannot be split smaller)
- Add context headers so each chunk is self-contained
- Create the config file in `training/split_config/`

The config format is `training/split_config/<filename>.json`:

```json
{
  "source_file": "my_document.txt",
  "target_chunk_size": 4000,
  "splits": [
    {
      "line": 85,
      "context": "Section Title - Brief Description"
    },
    {
      "line": 200,
      "context": "Another Section - What This Covers"
    }
  ]
}
```

- `line`: Line number where a new chunk begins
- `context`: Header prepended to the chunk (e.g., `# Context Header`)

The first chunk runs from line 1 to the first split. Each subsequent chunk runs from its split line to the next (or end of file).

#### 3. Run the Split Script

```bash
# Split a specific file
python3 scripts/split_training.py "my_document.json"

# Or split all configured files
python3 scripts/split_training.py
```

Output goes to `training/split/` with naming: `<sanitized_name>_part01.txt`, etc.

#### 4. Index to Qdrant

Use the Qdrant MCP tools to reindex:

```
mcp__qdrant-local__reindex_changes(path="/path/to/training/split")
```

Or for a fresh index:

```
mcp__qdrant-local__index_codebase(path="/path/to/training/split")
```

### Split Guidelines

- **Logical breaks**: Split at chapter/section boundaries, not mid-paragraph
- **Self-contained**: Each chunk should make sense on its own
- **Context headers**: Describe what the chunk covers (e.g., "6502 Instructions - Branch Operations")
- **Size targets**: Aim for <4KB, allow up to 8KB only when content is indivisible
