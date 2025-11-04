
import React, { useRef, useState } from 'react';

export default function MutationPitfall() {
  const [state, setState] = useState({ user: { name: 'Avery', city: 'Madrid' } });
  const tickRef = useRef(0);
  const [force, setForce] = useState(0);

  const mutateWithoutSetter = () => {
    state.user.city = 'Broken City (mutated)';
  };

  const triggerUnrelatedRerender = () => {
    tickRef.current += 1;
    setForce(x => x + 1);
  };

  const fixProperly = () => {
    setState({ ...state, user: { ...state.user, city: 'Barcelona (proper update)' } });
  };

  return (
    <div>
      <p className="muted">
        This card mutates state <em>without</em> calling the setter. Notice the UI
        does <strong>not</strong> update until some unrelated render happens.
      </p>
      <div className="row">
        <button onClick={mutateWithoutSetter}>Mutate without setter (no re-render)</button>
        <button onClick={triggerUnrelatedRerender}>Trigger unrelated render</button>
        <button onClick={fixProperly}>Fix properly (immutable update)</button>
      </div>
      <p><b>User:</b> {state.user.name} — <em>{state.user.city}</em></p>
      <p className="muted">Unrelated renders: {tickRef.current}</p>
      <details>
        <summary>What’s happening?</summary>
        <p>
          React re-renders when you replace state via the setter function. Mutating an
          existing object keeps the same reference, so React doesn’t know it changed.
          When some <em>other</em> update forces a re-render, the mutated value suddenly
          appears — a classic source of bugs.
        </p>
      </details>
    </div>
  );
}
