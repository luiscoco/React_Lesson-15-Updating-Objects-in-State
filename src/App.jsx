
import React, { useEffect, useRef, useState } from 'react';
import { produce } from 'immer';
import DiffViewer from './components/DiffViewer.jsx';
import MutationPitfall from './components/MutationPitfall.jsx';
import { useHistory } from './hooks/useHistory.js';

export default function App() {
  // ----- Plain React state (spread for updates), wrapped with history -----
  const initialPerson = {
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://picsum.photos/seed/nana/300/200'
    }
  };

  const history = useHistory(initialPerson);
  const person = history.value;
  const setPerson = (updater) => {
    const next = typeof updater === 'function' ? updater(person) : updater;
    history.push(next);
  };

  // ----- "Immer-like" updates using produce() with useState -----
  const [immerPerson, setImmerPerson] = useState({
    firstName: 'Niki',
    lastName: 'de Saint Phalle',
    email: 'niki@art.example',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://picsum.photos/seed/blue/300/200'
    }
  });

  const handleImmerRandomize = () => {
    setImmerPerson(current =>
      produce(current, draft => {
        draft.firstName = draft.firstName === 'Niki' ? 'Niki Updated' : 'Niki';
        draft.artwork.city = draft.artwork.city === 'Hamburg' ? 'Lagos' : 'Hamburg';
        draft.artwork.title = draft.artwork.title.includes('Nana') ? 'Joy of Life' : 'Blue Nana';
      })
    );
  };

  // Snapshots to compute diffs
  const prevPersonRef = useRef(person);
  const prevImmerRef = useRef(immerPerson);
  useEffect(() => { prevPersonRef.current = person; }, [person]);
  useEffect(() => { prevImmerRef.current = immerPerson; }, [immerPerson]);

  // Spread updates (immutable copies)
  const handleSpreadCityChange = (e) => {
    const nextCity = e.target.value;
    setPerson({
      ...person,
      artwork: { ...person.artwork, city: nextCity }
    });
  };
  const handleSpreadFirstName = (e) => {
    setPerson({ ...person, firstName: e.target.value });
  };
  const handleSpreadTitle = (e) => {
    setPerson({
      ...person,
      artwork: { ...person.artwork, title: e.target.value }
    });
  };

  // Local (non-state) mutation is fine
  const temp = { x: 0 };
  temp.x = 5;

  // Pointer position demo
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <div className="container">
      <header className="header">
        <h1>🎨 Artist Profile Editor</h1>
        <p>
          Practice <strong>immutable updates</strong> in React 19: spread vs. Immer-style updates,
          plus a diff viewer and time-travel history.
        </p>
      </header>

      <main className="grid">
        {/* ===== Without Immer (spread syntax) + Time Travel ===== */}
        <section className="card">
          <h2>Without Immer (spread syntax) + Time Travel</h2>
          <div className="row">
            <label>
              First name
              <input value={person.firstName} onChange={handleSpreadFirstName} />
            </label>
            <label>
              Artwork title
              <input value={person.artwork.title} onChange={handleSpreadTitle} />
            </label>
            <label>
              City (nested)
              <input value={person.artwork.city} onChange={handleSpreadCityChange} />
            </label>
          </div>

          <div className="media">
            <img
              src={person.artwork.image}
              alt={person.artwork.title}
              width="300"
              height="200"
            />
            <div>
              <p className="lead"><b>{person.firstName} {person.lastName}</b></p>
              <p><em>{person.artwork.title}</em> — {person.artwork.city}</p>
              <p className="muted">email: {person.email}</p>
            </div>
          </div>

          <div className="timeline">
            <button onClick={history.undo} disabled={!history.canUndo}>Undo</button>
            <button onClick={history.redo} disabled={!history.canRedo}>Redo</button>
            <span className="badge">
              Step {history.pointer + 1} / {history.length}
            </span>
          </div>

          <DiffViewer title="Diff (Spread example)" prev={prevPersonRef.current} next={person} />
        </section>

        {/* ===== With produce() (Immer) ===== */}
        <section className="card">
          <h2>With produce() (Immer-style deep updates)</h2>
          <div className="row">
            <button onClick={handleImmerRandomize}>Toggle fields via produce()</button>
          </div>

          <div className="media">
            <img
              src={immerPerson.artwork.image}
              alt={immerPerson.artwork.title}
              width="300"
              height="200"
            />
            <div>
              <p className="lead"><b>{immerPerson.firstName} {immerPerson.lastName}</b></p>
              <p><em>{immerPerson.artwork.title}</em> — {immerPerson.artwork.city}</p>
              <p className="muted">email: {immerPerson.email}</p>
            </div>
          </div>

          <details>
            <summary>How Immer's produce works</summary>
            <p>
              <code>produce()</code> creates a temporary <code>draft</code> you can modify freely.
              It then produces the next immutable state while preserving the original.
            </p>
          </details>

          <DiffViewer title="Diff (produce example)" prev={prevImmerRef.current} next={immerPerson} />
        </section>

        {/* ===== Pointer move demo ===== */}
        <section className="card">
          <h2>Pointer position (object state)</h2>
          <p className="muted">
            Move your pointer over the box: we store <code>{"{}"}</code> with <code>x/y</code> in state.
          </p>
          <div
            className="pointerRegion"
            onPointerMove={(e) => setPosition({ x: e.clientX, y: e.clientY })}
          >
            <div className="dot" style={{ left: position.x, top: position.y }} />
          </div>
          <p>Position: <code>{"{ x: " + position.x + ", y: " + position.y + " }"}</code></p>
        </section>

        {/* ===== Mutation pitfall live demo ===== */}
        <section className="card">
          <h2>⚠️ Mutation Pitfall</h2>
          <MutationPitfall />
        </section>
      </main>

      <footer className="footer">
        <small className="muted">
          Tip: try mutating objects directly in DevTools and notice the UI won’t update.
          Use the setter to replace with a new object.
        </small>
      </footer>
    </div>
  );
}
