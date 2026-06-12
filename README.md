# Soberly

Soberly is a static voice-first date coach prototype. Users can speak or type a date recap, then get conversational post-date advice: how to think about what happened, what to do next, what signals to watch for, and ideas for future dates.

## Run locally

Serve the folder from a local HTTP server so browser microphone permissions work:

```bash
python3 -m http.server 8766
```

Then open <http://127.0.0.1:8766/>.

Voice input depends on browser support for speech recognition and microphone permissions. The text box fallback works in any modern browser.

<img width="593" height="777" alt="Screenshot 2026-06-12 at 9 44 32 AM" src="https://github.com/user-attachments/assets/1864f10c-6586-4247-99a1-d790440b9cca" />
<img width="600" height="778" alt="Screenshot 2026-06-12 at 9 44 21 AM" src="https://github.com/user-attachments/assets/ed519f1d-ed14-4591-833f-910c0df2b680" />
