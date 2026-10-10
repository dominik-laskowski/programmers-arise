window.quizzes = {
  html_basics: [
    {
      q: "Which tag defines the main heading on a page?",
      options: ["<p>", "<h1>", "<title>", "<header>"],
      answer: 1,
      explainCorrect: "H1 represents the top-level heading in the document outline.",
      explainIncorrect: "Use <h1> for the main heading; <p> is for paragraphs; <title> is for the browser tab; <header> is a structural container."
    },
    {
      q: "Which attributes improve accessibility for images? (select all that apply)",
      options: ["alt", "src", "aria-label on <img>", "height/width only"],
      answer: [0],
      explainCorrect: "The alt attribute provides alternative text for screen readers and when images fail to load.",
      explainIncorrect: "Only the alt attribute belongs on <img> for text alternatives; aria-label does not apply to <img> in HTML."
    }
  ],
  js_basics: [
    {
      q: "Which statement declares a block-scoped variable?",
      options: ["var", "let", "const", "function"],
      answer: [1,2],
      explainCorrect: "Both let and const are block-scoped declarations introduced in ES6.",
      explainIncorrect: "Use let/const for block scope; var is function-scoped."
    },
    {
      q: "What does strict equality (===) check?",
      options: ["Value only", "Type only", "Value and type", "Reference only"],
      answer: 2,
      explainCorrect: "=== checks both value and type, avoiding coercion.",
      explainIncorrect: "Use === to avoid implicit type coercion issues."
    }
  ],
  arrays: [
    {
      q: "Which methods do NOT mutate the original array? (select all that apply)",
      options: ["map", "filter", "push", "pop"],
      answer: [0,1],
      explainCorrect: "map and filter return new arrays; push/pop mutate the original array.",
      explainIncorrect: "Non-mutating array methods include map, filter, slice, concat, etc."
    },
    {
      q: "What does Array.length return?",
      options: ["Number of defined elements", "Highest index + 1", "Allocated capacity", "Always 0-based index"],
      answer: 1,
      explainCorrect: "length is one more than the highest index, not necessarily the count of defined items.",
      explainIncorrect: "Sparse arrays can have holes; length reflects highestIndex+1."
    }
  ],
  accessibility: [
    {
      q: "Which practices improve keyboard accessibility? (select all that apply)",
      options: ["Ensure focus styles", "Click-only controls", "Logical tab order", "ARIA for everything"],
      answer: [0,2],
      explainCorrect: "Visible focus and logical tab order are essential; avoid click-only controls; use ARIA judiciously.",
      explainIncorrect: "Too much ARIA can harm accessibility; prefer semantic HTML first."
    },
    {
      q: "Which color contrast ratio aligns with WCAG AA for normal text?",
      options: ["2.5:1", "3:1", "4.5:1", "7:1"],
      answer: 2,
      explainCorrect: "WCAG AA requires at least 4.5:1 for normal text.",
      explainIncorrect: "3:1 is for large text at AA; 7:1 is AAA for normal text."
    }
  ]
};
