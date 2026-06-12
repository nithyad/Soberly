# Soberly Voice Date Coach Demo

Soberly is a React + Vite prototype for a website that embeds a voice-first dating coach. Users can talk through a date or type a recap, then receive next steps, second-date ideas, and follow-up message starters.

## Run the demo locally

```bash
npm install
npm run dev
```

Open the local Vite URL, usually <http://127.0.0.1:5173/> or <http://localhost:5173/>.

## Demo walkthrough

1. Click **Try the coach** in the navigation or **Start talking** in the hero.
2. In the voice-agent section, choose one of the **Try a demo** recaps:
   - **Great chemistry** shows a high-momentum follow-up.
   - **Mixed signals** shows a slower, lower-pressure second-date plan.
   - **Boundary concern** shows safety-forward advice.
3. Optionally click **Read advice aloud** to hear the generated recommendation.
4. To demo live speech, click **Start talking** and allow microphone access. Browser voice input works best in Chrome or Edge; the text area remains available everywhere.

## Quality checks

```bash
npm test
npm run build
npm run lint
```
