
export function diffObjects(prev, next) {
  const changes = [];
  walk(prev, next, '', changes);
  return { changes };
}

function isObject(x) {
  return x !== null && typeof x === 'object';
}

function walk(a, b, path, out) {
  const aKeys = a && isObject(a) ? Object.keys(a) : [];
  const bKeys = b && isObject(b) ? Object.keys(b) : [];

  for (const k of aKeys) {
    if (!(k in (b || {}))) {
      out.push({ type: 'removed', path: join(path, k), prev: a[k] });
    }
  }
  for (const k of bKeys) {
    const p = join(path, k);
    if (!(k in (a || {}))) {
      out.push({ type: 'added', path: p, next: b[k] });
    } else {
      const av = a[k];
      const bv = b[k];
      if (isObject(av) && isObject(bv)) {
        walk(av, bv, p, out);
      } else if (!isEqual(av, bv)) {
        out.push({ type: 'changed', path: p, prev: av, next: bv });
      }
    }
  }
}

function join(base, key) { return base ? `${base}.${key}` : key; }

function isEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (!isObject(a) || !isObject(b)) return false;
  try { return JSON.stringify(a) === JSON.stringify(b); } catch { return false; }
}
