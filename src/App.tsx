import { ArrowRight, CalendarHeart, HeartHandshake, LockKeyhole, MessageCircleHeart, Mic2, ShieldCheck } from 'lucide-react';
import { VoiceDateCoach } from './components/VoiceDateCoach';
import './styles.css';

const featureCards = [
  {
    icon: Mic2,
    title: 'Voice-first reflection',
    description: 'Talk naturally after a date and watch your recap become organized into themes, signals, and questions.',
  },
  {
    icon: MessageCircleHeart,
    title: 'Message starters',
    description: 'Get practical follow-up texts for warm momentum, mixed signals, or a respectful no-thanks.',
  },
  {
    icon: CalendarHeart,
    title: 'Next-date ideas',
    description: 'Choose date plans that fit the vibe: short, safe, conversation-friendly, or intentionally romantic.',
  },
];

const steps = [
  'Press the microphone or type a quick recap.',
  'Share what felt exciting, confusing, comfortable, or off.',
  'Review personalized next steps and copy a starter message.',
];

export default function App() {
  return (
    <main className="site-shell">
      <header className="site-header">
        <nav className="top-nav" aria-label="Soberly navigation">
          <a className="brand" href="/" aria-label="Soberly home">
            <HeartHandshake aria-hidden="true" size={28} />
            <span>Soberly</span>
          </a>
          <div className="nav-links">
            <a href="#how-it-works">How it works</a>
            <a href="#voice-agent">Voice agent</a>
            <a href="#safety">Safety</a>
          </div>
          <a className="nav-cta" href="#voice-agent">
            Try the coach
          </a>
        </nav>
      </header>

      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow">AI dating support that feels grounded</div>
          <h1 id="hero-title">A voice agent for deciding what to do after the date.</h1>
          <p>
            Soberly helps users talk through what happened, spot green and red flags, and leave with a clear next move:
            send the text, plan the next date, slow things down, or walk away with confidence.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="#voice-agent">
              Start talking
              <ArrowRight aria-hidden="true" size={18} />
            </a>
            <a className="secondary-link" href="#how-it-works">See how it works</a>
          </div>
        </div>

        <div className="hero-card" aria-label="Example coaching result">
          <div className="hero-card-header">
            <span className="live-dot" />
            Voice recap analyzed
          </div>
          <p>“Conversation was easy, but I am not sure if they want a second date.”</p>
          <ul>
            <li>Ask with a clear, low-pressure plan.</li>
            <li>Choose a short second date with room to talk.</li>
            <li>Watch for mutual effort in their response.</li>
          </ul>
        </div>
      </section>

      <section className="feature-section" aria-label="Voice agent features">
        {featureCards.map(({ icon: Icon, title, description }) => (
          <article className="feature-card" key={title}>
            <Icon aria-hidden="true" size={24} />
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <section className="process-section" id="how-it-works" aria-labelledby="process-title">
        <div>
          <div className="eyebrow">How it works</div>
          <h2 id="process-title">Built into the website, ready when the date ends.</h2>
        </div>
        <ol>
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="embedded-agent" id="voice-agent" aria-label="Soberly voice agent">
        <VoiceDateCoach />
      </section>

      <section className="safety-section" id="safety" aria-labelledby="safety-title">
        <div className="safety-card">
          <ShieldCheck aria-hidden="true" size={28} />
          <h2 id="safety-title">Safety-forward advice</h2>
          <p>
            The coach prioritizes boundaries and public, time-boxed plans when a recap includes pressure, disrespect, or
            safety concerns.
          </p>
        </div>
        <div className="safety-card">
          <LockKeyhole aria-hidden="true" size={28} />
          <h2>Private by design</h2>
          <p>
            This prototype analyzes recaps in the browser and includes a typing fallback for browsers where voice input is
            unavailable.
          </p>
        </div>
      </section>
    </main>
  );
}
