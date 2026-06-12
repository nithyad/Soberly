const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const storyInput = document.querySelector("#dateStory");
const listenButton = document.querySelector("#listenButton");
const micButton = document.querySelector("#micButton");
const analyzeButton = document.querySelector("#analyzeButton");
const speakToggle = document.querySelector("#speakToggle");
const localLink = document.querySelector("#localLink");
const supportStatus = document.querySelector("#supportStatus");
const stage = document.querySelector(".agent-stage");
const coachMessage = document.querySelector("#coachMessage");
const vibeScore = document.querySelector("#vibeScore");
const momentumScore = document.querySelector("#momentumScore");
const nextStepLabel = document.querySelector("#nextStepLabel");
const adviceList = document.querySelector("#adviceList");
const ideaList = document.querySelector("#ideaList");
const shuffleButton = document.querySelector("#shuffleButton");
const adviceTab = document.querySelector("#adviceTab");
const ideasTab = document.querySelector("#ideasTab");
const advicePanel = document.querySelector("#advicePanel");
const ideasPanel = document.querySelector("#ideasPanel");

let recognition;
let listening = false;
let lastAnalysis = null;
let ideaOffset = 0;
let voiceBlockedReason = "";

const positiveWords = ["fun", "easy", "laughed", "laugh", "chemistry", "spark", "kind", "thoughtful", "curious", "warm", "connected", "comfortable", "excited", "kiss", "great", "amazing", "sweet"];
const uncertainWords = ["awkward", "unsure", "confused", "mixed", "quiet", "distant", "late", "weird", "hesitant", "nervous", "busy", "dry", "unclear", "ghost", "ghosted"];
const boundaryWords = ["pushy", "rude", "ignored", "pressure", "uncomfortable", "unsafe", "mean", "jealous", "dismissive", "interrupted", "drunk", "angry"];

const issueSignals = [
  {
    key: "communication",
    label: "Communication",
    pattern: /text|texts|reply|replied|message|messages|ghost|ghosted|dry|busy|slow|plans|plan|follow up|follow-up/,
    meaning: "Okay, I would not jump straight to “they are not interested.” I would treat this as a communication-style question: does the way they follow up actually feel good to you?",
    action: "If you still want to see them, give it one simple opening instead of trying to decode every text. You could say you had fun and ask about one specific low-key plan, then see whether they meet you there.",
    watch: "Look for whether their reply makes you feel calmer. Warmth, a real time, and shared planning are good signs. More vagueness is also information."
  },
  {
    key: "chemistry",
    label: "Chemistry",
    pattern: /spark|chemistry|kiss|touch|flirt|flirty|attracted|attraction|butterflies|vibe|connection|connected/,
    meaning: "I get why you are thinking about it if there was chemistry. The only thing I would be careful about is letting the spark do all the talking for them.",
    action: "Hold onto what felt exciting, but pair it with evidence. If you want to continue, make the next step easy and specific, then notice whether they show up with curiosity and effort.",
    watch: "Look for grounded interest after the date: they remember details, ask about you, and help make the next plan. Chemistry plus effort is the thing."
  },
  {
    key: "awkwardness",
    label: "Awkwardness",
    pattern: /awkward|quiet|silence|nervous|anxious|weird|stilted|shy|uncomfortable|tense/,
    meaning: "A little awkwardness does not automatically mean “no.” Sometimes it is nerves, the setting, or two people taking a minute to find a rhythm.",
    action: "If there were also sweet or curious moments, I would not throw it out yet. Try a shorter second date with something to do, so the conversation has a little structure.",
    watch: "Pay attention to your body next time. If the awkwardness softens, great. If you feel tense, small, or like you are performing, that matters."
  },
  {
    key: "boundaries",
    label: "Boundaries",
    pattern: /pushy|rude|ignored|pressure|unsafe|mean|jealous|dismissive|interrupted|drunk|angry|uncomfortable/,
    meaning: "This is the part where I would slow down. If you felt pressured, dismissed, or unsafe, that is not just a tiny dating puzzle to solve.",
    action: "You do not have to keep giving access to someone who made you feel uneasy. If you do respond, keep it clear and self-protective rather than trying to make them understand everything.",
    watch: "If you keep talking, look for accountability without defensiveness. A real repair feels calm and specific, and then the behavior actually changes."
  },
  {
    key: "values",
    label: "Values",
    pattern: /kids|marriage|religion|politics|money|career|family|ex|drinking|party|partying|values|future|serious|casual/,
    meaning: "This sounds less like “did the date go well?” and more like “are we pointed in compatible directions?” That is worth taking seriously.",
    action: "Name the value underneath the concern, then ask one honest question before you get more invested. You are not being intense; you are checking whether continuing makes sense.",
    watch: "Listen for clarity and respect. You do not need identical answers, but you should feel more informed after the conversation, not more foggy."
  }
];

