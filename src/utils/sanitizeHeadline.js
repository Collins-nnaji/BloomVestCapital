/** Client-side headline cleanup (RSS often ships HTML entities / junk chars) */

function decodeNumericEntities(s) {
  return String(s)
    .replace(/&#x([0-9a-fA-F]+);/gi, (_, hex) => {
      const code = parseInt(hex, 16);
      try {
        return Number.isFinite(code) ? String.fromCodePoint(code) : '';
      } catch {
        return '';
      }
    })
    .replace(/&#(\d+);/g, (_, dec) => {
      const code = parseInt(dec, 10);
      try {
        return Number.isFinite(code) ? String.fromCodePoint(code) : '';
      } catch {
        return '';
      }
    });
}

export function sanitizeHeadline(text) {
  if (!text) return '';
  let s = decodeNumericEntities(String(text));
  if (typeof document !== 'undefined') {
    const el = document.createElement('textarea');
    el.innerHTML = s;
    s = el.value;
  }
  s = s
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');
  s = s.normalize('NFKC');
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '');
  s = s.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '');
  s = s.replace(/\uFFFD/g, '');
  s = s.replace(/[\uD800-\uDFFF]/g, '');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}
