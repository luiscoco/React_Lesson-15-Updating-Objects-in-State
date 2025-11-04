
import React from 'react';
import { diffObjects } from '../utils/diff.js';

export default function DiffViewer({ title, prev, next }) {
  const result = diffObjects(prev, next);
  return (
    <div className="diff">
      <h3 className="diffTitle">{title}</h3>
      {result.changes.length === 0 ? (
        <p className="muted">No changes</p>
      ) : (
        <ul className="diffList">
          {result.changes.map((c, i) => (
            <li key={i} className={`diffItem diff-${c.type}`}>
              <code>{c.path}</code>
              {c.type === 'changed' && (<>
                {' '}<span className="muted">changed</span> from <code>{formatVal(c.prev)}</code> to <code>{formatVal(c.next)}</code>
              </>)}
              {c.type === 'added' && (<>
                {' '}<span className="muted">added</span> = <code>{formatVal(c.next)}</code>
              </>)}
              {c.type === 'removed' && (<>
                {' '}<span className="muted">removed</span> (was <code>{formatVal(c.prev)}</code>)
              </>)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatVal(v) {
  if (typeof v === 'string') return JSON.stringify(v);
  if (typeof v === 'number' || typeof v === 'boolean' || v === null) return String(v);
  return JSON.stringify(v);
}
