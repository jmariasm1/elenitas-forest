const wrap = (body: string) =>
  `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
export const icons: Record<string, string> = {
  leaf: wrap(
    '<path d="M25 5C13 3 5 9 7 18c2 8 14 9 18-13Z" fill="currentColor" opacity=".18"/><path d="M7 27c2-10 7-16 15-19M12 17l-1-5m5 2 5 1"/>',
  ),
  rabbit: wrap(
    '<path d="M10 15C3-1 13-1 14 13m4 0c2-15 12-13 5 3"/><path d="M7 21c0-11 18-11 18 0s-18 11-18 0Z" fill="currentColor" opacity=".16"/><path d="M7 21c0-11 18-11 18 0s-18 11-18 0Z"/><path d="M12 20v1m8-1v1m-5 3h2"/>',
  ),
  shapes: wrap(
    '<path d="m17 4 10 6v12l-10 6-10-6V10Z" fill="currentColor" opacity=".18"/><path d="m17 4 10 6v12l-10 6-10-6V10Z"/><path d="M13 15v1m8-1v1m-6 4h4"/>',
  ),
  letter: wrap('<path d="m6 26 9-21h3l9 21M10 18h13" stroke-width="3"/>'),
  number: wrap(
    '<path d="M8 8c2-7 16-5 15 2 0 4-5 6-10 10l-5 6h16" stroke-width="3"/>',
  ),
  music: wrap(
    '<path d="M13 23V7l14-3v16M13 11l14-3"/><ellipse cx="8" cy="24" rx="5" ry="3" fill="currentColor"/><ellipse cx="22" cy="21" rx="5" ry="3" fill="currentColor"/>',
  ),
  telescope: wrap(
    '<path d="m7 16 13-9 4 6-13 9ZM18 21l-4 8m4-8 4 8m-4-8v8M20 6l3-2 5 8-3 2M5 18l3 4"/>',
  ),
  play: wrap('<path d="M11 6v20l16-10Z" fill="currentColor" stroke="none"/>'),
  sound: wrap(
    '<path d="M5 12h5l7-6v20l-7-6H5Zm17-1c4 3 4 7 0 10m3-14c6 5 6 13 0 18"/>',
  ),
  muted: wrap('<path d="M5 12h5l7-6v20l-7-6H5Zm17 0 7 8m0-8-7 8"/>'),
  lock: wrap(
    '<rect x="7" y="14" width="18" height="14" rx="5"/><path d="M11 14V9a5 5 0 0 1 10 0v5M16 20v3"/>',
  ),
  close: wrap('<path d="m9 9 14 14M23 9 9 23"/>'),
  left: wrap('<path d="m20 7-9 9 9 9"/>'),
  right: wrap('<path d="m12 7 9 9-9 9"/>'),
  moon: wrap(
    '<path d="M24 23A12 12 0 0 1 12 4a12 12 0 1 0 12 19Z" fill="currentColor" opacity=".15"/><path d="M24 23A12 12 0 0 1 12 4a12 12 0 1 0 12 19ZM23 4v4m-2-2h4"/>',
  ),
  sun: wrap(
    '<circle cx="16" cy="16" r="6" fill="currentColor" opacity=".22"/><circle cx="16" cy="16" r="6"/><path d="M16 2v4m0 20v4M2 16h4m20 0h4M6 6l3 3m14 14 3 3M6 26l3-3M23 9l3-3"/>',
  ),
  home: wrap('<path d="m5 16 11-10 11 10M8 13v14h16V13M13 27v-8h6v8"/>'),
  expand: wrap('<path d="M11 5H5v6m16-6h6v6M5 21v6h6m10 0h6v-6"/>'),
  rotate: wrap(
    '<rect x="8" y="6" width="16" height="22" rx="3" transform="rotate(-25 16 16)"/><path d="M25 3h5v5M30 3l-5 5M2 23v5h5M2 28l5-5"/>',
  ),
};
