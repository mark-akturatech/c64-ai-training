// ============================================================================
// AI Client — wraps OpenAI for structured JSON responses
//
// Supports GPT-5 reasoning_effort + text_verbosity parameters for
// controlling thinking depth and output style per-call.
// ============================================================================

import OpenAI from "openai";

export type ReasoningEffort = "minimal" | "low" | "medium" | "high";
export type TextVerbosity = "low" | "medium" | "high";

export interface AIClientOptions {
  apiKey?: string;
  model?: string;
}

export interface AICallOptions {
  /** How hard the model should think. "low" for simple lookups, "high"/"xhigh" for RE. */
  reasoning_effort?: ReasoningEffort;
  /** How verbose the response should be. "low" for terse JSON, "high" for detailed docs. */
  text_verbosity?: TextVerbosity;
  /** Override system prompt for this call. */
  systemPrompt?: string;
}

export class AIClient {
  private client: OpenAI;
  private model: string;
  private totalCalls = 0;
  private totalTokens = 0;

  constructor(opts: AIClientOptions = {}) {
    this.client = new OpenAI({ apiKey: opts.apiKey ?? process.env.OPENAI_API_KEY });
    this.model = opts.model ?? process.env.RE_MODEL ?? "gpt-5-mini";
  }

  get stats() {
    return { calls: this.totalCalls, tokens: this.totalTokens };
  }

  /**
   * Send a prompt and get back a parsed JSON object.
   * Uses response_format: json_object for reliable parsing.
   */
  async jsonCall(prompt: string, opts?: AICallOptions): Promise<Record<string, unknown>> {
    this.totalCalls++;
    const messages: OpenAI.ChatCompletionMessageParam[] = [];

    const systemPrompt = opts?.systemPrompt ??
      "You are a 6502/C64 reverse engineering expert. Always respond with valid JSON.";
    messages.push({ role: "system", content: systemPrompt });
    messages.push({ role: "user", content: prompt });

    const params: Record<string, unknown> = {
      model: this.model,
      messages,
      response_format: { type: "json_object" },
    };
    if (opts?.reasoning_effort) params.reasoning_effort = opts.reasoning_effort;
    // text_verbosity — not yet supported on all models, skip if absent
    // if (opts?.text_verbosity) params.text_verbosity = opts.text_verbosity;

    const response = await this.client.chat.completions.create(params as any);

    const content = response.choices[0]?.message?.content ?? "{}";
    this.totalTokens += response.usage?.total_tokens ?? 0;

    try {
      return JSON.parse(content);
    } catch {
      return { raw: content, error: "Failed to parse JSON response" };
    }
  }

  /**
   * Simple text call — for concept extraction etc.
   */
  async textCall(prompt: string, opts?: AICallOptions): Promise<string> {
    this.totalCalls++;

    const systemPrompt = opts?.systemPrompt ??
      "You are a 6502/C64 reverse engineering expert.";

    const params: Record<string, unknown> = {
      model: this.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    };
    if (opts?.reasoning_effort) params.reasoning_effort = opts.reasoning_effort;
    // text_verbosity — not yet supported on all models, skip if absent
    // if (opts?.text_verbosity) params.text_verbosity = opts.text_verbosity;

    const response = await this.client.chat.completions.create(params as any);

    const content = response.choices[0]?.message?.content ?? "";
    this.totalTokens += response.usage?.total_tokens ?? 0;
    return content;
  }
}
