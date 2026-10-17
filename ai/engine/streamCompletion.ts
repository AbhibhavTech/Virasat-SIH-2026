/** Assemble OpenAI-compatible SSE deltas, including fragmented tool arguments. */
export async function readStreamCompletion(response: Response, onText: (text: string) => void) {
  if (!response.body) throw new Error('MODEL_INVALID_RESPONSE');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let pending = '', content = '', bytes = 0;
  const calls = new Map<number, any>();
  let usage: any;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.length;
      if (bytes > 2_000_000) throw new Error('MODEL_RESPONSE_TOO_LARGE');
      pending += decoder.decode(value, { stream: true });
      let newline: number;
      while ((newline = pending.indexOf('\n')) >= 0) {
        const line = pending.slice(0, newline).trim(); pending = pending.slice(newline + 1);
        if (!line.startsWith('data:') || line.slice(5).trim() === '[DONE]') continue;
        const event = JSON.parse(line.slice(5));
        if (event.error) throw new Error('MODEL_STREAM_FAILED');
        if (event.usage) usage = event.usage;
        const delta = event.choices?.[0]?.delta;
        if (typeof delta?.content === 'string') { content += delta.content; onText(delta.content); }
        for (const part of delta?.tool_calls || []) {
          if (!Number.isInteger(part.index) || part.index < 0 || part.index > 5) throw new Error('MODEL_TOOL_LIMIT');
          const call = calls.get(part.index) || { id: '', type: 'function', function: { name: '', arguments: '' } };
          if (part.id) call.id = part.id;
          if (part.function?.name) call.function.name += part.function.name;
          if (part.function?.arguments) call.function.arguments += part.function.arguments;
          calls.set(part.index, call);
        }
      }
    }
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
  if (pending.trim()) throw new Error('MODEL_STREAM_INCOMPLETE');
  return { usage, choices: [{ message: { role: 'assistant', content, tool_calls: [...calls.values()] } }] };
}
