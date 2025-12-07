paru -S docker
sudo systemctl enable docker.socket
sudo systemctl start docker.socket

sudo usermod -aG docker $USER

sudo pacman -S direnv
direnv allow .

Direvn is needed to manage environment variables for the project as qdrant-local requires env to be added directly to mcp call and i dont want my open-api key in it.

docker run -d --name qdrant-db -p 6333:6333 -p 6334:6334 -v $(pwd)/qdrant_data:/qdrant/storage qdrant/qdrant:latest 


{
  "mcpServers": {
 "qdrant-local": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@mhalder/qdrant-mcp-server"],
      "env": {
        "TRANSPORT_MODE": "stdio",
        "EMBEDDING_PROVIDER": "openai",
        "EMBEDDING_MODEL": "text-embedding-3-large",
        "QDRANT_URL": "http://localhost:6333"
      }
    }
  }
}

























docker run -p 8000:8000 \
  -e FASTMCP_HOST="0.0.0.0" \
  -e QDRANT_URL="http://your-qdrant-server:6333" \
  -e QDRANT_API_KEY="your-api-key" \
  -e COLLECTION_NAME="your-collection" \
  mcp-server-qdrant


QDRANT_URL="http://localhost:6333" \
COLLECTION_NAME="my-6502-collection" \
EMBEDDING_MODEL="sentence-transformers/all-MiniLM-L6-v2" \
uvx mcp-server-qdrant


Idea here is to create a system for training AI to understand and write 6502 code for the c64.
https://github.com/qdrant/mcp-server-qdrant
https://skywork.ai/skypage/en/qdrant-mcp-semantic-memory-ai/1978001302501642240

Idea is we will use qdrant as vector db to store 6502 code snippets with embeddings.
We will train with mapping the 64 ascii document and 6502 opcode manual.

might need mcp-qdrant-docs for consumption.

OK so thoughts:
install qdrant via docker
might user docker externsion to start it? might need to use tasks to auto run it??

create claude.md file to orchestrate and use qdrant.

