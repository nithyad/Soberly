import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('Soberly website', () => {
  it('integrates the voice agent into a complete marketing page', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /a voice agent for deciding what to do after the date/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /try the coach/i })).toHaveAttribute('href', '#voice-agent');
    expect(screen.getByRole('heading', { name: /talk through your date and get a grounded next move/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /safety-forward advice/i })).toBeInTheDocument();
  });
});
