import { describe, expect, it } from 'vitest';
import { buildDateAdvice, detectDateMood } from './dateAdvice';

describe('date advice engine', () => {
  it('detects excited recaps and recommends direct follow-up', () => {
    const advice = buildDateAdvice('The date was amazing, we laughed a lot, and the chemistry felt easy.');

    expect(advice.mood).toBe('excited');
    expect(advice.nextSteps[0]).toContain('within 24 hours');
  });

  it('prioritizes safety concerns over chemistry', () => {
    expect(detectDateMood('We had chemistry, but they were rude and pushed my boundaries.')).toBe('concerned');
  });

  it('offers low-pressure guidance when the recap sounds uncertain', () => {
    const advice = buildDateAdvice('I am unsure because it was awkward and mixed.');

    expect(advice.mood).toBe('uncertain');
    expect(advice.nextDateIdeas.some((idea) => idea.includes('45-minute'))).toBe(true);
  });
});