const ideaBank = {
  food: [
    ["Neighborhood tasting crawl", "Pick three tiny spots within walking distance: one snack, one drink, one dessert. It keeps the date moving and lowers the pressure."],
    ["Cookbook swap coffee", "Meet at a cafe with one favorite recipe each and trade the story behind it before choosing a dish to try next time."]
  ],
  outdoors: [
    ["Golden-hour walk", "Choose a scenic loop with an easy exit point, then end with tea or ice cream nearby."],
    ["Farmers market mission", "Each person picks one ingredient, then you invent a low-stakes dinner idea together."]
  ],
  culture: [
    ["Small gallery lap", "Visit a compact exhibit and each choose the piece you would put in your imaginary apartment."],
    ["Bookstore prompt date", "Trade three books: one childhood favorite, one guilty pleasure, one book you want to be the kind of person who reads."]
  ],
  playful: [
    ["Arcade rematch", "A little competition gives you something to react to without forcing nonstop conversation."],
    ["Mini-golf plus a walk", "Keep the score lightly suspicious, then decompress with a walk after the last hole."]
  ],
  calm: [
    ["Tea flight check-in", "A quiet tea bar gives you space to ask the one or two questions still hanging in the air."],
    ["Museum courtyard pause", "Pick somewhere calm where conversation can breathe, with an easy nearby second stop if it goes well."]
  ]
};

const defaultIdeas = [
  ["Two-stop date", "Start with a short activity, then only add the second stop if the energy is clearly good."],
  ["Question walk", "Take a 35-minute walk and each bring three questions: one silly, one real, one future-facing."],
  ["Low-pressure dinner", "Choose a place with shared plates so the date has built-in collaboration without becoming too formal."]
];

function setupVoice() {
  const isFilePage = window.location.protocol === "file:";
  const isSecureVoiceContext = window.isSecureContext || ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);

  if (isFilePage || !isSecureVoiceContext) {
    voiceBlockedReason = "Open the localhost preview to use the mic.";
    document.body.classList.add("needs-localhost");
    supportStatus.textContent = "Open mic preview";
    listenButton.textContent = "Open mic preview";
    micButton.setAttribute("aria-label", "Open the localhost mic preview");
    return;
  }

  if (!SpeechRecognition) {
    voiceBlockedReason = "This browser does not support live speech recognition.";
    supportStatus.textContent = "Text mode ready";
    listenButton.disabled = true;
    micButton.disabled = true;
    listenButton.textContent = "Voice unavailable";
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.addEventListener("result", (event) => {
    let interim = "";
    let finalText = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalText += transcript;
      } else {
        interim += transcript;
      }
    }
    if (finalText) {
      storyInput.value = `${storyInput.value.trim()} ${finalText}`.trim();
    }
    supportStatus.textContent = interim ? "Listening" : "Voice ready";
  });

  recognition.addEventListener("end", () => {
    listening = false;
    stage.classList.remove("listening");
    listenButton.textContent = "Start talking";
    micButton.setAttribute("aria-label", "Start voice capture");
    supportStatus.textContent = "Voice ready";
  });

  recognition.addEventListener("error", () => {
    listening = false;
    stage.classList.remove("listening");
    supportStatus.textContent = "Mic blocked";
    listenButton.textContent = "Start talking";
    coachMessage.textContent = "The browser could not start the microphone. Check that microphone permission is allowed for this page, or type the date story here and I can still help.";
  });

  supportStatus.textContent = "Voice ready";
}

async function requestMicAccess() {
  if (!navigator.mediaDevices?.getUserMedia) return true;
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  stream.getTracks().forEach((track) => track.stop());
  return true;
}

