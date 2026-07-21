# The Cortex

> Capture a thought. Watch it grow.

Thoughts disappear in seconds, taking ideas, insights, and connections with them. **The Cortex** captures fragmented thinking and transforms it into an evolving, searchable digital mind.

The Cortex is a browser-based algorithmic laboratory for thought preservation and inspectable synthetic cognition. A user enters an idea, question, or observation and watches it move through a six-stage cognitive pipeline. The prototype extracts concepts, creates a memory node, scores related ideas, and exposes the resulting connections in a visual mind interface.

## Why it matters

Most note-taking tools preserve text but lose context. Notes become isolated pages inside folders, while the relationships that made an idea valuable remain implicit. The Cortex treats every thought as part of a connected system. Its purpose is not to generate more information for the user, but to preserve and develop the user's own thinking.

## Features

- Capture ideas, questions, observations, and unfinished thoughts
- Watch every thought move through a live six-stage cognitive pipeline
- Extract meaningful concepts without a remote API or secret key
- Store thoughts as interactive memory nodes
- Score and explain relationships between memories
- Search the memory archive by text or concept
- Inspect signal strength, graph connections, and active concepts
- Explore the system architecture and connection model
- Responsive, keyboard-accessible interface with reduced-motion support
- Runs entirely in the browser for a zero-configuration demo

## Cognitive pipeline

1. **Capture** receives natural-language input.
2. **Interpret** extracts concepts, intent, and tone.
3. **Remember** creates a persistent memory node in the session.
4. **Connect** compares the new node with existing memories.
5. **Reason** ranks potentially useful relationships.
6. **Visualize** updates the interactive mind and telemetry.

The prototype models the connection between thoughts \(i\) and \(j\) as:

$$
w_{ij} = \alpha S_{ij} + \beta K_{ij} + \gamma T_{ij}
$$

where \(S\) is semantic similarity, \(K\) represents shared concepts, and \(T\) represents temporal context. The current offline prototype uses a deterministic lightweight approximation so that anyone can run it without credentials. The architecture is ready for embedding and graph-database adapters.

## Tech stack

- Next.js 16
- React 19
- TypeScript
- CSS and SVG visualization
- Vinext and Vite
- Cloudflare Workers-compatible production build

## Run locally

Requirements: Node.js 20.9 or newer.

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd the-cortex
npm install
npm run dev
```

Open the local URL printed in your terminal.

## Production build

```bash
npm run build
npm run start
```

## Try the demo

1. Enter a thought in the capture field.
2. Select **Capture Thought**.
3. Watch the signal move through all six cognitive stages.
4. Inspect the generated concepts and strongest memory connections.
5. Select another thought to compare connection analysis.
6. Search the memory archive.
7. Open **Architecture** to inspect how the system works.

## Project structure

```text
app/
  page.tsx          Interactive Cortex laboratory and architecture view
  globals.css       Responsive cosmic laboratory design system
  layout.tsx        Application metadata and root layout
docs/
  ARCHITECTURE.md   Technical architecture and data flow
  DEMO_SCRIPT.md    Timed 3–5 minute video narration
  DEVPOST.md        Submission-ready project story and checklist
public/             Static project assets
tests/              Rendered output smoke tests
```

## Privacy

The hackathon prototype processes thoughts locally in the current browser session. It does not transmit entries to an external AI service or database. Refreshing the page resets the prototype data.

## Future scope

- Local-first persistent encrypted storage
- Sentence embeddings and semantic vector search
- A graph database for long-term memory relationships
- Voice, document, image, and link capture
- Explainable connection scoring controls
- Thought timelines and evolving concept maps
- Collaborative research minds
- Pluggable local and hosted reasoning models

## Challenges

The central design challenge was representing a thought as more than a block of text. The Cortex needed to preserve content, context, uncertainty, and relationships while remaining understandable. The second challenge was making a cinematic visualization genuinely functional. Nodes, signals, stages, and telemetry therefore correspond to real state in the prototype rather than serving as decoration.

## Author

**Shannon Aurelia Widjaja**  
Electrical Engineering, Universitas Indonesia

## License

Released under the [MIT License](LICENSE).
