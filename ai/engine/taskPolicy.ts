export type TaskProfile = { domain: 'general' | 'tourism' | 'auto'; complexity: 'standard' | 'complex' };
/** A routing hint, never a gate on which questions the model may answer. */
export function taskProfile(message: string): TaskProfile {
  const general = /```|\b(debug|javascript|typescript|python|algorithm|equation|calculate|multiplied|algebra|photosynthesis|translate|summariz\w*|essay|poem|write|explain|science|programming|binary search)\b|समझाओ|गणित|अनुवाद/i.test(message);
  const tourism = /\b(trip|itinerary|tourism|heritage|monument|hotel|flight|train|festival|visit|travel|temple|fort|discover bharat|attraction|destination|nearby|hidden gems?|offbeat|wildlife|sanctuary|museum|restaurant|route|stay|beach|waterfall|city guide)\b|यात्रा|मंदिर|घूम|ghum|ghoom|छुपे|पर्यटन/i.test(message);
  return { domain: tourism ? 'tourism' : general ? 'general' : 'auto',
    complexity: message.length > 700 || /\b(prove|debug|optimi[sz]e|trade.?offs|step.by.step|multi.step|constraints)\b/i.test(message) ? 'complex' : 'standard' };
}

export class CapacityGate {
  active = 0;
  acquire(limit: number) {
    if (this.active >= limit) throw new Error('MODEL_CAPACITY_BUSY');
    this.active++;
    let released = false;
    return () => { if (!released) { released = true; this.active--; } };
  }
}
export const generationCapacity = new CapacityGate();
export const generationMetrics = { completed: 0, failed: 0, total_latency_ms: 0, prompt_tokens: 0, completion_tokens: 0 };