async function toggleListening() {
  if (!recognition) {
    if (voiceBlockedReason) {
      coachMessage.textContent = voiceBlockedReason;
      if (localLink && document.body.classList.contains("needs-localhost")) {
        window.location.href = localLink.href;
      }
    }
    return;
  }
  if (listening) {
    recognition.stop();
    return;
  }
  try {
    supportStatus.textContent = "Allow mic";
    coachMessage.textContent = "Allow microphone access in the browser prompt, then start talking about how the date went.";
    const permissionHint = window.setTimeout(() => {
      if (!listening) {
        supportStatus.textContent = "Waiting for mic";
        coachMessage.textContent = "I am waiting for browser microphone permission. Choose Allow in the mic prompt, or type the date story and use Get advice.";
      }
    }, 2500);
    await requestMicAccess();
    window.clearTimeout(permissionHint);
    listening = true;
    recognition.start();
    stage.classList.add("listening");
    listenButton.textContent = "Stop listening";
    micButton.setAttribute("aria-label", "Stop voice capture");
    supportStatus.textContent = "Listening";
  } catch (error) {
    listening = false;
    stage.classList.remove("listening");
    supportStatus.textContent = "Mic blocked";
    listenButton.textContent = "Start talking";
    coachMessage.textContent = "Microphone permission is blocked for this page. Allow mic access in the browser prompt, or type the date story and use Get advice.";
  }
}

function countMatches(text, words) {
  return words.reduce((total, word) => total + (text.includes(word) ? 1 : 0), 0);
}

function detectInterests(text) {
  const buckets = [];
  if (/dinner|food|drink|bar|coffee|restaurant|dessert|cook/.test(text)) buckets.push("food");
  if (/walk|hike|park|outside|beach|sunset|market/.test(text)) buckets.push("outdoors");
  if (/movie|music|museum|book|art|gallery|show|concert/.test(text)) buckets.push("culture");
  if (/game|bowling|arcade|dance|karaoke|mini golf|funny/.test(text)) buckets.push("playful");
  if (/quiet|deep|talk|calm|nervous|slow/.test(text)) buckets.push("calm");
  return buckets.length ? buckets : ["calm", "food", "playful"];
}

function analyzeStory() {
  const raw = storyInput.value.trim();
  if (!raw) {
    coachMessage.textContent = "Tell me a little more first: what happened, how you felt after, and what you are wondering about now.";
    return;
  }

  const text = raw.toLowerCase();
  const positive = countMatches(text, positiveWords);
  const uncertain = countMatches(text, uncertainWords);
  const boundary = countMatches(text, boundaryWords);
  const questionMarks = (raw.match(/\?/g) || []).length;
  const issues = detectIssues(text, { boundary, uncertain });

  const vibe = Math.max(1, Math.min(10, 5 + positive * 1.2 - uncertain * 0.8 - boundary * 1.8));
  const momentum = Math.max(1, Math.min(10, 4 + positive + (text.includes("text") || text.includes("again") ? 1.4 : 0) - uncertain * 0.7 - boundary * 1.2));
  const interests = detectInterests(text);

  let nextStep = "Talk it through";
  let headline = "My honest read: do not pressure yourself to decide everything right now. Let us sort what felt good, what felt off, and what you would need to see next.";
  if (boundary > 0) {
    nextStep = "Protect your peace";
    headline = "I would slow down here. Before you think about keeping the connection going, pay attention to the part of you that felt uncomfortable.";
  } else if (vibe >= 7 && momentum >= 6) {
    nextStep = "Keep it light";
    headline = "This sounds promising. If you want to continue, I would keep it simple and look for whether their effort matches the chemistry.";
  } else if (uncertain >= 2 || questionMarks > 1) {
    nextStep = "Get clarity";
    headline = "It makes sense that you feel unsure. I would not spiral on it; I would gently test the unclear part and let their response tell you more.";
  }

  lastAnalysis = { raw, text, positive, uncertain, boundary, vibe, momentum, interests, issues, nextStep, headline };
  renderAnalysis(lastAnalysis);
  renderIdeas(lastAnalysis);
  speak(headline);
}

