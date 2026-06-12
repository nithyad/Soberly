export type DateMood = 'excited' | 'uncertain' | 'concerned' | 'calm';

export interface DateAdvice {
  mood: DateMood;
  headline: string;
  nextSteps: string[];
  nextDateIdeas: string[];
  conversationStarters: string[];
}

const POSITIVE_TERMS = ['great', 'amazing', 'fun', 'chemistry', 'laughed', 'laugh', 'connected', 'easy', 'spark', 'kiss'];
const UNCERTAIN_TERMS = ['unsure', 'mixed', 'awkward', 'maybe', 'quiet', 'nervous', 'confusing', 'unclear'];
const CONCERN_TERMS = ['red flag', 'rude', 'drunk', 'unsafe', 'pressure', 'pushed', 'ignored', 'angry', 'jealous'];

const countTerms = (text: string, terms: string[]) => terms.reduce((count, term) => count + (text.includes(term) ? 1 : 0), 0);

export function detectDateMood(transcript: string): DateMood {
  const normalized = transcript.toLowerCase();
  const positiveScore = countTerms(normalized, POSITIVE_TERMS);
  const uncertainScore = countTerms(normalized, UNCERTAIN_TERMS);
  const concernScore = countTerms(normalized, CONCERN_TERMS);

  if (concernScore > 0 && concernScore >= positiveScore) {
    return 'concerned';
  }

  if (positiveScore >= 2 && positiveScore > uncertainScore) {
    return 'excited';
  }

  if (uncertainScore > 0) {
    return 'uncertain';
  }

  return 'calm';
}

export function buildDateAdvice(transcript: string): DateAdvice {
  const mood = detectDateMood(transcript);

  const adviceByMood: Record<DateMood, DateAdvice> = {
    excited: {
      mood,
      headline: 'It sounds like there is real momentum worth nurturing.',
      nextSteps: [
        'Send a warm message within 24 hours naming one specific moment you enjoyed.',
        'Suggest a clear next plan instead of keeping things vague.',
        'Keep your pacing steady: show interest without over-explaining or planning too far ahead.',
      ],
      nextDateIdeas: [
        'A low-pressure coffee walk in a scenic neighborhood',
        'A cooking class or dessert tasting where you can compare favorites',
        'A museum visit followed by a short drink or mocktail stop',
      ],
      conversationStarters: [
        '“I kept thinking about when we laughed about ____. Want to continue the story this week?”',
        '“I had a really good time. Would you be up for ____ on Thursday or Saturday?”',
      ],
    },
    uncertain: {
      mood,
      headline: 'There may be something to explore, but it is okay to gather more data slowly.',
      nextSteps: [
        'Check whether the awkwardness came from nerves, mismatch, or unmet expectations.',
        'If you are curious, propose a shorter second date with an easy exit point.',
        'Notice how they respond to a clear invitation and whether effort feels mutual.',
      ],
      nextDateIdeas: [
        'A 45-minute coffee or tea meet-up',
        'A bookstore browse with each person picking a recommendation',
        'A casual lunch near an activity you already enjoy',
      ],
      conversationStarters: [
        '“I enjoyed getting to know you and would be open to a relaxed coffee if you are.”',
        '“I was a little nervous at first, but I liked hearing about ____. Want to pick that back up?”',
      ],
    },
    concerned: {
      mood,
      headline: 'Your comfort and safety matter more than making the connection work.',
      nextSteps: [
        'Write down what felt off while it is fresh so you do not minimize it later.',
        'If you felt unsafe or pressured, do not meet again in private and consider ending contact.',
        'If you choose to respond, keep it brief, clear, and boundary-focused.',
      ],
      nextDateIdeas: [
        'If you continue, choose a public daytime place and tell a friend your plan',
        'Plan something time-boxed, such as coffee before another commitment',
        'Skip another date if the concern involved disrespect, pressure, or safety',
      ],
      conversationStarters: [
        '“I do not think we are the right fit, but I wish you well.”',
        '“I am only comfortable meeting in public and keeping things low-key.”',
      ],
    },
    calm: {
      mood,
      headline: 'You have enough information to choose an intentional next step.',
      nextSteps: [
        'Name what you liked, what you are unsure about, and what you want to learn next.',
        'Send a simple follow-up if you want another conversation.',
        'Choose a date idea that creates room for talking instead of only watching or performing.',
      ],
      nextDateIdeas: [
        'A walk-and-talk with coffee or tea',
        'A casual trivia night with an agreed end time',
        'A farmers market, gallery, or neighborhood stroll',
      ],
      conversationStarters: [
        '“Thanks again for meeting up. I liked hearing about ____. Want to do another low-key plan?”',
        '“I had a nice time and would be interested in getting to know you more.”',
      ],
    },
  };

  return adviceByMood[mood];
}
