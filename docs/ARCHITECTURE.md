# The Cortex Architecture

## System overview

The Cortex is designed as a modular thought-processing pipeline. The current hackathon prototype runs fully in the browser so judges can test it without accounts, API keys, or a database.

```mermaid
flowchart LR
    A[Thought input] --> B[Concept extraction]
    B --> C[Memory node]
    C --> D[Connection scoring]
    D --> E[Reasoning rank]
    E --> F[Mind visualization]
```

## Data model

Each thought contains a unique identifier, original text, extracted concepts, inferred tone, capture time, and signal strength. Relationships are computed between the active thought and stored memories.

```ts
type Thought = {
  id: number;
  text: string;
  concepts: string[];
  tone: string;
  created: string;
  strength: number;
};
```

## Connection model

The intended connection model is:

$$
w_{ij} = \alpha S_{ij} + \beta K_{ij} + \gamma T_{ij}
$$

- \(S_{ij}\): semantic similarity between thoughts
- \(K_{ij}\): shared concepts and keywords
- \(T_{ij}\): temporal context
- \(\alpha, \beta, \gamma\): configurable weighting factors

The current offline implementation scores extracted concept overlap and meaningful shared-word overlap. The calculation is deterministic, so the same pair of thoughts always produces the same result. This keeps the public demo fast, reproducible, private, and free of credentials.

## Interface architecture

- **Laboratory:** input, animated graph, processing pipeline, memory archive, inspector, and telemetry
- **Architecture:** human-readable explanation of all processing stages and the mathematical model
- **Graph:** an SVG network whose state responds to the active pipeline stage
- **State:** React state manages capture, processing, selection, filtering, and view changes

## Production evolution

The interfaces can be replaced independently:

| Prototype module | Production adapter |
| --- | --- |
| Keyword extraction | NLP pipeline or language model |
| Browser local storage | Encrypted cross-device store or PostgreSQL |
| Lightweight scoring | Embeddings and vector similarity |
| Array relationships | Neo4j or another graph database |
| Local browser persistence | Authenticated cross-device workspace |

## Design principles

1. **Human thought first:** algorithms support the user's thinking instead of replacing it.
2. **Explainability:** connections must show why they exist.
3. **Modularity:** every cognitive stage can be inspected or replaced.
4. **Privacy:** personal thoughts require explicit storage and model controls.
5. **Accessibility:** the system remains navigable without animation or a pointer.
