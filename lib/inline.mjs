// ---------------------------------------------------------------------------
// Inline rich text.
//
// The report sources use a deliberately small markdown subset — [label](url),
// **bold**, *italic* — and the URL alternative below tolerates one level of
// balanced parentheses, because a fair number of institutional source links
// (Wikipedia, IMF working papers, UN country pages) carry them. That is the
// same pattern the docx build scripts use; keeping the two in step means the
// web edition and the Word edition mark up identically.
// ---------------------------------------------------------------------------

const INLINE_RE =
  /\[([^\]]+)\]\((https?:\/\/(?:[^()\s]+|\([^()\s]*\))+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

/** Escape text for insertion into an HTML text node. */
export function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Escape text for insertion into a double-quoted HTML attribute. */
export function escAttr(s = '') {
  return esc(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** Bold/italic only — used inside link labels, which cannot nest links. */
function labelToHtml(label) {
  let out = '';
  let last = 0;
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let m;
  while ((m = re.exec(label))) {
    if (m.index > last) out += esc(label.slice(last, m.index));
    if (m[1]) out += `<strong>${esc(m[1])}</strong>`;
    else out += `<em>${esc(m[2])}</em>`;
    last = re.lastIndex;
  }
  out += esc(label.slice(last));
  return out || esc(label);
}

/** Render one source string to inline HTML. */
export function inline(s = '') {
  let out = '';
  let last = 0;
  let m;
  INLINE_RE.lastIndex = 0;
  while ((m = INLINE_RE.exec(s))) {
    if (m.index > last) out += esc(s.slice(last, m.index));
    if (m[1]) {
      out +=
        `<a href="${escAttr(m[2])}" rel="noopener nofollow" target="_blank">` +
        `${labelToHtml(m[1])}</a>`;
    } else if (m[3]) {
      out += `<strong>${esc(m[3])}</strong>`;
    } else {
      out += `<em>${esc(m[4])}</em>`;
    }
    last = INLINE_RE.lastIndex;
  }
  out += esc(s.slice(last));
  return out;
}

/** Strip all markup — for <title>, meta descriptions, og:*, and ToC labels. */
export function plain(s = '') {
  return String(s)
    .replace(INLINE_RE, (_all, label, _url, bold, italic) => label || bold || italic || '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Every external URL referenced by a string, in order of appearance. */
export function linksIn(s = '') {
  const urls = [];
  let m;
  INLINE_RE.lastIndex = 0;
  while ((m = INLINE_RE.exec(s))) if (m[2]) urls.push({ label: plain(m[1]), url: m[2] });
  return urls;
}
