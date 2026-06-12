# Soberly

Soberly is a static voice-first date coach prototype. Users can speak or type a date recap, then get post-date guidance about what to consider, what to do next, what signals to watch for, and ideas for future dates.

## Run locally

Serve the folder from a local HTTP server so browser microphone permissions work:

```bash
python3 -m http.server 8766
```

Then open <http://127.0.0.1:8766/>.

Voice input depends on browser support for speech recognition and microphone permissions. The text box fallback works in any modern browser.
