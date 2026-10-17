---
kind: checklist
---
# English patterns: formatting, leftovers, reader and register (EN-19 to EN-26)

Decoration, leftovers from a chat or a draft, and text written for the wrong
reader. Apply the strength and add-nothing rules from
`patterns-staging-and-rhythm.md`. Several of these are *weak alone* because
editors, templates and CMS tools also produce clean formatting; the tell is
decoration on every item, not its presence.

## EN-19 Bold as decoration (weak alone)

- **Signals:** bold scattered through sentences for no reason; every list item opening with a bold label and a colon; bold on every key term in every paragraph.
- **Why:** Emphasis everywhere is emphasis nowhere, and labeled lists often repeat the label inside the sentence.
- **Not a tell when:** bold marks a UI label ("click **Save**"), a warning the reader must not miss ("**Do not** run this in production"), a glossary term at first definition, or a reference list whose labels carry information such as parameter names.
- **Before:** "- **Speed:** Builds are faster. - **Security:** Tokens are rotated. - **Simplicity:** Setup is easier."
- **After:** "Builds are faster, tokens are rotated and setup is easier."
- **Preserve:** UI label emphasis, safety warnings and heading levels that other documents link to.

## EN-20 Decorative headings, emoji and rules (weak alone)

- **Signals:** Title Case On Every Heading, emoji or arrows on headings and bullets, a horizontal rule between every section, a top-level heading that repeats the document title, a heading written for effect ("The Decision, At A Glance") instead of naming what the section holds.
- **Why:** Decoration competes with content and makes the document look templated.
- **Not a tell when:** the project uses emoji or gitmoji by convention (changelogs, status badges), the style guide requires headline-style capitalization, or the heading is an anchor target that other pages link to.
- **Before:** "## 🚀 Getting Started With Our Amazing New CLI"
- **After:** "## Getting started with the CLI"
- **Preserve:** heading text that anchors link to (check for links before renaming one), frontmatter titles and the SEO page heading. Major style guides, including Google's and Microsoft's, prefer sentence case for headings, but follow the project's existing convention.

## EN-21 Typography that breaks or distracts (weak alone)

- **Signals:** curly quotation marks (“ ”) or an ellipsis character inside a command, JSON or code sample; compound modifiers hyphenated inconsistently ("well-documented API" next to "the API is well-documented"); a serial comma used in some lists and not others.
- **Why:** Curly quotes in a shell command or JSON break copy and paste, and inconsistent punctuation distracts without helping.
- **Not a tell when:** the CMS or editor applies typographic quotes to prose by design, the word is always hyphenated ("third-party", "built-in"), or the style is a project choice used consistently.
- **Before:** "Run the installer with the flag “--force”. The report is well-documented."
- **After:** "Run the installer with the `--force` flag. The report is well documented."
- **Preserve:** the prose typography that the site or CMS applies, and every character inside code. The usual convention is a hyphen before the noun ("a well-documented report") and none after it, with fixed compounds keeping the hyphen; British style sometimes hyphenates both. Follow the document.

## EN-22 Chatbot residue (strong)

- **Signals:** "Certainly!", "Great question!", "Sure, here's...", "Here is a revised version:", "I hope this helps", "Let me know if you'd like me to...", "As an AI language model...", and unfilled placeholders such as "[Your Name]" or "[Company]".
- **Why:** A chat reply's greeting, praise, offer or closing remains in text that should stand on its own. It is the most certain tell in this list and the easiest to miss when it wraps real content.
- **Not a tell when:** a human support reply has a genuine closing line, a business-owned contact line belongs on the page, or a template file documents its placeholders on purpose.
- **Before:** "Certainly! Here is a short description for the pricing page: The Team plan costs $12 per user per month. I hope this helps!"
- **After:** "The Team plan costs $12 per user per month."
- **Preserve:** the content inside the wrapper. Flag unfilled placeholders and ask for the values; never fill them with invented names, prices or dates.

## EN-23 Knowledge-limit disclaimers and guesses (strong)

- **Signals:** "as of my last update", "based on the information available", "specific details are not publicly available" followed by a plausible guess ("likely started around 2018"), "it appears that" hedging an invented detail.
- **Why:** The text mentions where a model's knowledge ends, or admits there is no source and then fills the gap with a guess dressed as fact.
- **Not a tell when:** the limitation changes what the reader should do ("This guide covers version 3 only", "benchmarks were run on one machine"), or a research article documents its own data limits.
- **Before:** "Details about the maintainers are not widely documented, but the project was likely started around 2018 by a small team."
- **After:** "The project's start date and maintainers are not documented."
- **Preserve:** real limitations and scope notes. Remove a guess presented as fact, and flag the gap for the owner.

## EN-24 Writing about the document (strong for repeated headings and narration)

- **Signals:** a heading restated in the first sentence ("## Installation / This section explains how to install the package."); "In this article we will..." before every section; "The table below compares..."; narration of how the text was assembled ("compiled from several sources; anything unconfirmed is flagged"); an account of the previous version outside a changelog.
- **Why:** The text describes itself instead of its subject, so the reader waits for the content.
- **Not a tell when:** a long document needs an overview or table of contents, the text is a changelog or migration guide that discusses the previous version, or a source credit lets the reader follow up.
- **Before:** "## Installation. This section explains how to install the package. Run `npm install acme-sdk`."
- **After:** "## Installation. Run `npm install acme-sdk`."
- **Preserve:** commands, code, links and any caveat that changes what the reader should do. A single description of a page is weak alone.

## EN-25 Re-explaining what the reader knows (strong when the conversation is visible)

- **Signals:** a reply in a thread that restates the problem, walks through the diagnosis and shows the evidence before reaching the decision, with the answer in the last line; background the other person wrote or already agreed to.
- **Why:** In a reply the reader already has the context, so rebuilding it buries the point. Each sentence can read well alone, so this survives sentence-level cleanup.
- **Not a tell when:** the reader lacks the context (a cold email, a new teammate, public documentation), the text must stand alone as a ticket or postmortem, or the reader asked for the full write-up.
- **Before:** "Thanks for the review. As you noted, the retry loop can double-send. I traced the queue consumer and found that messages are acknowledged after handling, so a crash between send and acknowledgement causes a duplicate. On staging there were 4 duplicates in 1,200 messages. So I'll make the handler idempotent with a dedupe key, in a follow-up PR."
- **After:** "Agreed. I'll make the handler idempotent with a dedupe key in a follow-up PR. Staging showed 4 duplicates in 1,200 messages, so the fix is worth doing."
- **Preserve:** the decision, every action item, and each link or number the reader needs in order to act. Apply this only when the surrounding thread is visible or the text is plainly a reply; otherwise ask or leave it alone.

## EN-26 Register or tone that does not fit the reader (strong when it conflicts with a stated audience)

- **Signals:** marketing exuberance in reference documentation; stiff corporate phrasing in a casual blog ("We are pleased to announce the commencement of..."); jargon for beginners or basics for experts; blame or exclamation marks in error messages; mixed "the user" and "you"; inconsistent contractions.
- **Why:** Register tells the reader how the writer sees them. A mismatch is felt at once and costs trust more than a small grammar slip.
- **Not a tell when:** the register is a deliberate brand voice such as a playful product tone, the text quotes someone, or a legal notice requires formality.
- **Before:** "Oops! You entered an invalid email address!!"
- **After:** "Enter a valid email address."
- **Preserve:** the brand voice and approved copy, the field or action the message refers to, and mandatory legal wording. Name a specific field only when the source identifies it.
