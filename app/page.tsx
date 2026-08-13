"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Thought = {
  id: number;
  text: string;
  concepts: string[];
  tone: string;
  created: string;
  strength: number;
};

const seedThoughts: Thought[] = [
  { id: 1, text: "Algorithms can become instruments for extending human memory.", concepts: ["algorithms", "memory", "intelligence"], tone: "research", created: "09:14", strength: 92 },
  { id: 2, text: "A useful digital mind should reveal why two ideas are connected.", concepts: ["explainability", "ideas", "trust"], tone: "principle", created: "10:02", strength: 87 },
  { id: 3, text: "What if unfinished thoughts could continue developing while we work?", concepts: ["thoughts", "automation", "creativity"], tone: "question", created: "11:46", strength: 78 },
  { id: 4, text: "Knowledge feels alive when it is organized as relationships, not folders.", concepts: ["knowledge", "graphs", "relationships"], tone: "insight", created: "13:21", strength: 95 },
  { id: 5, text: "Build computational minds that people can inspect and control.", concepts: ["control", "synthetic minds", "systems"], tone: "mission", created: "15:08", strength: 90 },
];

const pipeline = ["Capture", "Interpret", "Remember", "Connect", "Reason", "Visualize"];
const STORAGE_KEY = "the-cortex-thoughts-v1";
const nodePositions = [
  [49, 14], [36, 18], [61, 21], [27, 28], [45, 28], [70, 31], [20, 41], [35, 42], [55, 39], [78, 43],
  [25, 55], [43, 52], [62, 53], [82, 57], [32, 67], [51, 65], [68, 68], [42, 78], [58, 80], [72, 77],
];
const edges = [[0,1],[0,2],[1,3],[1,4],[2,4],[2,5],[3,6],[3,7],[4,7],[4,8],[5,8],[5,9],[6,10],[7,10],[7,11],[8,11],[8,12],[9,12],[9,13],[10,14],[11,14],[11,15],[12,15],[12,16],[13,16],[14,17],[15,17],[15,18],[16,18],[16,19],[17,18],[18,19],[4,11],[7,15],[8,16],[10,17],[3,11],[5,12]];

function extractConcepts(text: string) {
  const stop = new Set(["about", "after", "again", "before", "being", "between", "could", "from", "have", "into", "just", "more", "something", "that", "their", "there", "these", "they", "this", "through", "what", "when", "where", "which", "with", "would", "your"]);
  return [...new Set(text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((word) => word.length > 4 && !stop.has(word)))].slice(0, 4);
}

function connectionScore(a: Thought, b: Thought) {
  const sharedConcepts = a.concepts.filter((concept) => b.text.toLowerCase().includes(concept) || b.concepts.includes(concept)).length;
  const wordsA = new Set(a.text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((word) => word.length > 4));
  const sharedWords = b.text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((word) => wordsA.has(word)).length;
  return Math.min(96, 42 + sharedConcepts * 18 + Math.min(6, sharedWords) * 6);
}

