import { useMemo, useRef, useState } from 'react';
import { Lightbulb, Mic, MicOff, Sparkles, Volume2 } from 'lucide-react';
import { buildDateAdvice } from '../lib/dateAdvice';
import { getSpeechRecognitionConstructor, type SpeechRecognitionLike } from '../lib/speechRecognition';

const prompts = [
  'How did the date feel before, during, and after?',
  'What moments made you feel more connected or less connected?',
  'Did anything feel exciting, confusing, rushed, or unsafe?',
  'What would you like to happen next?',
];

function speakAdvice(text: string) {
  if (!('speechSynthesis' in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

export function VoiceDateCoach() {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const recognitionSupported = typeof window !== 'undefined' && Boolean(getSpeechRecognitionConstructor());
  const advice = useMemo(() => buildDateAdvice(transcript), [transcript]);
  const hasTranscript = transcript.trim().length > 0;

  const startListening = () => {
    const Recognition = getSpeechRecognitionConstructor();

    if (!Recognition) {
      setError('Voice input is not supported in this browser yet. You can still type your date recap below.');
      return;
    }

    setError(null);
    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalText = '';
      let interimText = '';

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const text = result[0]?.transcript ?? '';

        if (result.isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }

      if (finalText) {
        setTranscript((current) => `${current} ${finalText}`.trim());
      }

      setInterimTranscript(interimText);
    };

    recognition.onerror = (event) => {
      setError(`Voice input stopped: ${event.error}. You can keep typing your recap.`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    setInterimTranscript('');
  };

  const readAdvice = () => {
    const text = [
      advice.headline,
      'Next steps.',
      ...advice.nextSteps,
      'Next date ideas.',
      ...advice.nextDateIdeas,
    ].join(' ');

    speakAdvice(text);
  };

  return (
    <section className="voice-coach" aria-labelledby="voice-coach-title">
      <div className="coach-panel intro-panel">
        <div className="eyebrow">
          <Sparkles aria-hidden="true" size={18} />
          Voice date coach
        </div>
        <h1 id="voice-coach-title">Talk through your date and get a grounded next move.</h1>
        <p>
          Press the mic, describe what happened, and Soberly will organize your thoughts into next steps,
          message ideas, and low-pressure second-date plans.
        </p>

        <div className="prompt-grid" aria-label="Conversation prompts">
          {prompts.map((prompt) => (
            <span key={prompt}>{prompt}</span>
          ))}
        </div>
      </div>

      <div className="coach-panel recorder-panel">
        <div className="recorder-actions">
          <button
            className={`mic-button ${isListening ? 'listening' : ''}`}
            type="button"
            onClick={isListening ? stopListening : startListening}
            aria-pressed={isListening}
          >
            {isListening ? <MicOff aria-hidden="true" /> : <Mic aria-hidden="true" />}
            {isListening ? 'Stop listening' : 'Start talking'}
          </button>
          <button className="secondary-button" type="button" onClick={() => setTranscript('')} disabled={!hasTranscript}>
            Clear recap
          </button>
        </div>

        {!recognitionSupported && (
          <p className="support-note">Voice input works best in Chrome or Edge. Typing is available in every browser.</p>
        )}

        {error && <p className="error-note" role="alert">{error}</p>}

        <label htmlFor="date-recap">Your date recap</label>
        <textarea
          id="date-recap"
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          placeholder="Example: We got coffee, conversation felt easy, but I am not sure if they were interested in a second date..."
          rows={9}
        />

        {interimTranscript && <p className="interim-text">Hearing: {interimTranscript}</p>}
      </div>

      <aside className="coach-panel advice-panel" aria-live="polite">
        <div className={`mood-pill ${advice.mood}`}>{advice.mood}</div>
        <h2>{hasTranscript ? advice.headline : 'Your personalized advice will appear here.'}</h2>
        {!hasTranscript ? (
          <p className="empty-state">Start talking or type a recap to receive suggestions tailored to your situation.</p>
        ) : (
          <>
            <AdviceList title="Next steps" items={advice.nextSteps} />
            <AdviceList title="Next date ideas" items={advice.nextDateIdeas} />
            <AdviceList title="Message starters" items={advice.conversationStarters} />
            <button className="read-button" type="button" onClick={readAdvice}>
              <Volume2 aria-hidden="true" size={18} />
              Read advice aloud
            </button>
          </>
        )}
      </aside>
    </section>
  );
}

function AdviceList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="advice-list">
      <h3>
        <Lightbulb aria-hidden="true" size={18} />
        {title}
      </h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
