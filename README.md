# Programmers Arise

**A prototype learning environment with embedded video, formative quizzes and a progress dashboard.**

Final year project for TM470, BSc (Hons) Computing & IT, The Open University (2025).

## The problem

Self-taught beginners often learn from unstructured YouTube tutorials with no sequence, no progress tracking and no feedback. Programmers Arise wraps curated videos in a simple learning path: watch a short lesson, test yourself straight away, and track your progress over time.

## Features

- **Simulated login** with a display name, so progress stays separate per user on a shared device
- **Four modules:** HTML Basics, JavaScript Basics, JavaScript Arrays, Web Accessibility Basics
- **Embedded YouTube videos** via standard iframe embeds (public, embeddable content only)
- **Curated fallback dataset** (`data/videos.js`) so the app works offline and without an API key
- **Optional YouTube Data API v3** search, filtered by a channel allow-list, with automatic fallback if the API is off, unavailable or over quota
- **Quiz engine** with explanatory feedback, retries without penalty and partial-credit scoring for multi-answer questions
- **Dashboard** with best score and full attempt history per module
- **Export progress as JSON**
- **Accessibility:** skip link, semantic landmarks, labelled controls, ARIA live regions for feedback

## Tech and architecture

HTML5, CSS3 and vanilla JavaScript (ES6). No frameworks and no build step.

```
index.html        Four sections: login, modules, player (video + quiz), dashboard
css/style.css     Layout and styling
data/videos.js    Curated module list and YouTube video IDs (fallback dataset)
data/quizzes.js   Question bank, kept separate from the quiz logic
js/config.js      API switch, key, channel allow-list and search topics
js/api.js         Optional YouTube Data API v3 search with fallback
js/app.js         Navigation, quiz engine, scoring, localStorage persistence, dashboard and export
```

Key design decisions:

- **Data separate from logic.** New modules and questions are added by editing `data/` only.
- **localStorage instead of a database.** SQLite was evaluated and excluded: it added complexity and backend dependencies the prototype did not need, and keeping data in the browser means no personal data is collected.
- **Fallback first.** API quota limits and privacy concerns were real risks, so the curated dataset is the default and the API is opt-in.

## Run it locally

Open `index.html` in a browser, or use a static server such as the VS Code Live Server extension.

To try the live API, set `useYouTubeAPI: true` and add your key in `js/config.js`. **Do not commit a real API key.**

## Known issues and next steps

Found while reviewing the code for publication:

- The `d` keyboard shortcut for the dashboard also fires while typing in the name field.
- Multi-answer scoring counts correct picks only, so ticking every option scores 100%. Wrong picks should reduce the score.
- Single-answer questions use checkboxes rather than radio buttons.
- Headings receive focus on view change only if they are focusable (`tabindex="-1"` needed).
- Longer term: a Node.js backend with a SQL database for cross-device progress, and testing with real learners.

## Author

Dominik Laskowski