export default function Home() {
  const [thoughts, setThoughts] = useState(seedThoughts);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [activeStage, setActiveStage] = useState(-1);
  const [selected, setSelected] = useState<Thought>(seedThoughts[3]);
  const [view, setView] = useState<"lab" | "architecture">("lab");
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState("SYSTEM READY");
  const [storageReady, setStorageReady] = useState(false);

  const filtered = useMemo(() => thoughts.filter((thought) => `${thought.text} ${thought.concepts.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [thoughts, query]);
  const related = useMemo(() => thoughts.filter((thought) => thought.id !== selected.id).map((thought) => ({ ...thought, score: connectionScore(selected, thought) })).sort((a, b) => b.score - a.score).slice(0, 3), [thoughts, selected]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Thought[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setThoughts(parsed);
          setSelected(parsed[0]);
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (storageReady) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(thoughts));
  }, [thoughts, storageReady]);

  useEffect(() => {
    if (!processing) return;
    if (activeStage < pipeline.length - 1) {
      const timer = setTimeout(() => setActiveStage((stage) => stage + 1), 430);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      const concepts = extractConcepts(input);
      const thought: Thought = {
        id: Date.now(), text: input.trim(), concepts: concepts.length ? concepts : ["unclassified"],
        tone: input.includes("?") ? "question" : "observation", created: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), strength: Math.min(96, 68 + Math.min(4, concepts.length) * 6 + (input.includes("?") ? 2 : 4)),
      };
      setThoughts((items) => [thought, ...items]);
      setSelected(thought);
      setInput("");
      setProcessing(false);
      setToast("THOUGHT INTEGRATED");
      setTimeout(() => setToast("SYSTEM READY"), 2400);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeStage, processing, input]);

  function capture(event: FormEvent) {
    event.preventDefault();
    if (!input.trim() || processing) return;
    setActiveStage(0);
    setProcessing(true);
    setToast("COGNITIVE PIPELINE ACTIVE");
  }

  return (
    <main>
      <div className="space" aria-hidden="true"><i/><i/><i/></div>
      <header className="topbar">
        <button className="brand" onClick={() => setView("lab")}><span className="brand-orbit"><b/></span><span>THE CORTEX</span></button>
        <nav aria-label="Primary navigation">
          <button className={view === "lab" ? "active" : ""} onClick={() => setView("lab")}>Laboratory</button>
          <button className={view === "architecture" ? "active" : ""} onClick={() => setView("architecture")}>Architecture</button>
          <a href="#open-source">Open Source</a>
        </nav>
        <div className="online"><span/> Synthetic cognition online</div>
      </header>

      {view === "lab" ? (
        <>
          <section className="hero" id="laboratory">
            <div className="hero-copy">
              <div className="eyebrow"><span>◇</span> Thought preservation system</div>
              <h1><span>THE</span> CORTEX</h1>
              <h2>Capture a thought. Watch it grow.</h2>
              <p>Thoughts disappear in seconds. The Cortex captures fragmented thinking and transforms it into an evolving, searchable digital mind.</p>
              <form className="capture" onSubmit={capture}>
                <label htmlFor="thought-input">What are you thinking?</label>
                <textarea id="thought-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type an idea, question, observation, or unfinished thought…" maxLength={280}/>
                <div><span>{input.length}/280 · saved locally</span><button disabled={!input.trim() || processing}>{processing ? "THINKING…" : "CAPTURE THOUGHT →"}</button></div>
              </form>
            </div>

            <div className="observatory" aria-label="Interactive visualization of the Cortex thought network">
              <div className="chamber-top"><i/><i/><i/></div>
              <div className={`brain ${processing ? "processing" : ""}`}>
                <div className="brain-glow"/>
                <svg viewBox="0 0 100 100" role="img" aria-label="Connected thought graph">
                  <defs><linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#4debff"/><stop offset=".55" stopColor="#775cff"/><stop offset="1" stopColor="#ff4fd8"/></linearGradient></defs>
                  {edges.map(([from, to], index) => <line key={index} x1={nodePositions[from][0]} y1={nodePositions[from][1]} x2={nodePositions[to][0]} y2={nodePositions[to][1]} className={index % 5 === activeStage ? "signal" : ""}/>)}
                  {nodePositions.map(([x,y], index) => <circle key={index} cx={x} cy={y} r={index % 4 === 0 ? 1.55 : 1.05} className={index % 6 <= activeStage ? "lit" : ""}/>)}
                </svg>
              </div>
              <div className="orbit orbit-one"><span>MEMORY</span></div>
              <div className="orbit orbit-two"><span>REASON</span></div>
              <div className="orbit orbit-three"/>
              <div className="chamber-base"><i/><i/><i/></div>
              <div className="callout left">NEURAL<br/>NETWORK</div><div className="callout right top">COGNITIVE<br/>MODULES</div><div className="callout right bottom">MEMORY<br/>LAYERS</div>
            </div>
          </section>

          <section className="pipeline" aria-label="Cognitive pipeline">
            <div className="pipeline-head"><div><span className="pulse"/> LIVE COGNITIVE PIPELINE</div><strong>{toast}</strong></div>
            <div className="stages">{pipeline.map((stage, index) => <div key={stage} className={index <= activeStage ? "active" : ""}><span>{String(index + 1).padStart(2,"0")}</span><b>{stage}</b>{index < pipeline.length - 1 && <i>→</i>}</div>)}</div>
          </section>

          <section className="workspace">
            <aside className="memory-panel panel">
              <div className="panel-title"><div><small>MEMORY ARCHIVE</small><h3>Captured thoughts</h3></div><span>{thoughts.length}</span></div>
              <input className="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your mind…" aria-label="Search captured thoughts"/>
              <div className="thought-list">{filtered.map((thought) => <button key={thought.id} onClick={() => setSelected(thought)} className={selected.id === thought.id ? "selected" : ""}><span className="thought-dot"/><div><p>{thought.text}</p><small>{thought.created} · {thought.tone}</small></div></button>)}</div>
            </aside>

            <section className="inspector panel">
              <div className="panel-title"><div><small>THOUGHT INSPECTOR</small><h3>Connection analysis</h3></div><span className="confidence">{selected.strength}% signal</span></div>
              <article className="selected-thought"><small>ACTIVE THOUGHT / {selected.tone.toUpperCase()}</small><blockquote>“{selected.text}”</blockquote><div>{selected.concepts.map((concept) => <span key={concept}>#{concept}</span>)}</div></article>
              <h4>Strongest memory connections</h4>
              <div className="connections">{related.map((thought) => <button key={thought.id} onClick={() => setSelected(thought)}><div className="score"><strong>{thought.score}%</strong><i style={{width:`${thought.score}%`}}/></div><p>{thought.text}</p><small>Connected through shared concepts and meaningful word overlap</small></button>)}</div>
            </section>

            <aside className="telemetry panel">
              <div className="panel-title"><div><small>SYSTEM TELEMETRY</small><h3>Mind state</h3></div></div>
              <div className="metric"><span>MEMORY NODES</span><strong>{thoughts.length.toLocaleString()}</strong><small>persistent local memory</small></div>
              <div className="metric"><span>CONNECTIONS</span><strong>{(thoughts.length * 3 + 7).toLocaleString()}</strong><small>graph density 0.72</small></div>
              <div className="metric"><span>ACTIVE CONCEPTS</span><strong>{new Set(thoughts.flatMap(t => t.concepts)).size}</strong><small>4 emerging themes</small></div>
              <div className="wave"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
              <div className="system-note"><span>●</span><p><b>Cortex is mapping</b>Your mind map evolves with every captured thought.</p></div>
            </aside>
          </section>
        </>
      ) : (
        <Architecture onEnter={() => setView("lab")}/>
      )}

      <footer id="open-source"><div className="brand"><span className="brand-orbit"><b/></span><span>THE CORTEX</span></div><p>Open-source infrastructure for thought preservation and inspectable synthetic cognition.</p><a href="https://github.com/shannon-aurelia/the-cortex-technoviz" target="_blank" rel="noreferrer">VIEW SOURCE ↗</a></footer>
    </main>
  );
}

function Architecture({ onEnter }: { onEnter: () => void }) {
  return <section className="architecture-view"><div className="eyebrow"><span>◇</span> OPEN, MODULAR, EXPLAINABLE</div><h1>Inside the <em>Cortex.</em></h1><p className="architecture-intro">A six-stage cognitive pipeline turns a fleeting thought into structured, connected, and retrievable knowledge. Every transformation remains visible to the user.</p><div className="architecture-grid">{pipeline.map((stage,index) => <article key={stage}><span>{String(index+1).padStart(2,"0")}</span><div className="architecture-icon">{["⌁","◇","◉","⌘","✦","◎"][index]}</div><h2>{stage}</h2><p>{["Accept natural-language thoughts at the moment they occur.","Extract concepts, intent, tone, and useful semantic signals.","Store each thought as a persistent, searchable memory node.","Score relationships using meaning, concepts, and context.","Surface patterns, questions, and paths worth developing.","Render the evolving mind as an inspectable knowledge graph."][index]}</p></article>)}</div><div className="formula"><small>CONNECTION MODEL</small><code>wᵢⱼ = αSᵢⱼ + βKᵢⱼ + γTᵢⱼ</code><p>Semantic similarity + shared concepts + temporal context</p></div><button className="enter-button" onClick={onEnter}>ENTER THE LABORATORY →</button></section>;
}