function renderAnalysis(analysis) {
  coachMessage.textContent = analysis.headline;
  vibeScore.textContent = `${Math.round(analysis.vibe)}/10`;
  momentumScore.textContent = `${Math.round(analysis.momentum)}/10`;
  nextStepLabel.textContent = analysis.nextStep;

  const mainIssue = analysis.issues[0];
  const advice = [
    ["How I would read it", mainIssue.meaning],
    ["What I would do next", buildActionAdvice(analysis, mainIssue)],
    ["What I would watch for", buildWatchAdvice(analysis, mainIssue)]
  ];

  adviceList.innerHTML = advice.map(([title, body]) => `
    <article class="advice-card">
      <h2>${title}</h2>
      <p>${body}</p>
    </article>
  `).join("");
}

function detectIssues(text, scores) {
  const matched = issueSignals.filter((issue) => issue.pattern.test(text));
  if (scores.boundary > 0 && !matched.some((issue) => issue.key === "boundaries")) {
    matched.unshift(issueSignals.find((issue) => issue.key === "boundaries"));
  }
  if (scores.uncertain > 1 && !matched.some((issue) => issue.key === "communication")) {
    matched.push(issueSignals.find((issue) => issue.key === "communication"));
  }
  return matched.length ? matched : [{
    key: "general",
    label: "the overall read",
    meaning: "I would treat this date as information, not a verdict. Before deciding yes or no, name what felt easy, what felt weird, and what you are hoping is true.",
    action: "If you are open to continuing, send something simple and specific. If you are not sure, it is okay to take a beat and ask yourself what you would need to feel more comfortable.",
    watch: "Notice whether the next interaction makes things feel simpler. A good next step usually gives you more ease, not more mental homework."
  }];
}

function buildActionAdvice(analysis, issue) {
  if (analysis.boundary > 0) return issue.action;
  if (analysis.vibe >= 7 && analysis.momentum >= 6) {
    return `${issue.action} You do not need a huge speech. Something like, “I had a really nice time and would be up for seeing you again,” is enough. Then let their follow-through tell you as much as their words.`;
  }
  if (analysis.uncertain >= 2) {
    return `${issue.action} Keep the next step small enough that you can observe their response without feeling like you are over-investing.`;
  }
  return issue.action;
}

function buildWatchAdvice(analysis, issue) {
  if (analysis.boundary > 0) return issue.watch;
  if (analysis.positive > analysis.uncertain) {
    return `${issue.watch} Also notice whether the good parts repeat when there is less novelty and more ordinary planning. That is usually where the real signal shows up.`;
  }
  if (analysis.uncertain >= 2) {
    return `${issue.watch} If you keep needing to decode them, I would treat that as information instead of a challenge you have to solve.`;
  }
  return issue.watch;
}

function renderIdeas(analysis = lastAnalysis) {
  const keys = analysis ? analysis.interests : ["calm", "food", "playful"];
  const pool = keys.flatMap((key) => ideaBank[key] || []);
  const ideas = [...pool, ...defaultIdeas];
  const selected = [0, 1, 2].map((i) => ideas[(i + ideaOffset) % ideas.length]);

  ideaList.innerHTML = selected.map(([title, body]) => `
    <article class="idea-card">
      <h2>${title}</h2>
      <p>${body}</p>
    </article>
  `).join("");
}

function speak(message) {
  if (!speakToggle.checked || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = 0.96;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function showTab(target) {
  const isAdvice = target === "advice";
  adviceTab.classList.toggle("active", isAdvice);
  ideasTab.classList.toggle("active", !isAdvice);
  adviceTab.setAttribute("aria-selected", String(isAdvice));
  ideasTab.setAttribute("aria-selected", String(!isAdvice));
  advicePanel.classList.toggle("active", isAdvice);
  ideasPanel.classList.toggle("active", !isAdvice);
}

listenButton.addEventListener("click", toggleListening);
micButton.addEventListener("click", toggleListening);
analyzeButton.addEventListener("click", analyzeStory);
shuffleButton.addEventListener("click", () => {
  ideaOffset += 1;
  renderIdeas();
});
adviceTab.addEventListener("click", () => showTab("advice"));
ideasTab.addEventListener("click", () => showTab("ideas"));

storyInput.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    analyzeStory();
  }
});

setupVoice();
renderIdeas();
