/**
 * OpenAI embedding generation.
 */

import OpenAI from "openai";

export async function getEmbedding(
  client: OpenAI,
  text: string,
  model: string,
): Promise<number[]> {
  const response = await client.embeddings.create({
    model,
    input: [text],
  });
  return response.data[0].embedding;
}
