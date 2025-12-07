#!/usr/bin/env python3
"""
Full import of mapping-c64.txt into Qdrant.
Uses requests to communicate with Qdrant directly.
"""

import json
import requests
import hashlib
from openai import OpenAI

QDRANT_URL = "http://localhost:6333"
COLLECTION = "6502-knowledge"

def get_embedding(text: str, client: OpenAI) -> list:
    """Get embedding from OpenAI."""
    response = client.embeddings.create(
        model="text-embedding-3-large",
        input=text
    )
    return response.data[0].embedding

def main():
    # Load parsed documents
    with open('/home/mark/Development/6502/mapping_parsed.json', 'r') as f:
        docs = json.load(f)

    print(f"Loaded {len(docs)} documents")

    # Initialize OpenAI client
    client = OpenAI()

    # Process in batches
    batch_size = 20
    for i in range(0, len(docs), batch_size):
        batch = docs[i:i+batch_size]
        points = []

        for doc in batch:
            # Generate unique ID from doc id
            point_id = hashlib.md5(doc['id'].encode()).hexdigest()[:32]
            # Convert to UUID format
            point_id = f"{point_id[:8]}-{point_id[8:12]}-{point_id[12:16]}-{point_id[16:20]}-{point_id[20:32]}"

            # Get embedding
            embedding = get_embedding(doc['text'], client)

            point = {
                "id": point_id,
                "vector": embedding,
                "payload": {
                    "text": doc['text'],
                    "source": doc['source'],
                    "hex_start": doc['hex_start'],
                    "hex_end": doc['hex_end'],
                    "label": doc.get('label', ''),
                    "type": doc['type'],
                    "doc_id": doc['id']
                }
            }
            points.append(point)

        # Upsert to Qdrant
        response = requests.put(
            f"{QDRANT_URL}/collections/{COLLECTION}/points",
            json={"points": points}
        )

        if response.status_code == 200:
            print(f"Imported batch {i//batch_size + 1}/{(len(docs) + batch_size - 1)//batch_size} ({len(batch)} docs)")
        else:
            print(f"Error importing batch: {response.text}")
            break

    print("Done!")

if __name__ == '__main__':
    main()
